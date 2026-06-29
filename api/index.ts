import { IncomingMessage, ServerResponse } from "http";
import express from "express";
import path from "path";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import webpush from "web-push";

dotenv.config();

const app = express();
const PORT = 3000;

function logDebug(message: string) {
  console.log(`[DEBUG] ${message}`);
}

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Helper to clean environment variables (removing potential trailing/leading quotes, whitespaces, etc.)
function cleanEnvVar(val: string | undefined): string {
  if (!val) return "";
  let s = val.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

// Supabase Setup
let globalSupabaseCache: { key: string; client: any } | null = null;
let cachedHasDateColumn: boolean | null = null;
let cachedTblColNames: string[] | null = null;
const verifiedCompanies = new Set<string>();

function getSupabaseUrlAndKey(): { url: string; key: string } {
  const rawSupabaseUrl = cleanEnvVar(process.env.SUPABASE_URL);
  const supabaseUrl = rawSupabaseUrl.replace(/\/+$/, '').replace(/\/rest\/v1\/?$/, '');
  const supabaseServiceRoleKey = cleanEnvVar(process.env.SUPABASE_SERVICE_ROLE_KEY);
  return { url: supabaseUrl, key: supabaseServiceRoleKey };
}

function getSupabaseClient(): any {
  const { url, key } = getSupabaseUrlAndKey();

  if (!url || !key) {
    throw new Error("Variáveis de ambiente SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configuradas no Vercel/Ambiente. Certifique-se de adicioná-las sem aspas e sem espaços adicionais.");
  }

  const cacheKey = `${url}_${key}`;
  if (globalSupabaseCache && globalSupabaseCache.key === cacheKey) {
    return globalSupabaseCache.client;
  }

  try {
    const client = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: { 'x-my-custom-header': 'kivo-barber' },
      },
    });
    globalSupabaseCache = { key: cacheKey, client };
    return client;
  } catch (err: any) {
    console.error("[SUPABASE RUNTIME INIT ERROR]:", err);
    throw new Error(`Falha ao inicializar o cliente Supabase em tempo de execução: ${err.message || String(err)}`);
  }
}

// Proxies all property accesses to the dynamically created/validated supabase client
const supabase: any = new Proxy({} as any, {
  get(target, prop) {
    if (prop === 'then' || prop === 'catch') return undefined;
    const client = getSupabaseClient();
    const val = client[prop];
    if (typeof val === 'function') {
      return val.bind(client);
    }
    return val;
  }
});

app.get("/api/health", async (req, res) => {
  let dbStatus = "not_connected";
  let detailError: string | null = null;
  let configUrl = false;
  let urlLength = 0;
  let parsedHost: string | null = null;
  let configKey = false;
  let keyLength = 0;

  try {
    const { url, key } = getSupabaseUrlAndKey();
    configUrl = !!url;
    urlLength = url ? url.length : 0;
    configKey = !!key;
    keyLength = key ? key.length : 0;

    if (url) {
      try {
        parsedHost = new URL(url).hostname;
      } catch (e) {}
    }

    if (url && key) {
      const client = getSupabaseClient();
      const { error } = await client.from('plans').select('id').limit(1);
      dbStatus = error ? `error: ${error.message}` : "connected";
      if (error) {
        detailError = error.message;
      }
    } else {
      detailError = "Variáveis de ambiente SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configuradas no Vercel/Ambiente.";
    }
  } catch (err: any) {
    dbStatus = "exception";
    detailError = err.message || String(err);
  }

  res.json({ 
    status: "ok", 
    database: dbStatus,
    config: {
      url: configUrl,
      url_length: urlLength,
      url_host: parsedHost,
      key: configKey,
      key_length: keyLength,
      vercel: !!process.env.VERCEL,
      is_production: process.env.NODE_ENV === "production"
    },
    error: detailError
  });
});

// Standard PWA Manifest for KIVO BARBER
app.get("/manifest.json", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.json({
    "name": "Queen Agenda",
    "short_name": "Queen Agenda",
    "description": "Sistema de Agendamento Profissional Queen Agenda",
    "start_url": "/",
    "scope": "/",
    "id": "queen-agenda-v1",
    "display": "standalone",
    "display_override": ["standalone", "fullscreen"],
    "orientation": "portrait",
    "background_color": "#0a0a0a",
    "theme_color": "#0a0a0a",
    "prefer_related_applications": false,
    "categories": ["business", "lifestyle"],
    "icons": [
      {
        "src": "/logo_kivo_192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any"
      },
      {
        "src": "/logo_kivo_192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "maskable"
      },
      {
        "src": "/logo_kivo_512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any"
      },
      {
        "src": "/logo_kivo_512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "maskable"
      }
    ],
    "screenshots": [
      {
        "src": "/logo_kivo_512.png",
        "sizes": "512x512",
        "type": "image/png",
        "form_factor": "wide"
      },
      {
        "src": "/logo_kivo_512.png",
        "sizes": "512x512",
        "type": "image/png",
        "form_factor": "narrow"
      }
    ]
  });
});

// Web Push Configuration
const VAPID_PUBLIC_KEY = cleanEnvVar(process.env.VAPID_PUBLIC_KEY);
const VAPID_PRIVATE_KEY = cleanEnvVar(process.env.VAPID_PRIVATE_KEY);
const VAPID_EMAIL = cleanEnvVar(process.env.VAPID_EMAIL) || "mailto:support@queenagenda.com";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  console.log("[NOTIFICATIONS] Web Push VAPID keys configured.");
} else {
  console.warn("[NOTIFICATIONS] VAPID keys NOT configured. Web Push notifications will not work.");
}

// Background Task for Reminder Notifications
const NOTIFICATION_CHECK_INTERVAL = 60 * 1000; // Every minute
const notifiedAppointments = new Set<string>();

async function checkAndSendReminders() {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return;

  try {
    const now = new Date();
    // Fetch active shops to get their lead times
    const { data: shops } = await supabase.from('barbershops').select('id, name, reminder_lead_time_minutes');
    if (!shops) return;

    for (const shop of shops) {
      const leadTime = shop.reminder_lead_time_minutes || 60;
      const targetTimeStart = new Date(now.getTime() + leadTime * 60 * 1000);
      const targetTimeEnd = new Date(targetTimeStart.getTime() + 60 * 1000); // 1 minute window

      const targetDate = targetTimeStart.toISOString().split('T')[0];
      const targetTimeStr = targetTimeStart.toTimeString().split(' ')[0].substring(0, 5); // HH:mm

      // Find appointments at this exact time
      const { data: appts, error } = await supabase
        .from('appointments')
        .select('*, service:services(*), professional:professionals(*)')
        .eq('barbershop_id', shop.id)
        .eq('date', targetDate)
        .eq('status', 'pending')
        .ilike('time', `${targetTimeStr}%`);

      if (error || !appts) continue;

      for (const appt of appts) {
        if (notifiedAppointments.has(appt.id)) continue;

        // Find the client to get their push subscription
        const cleanPhone = appt.customer_phone?.replace(/\D/g, '');
        const { data: client } = await supabase
          .from('clients')
          .select('push_subscription, notifications_enabled')
          .eq('barbershop_id', shop.id)
          .eq('phone', cleanPhone)
          .single();

        if (client && client.push_subscription && client.notifications_enabled !== false) {
          try {
            const subscription = JSON.parse(client.push_subscription);
            const payload = JSON.stringify({
              title: `Lembrete: ${shop.name}`,
              body: `Olá! Seu agendamento de ${appt.service?.name} com ${appt.professional?.name} é em ${leadTime} minutos (${appt.time}).`,
              icon: '/logo_kivo_192.png',
              data: { url: `/portal/${shop.id}` }
            });

            await webpush.sendNotification(subscription, payload);
            console.log(`[NOTIFICATIONS] Sent reminder to ${appt.customer_name} for appointment ${appt.id}`);
            notifiedAppointments.add(appt.id);
          } catch (pushErr) {
            console.error(`[NOTIFICATIONS] Failed to send push to ${appt.customer_name}:`, pushErr);
          }
        }
      }
    }

    // Cleanup old notified appointments once a day or when they are in the past
    if (notifiedAppointments.size > 1000) {
      notifiedAppointments.clear();
    }
  } catch (err) {
    console.error("[NOTIFICATIONS CHECK ERROR]:", err);
  }
}

