import { app } from "./api/index";
import express from "express";
import path from "path";
import fs from "fs";

const PORT = 3000;

async function startServer() {
  // Auto-migrate the generated high-quality PNG/JPG icon to structural static folders
  try {
    const generatedIconPath = path.join(process.cwd(), 'src', 'assets', 'images', 'logo_kivo_png_1781541028660.jpg');
    if (fs.existsSync(generatedIconPath)) {
      console.log(`[PWA Icon Migrator] Found high quality generated icon at ${generatedIconPath}`);
      const publicDir = path.join(process.cwd(), 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      
      // Copy to public folder
      fs.copyFileSync(generatedIconPath, path.join(publicDir, 'logo_kivo_192.png'));
      fs.copyFileSync(generatedIconPath, path.join(publicDir, 'logo_kivo_512.png'));
      fs.copyFileSync(generatedIconPath, path.join(publicDir, 'logo_kivo_192.jpg'));
      fs.copyFileSync(generatedIconPath, path.join(publicDir, 'logo_kivo_512.jpg'));
      console.log(`[PWA Icon Migrator] Copied to public/ successfully.`);

      // Also copy to dist folder if it exists
      const distDir = path.join(process.cwd(), 'dist');
      if (fs.existsSync(distDir)) {
        fs.copyFileSync(generatedIconPath, path.join(distDir, 'logo_kivo_192.png'));
        fs.copyFileSync(generatedIconPath, path.join(distDir, 'logo_kivo_512.png'));
        fs.copyFileSync(generatedIconPath, path.join(distDir, 'logo_kivo_192.jpg'));
        fs.copyFileSync(generatedIconPath, path.join(distDir, 'logo_kivo_512.jpg'));
        console.log(`[PWA Icon Migrator] Copied to dist/ successfully.`);
      }
    } else {
      console.warn(`[PWA Icon Migrator] Generated icon not found at ${generatedIconPath}`);
    }
  } catch (e) {
    console.error("[PWA Icon Migrator] Error migrating icons:", e);
  }

  let isProduction = process.env.NODE_ENV === "production";

  // Robust production mode check:
  // 1. If NODE_ENV is explicitly 'production'
  // 2. OR if we are running the bundled file (dist/server.cjs)
  // 3. OR if __dirname is inside 'dist' or 'build'
  try {
    if (typeof __dirname !== "undefined" && (__dirname.includes('dist') || __dirname.includes('build'))) {
      isProduction = true;
    }
  } catch (e) {
    // safe fallback
  }

  // Under dev mode (isProduction is false) and if we have 'vite' folder
  if (!isProduction) {
    try {
      const vitePath = path.join(process.cwd(), 'node_modules', 'vite');
      if (!fs.existsSync(vitePath)) {
        isProduction = true;
      }
    } catch (e) {
      isProduction = true;
    }
  }

  if (!isProduction) {
    console.log("[SERVER] Starting in DEVELOPMENT mode with Vite dev middleware...");
    const viteModule = "vite";
    const { createServer: createViteServer } = await import(viteModule);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    const handleHtmlWithManifestDev = async (req: any, res: any, next: any) => {
      try {
        const indexHtmlPath = path.resolve(process.cwd(), 'index.html');
        if (fs.existsSync(indexHtmlPath)) {
          let html = fs.readFileSync(indexHtmlPath, 'utf-8');
          
          let manifestUrl = "/manifest.json";
          html = html.replace('<link rel="manifest" href="/manifest.json" />', `<link rel="manifest" href="${manifestUrl}" />`);
          html = await vite.transformIndexHtml(req.originalUrl, html);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } else {
          next();
        }
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    };

    app.get('/', handleHtmlWithManifestDev);
    app.get('/login', handleHtmlWithManifestDev);
    app.get('/dashboard', handleHtmlWithManifestDev);

    app.use(vite.middlewares);

    // Universal SPA Fallback for Development/Preview Mode
    app.get('*', async (req, res, next) => {
      // Skip API routes and files with extensions
      if (req.path.startsWith('/api') || req.path.includes('.')) {
        return next();
      }
      await handleHtmlWithManifestDev(req, res, next);
    });
  } else {
    console.log("[SERVER] Starting in PRODUCTION mode with static file serving...");
    
    // Resolve dist folder with multiple safety checks
    let distPath = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(path.join(distPath, 'index.html'))) {
      if (typeof __dirname !== "undefined" && fs.existsSync(path.join(__dirname, 'index.html'))) {
        distPath = __dirname;
      } else if (typeof __dirname !== "undefined" && fs.existsSync(path.join(__dirname, '..', 'dist', 'index.html'))) {
        distPath = path.join(__dirname, '..', 'dist');
      }
    }

    console.log(`[SERVER] Serving static production files from: ${distPath}`);

    const handleHtmlWithManifestProd = (req: any, res: any, next: any) => {
      const primaryPath = path.join(distPath, 'index.html');
      const fallbackPath = path.join(process.cwd(), 'dist', 'index.html');
      const targetPath = fs.existsSync(primaryPath) ? primaryPath : fallbackPath;

      if (fs.existsSync(targetPath)) {
        let html = fs.readFileSync(targetPath, 'utf-8');
        
        let manifestUrl = "/manifest.json";
        html = html.replace('<link rel="manifest" href="/manifest.json" />', `<link rel="manifest" href="${manifestUrl}" />`);
        res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
      } else {
        res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KIVO BARBER</title>
</head>
<body style="margin: 0; background-color: #121212; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh;">
    <div style="text-align: center; padding: 20px;">
        <h2 style="color: #ffb77d;">Carregando KIVO BARBER...</h2>
        <p style="color: #ddc1ae; font-size: 14px;">Inicializando o portal de agendamento online...</p>
        <script>
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        </script>
    </div>
</body>
</html>`);
      }
    };

    app.get('/', handleHtmlWithManifestProd);
    app.get('/login', handleHtmlWithManifestProd);
    app.get('/dashboard', handleHtmlWithManifestProd);

    // Serve static files
    app.use(express.static(distPath));

    // For SPA, fall back to index.html for any unregistered GET route
    app.get('*', (req, res, next) => {
      // Skip API and static assets
      if (req.path.startsWith('/api') || req.path.includes('.')) {
        return next();
      }
      handleHtmlWithManifestProd(req, res, next);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