setInterval(checkAndSendReminders, NOTIFICATION_CHECK_INTERVAL);

app.get("/api/notifications/vapid-key", (req, res) => {
  res.json({ publicKey: VAPID_PUBLIC_KEY });
});

app.post("/api/notifications/subscribe", async (req, res) => {
  try {
    const { subscription, clientId } = req.body;
    if (!subscription || !clientId) {
      return res.status(400).json({ error: "Subscription e clientId são obrigatórios." });
    }

    const { error } = await supabase
      .from('clients')
      .update({ push_subscription: JSON.stringify(subscription), notifications_enabled: true })
      .eq('id', clientId);

    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Dynamic fallback and express delivery of high-quality converted raster brand icons
app.get(["/logo_kivo_192.png", "/logo_kivo_192.jpg"], (req, res) => {
  const pngPath = path.join(process.cwd(), 'public', 'logo_kivo_192.png');
  const jpgPath = path.join(process.cwd(), 'src', 'assets', 'images', 'logo_kivo_png_1781541028660.jpg');
  if (req.path.endsWith('.png') && fs.existsSync(pngPath)) {
    res.setHeader("Content-Type", "image/png");
    return res.sendFile(pngPath);
  } else if (fs.existsSync(jpgPath)) {
    res.setHeader("Content-Type", "image/jpeg");
    return res.sendFile(jpgPath);
  }
  // fallback
  res.setHeader("Content-Type", "image/svg+xml");
  res.sendFile(path.join(process.cwd(), 'public', 'logo_kivo.svg'));
});

app.get(["/logo_kivo_512.png", "/logo_kivo_512.jpg"], (req, res) => {
  const pngPath = path.join(process.cwd(), 'public', 'logo_kivo_512.png');
  const jpgPath = path.join(process.cwd(), 'src', 'assets', 'images', 'logo_kivo_png_1781541028660.jpg');
  if (req.path.endsWith('.png') && fs.existsSync(pngPath)) {
    res.setHeader("Content-Type", "image/png");
    return res.sendFile(pngPath);
  } else if (fs.existsSync(jpgPath)) {
    res.setHeader("Content-Type", "image/jpeg");
    return res.sendFile(jpgPath);
  }
  // fallback
  res.setHeader("Content-Type", "image/svg+xml");
  res.sendFile(path.join(process.cwd(), 'public', 'logo_kivo.svg'));
});



// Auto-block delinquent barbershops (e.g. active barbershops on 'Plano Bronze' created more than 30 days ago)
async function runAutoBlockCheck() {
  try {
    const { data: shops, error } = await supabase
      .from('barbershops')
      .select('*')
      .eq('status', 'active');
      
    if (error || !shops) return;
    
    const now = new Date();
    for (const shop of shops) {
      if (!shop.created_at) continue;
      const createdAt = new Date(shop.created_at);
      const diffTime = Math.abs(now.getTime() - createdAt.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Auto-block if active, created > 30 days ago (representing standard delinquency period without payment)
      if (diffDays > 30) {
        await supabase
          .from('barbershops')
          .update({ status: 'blocked' })
          .eq('id', shop.id);
        console.log(`[AUTO-BLOCK] Barbearia ${shop.name} foi bloqueada automaticamente devido a exceder o período de inadimplência (> 30 dias).`);
      }
    }
  } catch (err) {
    console.error("[AUTO-BLOCK ERROR]:", err);
  }
}

async function isPhoneAlreadyInUse(supabaseClient: any, cleanPhone: string, exclude?: { table: 'barbershops' | 'professionals' | 'clients', id: string }): Promise<string | null> {
  if (!cleanPhone || cleanPhone.trim() === "") return null;

  // 1. Check in barbershops (owners)
  let qShops = supabaseClient.from('barbershops').select('id, name').eq('phone', cleanPhone);
  if (exclude && exclude.table === 'barbershops') {
    qShops = qShops.neq('id', exclude.id);
  }
  const { data: shops } = await qShops;
  if (shops && shops.length > 0) {
    return `Este número de telefone já pertence ao proprietário da barbearia "${shops[0].name}".`;
  }

  // 2. Check in professionals
  let qProfs = supabaseClient.from('professionals').select('id, name').eq('phone', cleanPhone);
  if (exclude && exclude.table === 'professionals') {
    qProfs = qProfs.neq('id', exclude.id);
  }
  const { data: profs } = await qProfs;
  if (profs && profs.length > 0) {
    return `Este número de telefone já pertence ao profissional "${profs[0].name}".`;
  }

  // 3. Check in clients
  let qClients = supabaseClient.from('clients').select('id, name').eq('phone', cleanPhone);
  if (exclude && exclude.table === 'clients') {
    qClients = qClients.neq('id', exclude.id);
  }
  const { data: clients } = await qClients;
  if (clients && clients.length > 0) {
    return `Este número de telefone já pertence ao cliente "${clients[0].name}".`;
  }

  return null;
}

// API Routes
app.post("/api/login", async (req, res) => {
  logDebug(`[LOGIN REQUEST START] body: ${JSON.stringify(req.body)}`);
  try {
    const { login, password } = req.body || {};

    if (!login) {
      logDebug(`[LOGIN ERROR]: Login field is empty or missing`);
      return res.status(400).json({ error: "Campo de login é obrigatório." });
    }

    // Run the automated delinquency auto-block check on login attempt
    await runAutoBlockCheck();

    // Master login (Secure from environment variables)
    const masterEmail = cleanEnvVar(process.env.MASTER_EMAIL);
    const masterPassword = cleanEnvVar(process.env.MASTER_PASSWORD);

    const inputLoginClean = (login || "").trim().toLowerCase();
    const inputPasswordClean = (password || "").trim();
    let masterEmailClean = masterEmail.trim().toLowerCase();
    let masterPasswordClean = masterPassword.trim();

    // Resilient fallback for Vercel production deploy if variables are not populated in Vercel settings panel
    if (!masterEmailClean) {
      masterEmailClean = "paulojbo@outlook.com";
    }
    if (!masterPasswordClean) {
      masterPasswordClean = "290824";
    }

    // Log diagnostic conditions securely (No secrets shown, handles empty vars or typos)
    logDebug(`[MASTER LOGIN DIAGNOSTIC]: 
      - master_email_configured: ${!!masterEmailClean} (length: ${masterEmailClean.length})
      - master_password_configured: ${!!masterPasswordClean} (length: ${masterPasswordClean.length})
      - input_login_clean: "${inputLoginClean}"
      - email_matches: ${inputLoginClean === masterEmailClean}
      - password_matches: ${inputPasswordClean === masterPasswordClean}
    `);

    if (masterEmailClean && masterPasswordClean && inputLoginClean === masterEmailClean && inputPasswordClean === masterPasswordClean) {
      logDebug(`[LOGIN SUCCESS]: Logged in as master`);
      return res.json({ 
        user: { role: 'master', name: 'Administrador Master' } 
      });
    }

    const { url: checkUrl, key: checkKey } = getSupabaseUrlAndKey();
    if (!checkUrl || !checkKey) {
      logDebug(`[LOGIN ERROR]: Supabase is not configured (missing setup).`);
      return res.status(500).json({ 
        error: `Supabase não configurado ou erro de inicialização. Se estiver na Vercel, defina as variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no painel da Vercel.` 
      });
    }

    // Clean phone numbers for comparison (remove non-digits)
    const cleanLogin = login.replace(/\D/g, '');

    logDebug(`[LOGIN ATTEMPT]: login=${login}, cleanLogin=${cleanLogin}, passwordLen=${password ? password.length : 0}`);

    // 1. Tenta primeiro como Proprietário (Barbearia)
    logDebug(`[LOGIN DB QUERY START] querying barbershops table for cleanLogin=${cleanLogin} or login=${login}`);
    const { data: shops, error: shopError } = await supabase
      .from('barbershops')
      .select('*, plan:plans(*)')
      .or(`phone.eq.${cleanLogin},phone.eq.${login}`);

    if (shopError) {
      logDebug(`[LOGIN DB QUERY BARBERSHOPS ERROR]: ${JSON.stringify(shopError)}`);
      console.error("[LOGIN] Erro query barbearia:", shopError);
    } else {
      logDebug(`[LOGIN DB QUERY BARBERSHOPS SUCCESS]: Found ${shops?.length || 0} matching shops`);
    }

    let shop = shops?.find(s => s.password === password);

    if (shop) {
      if (shop.status === 'blocked') {
        logDebug(`[LOGIN BLOCKED]: Barbershop ${shop.name} is blocked.`);
        return res.status(403).json({ error: "Sistema em bloqueio, contate o revendedor." });
      }
      logDebug(`[LOGIN SUCCESS]: Logged in as barbershop owner: ${shop.name}`);
      console.log(`[LOGIN] Sucesso como Barbearia: ${shop.name}`);
      res.cookie('kivo_role', 'barber', { maxAge: 365 * 24 * 60 * 60 * 1000, path: '/' });
      res.cookie('kivo_shop_id', shop.id, { maxAge: 365 * 24 * 60 * 60 * 1000, path: '/' });
      return res.json({ 
        user: { 
          role: 'barber', 
          name: shop.name, 
          shopId: shop.id,
          shop: shop
        } 
      });
    }

    // 2. Se não encontrou, tenta como Profissional
    logDebug(`[LOGIN DB QUERY START] querying professionals table for cleanLogin=${cleanLogin} or login=${login}`);
    const { data: directProfs, error: directProfError } = await supabase
      .from('professionals')
      .select('*')
      .or(`phone.eq.${cleanLogin},phone.eq.${login}`);

    if (directProfError) {
      logDebug(`[LOGIN DB QUERY PROFESSIONALS ERROR]: ${JSON.stringify(directProfError)}`);
      console.error("[LOGIN] Erro query direta profissional:", directProfError);
    } else {
      logDebug(`[LOGIN DB QUERY PROFESSIONALS SUCCESS]: Found ${directProfs?.length || 0} professionals`);
    }

    let profObj = directProfs?.find(p => p.password === password);

    // 3. Fallback: Se não encontrou por busca exata, tenta com ilike parcial
    if (!profObj && cleanLogin.length > 5) {
      logDebug(`[LOGIN DB QUERY FALLBACK START] querying professionals with ilike for cleanLogin=${cleanLogin}`);
      const { data: fallbackProfs, error: fallbackError } = await supabase
        .from('professionals')
        .select('*')
        .ilike('phone', `%${cleanLogin}%`);
      
      if (fallbackError) {
        logDebug(`[LOGIN DB QUERY FALLBACK ERROR]: ${JSON.stringify(fallbackError)}`);
        console.error("[LOGIN] Erro query fallback profissional:", fallbackError);
      } else {
        logDebug(`[LOGIN DB QUERY FALLBACK SUCCESS]: Found ${fallbackProfs?.length || 0} professionals parciais`);
      }

      profObj = fallbackProfs?.find(p => p.password === password);
    }

    if (profObj) {
      logDebug(`[LOGIN SUCCESS]: Logged in as professional: ${profObj.name}`);
      console.log(`[LOGIN] Sucesso na autenticação: ${profObj.name}. Carregando barbearia id ${profObj.barbershop_id}...`);
      
      const { data: shopData, error: shopLoadError } = await supabase
        .from('barbershops')
        .select('*, plan:plans(*)')
        .eq('id', profObj.barbershop_id)
        .single();

      if (shopLoadError) {
        logDebug(`[LOGIN LOAD PROFILE OWNER SHOP ERROR]: ${JSON.stringify(shopLoadError)}`);
        console.error(`[LOGIN] Erro ao carregar Barbearia para profissional ${profObj.name}:`, shopLoadError);
      } else {
        logDebug(`[LOGIN LOAD PROFILE OWNER SHOP SUCCESS]: Loaded shop ${shopData?.name}`);
        console.log(`[LOGIN] Barbearia carregada com sucesso: ${shopData?.name}`);
      }

      if (shopData && shopData.status === 'blocked') {
        logDebug(`[LOGIN BLOCKED]: Professional's barbershop ${shopData.name} is blocked.`);
        return res.status(403).json({ error: "Sistema em bloqueio, contate o revendedor." });
      }

      res.cookie('kivo_role', 'professional', { maxAge: 365 * 24 * 60 * 60 * 1000, path: '/' });
      res.cookie('kivo_shop_id', profObj.barbershop_id, { maxAge: 365 * 24 * 60 * 60 * 1000, path: '/' });
      return res.json({
        user: {
          role: 'professional',
          name: profObj.name,
          id: profObj.id,
          shopId: profObj.barbershop_id,
          shop: shopData || null
        }
      });
    }

    logDebug(`[LOGIN FAIL]: Invalid credentials for login=${login}`);
    console.log("[LOGIN] Falha: Credenciais não batem.");
    return res.status(401).json({ error: "Credenciais inválidas. Verifique o telefone e a senha." });
  } catch (err: any) {
    logDebug(`[LOGIN EXCEPTION]: ${err.message || err}\nStack: ${err.stack}`);
    res.status(500).json({ error: err.message || "Erro interno do servidor durante o processamento do login." });
  }
});

// CLIENT LOGIN & REGISTER
app.post("/api/clients/register", async (req, res) => {
  try {
    const { name, phone, password, barbershop_id: raw_barbershop_id, notifications_enabled } = req.body;

    if (!name || !phone || !password || !raw_barbershop_id) {
       return res.status(400).json({ error: "Preencha todos os campos obrigatórios." });
    }

    const barbershop_id = await resolveShopId(supabase, raw_barbershop_id);
    const cleanPhone = phone.replace(/\D/g, '');

    const phoneInUseError = await isPhoneAlreadyInUse(supabase, cleanPhone);
    if (phoneInUseError) {
      return res.status(400).json({ error: phoneInUseError });
    }

    const { data: inserted, error: insertError } = await supabase
        .from('clients')
        .insert([{
          name,
          phone: cleanPhone,
          password,
          barbershop_id,
          notifications_enabled: notifications_enabled !== undefined ? notifications_enabled : true
        }])
        .select();

      if (insertError) throw insertError;
      return res.json({ success: true, client: inserted[0] });
  } catch (err: any) {
    console.error("[REGISTER CLIENT] Erro geral:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/clients/login", async (req, res) => {
  try {
    const { phone, password, barbershop_id: raw_barbershop_id } = req.body;

    if (!phone || !password || !raw_barbershop_id) {
      return res.status(400).json({ error: "Telefone, senha e barbearia são obrigatórios." });
    }

    const barbershop_id = await resolveShopId(supabase, raw_barbershop_id);
    const cleanPhone = phone.replace(/\D/g, '');

    const { data: clients, error: loginError } = await supabase
      .from('clients')
      .select('*')
      .eq('phone', cleanPhone)
      .eq('barbershop_id', barbershop_id);

    if (loginError) throw loginError;

    const matchedClient = clients?.find(c => c.password === password);

    if (!matchedClient) {
      return res.status(401).json({ error: "Telefone ou senha incorretos para esta barbearia." });
    }

    res.cookie('kivo_role', 'client', { maxAge: 365 * 24 * 60 * 60 * 1000, path: '/' });
    res.cookie('kivo_shop_id', barbershop_id, { maxAge: 365 * 24 * 60 * 60 * 1000, path: '/' });
    res.json({ success: true, client: matchedClient });
  } catch (err: any) {
    console.error("[CLIENT LOGIN] Erro geral:", err);
    res.status(500).json({ error: err.message });
  }
});

// Appointments Routes
function mapApptToFrontend(appt: any): any {
  if (!appt) return null;

  // Resilient Date & Time parsing
  let datePart = appt.date || "";
  let timePart = appt.time ? appt.time.slice(0, 5) : "";

  if (!datePart && appt.start_time) {
    const parts = appt.start_time.split("T");
    datePart = parts[0];
    if (parts[1]) {
      timePart = parts[1].slice(0, 5); // "HH:MM"
    }
  }

  // Resilient Shop ID mapping
  const shopId = appt.barbershop_id || appt.company_id || "";

  // Resilient customer mapping
  const custName = appt.customer_name || appt.client?.name || appt.notes || "Cliente";
  const custPhone = appt.customer_phone || appt.client?.phone || "";

  const statusMap: Record<string, string> = {
    scheduled: 'pending',
    confirmed: 'confirmed',
    completed: 'completed',
    cancelled: 'cancelled'
  };

  return {
    id: appt.id,
    barbershop_id: shopId,
    professional_id: appt.professional_id,
    service_id: appt.service_id,
    customer_name: custName,
    customer_phone: custPhone,
    date: datePart,
    time: timePart,
    status: statusMap[appt.status] || appt.status || 'pending',
    created_at: appt.created_at,
    service: appt.service || null,
    professional: appt.professional || null
  };
}

async function hydrateAppointments(supabaseClient: any, appointments: any[]): Promise<any[]> {
  if (!appointments || appointments.length === 0) return [];

  const serviceIds = Array.from(new Set(appointments.map(a => a.service_id).filter(Boolean)));
  const profIds = Array.from(new Set(appointments.map(a => a.professional_id).filter(Boolean)));
  const clientIds = Array.from(new Set(appointments.map(a => a.client_id).filter(Boolean)));

  const [servicesRes, profsRes, clientsRes] = await Promise.all([
    serviceIds.length > 0 ? supabaseClient.from('services').select('*').in('id', serviceIds) : { data: [] },
    profIds.length > 0 ? supabaseClient.from('professionals').select('*').in('id', profIds) : { data: [] },
    clientIds.length > 0 ? supabaseClient.from('clients').select('*').in('id', clientIds) : { data: [] }
  ]);

  const servicesMap = new Map((servicesRes.data || []).map((s: any) => [s.id, s]));
  const profsMap = new Map((profsRes.data || []).map((p: any) => [p.id, p]));
  const clientsMap = new Map((clientsRes.data || []).map((c: any) => [c.id, c]));

  return appointments.map(appt => {
    return {
      ...appt,
      service: servicesMap.get(appt.service_id) || appt.service || null,
      professional: profsMap.get(appt.professional_id) || appt.professional || null,
      client: appt.client_id ? (clientsMap.get(appt.client_id) || appt.client || null) : (appt.client || null)
    };
  });
}

async function resolveShopId(supabaseClient: any, idOrSlug: string | undefined): Promise<string> {
  if (!supabaseClient || !idOrSlug) return idOrSlug || "";
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(idOrSlug)) {
    return idOrSlug;
  }

  try {
    const { data: shop, error } = await supabaseClient
      .from('barbershops')
      .select('id')
      .eq('slug', idOrSlug)
      .maybeSingle();
    
    if (shop && shop.id && !error) {
      return shop.id;
    }

    // Fallback: search by name-based slug if column is missing or not matched
    const { data: allShops } = await supabaseClient.from('barbershops').select('id, name');
    if (allShops) {
      const match = allShops.find((s: any) => {
        const tempSlug = (s.name || '').toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        return tempSlug === idOrSlug;
      });
      if (match) {
        return match.id;
      }
    }
  } catch (err) {
    console.error(`[resolveShopId] Error resolving ${idOrSlug}:`, err);
  }

  return idOrSlug;
}

async function ensureCompanyExists(supabaseClient: any, barbershopId: string): Promise<boolean> {
  if (!supabaseClient || !barbershopId) return false;
  if (verifiedCompanies.has(barbershopId)) {
    return true;
  }
  try {
    const { data: company, error: cErr } = await supabaseClient
      .from('companies')
      .select('id')
      .eq('id', barbershopId)
      .maybeSingle();

    if (company) {
      verifiedCompanies.add(barbershopId);
      return true;
    }

    const { data: barbershop, error: bErr } = await supabaseClient
      .from('barbershops')
      .select('*')
      .eq('id', barbershopId)
      .maybeSingle();

    if (bErr || !barbershop) {
      console.error(`[ensureCompanyExists] Barbershop not found for ID: ${barbershopId}`);
      return false;
    }

    const slug = (barbershop.name || 'barber')
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    let planId = barbershop.plan_id;
    if (!planId) {
      const { data: plans } = await supabaseClient.from('plans').select('id').limit(1);
      if (plans && plans.length > 0) {
        planId = plans[0].id;
      }
    }

    console.log(`[ensureCompanyExists] Creating matching company for barbershop ${barbershop.name} with ID ${barbershopId}`);
    const { error: insertErr } = await supabaseClient
      .from('companies')
      .insert([{
        id: barbershopId,
        name: barbershop.name,
        slug: slug || `barber-${barbershopId.slice(0, 8)}`,
        phone: barbershop.phone,
        address: barbershop.address,
        plan_id: planId,
        active: true,
        owner_name: 'Proprietário'
      }]);

    if (insertErr) {
      console.error(`[ensureCompanyExists] Error inserting company:`, insertErr);
      return false;
    }
    verifiedCompanies.add(barbershopId);
    return true;
  } catch (err) {
    console.error(`[ensureCompanyExists] Exception:`, err);
    return false;
  }
}

async function checkAppointmentConflict(
  supabaseClient: any,
  professional_id: string,
  date: string,
  time: string,
  service_id: string,
  exclude_appointment_id?: string,
  serviceDuration?: number
): Promise<{ conflict: boolean; message?: string }> {
  try {
    let proposedDuration = serviceDuration;
    if (!proposedDuration) {
      const { data: service, error: sErr } = await supabaseClient
        .from('services')
        .select('name, duration_minutes')
        .eq('id', service_id)
        .single();
      
      if (sErr || !service) {
        return { conflict: false };
      }
      proposedDuration = service.duration_minutes || 30;
    }
    
    const proposedStart = new Date(`${date}T${time}:00.000Z`);
    const proposedEnd = new Date(proposedStart.getTime() + proposedDuration * 60000);

    let query = supabaseClient
      .from('appointments')
      .select('*')
      .eq('professional_id', professional_id)
      .neq('status', 'cancelled');

    if (exclude_appointment_id) {
      query = query.neq('id', exclude_appointment_id);
    }

    // Try applying date filter first as it's the schema column
    let dateFilterApplied = false;
    try {
      if (cachedHasDateColumn === null) {
        const testRes = await supabaseClient.from('appointments').select('date').limit(1);
        cachedHasDateColumn = !testRes.error;
      }
      if (cachedHasDateColumn) {
        query = query.eq('date', date);
        dateFilterApplied = true;
      }
    } catch (e) {
      cachedHasDateColumn = false;
    }

    if (!dateFilterApplied) {
      query = query
        .gte('start_time', `${date}T00:00:00.000Z`)
        .lte('start_time', `${date}T23:59:59.999Z`);
    }

    const { data: existingAppts, error: apptsErr } = await query;
    if (apptsErr || !existingAppts) {
      return { conflict: false };
    }

    for (const appt of existingAppts) {
      let apptStart: Date;
      let apptEnd: Date;

      if (appt.date && appt.time) {
        const cleanTime = appt.time.slice(0, 5);
        apptStart = new Date(`${appt.date}T${cleanTime}:00.000Z`);
        
        let apptDuration = 30;
        if (appt.service_id) {
          const { data: s } = await supabaseClient
            .from('services')
            .select('duration_minutes')
            .eq('id', appt.service_id)
            .single();
          if (s) apptDuration = s.duration_minutes || 30;
        }
        apptEnd = new Date(apptStart.getTime() + apptDuration * 60000);
      } else {
        apptStart = new Date(appt.start_time || `${date}T${time}:00.000Z`);
        apptEnd = new Date(appt.end_time || apptStart.getTime() + 30 * 60000);
      }

      if (proposedStart < apptEnd && apptStart < proposedEnd) {
        let serviceName = "Serviço";
        if (appt.service_id) {
          const { data: s } = await supabaseClient
            .from('services')
            .select('name')
            .eq('id', appt.service_id)
            .single();
          if (s) serviceName = s.name;
        }

        const formatTime = (d: Date) => {
          const pad = (num: number) => num.toString().padStart(2, '0');
          return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
        };
        const startStr = formatTime(apptStart);
        const endStr = formatTime(apptEnd);
        return {
          conflict: true,
          message: `Conflito de horário! O profissional já possui um agendamento das ${startStr} às ${endStr} (${serviceName}). Por favor, escolha outro horário.`
        };
      }
    }

    return { conflict: false };
  } catch (err) {
    console.error("Erro ao verificar conflito de agendamento:", err);
    return { conflict: false };
  }
}

app.get("/api/appointments", async (req, res) => {
  try {
    const { shopId: rawShopId, professionalId, date } = req.query;
    const shopId = await resolveShopId(supabase, rawShopId as string);
    
    if (shopId) {
      await ensureCompanyExists(supabase, shopId as string);
    }
    
    // Check which shop column we can query
    let shopCol = 'barbershop_id';
    try {
      const testRes = await supabase.from('appointments').select('barbershop_id').limit(1);
      if (testRes.error && testRes.error.message.includes('company_id')) {
        shopCol = 'company_id';
      } else if (testRes.error) {
        const testRes2 = await supabase.from('appointments').select('company_id').limit(1);
        if (!testRes2.error) {
          shopCol = 'company_id';
        }
      }
    } catch (e) {}

    let query = supabase.from('appointments').select('*').eq(shopCol, shopId);
    
    if (professionalId) {
      query = query.eq('professional_id', professionalId);
    }
    
    // Check if we can query by "date" column
    let dateColExist = true;
    try {
      const testRes = await supabase.from('appointments').select('date').limit(1);
      if (testRes.error) {
        dateColExist = false;
      }
    } catch (e) {
      dateColExist = false;
    }

    if (date) {
      if (dateColExist) {
        query = query.eq('date', date);
      } else {
        query = query
          .gte('start_time', `${date}T00:00:00.000Z`)
          .lte('start_time', `${date}T23:59:59.999Z`);
      }
    }
    
    let orderByCol = dateColExist ? 'time' : 'start_time';
    const { data, error } = await query.order(orderByCol);
    if (error) throw error;
    
    const hydrated = await hydrateAppointments(supabase, data);
    const formatted = hydrated.map(mapApptToFrontend);
    res.json(formatted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/appointments", async (req, res) => {
  try {
    const { barbershop_id, professional_id, service_id, customer_name, customer_phone, date, time } = req.body;
    
    if (!barbershop_id || !professional_id || !service_id || !customer_name || !date || !time) {
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios." });
    }

    await ensureCompanyExists(supabase, barbershop_id);

    // Subscription Quota Check
    if (customer_phone) {
      const cleanPhone = customer_phone.replace(/\D/g, '');
      const { data: clientData } = await supabase
        .from('clients')
        .select('*, subscription_plan:barbershop_subscriptions(*)')
        .eq('phone', cleanPhone)
        .eq('barbershop_id', barbershop_id)
        .maybeSingle();

      if (clientData && clientData.plan_id && clientData.subscription_plan) {
        const plan = clientData.subscription_plan;
        // Check if the service being booked is the one in the plan
        if (plan.service_id === service_id) {
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

          const { count, error: countErr } = await supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .eq('barbershop_id', barbershop_id)
            .eq('customer_phone', cleanPhone)
            .eq('service_id', service_id)
            .neq('status', 'cancelled')
            .gte('date', startOfMonth)
            .lte('date', endOfMonth);

          if (!countErr && count !== null && count >= plan.limit_count) {
            return res.status(400).json({ 
              error: `Limite do seu plano de assinatura atingido (${plan.limit_count} agendamentos no mês para este serviço).`,
              is_quota_exceeded: true
            });
          }
        }
      }
    }

    const proposedStart = new Date(`${date}T${time}:00.000-03:00`);
    if (proposedStart.getTime() < Date.now() - 5 * 1000) {
      return res.status(400).json({ error: "Este horário já passou. Por favor, escolha uma data e horário futuros." });
    }

    const { data: service, error: sErr } = await supabase
      .from('services')
      .select('*')
      .eq('id', service_id)
      .single();
    
    if (sErr || !service) {
      return res.status(400).json({ error: "Serviço não encontrado." });
    }
    const price = service.price || 0;
    const duration = service.duration_minutes || 30;

    const check = await checkAppointmentConflict(supabase, professional_id, date, time, service_id, undefined, duration);
    if (check.conflict) {
      return res.status(400).json({ error: check.message });
    }

    let client_id = null;
    if (customer_phone) {
      const { data: existingClientPhone } = await supabase
        .from('clients')
        .select('id')
        .eq('phone', customer_phone)
        .eq('barbershop_id', barbershop_id)
        .limit(1);
      
      if (existingClientPhone && existingClientPhone.length > 0) {
        client_id = existingClientPhone[0].id;
      }
    }
    
    if (!client_id) {
      const { data: existingClientName } = await supabase
        .from('clients')
        .select('id')
        .eq('name', customer_name)
        .eq('barbershop_id', barbershop_id)
        .limit(1);
        
      if (existingClientName && existingClientName.length > 0) {
        client_id = existingClientName[0].id;
      }
    }
    
    if (!client_id) {
      const { data: newClient, error: cErr } = await supabase
        .from('clients')
        .insert([{
          name: customer_name,
          phone: customer_phone || null,
          barbershop_id
        }])
        .select()
        .single();
      if (cErr) {
        return res.status(400).json({ error: `Erro ao cadastrar cliente no banco: ${cErr.message}` });
      }
      client_id = newClient.id;
    }

    const start_time = `${date}T${time}:00.000Z`;
    const end_time = new Date(new Date(start_time).getTime() + duration * 60000).toISOString();

    const insertPayload: any = {
      professional_id,
      service_id,
      status: 'pending'
    };

    // Determine columns dynamically (based on columns available in database)
    if (cachedTblColNames === null) {
      const testColsRes = await supabase.from('appointments').select('barbershop_id, customer_name, date').limit(0);
      cachedTblColNames = !testColsRes.error ? ['barbershop_id', 'customer_name', 'customer_phone', 'date', 'time'] : [];
    }
    const tblColNames = cachedTblColNames;
    
    if (tblColNames.length > 0) {
      insertPayload.barbershop_id = barbershop_id;
      insertPayload.customer_name = customer_name;
      insertPayload.customer_phone = customer_phone || null;
      insertPayload.date = date;
      insertPayload.time = time;
    } else {
      insertPayload.company_id = barbershop_id;
      insertPayload.client_id = client_id;
      insertPayload.start_time = start_time;
      insertPayload.end_time = end_time;
      insertPayload.total_price = price;
      insertPayload.notes = customer_name;
      insertPayload.status = 'scheduled';
    }

    const { data, error } = await supabase.from('appointments').insert([insertPayload]).select('*').single();

    if (error) throw error;
    const hydrated = (await hydrateAppointments(supabase, [data]))[0];

    // Push Confirmation (Optional but good UX)
    if (customer_phone && VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
      const cleanPhone = customer_phone.replace(/\D/g, '');
      const { data: client } = await supabase
        .from('clients')
        .select('push_subscription, notifications_enabled')
        .eq('barbershop_id', barbershop_id)
        .eq('phone', cleanPhone)
        .single();

      if (client && client.push_subscription && client.notifications_enabled !== false) {
        try {
          const subscription = JSON.parse(client.push_subscription);
          const payload = JSON.stringify({
            title: `Agendamento Realizado!`,
            body: `Tudo pronto! Seu agendamento de ${hydrated.service?.name} está marcado para ${hydrated.date} às ${hydrated.time}.`,
            icon: '/logo_kivo_192.png'
          });
          webpush.sendNotification(subscription, payload).catch(e => console.error("[NOTIFICATIONS] Error sending push confirmation:", e));
        } catch (e) {}
      }
    }

    res.json(mapApptToFrontend(hydrated));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, time, date, professional_id, service_id } = req.body;
    
    const { data: original, error: origError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();
      
    if (origError || !original) {
      return res.status(404).json({ error: "Agendamento não encontrado." });
    }

    const finalProfId = professional_id || original.professional_id;
    const finalServiceId = service_id || original.service_id;
    
    let originalDate = original.date || "";
    let originalTime = original.time ? original.time.slice(0, 5) : "";
    if (!originalDate && original.start_time) {
      const parts = original.start_time.split("T");
      originalDate = parts[0];
      if (parts[1]) {
        originalTime = parts[1].slice(0, 5);
      }
    }

    let finalDbStatus = original.status;
    if (status) {
      if (status === 'pending') {
        finalDbStatus = 'scheduled';
      } else {
        finalDbStatus = status;
      }
    }

    let finalStartTime = original.start_time;
    let finalEndTime = original.end_time;
    
    let duration = 30;
    if (time || date || service_id) {
      const activeDate = date || originalDate;
      const activeTime = time || originalTime;
      
      const { data: activeService } = await supabase
        .from('services')
        .select('duration_minutes')
        .eq('id', finalServiceId)
        .single();
        
      duration = activeService ? activeService.duration_minutes : 30;
      
      finalStartTime = `${activeDate}T${activeTime}:00.000Z`;
      finalEndTime = new Date(new Date(finalStartTime).getTime() + duration * 60000).toISOString();
    } else if (professional_id) {
      const { data: activeService } = await supabase
        .from('services')
        .select('duration_minutes')
        .eq('id', finalServiceId)
        .single();
      
      duration = activeService ? activeService.duration_minutes : 30;
    }

    if (finalDbStatus !== 'cancelled' && (time || date || professional_id || service_id)) {
      const activeDate = date || originalDate;
      const activeTime = time || originalTime;
      
      const check = await checkAppointmentConflict(supabase, finalProfId, activeDate, activeTime, finalServiceId, id, duration);
      if (check.conflict) {
        return res.status(400).json({ error: check.message });
      }
    }

    const updatePayload: any = {
      status: finalDbStatus,
      professional_id: finalProfId,
      service_id: finalServiceId
    };

    // Determine columns dynamically
    if (cachedHasDateColumn === null) {
      const testColsRes = await supabase.from('appointments').select('date').limit(0);
      cachedHasDateColumn = !testColsRes.error;
    }
    const hasNewCols = cachedHasDateColumn;

    if (hasNewCols) {
      if (date) updatePayload.date = date;
      if (time) updatePayload.time = time;
    } else {
      if (finalStartTime) updatePayload.start_time = finalStartTime;
      if (finalEndTime) updatePayload.end_time = finalEndTime;
    }

    const { data, error } = await supabase
      .from('appointments')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) throw error;
    const hydrated = (await hydrateAppointments(supabase, [data]))[0];
    res.json(mapApptToFrontend(hydrated));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/plans", async (req, res) => {
  try {
    const { data, error } = await supabase.from('plans').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/plans", async (req, res) => {
  try {
    const { name, price, professionals_count } = req.body;
    const { data, error } = await supabase.from('plans').insert([{ name, price, professionals_count }]).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/plans/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, professionals_count } = req.body;
    const { data, error } = await supabase.from('plans').update({ name, price, professionals_count }).eq('id', id).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/plans/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await supabase.from('barbershops').update({ plan_id: null }).eq('plan_id', id);
    const { error } = await supabase.from('plans').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/barbershops", async (req, res) => {
  try {
    const { data, error } = await supabase.from('barbershops').select('*, plan:plans(*)').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/barbershops/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const targetId = await resolveShopId(supabase, id);
    const { data, error } = await supabase.from('barbershops').select('*, plan:plans(*)').eq('id', targetId).single();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/barbershops", async (req, res) => {
  try {
    const { name, address, phone, plan_id, password, status, slug } = req.body;
    let logo_url = req.body.logo_url;
    let banner_url = req.body.banner_url;
    let bio = req.body.bio;
    let photo1 = req.body.photo1;
    let photo2 = req.body.photo2;
    let photo3 = req.body.photo3;

    if (address) {
      const parts = address.split('|||');
      if (parts.length > 2 && !logo_url) logo_url = parts[2];
      if (parts.length > 3 && !banner_url) banner_url = parts[3];
      if (parts.length > 4 && !bio) bio = parts[4];
      if (parts.length > 5 && !photo1) photo1 = parts[5];
      if (parts.length > 6 && !photo2) photo2 = parts[6];
      if (parts.length > 7 && !photo3) photo3 = parts[7];
    }

    const cleanPhone = (phone || "").replace(/\D/g, '');
    const phoneInUseError = await isPhoneAlreadyInUse(supabase, cleanPhone);
    if (phoneInUseError) {
      return res.status(400).json({ error: phoneInUseError });
    }

    const finalSlug = slug || (name || 'barber')
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const { data, error } = await supabase.from('barbershops').insert([{ 
      name, 
      address, 
      phone: cleanPhone, 
      plan_id, 
      password, 
      status,
      logo_url,
      banner_url,
      bio,
      photo1,
      photo2,
      photo3,
      slug: finalSlug
    }]).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/barbershops/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone, plan_id, password, status, whatsapp, reminder_lead_time_minutes, slug } = req.body;
    let logo_url = req.body.logo_url;
    let banner_url = req.body.banner_url;
    let bio = req.body.bio;
    let photo1 = req.body.photo1;
    let photo2 = req.body.photo2;
    let photo3 = req.body.photo3;

    // Get current data for merging if fields are missing in payload
    const { data: currentShop } = await supabase.from('barbershops').select('*').eq('id', id).single();

    if (address) {
      const parts = address.split('|||');
      // Only recover from address if they are null/undefined in body AND not intentionally empty strings (unless we want to allow clearing)
      // Usually, if the body doesn't even have the key, we recover it.
      if (parts.length > 2 && logo_url === undefined) logo_url = parts[2];
      if (parts.length > 3 && banner_url === undefined) banner_url = parts[3];
      if (parts.length > 4 && bio === undefined) bio = parts[4];
      if (parts.length > 5 && photo1 === undefined) photo1 = parts[5];
      if (parts.length > 6 && photo2 === undefined) photo2 = parts[6];
      if (parts.length > 7 && photo3 === undefined) photo3 = parts[7];
    } else if (currentShop) {
      // If address is NOT provided, we should probably keep existing address or reconstruct it?
      // For now, let's just make sure we don't lose the individual column values.
    }

    // Double check with columns in case address string was out of sync
    if (currentShop) {
      if (logo_url === undefined) logo_url = currentShop.logo_url;
      if (banner_url === undefined) banner_url = currentShop.banner_url;
      if (bio === undefined) bio = currentShop.bio;
      if (photo1 === undefined) photo1 = currentShop.photo1;
      if (photo2 === undefined) photo2 = currentShop.photo2;
      if (photo3 === undefined) photo3 = currentShop.photo3;
    }

    const cleanPhone = phone ? phone.replace(/\D/g, '') : undefined;
    
    if (cleanPhone) {
      const phoneInUseError = await isPhoneAlreadyInUse(supabase, cleanPhone, { table: 'barbershops', id });
      if (phoneInUseError) {
        return res.status(400).json({ error: phoneInUseError });
      }
    }

    if (slug && slug !== currentShop?.slug) {
      const { data: slugCheck } = await supabase.from('barbershops').select('id').eq('slug', slug).neq('id', id).maybeSingle();
      if (slugCheck) {
        return res.status(400).json({ error: "Este identificador (slug) já está em uso por outra unidade." });
      }
    }
    
    // Check if transitioning from blocked to active to renew billing cycle / grace period
    const updatePayload: any = { 
      name: name ?? currentShop?.name, 
      address: address ?? currentShop?.address, 
      phone: cleanPhone ?? currentShop?.phone, 
      plan_id: plan_id ?? currentShop?.plan_id, 
      status: status ?? currentShop?.status,
      logo_url: logo_url,
      banner_url: banner_url,
      bio: bio,
      photo1: photo1,
      photo2: photo2,
      photo3: photo3,
      whatsapp: whatsapp ?? currentShop?.whatsapp,
      reminder_lead_time_minutes: reminder_lead_time_minutes ?? currentShop?.reminder_lead_time_minutes,
      slug: slug ?? currentShop?.slug
    };

    if (password) updatePayload.password = password;

    if (currentShop && currentShop.status === 'blocked' && status === 'active') {
      updatePayload.created_at = new Date().toISOString();
    }

    const { data, error } = await supabase.from('barbershops').update(updatePayload).eq('id', id).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/barbershops/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const dependentTables = ['clients', 'profiles', 'professionals', 'services', 'products', 'appointments', 'inventory'];
    for (const table of dependentTables) {
      await supabase.from(table).delete().eq('barbershop_id', id);
    }

    const { error } = await supabase.from('barbershops').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/metrics", async (req, res) => {
  const { data: shops } = await supabase.from('barbershops').select('id, status, plan_id');
  const { data: plans } = await supabase.from('plans').select('id, price');
  
  const plansMap = new Map((plans || []).map(p => [p.id, p.price]));
  const activeShops = shops?.filter(s => s.status === 'active') || [];
  
  const monthlyRevenue = activeShops.reduce((acc, shop) => {
    return acc + (plansMap.get(shop.plan_id) || 0);
  }, 0);

  res.json({
    monthlyRevenue,
    totalBarbershops: shops?.length || 0,
    activeSubscriptions: activeShops.length
  });
});

// Services Routes
app.get("/api/services", async (req, res) => {
  try {
    const { shopId: rawShopId } = req.query;
    const shopId = await resolveShopId(supabase, rawShopId as string);
    const { data, error } = await supabase.from('services').select('*').eq('barbershop_id', shopId).order('name');
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/services", async (req, res) => {
  try {
    const { barbershop_id, name, price, duration_minutes } = req.body;
    const { data, error } = await supabase.from('services').insert([{ barbershop_id, name, price, duration_minutes }]).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/services/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, duration_minutes } = req.body;
    const { data, error } = await supabase.from('services').update({ name, price, duration_minutes }).eq('id', id).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/services/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- SUBSCRIPTION PLANS API ---
app.get("/api/subscription-plans", async (req, res) => {
  try {
    const { barbershop_id } = req.query;
    if (!barbershop_id) return res.status(400).json({ error: "barbershop_id é obrigatório." });
    
    const { data, error } = await supabase
      .from('barbershop_subscriptions')
      .select('*, service:services(*)')
      .eq('barbershop_id', barbershop_id)
      .order('created_at');
      
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/subscription-plans", async (req, res) => {
  try {
    const { barbershop_id, name, price, limit_count, service_id } = req.body;
    if (!barbershop_id || !name || !price || !limit_count || !service_id) {
      return res.status(400).json({ error: "Preencha todos os campos do plano." });
    }
    
    const { data, error } = await supabase
      .from('barbershop_subscriptions')
      .insert([{ barbershop_id, name, price, limit_count, service_id }])
      .select()
      .single();
      
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/subscription-plans/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, limit_count, service_id } = req.body;
    
    const { data, error } = await supabase
      .from('barbershop_subscriptions')
      .update({ name, price, limit_count, service_id })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/subscription-plans/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('barbershop_subscriptions').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/debug/columns", async (req, res) => {
  try {
    const { data: cols, error } = await supabase.from('professionals').select('working_hours_type, custom_start_time, custom_end_time').limit(0);
    if (error) {
      return res.json({ 
        status: 'error', 
        message: 'As colunas de horário não existem no banco de dados.', 
        error: error.message,
        sql: `ALTER TABLE professionals ADD COLUMN working_hours_type TEXT DEFAULT 'shop';
ALTER TABLE professionals ADD COLUMN custom_start_time TEXT DEFAULT '08:00';
ALTER TABLE professionals ADD COLUMN custom_end_time TEXT DEFAULT '20:00';`
      });
    }
    res.json({ status: 'ok', message: 'Tabela profissionais possui todas as colunas necessárias.' });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Professionals Routes
app.get("/api/professionals", async (req, res) => {
  try {
    const { shopId: rawShopId } = req.query;
    const shopId = await resolveShopId(supabase, rawShopId as string);
    const { data, error } = await supabase.from('professionals').select('*').eq('barbershop_id', shopId).order('name');
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/professionals", async (req, res) => {
  try {
    const { barbershop_id, name, phone, password, commission_percentage, photo_url, working_hours_type, custom_start_time, custom_end_time } = req.body;
    const cleanPhone = (phone || "").replace(/\D/g, '');

    if (!barbershop_id) return res.status(400).json({ error: "barbershop_id é obrigatório" });
    if (!name) return res.status(400).json({ error: "Nome do profissional é obrigatório" });
    if (!password) return res.status(400).json({ error: "Senha do profissional é obrigatória" });

    console.log(`[PROFESSIONAL] Criando profissional: ${name}, fone: ${cleanPhone}, shop: ${barbershop_id}, comissão: ${commission_percentage}, foto: ${!!photo_url}`);

    const phoneInUseError = await isPhoneAlreadyInUse(supabase, cleanPhone);
    if (phoneInUseError) {
      return res.status(400).json({ error: phoneInUseError });
    }

    const { data: shop, error: shopErr } = await supabase.from('barbershops').select('*, plan:plans(*)').eq('id', barbershop_id).single();
    if (shopErr) {
      console.error("[PROFESSIONAL] Erro ao buscar barbearia para limite de plano:", shopErr);
    }
    
    const { count, error: countErr } = await supabase.from('professionals').select('*', { count: 'exact', head: true }).eq('barbershop_id', barbershop_id);
    if (countErr) {
      console.error("[PROFESSIONAL] Erro ao contar profissionais:", countErr);
    }
    
    if (shop?.plan && count !== null && count >= shop.plan.professionals_count) {
      return res.status(400).json({ error: `Seu plano (${shop.plan.name}) permite apenas ${shop.plan.professionals_count} profissionais.` });
    }

    const { data, error } = await supabase.from('professionals').insert([{ 
      barbershop_id, 
      name, 
      phone: cleanPhone, 
      password,
      commission_percentage: commission_percentage !== undefined ? Number(commission_percentage) : 40,
      photo_url: photo_url || null,
      working_hours_type: working_hours_type || 'shop',
      custom_start_time: custom_start_time || '08:00',
      custom_end_time: custom_end_time || '20:00'
    }]).select();
    
    if (error) {
      console.error("[PROFESSIONAL] Erro Supabase ao inserir profissional:", error);
      if (error.code === '23505') {
        return res.status(400).json({ error: "Este número de telefone já está cadastrado para outro profissional nesta ou em outra barbearia." });
      }
      throw error;
    }
    
    if (!data || data.length === 0) {
      return res.status(500).json({ error: "Erro ao inserir: nenhuma linha retornada do banco de dados." });
    }

    console.log("[PROFESSIONAL] Profissional criado com sucesso:", data[0].name);
    res.json(data[0]);
  } catch (err: any) {
    console.error("[PROFESSIONAL] Falha catastrófica ao criar profissional:", err);
    res.status(500).json({ error: err.message || "Erro desconhecido ao salvar profissional." });
  }
});

app.put("/api/professionals/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, password, commission_percentage, photo_url, working_hours_type, custom_start_time, custom_end_time } = req.body;
    const cleanPhone = phone ? phone.replace(/\D/g, '') : undefined;
    
    console.log(`[PROFESSIONAL] Atualizando profissional ${id}: ${name}, fone: ${cleanPhone}, comissão: ${commission_percentage}, foto: ${!!photo_url}`);

    if (cleanPhone) {
      const phoneInUseError = await isPhoneAlreadyInUse(supabase, cleanPhone, { table: 'professionals', id });
      if (phoneInUseError) {
        return res.status(400).json({ error: phoneInUseError });
      }
    }

    const updateData: any = { name, phone: cleanPhone };
    if (password && password.trim() !== "") {
      updateData.password = password;
    }
    if (commission_percentage !== undefined) {
      updateData.commission_percentage = Number(commission_percentage);
    }
    if (photo_url !== undefined) {
      updateData.photo_url = photo_url;
    }
    if (working_hours_type !== undefined) {
      updateData.working_hours_type = working_hours_type;
    }
    if (custom_start_time !== undefined) {
      updateData.custom_start_time = custom_start_time;
    }
    if (custom_end_time !== undefined) {
      updateData.custom_end_time = custom_end_time;
    }

    const { data, error } = await supabase.from('professionals').update(updateData).eq('id', id).select();
    
    if (error) {
      console.error("[PROFESSIONAL] Erro ao atualizar profissional:", error);
      if (error.code === '23505') {
        return res.status(400).json({ error: "Este número de telefone já está cadastrado para outro profissional nesta ou em outra barbearia." });
      }
      throw error;
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Profissional não encontrado." });
    }

    console.log("[PROFESSIONAL] Profissional atualizado com sucesso:", data[0].name);
    res.json(data[0]);
  } catch (err: any) {
    console.error("[PROFESSIONAL] Erro desconhecido ao atualizar profissional:", err);
    res.status(500).json({ error: err.message || "Erro desconhecido ao atualizar profissional." });
  }
});

app.delete("/api/professionals/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('professionals').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Clients Routes
app.get("/api/clients", async (req, res) => {
  try {
    const { shopId: rawShopId } = req.query;
    const shopId = await resolveShopId(supabase, rawShopId as string);
    const { data, error } = await supabase
      .from('clients')
      .select('*, subscription_plan:barbershop_subscriptions(*)')
      .eq('barbershop_id', shopId)
      .order('name');
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/clients", async (req, res) => {
  try {
    const { barbershop_id, name, phone, password } = req.body;
    const cleanPhone = (phone || "").replace(/\D/g, '');

    const phoneInUseError = await isPhoneAlreadyInUse(supabase, cleanPhone);
    if (phoneInUseError) {
      return res.status(400).json({ error: phoneInUseError });
    }

    const { data, error } = await supabase.from('clients').insert([{ barbershop_id, name, phone: cleanPhone, password: password || "123" }]).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/clients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, password, plan_id } = req.body;
    const cleanPhone = phone ? phone.replace(/\D/g, '') : undefined;

    if (cleanPhone) {
      const phoneInUseError = await isPhoneAlreadyInUse(supabase, cleanPhone, { table: 'clients', id });
      if (phoneInUseError) {
        return res.status(400).json({ error: phoneInUseError });
      }
    }

    const updateData: any = { name, phone: cleanPhone, plan_id: plan_id === "free" ? null : plan_id };
    if (password && password.trim() !== "") updateData.password = password;

    const { data, error } = await supabase.from('clients').update(updateData).eq('id', id).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/clients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/barbershops/change-password", async (req, res) => {
  try {
    const { id, currentPassword, newPassword } = req.body || {};
    if (!id || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    const { data: shop, error: fetchError } = await supabase
      .from('barbershops')
      .select('password')
      .eq('id', id)
      .single();

    if (fetchError || !shop) {
      return res.status(404).json({ error: "Barbearia não encontrada." });
    }

    if (shop.password !== currentPassword) {
      return res.status(400).json({ error: "A senha atual está incorreta." });
    }

    const { error: updateError } = await supabase
      .from('barbershops')
      .update({ password: newPassword })
      .eq('id', id);

    if (updateError) {
      throw updateError;
    }

    res.json({ success: true, message: "Senha da barbearia alterada com sucesso." });
  } catch (err: any) {
    console.error("[CHANGE BARBERSHOP PASSWORD] Erro:", err);
    res.status(500).json({ error: err.message || "Erro desconhecido ao alterar senha." });
  }
});

app.post("/api/professionals/change-password", async (req, res) => {
  try {
    const { id, currentPassword, newPassword } = req.body || {};
    if (!id || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    const { data: prof, error: fetchError } = await supabase
      .from('professionals')
      .select('password')
      .eq('id', id)
      .single();

    if (fetchError || !prof) {
      return res.status(404).json({ error: "Profissional não encontrado." });
    }

    if (prof.password !== currentPassword) {
      return res.status(400).json({ error: "A senha atual está incorreta." });
    }

    const { error: updateError } = await supabase
      .from('professionals')
      .update({ password: newPassword })
      .eq('id', id);

    if (updateError) {
      throw updateError;
    }

    res.json({ success: true, message: "Senha do profissional alterada com sucesso." });
  } catch (err: any) {
    console.error("[CHANGE PROFESSIONAL PASSWORD] Erro:", err);
    res.status(500).json({ error: err.message || "Erro desconhecido ao alterar senha." });
  }
});


// Export Express Instance as Named Export
export { app };

// Default Vercel Serverless Handler
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const url = req.url || "";
  
  // Direct Diagnostic Route
  if (url.includes("/api/test-env")) {
    const { url: checkUrl, key: checkKey } = getSupabaseUrlAndKey();
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({
      status: "diagnostico_ok",
      current_time: new Date().toISOString(),
      env: {
        NODE_ENV: process.env.NODE_ENV || "not_defined",
        VERCEL: process.env.VERCEL || "not_defined",
        SUPABASE_URL_EXISTS: !!checkUrl,
        SUPABASE_URL_LENGTH: checkUrl ? checkUrl.length : 0,
        SUPABASE_SERVICE_ROLE_KEY_EXISTS: !!checkKey,
        SUPABASE_SERVICE_ROLE_KEY_LENGTH: checkKey ? checkKey.length : 0,
      }
    }));
    return;
  }

  try {
    // Forward the request to Express to process
    return (app as any)(req, res);
  } catch (err: any) {
    console.error("[VERCEL CRITICAL STARTUP ERROR]:", err);
    const errMsg = err.message || String(err);
    const errStack = err.stack ? String(err.stack) : "";
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({
      error: `Erro de inicialização na Vercel: ${errMsg} | Stack: ${errStack.substring(0, 300)}`,
      message: errMsg,
      stack: errStack,
      tip: "Verifique suas variáveis de ambiente na Vercel. Certifique-se de que os valores de SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão completos, sem aspas adicionais e sem espaços."
    }));
  }
}
