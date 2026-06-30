import { useState, useEffect, FormEvent, useRef } from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  Store, 
  PieChart, 
  Plus, 
  X, 
  Check,
  Menu,
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  LogOut,
  Moon,
  Sun,
  User,
  UserCircle,
  Lock,
  Scissors,
  Users,
  Calendar,
  Box,
  Package,
  Settings,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  Image as ImageIcon,
  Globe,
  Sparkles,
  Ban,
  Eye,
  EyeOff,
  TrendingUp,
  Smartphone,
  Download,
  Info,
  Share,
  RefreshCw,
  Camera,
  MoreVertical,
  ShieldCheck,
  FileText,
  Clock,
  MessageSquare,
  Star,
  Bell,
  BellOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Plan, Barbershop, Service, Professional, Appointment, SubscriptionPlan, Client } from './types';
import { FinancialERP } from './components/FinancialERP';

// Helper component for pagination
const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange, theme }: { currentPage: number, totalItems: number, itemsPerPage: number, onPageChange: (page: number) => void, theme: string }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 p-6 border-t border-white/5 bg-white/[0.01]">
      <button
        disabled={currentPage === 1}
        onClick={() => {
          onPageChange(currentPage - 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
          theme === 'dark' 
            ? 'border-white/10 text-[#C5A059] hover:bg-white/5' 
            : 'border-black/5 text-[#C5A059] hover:bg-black/5'
        } disabled:opacity-20`}
      >
        <ChevronLeft size={14} />
        Anterior
      </button>
      <div className="flex items-center gap-1.5">
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          // Mostrar apenas algumas páginas se forem muitas
          if (totalPages > 5 && Math.abs(page - currentPage) > 1 && page !== 1 && page !== totalPages) {
            if (page === 2 || page === totalPages - 1) return <span key={i} className="px-1 opacity-40">...</span>;
            return null;
          }
          
          return (
            <button
              key={i}
              onClick={() => {
                onPageChange(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${
                currentPage === page
                  ? 'bg-[#C5A059] text-white shadow-lg shadow-[#C5A059]/20 scale-110'
                  : theme === 'dark' ? 'text-[#8C7A6A] hover:bg-white/5 border border-white/5' : 'text-[#8C7A6A] hover:bg-black/5 border border-black/5'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>
      <button
        disabled={currentPage === totalPages}
        onClick={() => {
          onPageChange(currentPage + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
          theme === 'dark' 
            ? 'border-white/10 text-[#C5A059] hover:bg-white/5' 
            : 'border-black/5 text-[#C5A059] hover:bg-black/5'
        } disabled:opacity-20`}
      >
        Próximo
        <ChevronRight size={14} />
      </button>
    </div>
  );
};

interface AuthUser {
  role: 'master' | 'barber' | 'professional';
  name: string;
  id?: string;
  shopId?: string;
  shop?: Barbershop;
}

const PortalCarousel = ({ photos }: { photos: string[] }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (!photos || photos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx(prevIdx => (prevIdx + 1) % photos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [photos]);

  if (!photos || photos.length === 0) return null;

  const next = () => setCurrentIdx((currentIdx + 1) % photos.length);
  const prev = () => setCurrentIdx((currentIdx - 1 + photos.length) % photos.length);

  return (
    <div className="relative group w-full aspect-[9/16] max-w-[280px] xs:max-w-[320px] mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/20">
      <img
        src={photos[currentIdx]}
        alt={`Foto ${currentIdx + 1}`}
        className="w-full h-full object-cover transition-all duration-500"
        referrerPolicy="no-referrer"
      />
      
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/60 text-white backdrop-blur-md opacity-70 hover:opacity-100 transition-all hover:scale-105 active:scale-95 z-20"
            draggable={false}
          >
            <ChevronLeft size={16} />
          </button>
          
          <button
            type="button"
            onClick={next}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/60 text-white backdrop-blur-md opacity-70 hover:opacity-100 transition-all hover:scale-105 active:scale-95 z-20"
            draggable={false}
          >
            <ChevronRight size={16} />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full z-20">
            {photos.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentIdx ? 'bg-[#C5A059] w-3.5' : 'bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const getProfessionalColorStyles = (profId: string, professionals: Professional[], currentTheme: 'dark' | 'light'): string => {
  const sortedProfs = [...professionals].sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return timeA - timeB || a.name.localeCompare(b.name);
  });
  
  const index = sortedProfs.findIndex(p => p.id === profId);
  const colorIndex = index >= 0 ? index : 0;

  const colors = [
    // 0: Ouro Velho
    {
      dark: 'bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/20 hover:bg-[#C5A059]/20',
      light: 'bg-[#C5A059]/5 text-[#8B7344] border-[#C5A059]/10 hover:bg-[#C5A059]/10',
    },
    // 1: Rosa Chá
    {
      dark: 'bg-rose-400/10 text-rose-300 border-rose-400/20 hover:bg-rose-400/20',
      light: 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100/50',
    },
    // 2: Verde Oliva Suave
    {
      dark: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20 hover:bg-emerald-400/20',
      light: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100/50',
    },
    // 3: Lavanda
    {
      dark: 'bg-purple-400/10 text-purple-300 border-purple-400/20 hover:bg-purple-400/20',
      light: 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100/50',
    },
    // 4: Areia
    {
      dark: 'bg-amber-400/10 text-amber-300 border-amber-400/20 hover:bg-amber-400/20',
      light: 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100/50',
    },
    // 5: Azul Serenity
    {
      dark: 'bg-sky-400/10 text-sky-300 border-sky-400/20 hover:bg-sky-400/20',
      light: 'bg-sky-50 text-sky-600 border-sky-100 hover:bg-sky-100/50',
    },
  ];

  const scheme = colors[colorIndex % colors.length];
  return currentTheme === 'dark' ? scheme.dark : scheme.light;
};

// --- CONTROLE DE HORÁRIOS DE FUNCIONAMENTO ---
export interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface OperatingHours {
  [day: string]: DayHours;
}

export const weekdayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const ptDayNames: { [key: string]: string } = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

export const dayKeysOrdered = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const defaultOperatingHours: OperatingHours = {
  monday: { open: '08:00', close: '18:00', closed: false },
  tuesday: { open: '08:00', close: '18:00', closed: false },
  wednesday: { open: '08:00', close: '18:00', closed: false },
  thursday: { open: '08:00', close: '18:00', closed: false },
  friday: { open: '08:00', close: '18:00', closed: false },
  saturday: { open: '08:00', close: '14:00', closed: false },
  sunday: { open: '08:00', close: '12:00', closed: true },
};

export interface ScheduleBlock {
  id: string;
  type: 'professional' | 'shop' | 'barber';
  professionalId?: string; // se for professional
  date: string; // YYYY-MM-DD
  allDay: boolean;
  timeStart?: string;
  timeEnd?: string;
  reason?: string;
}

export interface ExtrasSettings {
  maxBookingDays: number; // 0 para livre, senão ex: 15, 30, etc.
  blocks: ScheduleBlock[];
}

export interface BarbershopData {
  addressOnly: string;
  hours: OperatingHours;
  logoUrl?: string;
  bannerUrl?: string;
  bio?: string;
  photo1?: string;
  photo2?: string;
  photo3?: string;
  extras?: ExtrasSettings;
}

export const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        resolve(canvas.toDataURL(outputType, 0.75));
      };
      img.onerror = () => {
        resolve('');
      };
    };
    reader.onerror = () => {
      resolve('');
    };
  });
};

export const parseBarbershopAddress = (rawAddress: string | undefined): BarbershopData => {
  if (!rawAddress) {
    return { addressOnly: '', hours: defaultOperatingHours, logoUrl: '', bannerUrl: '', bio: '', photo1: '', photo2: '', photo3: '', extras: { maxBookingDays: 0, blocks: [] } };
  }
  const parts = rawAddress.split('|||');
  const addressOnly = parts[0] || '';
  let hours = defaultOperatingHours;
  if (parts[1]) {
    try {
      hours = JSON.parse(parts[1]);
    } catch (e) {
      hours = defaultOperatingHours;
    }
  }
  const logoUrl = parts[2] || '';
  const bannerUrl = parts[3] || '';
  const bio = parts[4] || '';
  const photo1 = parts[5] || '';
  const photo2 = parts[6] || '';
  const photo3 = parts[7] || '';
  let extras: ExtrasSettings = { maxBookingDays: 0, blocks: [] };
  if (parts[8]) {
    try {
      extras = JSON.parse(parts[8]);
      if (extras && Array.isArray(extras.blocks)) {
        extras.blocks = extras.blocks.map((b: any, index: number) => {
          if (!b.id) {
            const fallbackId = `fallback-${b.date}-${b.type}-${b.professionalId || b.id || 'shop'}-${index}`;
            return { ...b, id: fallbackId };
          }
          return b;
        });
      }
    } catch (e) {
      extras = { maxBookingDays: 0, blocks: [] };
    }
  }
  return { addressOnly, hours, logoUrl, bannerUrl, bio, photo1, photo2, photo3, extras };
};

export const serializeBarbershopAddress = (
  addressOnly: string, 
  hours: OperatingHours, 
  logoUrl: string = '', 
  bannerUrl: string = '',
  bio: string = '',
  photo1: string = '',
  photo2: string = '',
  photo3: string = '',
  extras?: ExtrasSettings
): string => {
  const extrasStr = extras ? JSON.stringify(extras) : JSON.stringify({ maxBookingDays: 0, blocks: [] });
  // REDUZIR O TAMANHO DO CAMPO ADDRESS: Não salvar mais as imagens base64 gigantes dentro da string separada por pipes
  // Se já tivermos as colunas individuais no banco, manter apenas o endereço e horas aqui para compatibilidade de leitura
  return `${addressOnly.trim()}|||${JSON.stringify(hours)}|||||||||||||||||||||${extrasStr}`;
};

export const getDatesInRange = (startDateStr: string, endDateStr: string): string[] => {
  const dates: string[] = [];
  try {
    const start = new Date(startDateStr + 'T12:00:00');
    const end = new Date(endDateStr + 'T12:00:00');
    
    if (start > end) return [startDateStr];
    
    const current = new Date(start);
    while (current <= end) {
      const yyyy = current.getFullYear();
      const mm = String(current.getMonth() + 1).padStart(2, '0');
      const dd = String(current.getDate()).padStart(2, '0');
      dates.push(`${yyyy}-${mm}-${dd}`);
      current.setDate(current.getDate() + 1);
    }
  } catch (error) {
    console.error("Error calculating dates in range:", error);
    return [startDateStr];
  }
  return dates;
};

export const isBarbershopOpenAt = (dateStr: string, timeStr: string, rawAddress: string | undefined, durationMinutes: number = 0): { isOpen: boolean; reason?: string } => {
  const { hours } = parseBarbershopAddress(rawAddress);
  // dateStr is 'YYYY-MM-DD'
  const dateObj = new Date(dateStr + 'T12:00:00'); // Use noon to avoid timezone shift issues
  const dayIdx = dateObj.getDay();
  const dayName = weekdayKeys[dayIdx];
  const dayHours = hours[dayName] || defaultOperatingHours[dayName];
  
  const ptDayNames: { [key: string]: string } = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };

  if (dayHours.closed) {
    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    return { isOpen: false, reason: `O estabelecimento está fechado aos ${ptDayNames[dayName] || capitalizedDay}.` };
  }
  
  // check hours: timeStr is 'HH:MM'
  const [timeH, timeM] = timeStr.split(':').map(Number);
  const [openH, openM] = dayHours.open.split(':').map(Number);
  const [closeH, closeM] = dayHours.close.split(':').map(Number);
  
  const selectedMinutes = timeH * 60 + timeM;
  const selectedEndMinutes = selectedMinutes + durationMinutes;
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  
  if (selectedMinutes < openMinutes || selectedEndMinutes > closeMinutes) {
    return { 
      isOpen: false, 
      reason: `Horário fora do expediente. No dia selecionado (${ptDayNames[dayName]}), o funcionamento é das ${dayHours.open} às ${dayHours.close}.` 
    };
  }
  
  return { isOpen: true };
};

// Global slot generator to avoid hardcoded lists
export const generateRangeSlots = (startH: number = 0, endH: number = 23, step: number = 30) => {
  const slots = [];
  for (let h = startH; h <= endH; h++) {
    for (let m = 0; m < 60; m += step) {
      if (h === endH && m > 30) break; // limit to 23:30
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
};

export const COMMON_TIME_SLOTS = generateRangeSlots(6, 23, 30);

// Global PWA state to capture event before React hydration
let globalDeferredPrompt: any = null;
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    console.log("[PWA GLOBAL] beforeinstallprompt captured early.");
    globalDeferredPrompt = e;
  });
}

export default function App() {

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loginForm, setLoginForm] = useState({ login: '', password: '' });
  const [view, setView] = useState<'dashboard' | 'plans' | 'barbershops' | 'shop-dashboard' | 'financeiro' | 'financeiro-master' | 'agenda' | 'services' | 'professionals' | 'settings' | 'clientes' | 'extras' | 'terms' | 'privacy' | 'barbershop-subscriptions'>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [masterBarbershopPage, setMasterBarbershopPage] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [isSubscriptionPlanModalOpen, setIsSubscriptionPlanModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null);
  const [editingSubscriptionPlan, setEditingSubscriptionPlan] = useState<SubscriptionPlan | null>(null);
  const [newSubscriptionPlanForm, setNewSubscriptionPlanForm] = useState({
    name: '',
    price: '',
    limit_count: '4',
    service_id: ''
  });
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [agendaTab, setAgendaTab] = useState<'calendar' | 'list'>('calendar');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<string>(() => {
    const localToday = new Date();
    const y = localToday.getFullYear();
    const m = String(localToday.getMonth() + 1).padStart(2, '0');
    const d = String(localToday.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [appointmentError, setAppointmentError] = useState<string | null>(null);
  const [newAppointment, setNewAppointment] = useState({
    customer_name: '',
    customer_phone: '',
    service_id: '',
    professional_id: '',
    date: '',
    time: ''
  });

  // --- ESTADOS DO PAINEL DE CONFIGURAÇÕES ---
  const [settingsTab, setSettingsTab] = useState<'general' | 'hours' | 'portal'>('general');
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    address: '',
    phone: '',
    logoUrl: '',
    bannerUrl: '',
    bio: '',
    photo1: '',
    photo2: '',
    photo3: '',
  });
  const [settingsHours, setSettingsHours] = useState<OperatingHours>(defaultOperatingHours);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // --- ESTADOS DO MODAL DE ALTERAÇÃO DE SENHA ---
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState<string | null>(null);
  const [isChangingPasswordLoading, setIsChangingPasswordLoading] = useState(false);

  const handleChangePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setChangePasswordError(null);
    setChangePasswordSuccess(null);

    const { currentPassword, newPassword, confirmPassword } = changePasswordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setChangePasswordError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangePasswordError("A nova senha e a confirmação não coincidem.");
      return;
    }

    if (newPassword.length < 4) {
      setChangePasswordError("A nova senha deve conter pelo menos 4 caracteres.");
      return;
    }

    setIsChangingPasswordLoading(true);
    try {
      const endpoint = user?.role === 'barber' 
        ? '/api/barbershops/change-password' 
        : '/api/professionals/change-password';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user?.role === 'barber' ? user?.shopId : user?.id,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setChangePasswordError(data.error || "Erro ao alterar a senha.");
      } else {
        setChangePasswordSuccess("Senha alterada com sucesso!");
        setChangePasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        
        // Let's keep the user object updated if they are using shop object
        if (user && user.role === 'barber' && user.shop) {
          setUser({
            ...user,
            shop: {
              ...user.shop,
              password: newPassword
            }
          });
        }
      }
    } catch (err: any) {
      console.error("Erro ao alterar senha:", err);
      setChangePasswordError("Erro de conexão com o servidor.");
    } finally {
      setIsChangingPasswordLoading(false);
    }
  };

  // --- ESTADOS DO PAINEL DE CLIENTES ---
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [newClientForm, setNewClientForm] = useState({ name: '', phone: '', password: '' });
  const [searchClientQuery, setSearchClientQuery] = useState('');
  const [selectedProfessionalFilter, setSelectedProfessionalFilter] = useState<string>('all');
  const [clientFilterStartDate, setClientFilterStartDate] = useState('');
  const [clientFilterEndDate, setClientFilterEndDate] = useState('');
  const [isSavingClient, setIsSavingClient] = useState(false);
  const [isPlanSelectorOpen, setIsPlanSelectorOpen] = useState(false);
  const [clientPlanLoading, setClientPlanLoading] = useState(false);

  const [shopClientPage, setShopClientPage] = useState(1);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // --- ESTADOS DO PAINEL EXTRAS (BLOQUEIOS E LIMITES) ---
  const [lookaheadDays, setLookaheadDays] = useState<string>("15");
  const [isUnlimitedLookahead, setIsUnlimitedLookahead] = useState<boolean>(true);
  const [extrasBlocks, setExtrasBlocks] = useState<any[]>([]);
  const [newBlockType, setNewBlockType] = useState<'shop' | 'barber'>('shop');
  
  // Estados para o quadro "Bloquear Barbearia Completa"
  const [shopBlockStartDate, setShopBlockStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [shopBlockEndDate, setShopBlockEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [shopBlockReason, setShopBlockReason] = useState<string>('');

  // Estados para o quadro "Bloquear Profissional Específico"
  const [barberBlockProfId, setBarberBlockProfId] = useState<string>('');
  const [barberBlockPeriodType, setBarberBlockPeriodType] = useState<'days' | 'hours'>('days');
  const [barberBlockStartDate, setBarberBlockStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [barberBlockEndDate, setBarberBlockEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [barberBlockSingleDate, setBarberBlockSingleDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [barberBlockTimeStart, setBarberBlockTimeStart] = useState<string>('08:00');
  const [barberBlockTimeEnd, setBarberBlockTimeEnd] = useState<string>('19:00');
  const [barberBlockReason, setBarberBlockReason] = useState<string>('');
  const [isSavingExtras, setIsSavingExtras] = useState<boolean>(false);

  // --- ESTADOS DE CONTROLE FINANCEIRO MASTER ---
  const [masterFinanceSearch, setMasterFinanceSearch] = useState<string>('');
  const [masterFinancePriceFilter, setMasterFinancePriceFilter] = useState<'all' | 'premium' | 'cheap' | string>('all');
  const [masterFinanceStatusFilter, setMasterFinanceStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');

  // --- ESTADOS DO CLIENT PORTAL (AGENDAMENTO ONLINE) ---
  const [clientPortalShopId, setClientPortalShopId] = useState<string | null>(null);
  const [clientPortalShop, setClientPortalShop] = useState<Barbershop | null>(null);
  const [clientPortalUser, setClientPortalUser] = useState<Client | null>(null);
  const [clientPortalServices, setClientPortalServices] = useState<Service[]>([]);
  const [clientPortalProfessionals, setClientPortalProfessionals] = useState<Professional[]>([]);
  const [clientPortalLoading, setClientPortalLoading] = useState<boolean>(false);
  const [clientPortalError, setClientPortalError] = useState<string | null>(null);
  const [clientPortalAppointments, setClientPortalAppointments] = useState<Appointment[]>([]);
  const [clientPortalSubscriptionPlans, setClientPortalSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [portalCalendarPivot, setPortalCalendarPivot] = useState<Date>(new Date());

  // Portal Auth States
  const [portalPhone, setPortalPhone] = useState<string>('');
  const [portalPassword, setPortalPassword] = useState<string>('');
  const [portalName, setPortalName] = useState<string>('');
  const [portalFormType, setPortalFormType] = useState<'login' | 'register'>('register');
  const [portalAuthError, setPortalAuthError] = useState<string | null>(null);
  const [portalAuthLoading, setPortalAuthLoading] = useState<boolean>(false);
  const [showPortalPassword, setShowPortalPassword] = useState<boolean>(false);
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);

  // Portal Booking States
  const [portalStep, setPortalStep] = useState<number>(1);
  const [portalSelectedService, setPortalSelectedService] = useState<Service | null>(null);
  const [portalSelectedProfessional, setPortalSelectedProfessional] = useState<Professional | null>(null);
  const [portalSelectedDate, setPortalSelectedDate] = useState<string>('');
  const [portalSelectedTime, setPortalSelectedTime] = useState<string>('');
  const [portalCopiedLink, setPortalCopiedLink] = useState<boolean>(false);
  const [portalBookingLoading, setPortalBookingLoading] = useState<boolean>(false);
  const [portalBookingSuccess, setPortalBookingSuccess] = useState<boolean>(false);
  const [portalBookingError, setPortalBookingError] = useState<string | null>(null);
  const [portalPreSelectedProfId, setPortalPreSelectedProfId] = useState<string | null>(null);
  const [portalTab, setPortalTab] = useState<'booking' | 'appointments' | 'plans'>('booking');
  const [portalCancellingId, setPortalCancellingId] = useState<string | null>(null);

  // --- PAINEL DO CLIENTE (PORTAL) ---
  
  const [cancelModalData, setCancelModalData] = useState<{
    isOpen: boolean;
    appointmentId: string;
    serviceName: string;
    professionalName: string;
    date: string;
    time: string;
    customerName: string;
    isPortal: boolean;
  } | null>(null);

  const appointmentsRef = useRef<Appointment[]>([]);
  const userRef = useRef<AuthUser | null>(null);
  const clientPortalAppointmentsRef = useRef<Appointment[]>([]);
  const sessionCreatedApptIds = useRef<Set<string>>(new Set());
  const sessionCancelledApptIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    appointmentsRef.current = appointments;
  }, [appointments]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    clientPortalAppointmentsRef.current = clientPortalAppointments;
  }, [clientPortalAppointments]);

  const playNotificationSound = (type: 'new' | 'cancel') => {
    try {
      // Sons de notificação profissionais
      const soundUrl = type === 'new' 
        ? 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' // Ding suave para novo agendamento
        : 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'; // Som sutil para cancelamento
      
      const audio = new Audio(soundUrl);
      audio.volume = 0.6;
      audio.play().catch(e => {
        // Silenciosamente falha se o navegador bloquear autoplay sem interação prévia
        console.log("Som de notificação bloqueado pelo navegador (aguardando interação):", e.message);
      });
    } catch (err) {
      console.error("Erro ao processar áudio de notificação:", err);
    }
  };

  // Sincronizar dados da barbearia para o formulário de configurações ao carregar quando entra na tela
  useEffect(() => {
    if (view === 'settings' && user?.shop) {
      const parsed = parseBarbershopAddress(user.shop.address);
      setSettingsForm({
        name: user.shop.name || '',
        address: parsed.addressOnly || '',
        phone: user.shop.phone || '',
        logoUrl: user.shop.logo_url || parsed.logoUrl || '',
        bannerUrl: user.shop.banner_url || parsed.bannerUrl || '',
        bio: user.shop.bio || parsed.bio || '',
        photo1: user.shop.photo1 || parsed.photo1 || '',
        photo2: user.shop.photo2 || parsed.photo2 || '',
        photo3: user.shop.photo3 || parsed.photo3 || '',
      });
      setSettingsHours(parsed.hours);
    }
  }, [view, user?.shopId]);

  // Sincronizar dados de extras ao entrar no painel ou quando atualizados em segundo plano
  useEffect(() => {
    if (view === 'extras' && user?.shop) {
      const parsed = parseBarbershopAddress(user.shop.address);
      const ex = parsed.extras || { maxBookingDays: 0, blocks: [] };
      setLookaheadDays(ex.maxBookingDays > 0 ? String(ex.maxBookingDays) : "15");
      setIsUnlimitedLookahead(ex.maxBookingDays === 0);
      setExtrasBlocks(ex.blocks || []);
    }
  }, [view, user?.shopId, user?.shop?.address]);

  const handleSaveExtras = async (updatedBlocks?: any[], forceUnlimited?: boolean, forceDays?: number) => {
    if (!user || !user.shopId || !user.shop) return;
    setIsSavingExtras(true);
    setErrorStatus(null);
    try {
      // Obter dados mais recentes do servidor para garantir consistência e evitar campos nulos
      let freshShop = user.shop;
      try {
        const shopRes = await fetch(`/api/barbershops/${user.shopId}`);
        if (shopRes.ok) {
          const freshShopData = await shopRes.json();
          if (freshShopData && !freshShopData.error) {
            freshShop = freshShopData;
          }
        }
      } catch (e) {
        console.warn("Aviso ao buscar dados atualizados da unidade para extras:", e);
      }

      const parsedAddress = parseBarbershopAddress(freshShop.address);
      const blocksToSave = updatedBlocks !== undefined ? updatedBlocks : extrasBlocks;
      const isUnlimited = forceUnlimited !== undefined ? forceUnlimited : isUnlimitedLookahead;
      const daysCount = forceDays !== undefined ? forceDays : Number(lookaheadDays || 0);

      const updatedExtras: ExtrasSettings = {
        maxBookingDays: isUnlimited ? 0 : daysCount,
        blocks: blocksToSave
      };

      const fullAddress = serializeBarbershopAddress(
        parsedAddress.addressOnly,
        parsedAddress.hours,
        parsedAddress.logoUrl,
        parsedAddress.bannerUrl,
        parsedAddress.bio,
        parsedAddress.photo1,
        parsedAddress.photo2,
        parsedAddress.photo3,
        updatedExtras
      );

      const payload = {
        name: freshShop.name,
        address: fullAddress,
        phone: freshShop.phone || "",
        plan_id: freshShop.plan_id,
        status: freshShop.status || "active",
        logo_url: freshShop.logo_url || parsedAddress.logoUrl || "",
        banner_url: freshShop.banner_url || parsedAddress.bannerUrl || "",
        bio: freshShop.bio || parsedAddress.bio || "",
        photo1: freshShop.photo1 || parsedAddress.photo1 || "",
        photo2: freshShop.photo2 || parsedAddress.photo2 || "",
        photo3: freshShop.photo3 || parsedAddress.photo3 || ""
      };

      const res = await fetch(`/api/barbershops/${user.shopId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && !data.error) {
        setUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            shop: data
          };
        });
        setExtrasBlocks(blocksToSave); // Sincroniza estado de blocos local na hora
        setSettingsSuccess("Configurações extras salvas!");
        setTimeout(() => setSettingsSuccess(null), 3000);
      } else {
        setErrorStatus(data.error || "Erro ao salvar extras.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorStatus("Falha ao salvar modificações: " + err.message);
    } finally {
      setIsSavingExtras(false);
    }
  };

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.shopId) return;
    setIsSavingSettings(true);
    setSettingsSuccess(null);
    setSettingsError(null);
    try {
      // Recuperar extras configurados no shop existente para não sobrescrever nem apagar bloqueios de agenda ao salvar as configurações gerais!
      const existingAddressParsed = user.shop ? parseBarbershopAddress(user.shop.address) : null;
      const existingExtras = existingAddressParsed?.extras;

      const fullAddress = serializeBarbershopAddress(
        settingsForm.address, 
        settingsHours, 
        settingsForm.logoUrl, 
        settingsForm.bannerUrl,
        settingsForm.bio,
        settingsForm.photo1,
        settingsForm.photo2,
        settingsForm.photo3,
        existingExtras || undefined
      );
      
      const payload = {
        name: settingsForm.name,
        address: fullAddress,
        phone: settingsForm.phone,
        plan_id: user.shop?.plan_id,
        status: user.shop?.status,
        logo_url: settingsForm.logoUrl,
        banner_url: settingsForm.bannerUrl,
        bio: settingsForm.bio,
        photo1: settingsForm.photo1,
        photo2: settingsForm.photo2,
        photo3: settingsForm.photo3,
      };

      const res = await fetch(`/api/barbershops/${user.shopId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && !data.error) {
        setSettingsSuccess("Configurações salvas com sucesso!");
        setUser(prev => prev ? { ...prev, shop: data } : null);
        await fetchData();
      } else {
        setSettingsError(data.error || "Erro ao salvar as configurações.");
      }
    } catch (err: any) {
      console.error("Erro ao salvar configurações gerais:", err);
      setSettingsError(`Erro de conexão: ${err.message || err}`);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleOpenNewAppointment = (initialDate?: string) => {
    setAppointmentError(null);
    setEditingAppointment(null);
    
    let initialProfId = '';
    if (user?.role === 'professional' && user.id) {
      initialProfId = user.id;
    } else if (professionals.length > 0) {
      initialProfId = professionals[0].id;
    }
    
    const defaultDate = initialDate || new Date().toISOString().split('T')[0];
    const defaultServiceId = services.length > 0 ? services[0].id : '';
    
    setNewAppointment({
      customer_name: '',
      customer_phone: '',
      service_id: defaultServiceId,
      professional_id: initialProfId,
      date: defaultDate,
      time: ''
    });
    
    setIsAppointmentModalOpen(true);
  };

  const getAvailableSlots = () => {
    if (!newAppointment.date) return [];
    
    const shopAddress = user?.shop?.address;
    const shopData = shopAddress ? parseBarbershopAddress(shopAddress) : null;
    const dayBlocks = shopData?.extras?.blocks || [];
    
    const selectedService = services.find(s => s.id === newAppointment.service_id);
    const selectedDuration = selectedService?.duration_minutes || 30;
    
    const selectedProfId = newAppointment.professional_id || (user?.role === 'professional' ? user.id : '');
    
    const baseSlots = COMMON_TIME_SLOTS;

    return baseSlots.filter(tStr => {
      const checkOpen = shopAddress 
        ? isBarbershopOpenAt(newAppointment.date, tStr, shopAddress, selectedDuration) 
        : { isOpen: true };
      if (!checkOpen.isOpen) return false;

      const isPastSlot = (() => {
        const slotDateTime = new Date(`${newAppointment.date}T${tStr}:00.000-03:00`);
        return slotDateTime.getTime() < Date.now() - 5 * 60 * 1000;
      })();
      if (isPastSlot) return false;

      const isSlotBlocked = dayBlocks.some(b => {
        if (b.date !== newAppointment.date) return false;
        
        const isShopType = b.type === 'shop';
        const isBarberType = b.type === 'barber' && selectedProfId && b.professionalId === selectedProfId;
        
        if (!isShopType && !isBarberType) return false;
        if (b.allDay) return true;
        
        if (b.timeStart && b.timeEnd) {
          const [th, tm] = tStr.split(':').map(Number);
          const slotMinutes = th * 60 + tm;
          
          const [bsh, bsm] = b.timeStart.split(':').map(Number);
          const [beh, bem] = b.timeEnd.split(':').map(Number);
          const blockStart = bsh * 60 + bsm;
          const blockEnd = beh * 60 + bem;
          
          const slotEndMinutes = slotMinutes + selectedDuration;
          return slotMinutes < blockEnd && blockStart < slotEndMinutes;
        }
        return false;
      });
      if (isSlotBlocked) return false;

      // New: Professional Custom Working Hours Check
      if (selectedProfId) {
        const profObject = professionals.find(p => p.id === selectedProfId);
        if (profObject && String(profObject.working_hours_type).toLowerCase() === 'custom') {
          const [th, tm] = tStr.split(':').map(Number);
          const slotMinutes = th * 60 + tm;
          
          const startTimeStr = profObject.custom_start_time || '08:00';
          const endTimeStr = profObject.custom_end_time || '20:00';
          
          const [sh, sm] = startTimeStr.split(':').map(Number);
          const [eh, em] = endTimeStr.split(':').map(Number);
          const startMinutes = sh * 60 + sm;
          const endMinutes = eh * 60 + em;
          
          const slotEndMinutes = slotMinutes + selectedDuration;
          
          if (slotMinutes < startMinutes || slotEndMinutes > endMinutes) {
            return false;
          }
        }
        const isOccupied = appointments.some(a => {
          if (editingAppointment && a.id === editingAppointment.id) return false;
          
          const aptDate = a.date.split('T')[0];
          if (aptDate !== newAppointment.date || a.professional_id !== selectedProfId || a.status === 'cancelled') {
            return false;
          }
          const duration = a.service?.duration_minutes || 30;
          
          const [th, tm] = tStr.split(':').map(Number);
          const slotStart = th * 60 + tm;
          const slotEnd = slotStart + selectedDuration;

          const [ah, am] = (a.time || "08:00").slice(0, 5).split(':').map(Number);
          const aptStart = ah * 60 + am;
          const aptEnd = aptStart + duration;

          return slotStart < aptEnd && aptStart < slotEnd;
        });
        if (isOccupied) return false;
      }

      return true;
    });
  };

  const handleSaveAppointment = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.shopId) return;
    setAppointmentError(null);
    setIsLoading(true);
    
    if (!newAppointment.time) {
      setAppointmentError("Por favor, selecione um horário disponível.");
      setIsLoading(false);
      return;
    }

    // Validar se a barbearia está aberta no dia e hora selecionados
    if (newAppointment.date && newAppointment.time) {
      // Impedir agendamento no passado (-5 min tolerância)
      const selectedSlotDateTime = new Date(`${newAppointment.date}T${newAppointment.time}:00.000-03:00`);
      if (selectedSlotDateTime.getTime() < Date.now() - 5 * 60 * 1000) {
        setAppointmentError("Este horário já passou. Por favor, escolha uma data e horário futuros.");
        setIsLoading(false);
        return;
      }

      const checkOpen = isBarbershopOpenAt(newAppointment.date, newAppointment.time, user?.shop?.address);
      if (!checkOpen.isOpen) {
        setAppointmentError(checkOpen.reason || "A unidade está fechada nesse dia/horário.");
        setIsLoading(false);
        return;
      }

      // Validar bloqueios declarados permanentes ou temporários
      const shopAddress = user?.shop?.address;
      const shopData = shopAddress ? parseBarbershopAddress(shopAddress) : null;
      const dayBlocks = shopData?.extras?.blocks || [];
      const selectedProfId = newAppointment.professional_id || (user?.role === 'professional' ? user.id : '');
      const selectedService = services.find(s => s.id === newAppointment.service_id);
      const selectedDuration = selectedService?.duration_minutes || 30;

      const isDateBlocked = dayBlocks.some(b => {
        if (b.date !== newAppointment.date) return false;
        const isShopType = b.type === 'shop';
        const isBarberType = b.type === 'barber' && selectedProfId && b.professionalId === selectedProfId;
        if (!isShopType && !isBarberType) return false;
        if (b.allDay) return true;
        
        if (b.timeStart && b.timeEnd) {
          const [th, tm] = newAppointment.time.split(':').map(Number);
          const slotMinutes = th * 60 + tm;
          const [bsh, bsm] = b.timeStart.split(':').map(Number);
          const [beh, bem] = b.timeEnd.split(':').map(Number);
          const blockStart = bsh * 60 + bsm;
          const blockEnd = beh * 60 + bem;
          const slotEndMinutes = slotMinutes + selectedDuration;
          return slotMinutes < blockEnd && blockStart < slotEndMinutes;
        }
        return false;
      });

      if (isDateBlocked) {
        setAppointmentError("Este dia ou horário está temporariamente bloqueado para agendamentos (Folga/Férias/Feriado).");
        setIsLoading(false);
        return;
      }
    }

    try {
      const url = editingAppointment ? `/api/appointments/${editingAppointment.id}` : '/api/appointments';
      const method = editingAppointment ? 'PUT' : 'POST';
      
      const payload = editingAppointment 
        ? { 
            status: editingAppointment.status, 
            time: newAppointment.time, 
            date: newAppointment.date, 
            professional_id: newAppointment.professional_id, 
            service_id: newAppointment.service_id 
          }
        : {
            barbershop_id: user.shopId,
            professional_id: newAppointment.professional_id,
            service_id: newAppointment.service_id,
            customer_name: newAppointment.customer_name,
            customer_phone: newAppointment.customer_phone,
            date: newAppointment.date,
            time: newAppointment.time
          };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const responseText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        console.error("Erro ao analisar resposta JSON:", responseText);
        setAppointmentError(`Erro do Servidor (${res.status}): Resposta inválida.`);
        return;
      }
      
      if (res.ok && !data.error) {
        if (data.id) {
          sessionCreatedApptIds.current.add(data.id);
        }
        setIsAppointmentModalOpen(false);
        setEditingAppointment(null);
        playNotificationSound('new');
        await fetchData();
      } else {
        setAppointmentError(data.error || "Erro ao salvar agendamento.");
      }
    } catch (error: any) {
      console.error("Erro ao salvar agendamento:", error);
      setAppointmentError(`Falha na comunicação: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async (apptId: string) => {
    setIsLoading(true);
    try {
      sessionCancelledApptIds.current.add(apptId);
      const res = await fetch(`/api/appointments/${apptId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });
      if (res.ok) {
        playNotificationSound('cancel');
        await fetchData();
      } else {
        const d = await res.json();
        alert(d.error || "Erro ao cancelar agendamento.");
      }
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAppointmentStatus = async (apptId: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    setIsLoading(true);
    try {
      if (status === 'cancelled') {
        sessionCancelledApptIds.current.add(apptId);
      }
      const res = await fetch(`/api/appointments/${apptId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await fetchData();
      } else {
        const d = await res.json();
        alert(d.error || "Erro ao atualizar status.");
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveClient = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !user.shopId) return;
    setIsSavingClient(true);
    setErrorStatus(null);
    try {
      const payload = {
        barbershop_id: user.shopId,
        ...newClientForm
      };
      
      let res;
      if (editingClient) {
        res = await fetch(`/api/clients/${editingClient.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`/api/clients`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      
      const data = await res.json();
      if (res.ok && !data.error) {
        setIsClientModalOpen(false);
        setEditingClient(null);
        setNewClientForm({ name: '', phone: '', password: '' });
        await fetchData();
      } else {
        setErrorStatus(data.error || "Erro ao salvar cliente.");
      }
    } catch (error: any) {
      console.error("Erro ao salvar cliente:", error);
      setErrorStatus(`Falha na comunicação: ${error.message || error}`);
    } finally {
      setIsSavingClient(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!deletingClient) return;
    setIsLoading(true);
    setErrorStatus(null);
    try {
      const res = await fetch(`/api/clients/${deletingClient.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchData();
        setDeletingClient(null);
      } else {
        const data = await res.json();
        setErrorStatus(data.error || "Erro ao remover cliente.");
      }
    } catch (error: any) {
      console.error("Erro ao remover cliente:", error);
      setErrorStatus(`Falha na comunicação: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const [metrics, setMetrics] = useState({
    monthlyRevenue: 0,
    totalBarbershops: 0,
    activeSubscriptions: 0
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Portal Load & Data Fetching
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let shopId = params.get('shop') || params.get('b');

    // Suporte amplo a caminhos amigáveis e subpastas (ex: /shop/slug-ou-id ou /b/slug-ou-id)
    if (!shopId) {
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      if (pathSegments.length >= 2 && (pathSegments[0] === 'shop' || pathSegments[0] === 'b')) {
        shopId = pathSegments[1];
      } else if (pathSegments.length === 1) {
        // Ex: dominio.com/identificador-da-unidade
        const segment = pathSegments[0];
        // Evita confundir caminhos padrões do app com slug de unidade
        const notSlugs = ['dashboard', 'admin', 'login', 'register', 'professionals', 'services', 'plans', 'sw.js', 'manifest.json'];
        if (!notSlugs.includes(segment.toLowerCase())) {
          shopId = segment;
        }
      }
    }

    // Fallback para o último ID de unidade visitado se acessado pela raiz (PWA lançado)
    if (!shopId) {
      const lastSavedShopId = localStorage.getItem('queen_agenda_last_shop_id');
      if (lastSavedShopId) {
        shopId = lastSavedShopId;
      }
    } else {
      localStorage.setItem('queen_agenda_last_shop_id', shopId);
    }

    if (shopId) {
      setClientPortalShopId(shopId);
    }
    
    const profId = params.get('prof') || params.get('p');
    if (profId) {
      setPortalPreSelectedProfId(profId);
    }

    const savedClient = localStorage.getItem('queen_agenda_client');
    if (savedClient) {
      try {
        const parsed = JSON.parse(savedClient);
        setClientPortalUser(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    if (!clientPortalShopId) return;

    const fetchPortalData = async () => {
      setClientPortalLoading(true);
      setClientPortalError(null);
      try {
        const [shopRes, servicesRes, professionalsRes, appointmentsRes, subPlansRes] = await Promise.all([
          fetch(`/api/barbershops/${clientPortalShopId}`),
          fetch(`/api/services?shopId=${clientPortalShopId}`),
          fetch(`/api/professionals?shopId=${clientPortalShopId}`),
          fetch(`/api/appointments?shopId=${clientPortalShopId}`),
          fetch(`/api/subscription-plans?barbershop_id=${clientPortalShopId}`)
        ]);

        const shopData = await shopRes.json();
        const servicesData = await servicesRes.json();
        const professionalsData = await professionalsRes.json();
        const appointmentsData = await appointmentsRes.json();
        const subPlansData = await subPlansRes.json();

        if (shopData && !shopData.error) {
          setClientPortalShop(shopData);
          
          // Validar isolamento de cliente baseado no UUID real resolvido da unidade
          const savedClient = localStorage.getItem('queen_agenda_client');
          if (savedClient) {
            try {
              const parsed = JSON.parse(savedClient);
              if (parsed && parsed.barbershop_id !== shopData.id) {
                localStorage.removeItem('queen_agenda_client');
                setClientPortalUser(null);
              } else if (parsed) {
                // Fetch updated client data to get latest plan status
                fetch(`/api/clients?shopId=${shopData.id}&phone=${parsed.phone}`)
                  .then(r => r.json())
                  .then(data => {
                    const latest = Array.isArray(data) ? data.find((u: any) => u.phone === parsed.phone) : null;
                    if (latest) {
                      setClientPortalUser(latest);
                      localStorage.setItem('queen_agenda_client', JSON.stringify(latest));
                    }
                  }).catch(console.error);
              }
            } catch (err) {
              console.error(err);
            }
          }
        } else {
          setClientPortalError("Unidade não encontrada ou com link inativo.");
        }

        setClientPortalServices(Array.isArray(servicesData) ? servicesData : []);
        setClientPortalProfessionals(Array.isArray(professionalsData) ? professionalsData : []);
        setClientPortalAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
        setClientPortalSubscriptionPlans(Array.isArray(subPlansData) ? subPlansData : []);
      } catch (e) {
        setClientPortalError("Erro ao carregar o portal. Verifique sua conexão.");
      } finally {
        setClientPortalLoading(false);
      }
    };

    fetchPortalData();
  }, [clientPortalShopId]);

  // Auto-seleção de profissional se o ID vier da URL (?prof=...)
  useEffect(() => {
    if (portalPreSelectedProfId && clientPortalProfessionals.length > 0 && !portalSelectedProfessional) {
      const prof = clientPortalProfessionals.find(p => p.id === portalPreSelectedProfId);
      if (prof) {
        setPortalSelectedProfessional(prof);
      }
    }
  }, [portalPreSelectedProfId, clientPortalProfessionals, portalSelectedProfessional]);

  // Poll client portal appointments and shop block configurations silently in background every 4.5 seconds
  useEffect(() => {
    if (!clientPortalShopId) return;

    const intervalId = setInterval(async () => {
      if (document.visibilityState === 'visible') {
        try {
          const [apptsRes, shopRes, profsRes] = await Promise.all([
            fetch(`/api/appointments?shopId=${clientPortalShopId}`),
            fetch(`/api/barbershops/${clientPortalShopId}`),
            fetch(`/api/professionals?shopId=${clientPortalShopId}`)
          ]);

          if (apptsRes.ok) {
            const apptsData = await apptsRes.ok ? await apptsRes.json() : [];
            if (Array.isArray(apptsData)) {
              setClientPortalAppointments(apptsData);
            }
          }

          if (shopRes.ok) {
            const shopData = await shopRes.json();
            if (shopData && !shopData.error) {
              setClientPortalShop(shopData);
            }
          }

          if (profsRes.ok) {
            const profsData = await profsRes.json();
            if (Array.isArray(profsData)) {
              setClientPortalProfessionals(profsData);
            }
          }
        } catch (e) {
          console.error("Erro ao atualizar dados em tempo real no portal:", e);
        }
      }
    }, 4500);

    return () => clearInterval(intervalId);
  }, [clientPortalShopId]);

  // Persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('queen_agenda_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      if (parsed.role === 'barber') setView('shop-dashboard');
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('queen_agenda_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('queen_agenda_user');
    }
  }, [user]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorStatus(null);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      if (res.status === 403) {
        throw new Error("Sistema em bloqueio, contate o revendedor. Sua unidade encontra-se suspensa ou bloqueada. Por favor, entre em contato com o suporte para mais informações e para regularizar sua conta.");
      }

      const contentType = res.headers.get("content-type");
      let data: any = {};
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("[LOGIN MATCH ERROR] Non-JSON response:", text);
        let errorMsg = `Resposta inválida do servidor (Status: ${res.status}).`;
        if (res.status === 500) {
          errorMsg += " Verifique as variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no painel da Vercel.";
          if (text) {
            const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 150);
            if (cleanText) {
              errorMsg += ` Detalhe: ${cleanText}...`;
            }
          }
        } else {
          errorMsg += " Certifique-se de acessar as Configurações de Variáveis de Ambiente no painel do seu projeto na Vercel.";
        }
        throw new Error(errorMsg);
      }

      if (res.ok) {
        setUser(data.user);
        if (data.user.role === 'barber' || data.user.role === 'professional') setView('shop-dashboard');
        else setView('dashboard');
      } else {
        let errorMsg = data.error || "Login falhou";
        if (res.status === 500 && String(errorMsg).includes("Supabase")) {
          errorMsg += " (Importante: Se essa aplicação está na Vercel, configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nas configurações de variáveis de ambiente do seu projeto Vercel para conectar o banco de dados!)";
        }
        setErrorStatus(errorMsg);
      }
    } catch (error: any) {
      console.error("[LOGIN ERROR]:", error);
      setErrorStatus(error.message || "Erro de conexão com o servidor de dados.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('dashboard');
    setLoginForm({ login: '', password: '' });
    // Clear cookies to avoid wrong PWA profile caching on shared devices
    document.cookie = "queen_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "queen_shop_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const handlePortalLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!clientPortalShopId) return;
    setPortalAuthError(null);
    setPortalAuthLoading(true);
    try {
      const res = await fetch('/api/clients/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: portalPhone,
          password: portalPassword,
          barbershop_id: clientPortalShopId
        })
      });
      const contentType = res.headers.get("content-type");
      let data: any = {};
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("[PORTAL LOGIN MATCH ERROR] Non-JSON response:", text);
        let errorMsg = `Resposta inválida do servidor (Status: ${res.status}).`;
        if (res.status === 500) {
          errorMsg += " Verifique as variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no painel da Vercel.";
          if (text) {
            const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 150);
            if (cleanText) {
              errorMsg += ` Detalhe: ${cleanText}...`;
            }
          }
        }
        throw new Error(errorMsg);
      }

      if (res.ok && data.success) {
        setClientPortalUser(data.client);
        localStorage.setItem('queen_agenda_client', JSON.stringify(data.client));
        setPortalPhone('');
        setPortalPassword('');
      } else {
        let errorMsg = data.error || "Login falhou. Verifique telefone e senha.";
        if (res.status === 500 && String(errorMsg).includes("Supabase")) {
          errorMsg += " (Configure as variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no seu projeto Vercel!)";
        }
        setPortalAuthError(errorMsg);
      }
    } catch (err) {
      setPortalAuthError("Erro de conexão com o servidor.");
    } finally {
      setPortalAuthLoading(false);
    }
  };

  const handleClientSubscribe = async (planId: string) => {
    if (!clientPortalUser || !clientPortalShopId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/clients/${clientPortalUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: planId }),
      });
      if (!response.ok) throw new Error(await response.text());
      
      // Atualizar dados do usuário localmente
      const updatedUserRes = await fetch(`/api/clients?shopId=${clientPortalShopId}&phone=${clientPortalUser.phone}`);
      const updatedUsers = await updatedUserRes.json();
      const updatedUser = Array.isArray(updatedUsers) ? updatedUsers.find((u: any) => u.id === clientPortalUser.id) : null;
      
      if (updatedUser) {
        setClientPortalUser(updatedUser);
        localStorage.setItem('queen_agenda_client', JSON.stringify(updatedUser));
      }
      
      alert("Parabéns! Sua assinatura foi realizada com sucesso.");
    } catch (error: any) {
      console.error("Erro ao assinar plano:", error);
      alert(`Erro ao processar assinatura: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePortalRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!clientPortalShopId) return;
    setPortalAuthError(null);
    setPortalAuthLoading(true);
    try {
      const res = await fetch('/api/clients/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: portalName,
          phone: portalPhone,
          password: portalPassword,
          barbershop_id: clientPortalShopId
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setClientPortalUser(data.client);
        localStorage.setItem('queen_agenda_client', JSON.stringify(data.client));
        setPortalName('');
        setPortalPhone('');
        setPortalPassword('');
      } else {
        setPortalAuthError(data.error || "Cadastro falhou. Tente novamente.");
      }
    } catch (err) {
      setPortalAuthError("Erro de conexão com o servidor.");
    } finally {
      setPortalAuthLoading(false);
    }
  };

  const handlePortalLogout = () => {
    setClientPortalUser(null);
    localStorage.removeItem('queen_agenda_client');
    setPortalStep(1);
    setPortalSelectedService(null);
    setPortalSelectedProfessional(null);
    setPortalSelectedDate('');
    setPortalSelectedTime('');
    setPortalBookingSuccess(false);
    setPortalBookingError(null);
    setPortalTab('booking');
  };

  const handleExitClientPortal = () => {
    localStorage.removeItem('queen_agenda_last_shop_id');
    setClientPortalShopId(null);
    setClientPortalShop(null);
    window.location.href = window.location.origin;
  };

  const handlePortalCancelAppointment = async (apptId: string) => {
    setPortalCancellingId(apptId);
    try {
      sessionCancelledApptIds.current.add(apptId);
      const res = await fetch(`/api/appointments/${apptId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });
      if (res.ok) {
        playNotificationSound('cancel');
        // Refresh the client portal appointments
        const apptsRes = await fetch(`/api/appointments?shopId=${clientPortalShopId}`);
        const appointmentsData = await apptsRes.json();
        setClientPortalAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      } else {
        const d = await res.json();
        alert(d.error || "Erro ao cancelar agendamento.");
      }
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
    } finally {
      setPortalCancellingId(null);
    }
  };

  const triggerCancelConfirmation = (appt: Appointment, isPortal: boolean) => {
    const sName = appt.service?.name || (isPortal ? clientPortalServices : services).find(s => s.id === appt.service_id)?.name || "Serviço";
    const pName = appt.professional?.name || (isPortal ? clientPortalProfessionals : professionals).find(p => p.id === appt.professional_id)?.name || "Profissional";
    
    setCancelModalData({
      isOpen: true,
      appointmentId: appt.id,
      serviceName: sName,
      professionalName: pName,
      date: appt.date,
      time: appt.time,
      customerName: appt.customer_name,
      isPortal
    });
  };

  const handlePortalBookAppointment = async () => {
    if (!clientPortalShopId || !clientPortalUser) return;
    if (!portalSelectedService || !portalSelectedProfessional || !portalSelectedDate || !portalSelectedTime) {
      setPortalBookingError("Por favor, preencha todas as etapas do agendamento.");
      return;
    }

    setPortalBookingLoading(true);
    setPortalBookingError(null);

    // Pré-buscar as configurações e agendamentos mais recentes para evitar que burle as regras caso a página estivesse aberta
    let freshShop = clientPortalShop;
    let freshAppointments = clientPortalAppointments;

    try {
      const [shopRes, apptsRes] = await Promise.all([
        fetch(`/api/barbershops/${clientPortalShopId}`),
        fetch(`/api/appointments?shopId=${clientPortalShopId}`)
      ]);

      if (shopRes.ok) {
        const freshShopData = await shopRes.json();
        if (freshShopData && !freshShopData.error) {
          freshShop = freshShopData;
          setClientPortalShop(freshShopData); // Sincroniza o estado local para visibilidade visual posterior
        }
      }

      if (apptsRes.ok) {
        const freshApptsData = await apptsRes.json();
        if (Array.isArray(freshApptsData)) {
          freshAppointments = freshApptsData;
          setClientPortalAppointments(freshApptsData); // Sincroniza o estado de ocupação na tela
        }
      }
    } catch (err) {
      console.warn("Aviso: Falha ao pré-carregar os dados atualizados das folgas em tempo real, utilizando cache local:", err);
    }

    // Impedir agendamentos no passado
    const selectedSlotDateTime = new Date(`${portalSelectedDate}T${portalSelectedTime}:00.000-03:00`);
    if (selectedSlotDateTime.getTime() < Date.now()) {
      setPortalBookingError("Este horário já passou. Por favor, escolha uma data e horário futuros.");
      setPortalBookingLoading(false);
      return;
    }

    // Impedir se violar o limite máximo de dias configurado
    const shopData = freshShop ? parseBarbershopAddress(freshShop.address) : null;
    const maxDays = shopData?.extras?.maxBookingDays || 0;
    if (maxDays > 0) {
      const cellDate = new Date(portalSelectedDate + 'T12:00:00');
      cellDate.setHours(0,0,0,0);
      const todayMidnight = new Date();
      todayMidnight.setHours(0,0,0,0);
      
      const diffTime = cellDate.getTime() - todayMidnight.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > maxDays) {
        setPortalBookingError(`Agendamento indisponível! Esta data está além do limite de ${maxDays} dias permitidos de antecedência.`);
        setPortalBookingLoading(false);
        return;
      }
    }

    // Impedir se violar bloqueios ativos da agenda
    const dayBlocks = shopData?.extras?.blocks || [];
    const activeBlock = dayBlocks.find(b => {
      if (b.date !== portalSelectedDate) return false;
      
      const isShopType = b.type === 'shop';
      const isBarberType = b.type === 'barber' && b.professionalId === portalSelectedProfessional.id;
      
      if (!isShopType && !isBarberType) return false;
      if (b.allDay) return true;
      
      if (b.timeStart && b.timeEnd) {
        const [th, tm] = portalSelectedTime.split(':').map(Number);
        const slotMinutes = th * 60 + tm;
        
        const [bsh, bsm] = b.timeStart.split(':').map(Number);
        const [beh, bem] = b.timeEnd.split(':').map(Number);
        const blockStart = bsh * 60 + bsm;
        const blockEnd = beh * 60 + bem;
        
        const selectedDuration = portalSelectedService?.duration_minutes || 30;
        const slotEndMinutes = slotMinutes + selectedDuration;
        return slotMinutes < blockEnd && blockStart < slotEndMinutes;
      }
      return false;
    });

    if (activeBlock) {
      if (activeBlock.type === 'shop') {
        const reasonStr = activeBlock.reason ? ` por este motivo: "${activeBlock.reason}"` : "";
        setPortalBookingError(`Ops, a unidade está fechada hoje${reasonStr}.`);
      } else {
        const reasonStr = activeBlock.reason ? ` por este motivo: "${activeBlock.reason}"` : "";
        setPortalBookingError(`Ops, o profissional ${portalSelectedProfessional.name} está indisponível nesta data/horário${reasonStr}.`);
      }
      setPortalBookingLoading(false);
      return;
    }

    // Verificar se o horário já foi ocupado por outro cliente concorrente
    const isOccupied = portalSelectedProfessional ? (() => {
      return freshAppointments.some(a => {
        const aptDate = a.date.split('T')[0];
        if (aptDate !== portalSelectedDate || a.professional_id !== portalSelectedProfessional.id || a.status === 'cancelled') {
          return false;
        }
        const duration = a.service?.duration_minutes || 30;
        
        const [th, tm] = portalSelectedTime.split(':').map(Number);
        const slotStart = th * 60 + tm;
        const selectedDuration = portalSelectedService?.duration_minutes || 30;
        const slotEnd = slotStart + selectedDuration;

        const [ah, am] = (a.time || "08:00").slice(0, 5).split(':').map(Number);
        const aptStart = ah * 60 + am;
        const aptEnd = aptStart + duration;

        return slotStart < aptEnd && aptStart < slotEnd;
      });
    })() : false;

    if (isOccupied) {
      setPortalBookingError("Horário Ocupado! Outro cliente acabou de efetuar o agendamento deste mesmo horário.");
      setPortalBookingLoading(false);
      return;
    }

    // Validar se a barbearia está aberta no dia e hora selecionados
    if (freshShop?.address) {
      const checkOpen = isBarbershopOpenAt(portalSelectedDate, portalSelectedTime, freshShop.address);
      if (!checkOpen.isOpen) {
        setPortalBookingError(checkOpen.reason || "Erro ao agendar: A unidade está fechada nesta data/horário.");
        setPortalBookingLoading(false);
        return;
      }
    }

    // Validar se o profissional está em horário de trabalho
    if (portalSelectedProfessional && portalSelectedProfessional.working_hours_type === 'custom') {
      const [th, tm] = portalSelectedTime.split(':').map(Number);
      const slotMinutes = th * 60 + tm;
      
      const [sh, sm] = (portalSelectedProfessional.custom_start_time || '08:00').split(':').map(Number);
      const [eh, em] = (portalSelectedProfessional.custom_end_time || '20:00').split(':').map(Number);
      const startMinutes = sh * 60 + sm;
      const endMinutes = eh * 60 + em;
      
      const selectedDuration = portalSelectedService?.duration_minutes || 30;
      const slotEndMinutes = slotMinutes + selectedDuration;
      
      if (slotMinutes < startMinutes || slotEndMinutes > endMinutes) {
        setPortalBookingError(`O profissional ${portalSelectedProfessional.name} só trabalha das ${portalSelectedProfessional.custom_start_time} às ${portalSelectedProfessional.custom_end_time}.`);
        setPortalBookingLoading(false);
        return;
      }
    }

    // Validar Limite de Assinatura (se o serviço for o da assinatura e tiver atingido o limite)
    if (clientPortalUser.subscription_plan && portalSelectedService.id === clientPortalUser.subscription_plan.service_id) {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const planUsage = freshAppointments.filter(a => {
        const aDate = new Date(a.date);
        return a.customer_phone === clientPortalUser.phone &&
               a.service_id === clientPortalUser.subscription_plan?.service_id &&
               a.status !== 'cancelled' &&
               aDate.getMonth() === currentMonth &&
               aDate.getFullYear() === currentYear;
      }).length;
      
      const limit = clientPortalUser.subscription_plan.limit_count || 0;
      
      if (planUsage >= limit) {
        setShowLimitAlert(true);
        setPortalBookingLoading(false);
        return;
      }
    }

    try {
      const payload = {
        barbershop_id: clientPortalShopId,
        professional_id: portalSelectedProfessional.id,
        service_id: portalSelectedService.id,
        customer_name: clientPortalUser.name,
        customer_phone: clientPortalUser.phone,
        date: portalSelectedDate,
        time: portalSelectedTime
      };

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const responseText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        console.error("Erro ao analisar resposta JSON do agendamento:", responseText);
        setPortalBookingError("O servidor respondeu com um formato de dados inválido.");
        setPortalBookingLoading(false);
        return;
      }

      if (res.ok && !data.error) {
        if (data.id) {
          sessionCreatedApptIds.current.add(data.id);
        }
        setPortalBookingSuccess(true);
        setPortalStep(4);
        playNotificationSound('new');
        // Recarregar agendamentos do portal para atualizar a ocupação imediatamente
        try {
          const apptsRes = await fetch(`/api/appointments?shopId=${clientPortalShopId}`);
          const apptsData = await apptsRes.json();
          if (Array.isArray(apptsData)) {
            setClientPortalAppointments(apptsData);
          }
        } catch (e) {
          console.error("Erro ao recarregar agendamentos:", e);
        }
      } else {
        setPortalBookingError(data.error || "Não foi possível concluir o agendamento.");
      }
    } catch (error) {
      console.error("Erro ao realizar agendamento online:", error);
      setPortalBookingError("Erro ao enviar agendamento. Verifique conexões.");
    } finally {
      setPortalBookingLoading(false);
    }
  };

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isBarbershopModalOpen, setIsBarbershopModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isProfessionalModalOpen, setIsProfessionalModalOpen] = useState(false);
  
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editingBarbershop, setEditingBarbershop] = useState<Barbershop | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  
  const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null);
  const [deletingBarbershop, setDeletingBarbershop] = useState<Barbershop | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [deletingProfessional, setDeletingProfessional] = useState<Professional | null>(null);
  const [deletingClient, setDeletingClient] = useState<any | null>(null);

  // Form states
  const [newPlan, setNewPlan] = useState({ name: '', price: 0, professionals_count: 0 });
  const [newBarbershop, setNewBarbershop] = useState({
    name: '',
    address: '',
    phone: '',
    plan_id: '',
    password: '',
    status: 'active' as 'active' | 'blocked'
  });
  const [newService, setNewService] = useState({ name: '', price: 0, duration_minutes: 30 });
  const [newProfessional, setNewProfessional] = useState({ 
    name: '', 
    phone: '', 
    password: '', 
    commission_percentage: '40', 
    photo_url: '',
    working_hours_type: 'shop' as 'shop' | 'custom',
    custom_start_time: '08:00',
    custom_end_time: '20:00'
  });

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  const fetchData = async (isSilent = false) => {
    if (!user) return;
    if (!isSilent) setIsLoading(true);
    setErrorStatus(null);
    try {
      if (user.role === 'master') {
        const [plansRes, shopsRes, metricsRes] = await Promise.all([
          fetch('/api/plans'),
          fetch('/api/barbershops'),
          fetch('/api/metrics')
        ]);
        
        const plansData = await plansRes.json();
        const shopsData = await shopsRes.json();
        const metricsData = await metricsRes.json();

        setPlans(Array.isArray(plansData) ? plansData : []);
        setBarbershops(Array.isArray(shopsData) ? shopsData : []);
        setMetrics(metricsData);
      } else if ((user.role === 'barber' || user.role === 'professional') && user.shopId) {
        let appointmentsUrl = `/api/appointments?shopId=${user.shopId}`;
        if (user.role === 'professional' && user.id) {
          appointmentsUrl += `&professionalId=${user.id}`;
        }

        const [servicesRes, professionalsRes, appointmentsRes, shopRes, clientsRes, subPlansRes] = await Promise.all([
          fetch(`/api/services?shopId=${user.shopId}`),
          fetch(`/api/professionals?shopId=${user.shopId}`),
          fetch(appointmentsUrl),
          fetch(`/api/barbershops/${user.shopId}`),
          fetch(`/api/clients?shopId=${user.shopId}`),
          fetch(`/api/subscription-plans?barbershop_id=${user.shopId}`)
        ]);
        
        const prevAppts = appointmentsRef.current;
        const servicesData = await servicesRes.json();
        const professionalsData = await professionalsRes.json();
        const appointmentsData = await appointmentsRes.json();
        const shopData = await shopRes.json();
        const clientsData = await clientsRes.json();
        const subPlansData = await subPlansRes.json();

        setServices(Array.isArray(servicesData) ? servicesData : []);
        setProfessionals(Array.isArray(professionalsData) ? professionalsData : []);
        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
        setClients(Array.isArray(clientsData) ? clientsData : []);
        setSubscriptionPlans(Array.isArray(subPlansData) ? subPlansData : []);
        
        if (shopData && shopData.status === 'blocked') {
          handleLogout();
          setErrorStatus("Sistema em bloqueio, contate o revendedor.");
          return;
        }

        if (shopData && !shopData.error) {
          setUser(prev => prev ? { ...prev, shop: shopData } : null);
        }

        // Detect updates to trigger sound chimes
        if (isSilent && prevAppts.length > 0 && Array.isArray(appointmentsData)) {
          let shouldPlayNew = false;
          let shouldPlayCancel = false;

          const currentIds = new Set(prevAppts.map(a => a.id));
          const polledIds = new Set<string>();

          for (const polled of appointmentsData) {
            polledIds.add(polled.id);
            const prev = prevAppts.find(a => a.id === polled.id);
            
            if (prev) {
              if (prev.status !== 'cancelled' && polled.status === 'cancelled') {
                if (!sessionCancelledApptIds.current.has(polled.id)) {
                  shouldPlayCancel = true;
                }
              }
            } else {
              if (!sessionCreatedApptIds.current.has(polled.id)) {
                shouldPlayNew = true;
              }
            }
          }

          for (const prev of prevAppts) {
            if (!polledIds.has(prev.id) && prev.status !== 'cancelled') {
              if (!sessionCancelledApptIds.current.has(prev.id)) {
                shouldPlayCancel = true;
              }
            }
          }

          if (shouldPlayNew) {
            playNotificationSound('new');
          } else if (shouldPlayCancel) {
            playNotificationSound('cancel');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorStatus("Erro ao conectar com o servidor.");
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id, user?.shopId, user?.role]);

  // Poll appointments in background every 6 seconds for live update and sounds
  useEffect(() => {
    if (!user || user.role === 'master') return;
    
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchData(true).catch(err => console.error("Erro ao atualizar agendamentos em background:", err));
      }
    }, 6000);

    return () => clearInterval(intervalId);
  }, [user?.id, user?.shopId, user?.role]);

  const handleCreatePlan = async (e: FormEvent) => {
    e.preventDefault();
    setErrorStatus(null);
    setIsLoading(true);
    try {
      const url = editingPlan ? `/api/plans/${editingPlan.id}` : '/api/plans';
      const method = editingPlan ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlan),
      });
      const data = await res.json();
      
      if (res.ok && !data.error) {
        setIsPlanModalOpen(false);
        setEditingPlan(null);
        setNewPlan({ name: '', price: 0, professionals_count: 0 });
        await fetchData();
      } else {
        setErrorStatus(data.error || "Erro desconhecido ao salvar plano.");
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      setErrorStatus("Falha na comunicação com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!deletingPlan) return;
    setErrorStatus(null);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/plans/${deletingPlan.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && !data.error) {
        setDeletingPlan(null);
        await fetchData();
      } else {
        setErrorStatus(data.error || "Erro ao excluir plano.");
      }
    } catch (error) {
      setErrorStatus("Falha na comunicação com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBarbershop = async (e: FormEvent) => {
    e.preventDefault();
    setErrorStatus(null);
    setIsLoading(true);
    try {
      const url = editingBarbershop ? `/api/barbershops/${editingBarbershop.id}` : '/api/barbershops';
      const method = editingBarbershop ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBarbershop),
      });
      const data = await res.json();

      if (res.ok && !data.error) {
        setIsBarbershopModalOpen(false);
        setEditingBarbershop(null);
        setNewBarbershop({
          name: '',
          address: '',
          phone: '',
          plan_id: '',
          password: '',
          status: 'active'
        });
        await fetchData();
      } else {
        setErrorStatus(data.error || "Erro desconhecido ao salvar unidade.");
      }
    } catch (error) {
      console.error('Error saving barbershop:', error);
      setErrorStatus("Falha na comunicação com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBarbershop = async () => {
    if (!deletingBarbershop) return;
    setErrorStatus(null);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/barbershops/${deletingBarbershop.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && !data.error) {
        setDeletingBarbershop(null);
        await fetchData();
      } else {
        setErrorStatus(data.error || "Erro ao excluir unidade.");
      }
    } catch (error) {
      setErrorStatus("Falha na comunicação com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveService = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.shopId) return;
    setErrorStatus(null);
    setIsLoading(true);
    try {
      const url = editingService ? `/api/services/${editingService.id}` : '/api/services';
      const method = editingService ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newService, barbershop_id: user.shopId }),
      });
      const data = await res.json();
      
      if (res.ok && !data.error) {
        setIsServiceModalOpen(false);
        setEditingService(null);
        setNewService({ name: '', price: 0, duration_minutes: 30 });
        await fetchData();
      } else {
        setErrorStatus(data.error || "Erro salvar serviço.");
      }
    } catch (error) {
      setErrorStatus("Falha na comunicação com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteService = async () => {
    if (!deletingService) return;
    setErrorStatus(null);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/services/${deletingService.id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeletingService(null);
        await fetchData();
      } else {
        setErrorStatus("Erro ao excluir serviço.");
      }
    } catch (error) {
      setErrorStatus("Falha na comunicação com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSubscriptionPlan = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !user.shopId) return;
    setIsLoading(true);
    try {
      const url = editingSubscriptionPlan 
        ? `/api/subscription-plans/${editingSubscriptionPlan.id}` 
        : '/api/subscription-plans';
      const method = editingSubscriptionPlan ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSubscriptionPlanForm,
          barbershop_id: user.shopId,
          price: parseFloat(newSubscriptionPlanForm.price),
          limit_count: parseInt(newSubscriptionPlanForm.limit_count)
        }),
      });
      if (!response.ok) throw new Error(await response.text());
      await fetchData(true);
      setIsSubscriptionPlanModalOpen(false);
      setEditingSubscriptionPlan(null);
      setNewSubscriptionPlanForm({ name: '', price: '', limit_count: '4', service_id: '' });
    } catch (error: any) {
      console.error("Erro ao salvar plano de assinatura:", error);
      setErrorStatus(`Erro: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubscriptionPlan = async () => {
    if (!planToDelete) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/subscription-plans/${planToDelete.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(await response.text());
      await fetchData(true);
      setPlanToDelete(null);
    } catch (error: any) {
      console.error("Erro ao excluir plano:", error);
      setErrorStatus(`Erro: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateClientPlan = async (clientId: string, planId: string | null) => {
    setClientPlanLoading(true);
    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: planId === 'free' ? null : planId }),
      });
      if (!response.ok) throw new Error(await response.text());
      await fetchData(true);
      setIsPlanSelectorOpen(false);
    } catch (error: any) {
      console.error("Erro ao atualizar plano do cliente:", error);
      setErrorStatus(`Erro: ${error.message}`);
    } finally {
      setClientPlanLoading(false);
    }
  };

  const handleSaveProfessional = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.shopId) return;
    setErrorStatus(null);
    setIsLoading(true);
    try {
      const url = editingProfessional ? `/api/professionals/${editingProfessional.id}` : '/api/professionals';
      const method = editingProfessional ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProfessional, barbershop_id: user.shopId }),
      });
      
      const responseText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        console.error("Erro ao analisar resposta JSON:", responseText);
        setErrorStatus(`Erro do Servidor (${res.status}): Resposta inválida.`);
        return;
      }
      
      if (res.ok && !data.error) {
        setIsProfessionalModalOpen(false);
        setEditingProfessional(null);
        setNewProfessional({ 
          name: '', 
          phone: '', 
          password: '', 
          commission_percentage: '40', 
          photo_url: '',
          working_hours_type: 'shop',
          custom_start_time: '08:00',
          custom_end_time: '20:00'
        });
        await fetchData();
      } else {
        setErrorStatus(data.error || "Erro ao salvar profissional.");
      }
    } catch (error: any) {
      console.error("Erro de conexão ao salvar profissional:", error);
      setErrorStatus(`Falha na comunicação com o servidor: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfessional = async () => {
    if (!deletingProfessional) return;
    setErrorStatus(null);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/professionals/${deletingProfessional.id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeletingProfessional(null);
        await fetchData();
      } else {
        setErrorStatus("Erro ao excluir profissional.");
      }
    } catch (error) {
      setErrorStatus("Falha na comunicação com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- INJEÇÃO DA TELA DO CLIENTAL PORTAL (ONLINE CLIENT APPOINTMENT PROCESS) ---
  if (clientPortalShopId) {
    const shopData = clientPortalShop ? parseBarbershopAddress(clientPortalShop.address) : null;
    const shopBanner = clientPortalShop ? (clientPortalShop.banner_url || shopData?.bannerUrl || '/banner-placeholder.jpg') : null;
    const shopLogo = clientPortalShop ? (clientPortalShop.logo_url || shopData?.logoUrl) : null;
    const shopCleanAddress = shopData ? shopData.addressOnly : "";

    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-[#fafafa] text-black'} font-sans pb-12 transition-all relative`}>
        {/* Painel de Controle Top-Right para Clientes (Modo Tema) */}
        <div className="absolute top-4 right-4 z-[10500] flex gap-2">
          <button 
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2.5 rounded-xl border backdrop-blur-md shadow-lg transition-all cursor-pointer ${
              theme === 'dark' 
                ? 'bg-black/30 border-white/10 text-[#C5A059] hover:bg-black/50' 
                : 'bg-white/70 border-black/5 text-[#8B7344] hover:bg-[#C5A059]/5'
            }`}
            title="Alternar Tema"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        {/* POPUP DE AUTENTICAÇÃO OBRIGATÓRIA PADRÃO - BLOQUEIA TODO O CONTEÚDO ATÉ QUE FAÇA LOGIN OU CADASTRE-SE */}
        {clientPortalUser === null && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl overflow-y-auto animate-fadeIn">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`w-full max-w-md p-6 sm:p-8 rounded-[28px] border ${
                theme === 'dark' ? 'bg-[#121212]/95 border-white/10 shadow-2xl text-white' : 'bg-white border-black/10 shadow-2xl text-black'
              } space-y-6 max-h-[90vh] overflow-y-auto`}
            >
              {/* Header inside popup */}
              <div className="text-center space-y-2">
                {shopLogo ? (
                  <div className="w-16 h-16 rounded-2xl border border-[#C5A059] mx-auto overflow-hidden shadow-lg bg-white flex items-center justify-center">
                    <img src={shopLogo} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl border border-[#C5A059]/40 mx-auto bg-[#C5A059]/10 flex items-center justify-center p-2.5">
                    <Sparkles size={32} className="text-[#C5A059]" />
                  </div>
                )}
                <h2 className="text-xl font-black uppercase tracking-tight text-[#C5A059] mt-3 italic">
                  <span className="notranslate" translate="no">{clientPortalShop?.name || 'KIVVO AGENDA'}</span>
                </h2>
                <p className="text-[11px] opacity-60 font-medium max-w-xs mx-auto leading-relaxed">
                  {portalFormType === 'register' 
                    ? 'Faça seu cadastro rápido para agendar horários e gerenciar seus atendimentos.'
                    : 'Acesse sua conta para agendar ou ver seu histórico de atendimentos.'
                  }
                </p>
              </div>

              {/* Tab Selector */}
              <div className="flex border-b border-[#C5A059]/10 pb-0.5">
                <button
                  type="button"
                  onClick={() => { setPortalFormType('register'); setPortalAuthError(null); }}
                  className={`w-1/2 pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 text-center cursor-pointer ${
                    portalFormType === 'register' 
                      ? 'border-[#C5A059] text-[#C5A059]' 
                      : 'border-transparent opacity-40 hover:opacity-100 font-bold'
                  }`}
                >
                  Criar Nova Conta
                </button>
                <button
                  type="button"
                  onClick={() => { setPortalFormType('login'); setPortalAuthError(null); }}
                  className={`w-1/2 pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 text-center cursor-pointer ${
                    portalFormType === 'login' 
                      ? 'border-[#C5A059] text-[#C5A059]' 
                      : 'border-transparent opacity-40 hover:opacity-100 font-bold'
                  }`}
                >
                  Entrar na Conta
                </button>
              </div>

              {portalAuthError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3.5 rounded-xl flex items-start gap-2 text-xs font-bold animate-fadeIn">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{portalAuthError}</span>
                </div>
              )}

              {portalFormType === 'login' ? (
                <form onSubmit={handlePortalLogin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest opacity-60 flex items-center gap-1">
                      <span>📱 Celular / WhatsApp</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: (81) 99999-9999"
                      className={`w-full text-xs ${
                        theme === 'dark' ? 'bg-[#1c1b1b] text-white font-semibold' : 'bg-[#f5f5f5] text-black font-semibold'
                      } border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} rounded-xl p-3.5 focus:outline-none focus:border-[#ffb77d] transition-all`}
                      value={portalPhone}
                      onChange={e => setPortalPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest opacity-60 flex items-center gap-1">
                      <span>🔑 Senha de Acesso</span>
                    </label>
                    <div className="relative animate-fade-in">
                      <input
                        required
                        type={showPortalPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        className={`w-full text-xs ${
                          theme === 'dark' ? 'bg-[#1c1b1b] text-white font-semibold' : 'bg-[#f5f5f5] text-black font-semibold'
                        } border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} rounded-xl p-3.5 pr-12 focus:outline-none focus:border-[#ffb77d] transition-all`}
                        value={portalPassword}
                        onChange={e => setPortalPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPortalPassword(!showPortalPassword)}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200 cursor-pointer ${
                          theme === 'dark' ? 'text-white/40 hover:text-white/80' : 'text-black/40 hover:text-black/80'
                        }`}
                        id="btn-toggle-portal-password-login"
                      >
                        {showPortalPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={portalAuthLoading}
                    className="w-full bg-[#C5A059] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/15 disabled:opacity-50 font-sans mt-2 cursor-pointer"
                  >
                    {portalAuthLoading ? 'Acessando...' : 'ENTRAR E AGENDAR'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePortalRegister} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest opacity-60 flex items-center gap-1">
                      <span>👤 Seu Nome Completo</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Digite seu nome completo"
                      className={`w-full text-xs ${
                        theme === 'dark' ? 'bg-[#1c1b1b] text-white font-semibold' : 'bg-[#f5f5f5] text-black font-semibold'
                      } border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} rounded-xl p-3.5 focus:outline-none focus:border-[#ffb77d] transition-all`}
                      value={portalName}
                      onChange={e => setPortalName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest opacity-60 flex items-center gap-1">
                      <span>📱 Celular / WhatsApp</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: (81) 99999-9999"
                      className={`w-full text-xs ${
                        theme === 'dark' ? 'bg-[#1c1b1b] text-white font-semibold' : 'bg-[#f5f5f5] text-black font-semibold'
                      } border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} rounded-xl p-3.5 focus:outline-none focus:border-[#ffb77d] transition-all`}
                      value={portalPhone}
                      onChange={e => setPortalPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest opacity-60 flex items-center gap-1">
                      <span>🔑 Escolha uma Senha</span>
                    </label>
                    <div className="relative animate-fade-in">
                      <input
                        required
                        type={showPortalPassword ? "text" : "password"}
                        placeholder="Crie uma senha de acesso"
                        className={`w-full text-xs ${
                          theme === 'dark' ? 'bg-[#1c1b1b] text-white font-semibold' : 'bg-[#f5f5f5] text-black font-semibold'
                        } border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} rounded-xl p-3.5 pr-12 focus:outline-none focus:border-[#ffb77d] transition-all`}
                        value={portalPassword}
                        onChange={e => setPortalPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPortalPassword(!showPortalPassword)}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200 cursor-pointer ${
                          theme === 'dark' ? 'text-white/40 hover:text-white/80' : 'text-black/40 hover:text-black/80'
                        }`}
                        id="btn-toggle-portal-password-register"
                      >
                        {showPortalPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={portalAuthLoading}
                    className="w-full bg-[#C5A059] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/15 disabled:opacity-50 font-sans mt-2 cursor-pointer"
                  >
                    {portalAuthLoading ? 'Cadastrando...' : 'CRIAR CONTA E AVANÇAR'}
                  </button>
                </form>
              )}

              {/* REMOVED PWA DOWNLOAD SECTION */}
            </motion.div>
          </div>
        )}

        {/* Toggle Theme / Header Actions */}
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <button 
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2.5 rounded-xl border backdrop-blur-md shadow-lg transition-all cursor-pointer ${
              theme === 'dark' 
                ? 'bg-black/30 border-white/10 text-[#C5A059] hover:bg-black/50' 
                : 'bg-white/70 border-black/5 text-[#8B7344] hover:bg-white'
            }`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {clientPortalLoading ? (
          <div className="flex flex-col min-h-screen items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black uppercase tracking-widest opacity-60">Carregando portal...</p>
          </div>
        ) : clientPortalError ? (
          <div className="flex flex-col min-h-screen items-center justify-center p-6 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mb-4">
              <AlertCircle size={32} />
            </div>
            <h1 className="text-xl font-extrabold uppercase tracking-tight text-red-500">Erro de Carregamento</h1>
            <p className="text-sm opacity-70 mt-2 leading-relaxed">{clientPortalError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-[#C5A059] text-white px-6 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
            >
              Recarregar Página
            </button>
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto">
            {/* HEROPANEL - Banner and Shop Name */}
            <div className="relative h-48 md:h-60 overflow-hidden w-full bg-[#F8F5F0] shadow-lg">
              {shopBanner ? (
                <img 
                  src={shopBanner} 
                  alt="Banner" 
                  className="w-full h-full object-cover opacity-90" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#F8F5F0] to-[#E5E0D8] flex items-center justify-center">
                   <Sparkles size={64} className="text-[#C5A059] opacity-20 animate-pulse" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Logo Overlay */}
              <div className="absolute bottom-4 left-4 flex items-end gap-3.5 z-30">
                <button
                  type="button"
                  title="Página Inicial / Início"
                  onClick={() => {
                    setPortalStep(1);
                    setPortalSelectedService(null);
                    setPortalSelectedProfessional(null);
                    setPortalSelectedDate(new Date().toISOString().split('T')[0]);
                    setPortalSelectedTime('');
                    setPortalBookingSuccess(false);
                    setPortalBookingError(null);
                  }}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-[#C5A059] bg-white shadow-xl shrink-0 transition-all hover:scale-105 hover:border-[#D4AF37] active:scale-95 cursor-pointer block"
                >
                  {shopLogo ? (
                    <img 
                      src={shopLogo} 
                      alt="Logo" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#C5A059] font-black text-2xl bg-white">
                      {clientPortalShop?.name?.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </button>
                <div className="mb-1 text-white">
                  <button
                    type="button"
                    onClick={() => {
                      setPortalStep(1);
                      setPortalSelectedService(null);
                      setPortalSelectedProfessional(null);
                      setPortalSelectedDate(new Date().toISOString().split('T')[0]);
                      setPortalSelectedTime('');
                      setPortalBookingSuccess(false);
                      setPortalBookingError(null);
                    }}
                    className="text-left bg-transparent border-none p-0 cursor-pointer block group"
                  >
                    <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter drop-shadow-md text-[#C5A059] font-sans transition-all group-hover:text-[#D4AF37]">
                      <span className="notranslate" translate="no">{clientPortalShop?.name}</span>
                    </h1>
                  </button>
                  <p className="text-[10px] md:text-xs opacity-90 font-semibold drop-shadow-md flex items-center gap-1 font-sans text-white">
                    📍 {shopCleanAddress || "Endereço não informado"}
                  </p>

                  {(() => {
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const day = String(now.getDate()).padStart(2, '0');
                    const todayStr = `${year}-${month}-${day}`;
                    const dayIdx = now.getDay();
                    const dayName = weekdayKeys[dayIdx];
                    const currentHours = String(now.getHours()).padStart(2, '0');
                    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
                    const currentTimeStr = `${currentHours}:${currentMinutes}`;
                    
                    const dayBlocks = shopData?.extras?.blocks || [];

                    const activeTodayShopBlock = dayBlocks.find(b => {
                      if (b.type !== 'shop' || b.date !== todayStr) return false;
                      if (b.allDay) return true;
                      if (b.timeStart && b.timeEnd) {
                        const [currH, currM] = currentTimeStr.split(':').map(Number);
                        const [startH, startM] = b.timeStart.split(':').map(Number);
                        const [endH, endM] = b.timeEnd.split(':').map(Number);
                        const currMin = currH * 60 + currM;
                        const startMin = startH * 60 + startM;
                        const endMin = endH * 60 + endM;
                        return currMin >= startMin && currMin < endMin;
                      }
                      return false;
                    });

                    let isOpen = false;
                    let closedReason = "";

                    if (activeTodayShopBlock) {
                      isOpen = false;
                      closedReason = activeTodayShopBlock.reason || "Folga / Recesso administrado";
                    } else if (shopData) {
                      const hours = shopData.hours || defaultOperatingHours;
                      const dayHours = hours[dayName] || defaultOperatingHours[dayName];
                      
                      if (dayHours.closed) {
                        isOpen = false;
                        closedReason = "Fechado hoje";
                      } else {
                        const [currH, currM] = currentTimeStr.split(':').map(Number);
                        const [openH, openM] = dayHours.open.split(':').map(Number);
                        const [closeH, closeM] = dayHours.close.split(':').map(Number);
                        
                        const currMin = currH * 60 + currM;
                        const openMin = openH * 60 + openM;
                        const closeMin = closeH * 60 + closeM;
                        
                        if (currMin < openMin || currMin >= closeMin) {
                          isOpen = false;
                          closedReason = `Horário de funcionamento das ${dayHours.open} às ${dayHours.close}`;
                        } else {
                          isOpen = true;
                        }
                      }
                    }

                    return (
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        {isOpen ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[9px] md:text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-pulse">
                            <span className="w-1 h-1 rounded-full bg-emerald-400" />
                            Unidade Aberta
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-[9px] md:text-[10px] font-black text-rose-400 uppercase tracking-widest">
                            <span className="w-1 h-1 rounded-full bg-rose-400" />
                            Unidade Fechada
                          </span>
                        )}
                        {!isOpen && closedReason && (
                          <span className="text-[8px] md:text-[9px] font-semibold opacity-70 italic text-[#ddc1ae]">
                            ({closedReason})
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* PORTAL BODY CONTENT */}
            <div className="p-4 md:p-6 space-y-6">
              {(() => {
                const shopData = clientPortalShop ? parseBarbershopAddress(clientPortalShop.address) : null;
                const bio = clientPortalShop?.bio || shopData?.bio || "";
                const photo1 = clientPortalShop?.photo1 || shopData?.photo1 || "";
                const photo2 = clientPortalShop?.photo2 || shopData?.photo2 || "";
                const photo3 = clientPortalShop?.photo3 || shopData?.photo3 || "";
                const hasBio = bio && bio.trim().length > 0;
                const photos = [photo1, photo2, photo3].filter(p => p && p.trim().length > 0) as string[];
                
                if (!hasBio && photos.length === 0) return null;
                
                return (
                  <div className={`p-5 rounded-3xl border ${
                    theme === 'dark' ? 'bg-[#121212] border-white/5 shadow-xl' : 'bg-white border-black/5 shadow-md'
                  } space-y-4`}>
                    {hasBio && (
                      <div className="space-y-1 text-center py-1">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] font-sans">
                          Sobre o Estabelecimento
                        </h3>
                        <p className={`text-xs leading-relaxed font-semibold italic ${theme === 'dark' ? 'text-white/80' : 'text-black/80'} px-2`}>
                          "{bio}"
                        </p>
                      </div>
                    )}

                      <div className="pt-1.5 pb-1">
                        <button
                          type="button"
                          onClick={() => {
                            document.getElementById('scheduling-section')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="w-full flex items-center justify-center gap-2.5 px-6 py-5 bg-[#C5A059] text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl shadow-[#C5A059]/20 hover:shadow-[#C5A059]/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                        >
                          <Calendar size={18} />
                          Agendar Atendimento
                        </button>
                      </div>

                      {clientPortalSubscriptionPlans.length > 0 && (
                        <div className="pb-1">
                          <button
                            type="button"
                            onClick={() => {
                              document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                              theme === 'dark' 
                                ? 'bg-white/5 text-white hover:bg-white/10 border border-white/5' 
                                : 'bg-white text-black hover:bg-black/10 border border-[#C5A059]/10 shadow-sm'
                            }`}
                          >
                            <Sparkles size={16} className="text-[#C5A059]" />
                            Conheça Nossas Assinaturas Online
                          </button>
                        </div>
                      )}

                    {photos.length > 0 && (
                      <div className="pt-3 border-t border-dashed border-white/5">
                        <PortalCarousel photos={photos} />
                      </div>
                    )}
                  </div>
                );
              })()}

                        {clientPortalUser === null ? (
                /* AUTHENTICATION LOCKED VIEW - BLOCKED BY POPUP OVERLAY ABOVE */
                <div className={`p-8 text-center rounded-3xl border border-dashed ${
                  theme === 'dark' ? 'bg-[#121212]/30 border-white/10 text-white/40' : 'bg-black/[0.02] border-black/10 text-black/40'
                } space-y-3 animate-fadeIn`} id="scheduling-section">
                  <span className="text-2xl block">🔒</span>
                  <p className="text-xs font-black uppercase tracking-widest text-[#C5A059]">Acesso Restrito ao Agendamento</p>
                  <p className="text-[11px] font-semibold leading-relaxed max-w-sm mx-auto opacity-70">
                    O estabelecimento exige identificação prévia. Por favor, faça seu cadastro ou login no painel de abertura para liberar o agendamento de horários.
                  </p>
                </div>
              ) : (
                /* COLLABORATIVE ACTIVE BOOKING FLOW */
                <div id="scheduling-section" className="space-y-6 animate-fadeIn scroll-mt-6">
                  {/* Active Client Dashboard Greeting */}
                  <div className={`p-4 rounded-2xl border flex justify-between items-center ${
                    theme === 'dark' ? 'bg-[#131313] border-white/5' : 'bg-white border-black/5 shadow-sm'
                  }`}>
                    <div>
                      <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Portal do Cliente</p>
                      <h4 className="font-extrabold text-[#C5A059] text-sm uppercase">Olá, {clientPortalUser.name}!</h4>
                    </div>
                    <button
                      onClick={handlePortalLogout}
                      className="text-[10px] text-red-500 font-black hover:underline uppercase tracking-wider bg-red-500/10 px-2.5 py-1.5 rounded-lg border border-red-500/20"
                    >
                      Sair / Desconectar
                    </button>
                  </div>

                  {/* NAV-TABS: Novo Agendamento e Meus Agendamentos */}
                  <div className="flex border-b border-light-gray dark:border-white/5 pb-1 gap-4">
                    <button
                      type="button"
                      onClick={() => setPortalTab('booking')}
                      className={`pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                        portalTab === 'booking' 
                          ? 'border-[#C5A059] text-[#C5A059]' 
                          : 'border-transparent opacity-40 hover:opacity-100'
                      }`}
                    >
                      📅 Novo Agendamento
                    </button>
                    <button
                      type="button"
                      onClick={() => setPortalTab('appointments')}
                      className={`pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                        portalTab === 'appointments' 
                          ? 'border-[#C5A059] text-[#C5A059]' 
                          : 'border-transparent opacity-40 hover:opacity-100'
                      }`}
                    >
                      📋 Meus Agendamentos
                    </button>
                    <button
                      type="button"
                      onClick={() => setPortalTab('plans')}
                      className={`pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                        portalTab === 'plans' 
                          ? 'border-[#C5A059] text-[#C5A059]' 
                          : 'border-transparent opacity-40 hover:opacity-100'
                      }`}
                    >
                      💳 Assinaturas
                    </button>
                  </div>

                  {portalTab === 'booking' && (
                    <>
                      {/* STEP INDICATOR METER */}
                  <div className="flex justify-between items-center gap-1 select-none">
                    {[1, 2, 3, 4].map(st => {
                      const isActive = portalStep >= st;
                      const isCurrent = portalStep === st;
                      return (st < 4 || portalBookingSuccess) && (
                        <div key={st} className="flex-1 flex flex-col items-center gap-1.5">
                          <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-black transition-all ${
                            isCurrent
                              ? 'bg-[#C5A059] text-white border-[#C5A059] scale-110 shadow-lg shadow-[#C5A059]/20'
                              : isActive
                                ? 'bg-[#C5A059]/20 text-[#C5A059] border-[#C5A059]/40'
                                : theme === 'dark' 
                                  ? 'bg-[#151515] text-white/20 border-white/5' 
                                  : 'bg-white text-black/20 border-black/5'
                          }`}>
                            {st}
                          </div>
                          <span className={`text-[8px] uppercase tracking-wider font-extrabold ${st === portalStep ? 'text-[#C5A059]' : 'opacity-40'}`}>
                            {st === 1 ? 'Serviço' : st === 2 ? 'Profissional' : st === 3 ? 'Dia / Hora' : 'Pronto!'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {portalBookingError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-start gap-2.5 text-xs font-bold animate-fadeIn">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <span>{portalBookingError}</span>
                    </div>
                  )}

                  {/* STEP 1: SERVICES SELECTION */}
                  {portalStep === 1 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      {clientPortalSubscriptionPlans.length > 0 && (
                        <button 
                          onClick={() => setPortalTab('plans')}
                          className={`w-full ${theme === 'dark' ? 'bg-[#ffb77d]/10 border-[#ffb77d]/30' : 'bg-[#ffb77d]/5 border-[#ffb77d]/20'} text-[#ffb77d] py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#ffb77d]/20 transition-all mb-4`}
                        >
                          <CreditCard size={14} />
                          Conheça nossos planos de assinatura
                        </button>
                      )}
                      <h3 className="text-sm font-black uppercase tracking-wider text-[#ffb77d]">Escolha o Serviço Desejado:</h3>
                      <div className="grid grid-cols-1 gap-3.5">
                        {clientPortalServices.length > 0 ? (
                          clientPortalServices.map(service => {
                            const isSelected = portalSelectedService?.id === service.id;
                            return (
                              <button
                                key={service.id}
                                onClick={() => {
                                  setPortalSelectedService(service);
                                  setPortalStep(2);
                                }}
                                className={`w-full p-4 rounded-2xl border text-left flex justify-between items-center transition-all ${
                                  isSelected
                                    ? 'bg-[#ffb77d]/10 border-[#ffb77d] scale-[1.01]'
                                    : theme === 'dark'
                                      ? 'bg-[#121212] border-white/5 hover:border-[#ffb77d]/30'
                                      : 'bg-white border-black/5 hover:border-[#ffb77d]/50 shadow-sm'
                                }`}
                              >
                                <div>
                                  <h4 className={`font-sans font-black text-sm uppercase tracking-wide dark:group-hover:text-amber-400 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{service.name}</h4>
                                  <p className="text-[10px] opacity-50 font-bold uppercase mt-1">🕒 DURAÇÃO: {service.duration_minutes} MINUTOS</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-base font-black text-[#ffb77d]">R$ {service.price}</p>
                                  <p className="text-[8px] font-bold opacity-30 mt-0.5">SELECIONAR</p>
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <div className={`p-10 text-center border-2 border-dashed ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} rounded-2xl opacity-50 text-xs font-bold`}>
                            Nenhum serviço disponível no momento.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: PROFESSIONAL SELECTION */}
                  {portalStep === 2 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black uppercase tracking-wider text-[#ffb77d]">Escolha quem vai te atender:</h3>
                        <button
                          onClick={() => setPortalStep(1)}
                          className="text-[10px] uppercase font-bold text-[#ffb77d] hover:underline"
                        >
                          ← Voltar aos Serviços
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {clientPortalProfessionals.length > 0 ? (
                          clientPortalProfessionals.map(prof => {
                            const isSelected = portalSelectedProfessional?.id === prof.id;
                            const colorClass = getProfessionalColorStyles(prof.id, clientPortalProfessionals, theme);
                            return (
                              <button
                                key={prof.id}
                                onClick={() => {
                                  setPortalSelectedProfessional(prof);
                                  setPortalStep(3);
                                }}
                                className={`w-full p-4 rounded-2xl border text-left flex items-center gap-4 transition-all ${
                                  isSelected
                                    ? 'bg-[#ffb77d]/10 border-[#ffb77d] scale-[1.01]'
                                    : theme === 'dark'
                                      ? 'bg-[#121212] border-white/5 hover:border-[#ffb77d]/30'
                                      : 'bg-white border-black/5 hover:border-[#ffb77d]/50 shadow-sm'
                                }`}
                              >
                                <div 
                                  className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-lg bg-[#1a1a1a] cursor-zoom-in"
                                  onClick={(e) => {
                                    if (prof.photo_url) {
                                      e.stopPropagation();
                                      setZoomedImage(prof.photo_url);
                                    }
                                  }}
                                >
                                  {prof.photo_url ? (
                                    <img 
                                      src={prof.photo_url} 
                                      alt={prof.name} 
                                      className="w-full h-full object-cover transition-transform hover:scale-110" 
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className={`w-full h-full flex items-center justify-center font-black text-lg uppercase ${colorClass}`}>
                                      {prof.name.slice(0, 1).toUpperCase()}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-sm uppercase tracking-wide">{prof.name}</h4>
                                  <p className="text-[9px] opacity-40 font-bold mt-0.5 uppercase tracking-widest">Profissional</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="w-8 h-8 rounded-full bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059]">
                                    <ChevronRight size={16} />
                                  </div>
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <div className={`p-10 text-center border-2 border-dashed ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} rounded-2xl opacity-50 text-xs font-bold`}>
                            Nenhum profissional disponível no momento.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: DATE & TIME SELECTION WITH INTERACTIVE CALENDAR */}
                  {portalStep === 3 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      {clientPortalSubscriptionPlans.length > 0 && (
                        <button 
                          type="button"
                          onClick={() => setPortalTab('plans')}
                          className={`w-full ${theme === 'dark' ? 'bg-[#C5A059]/10 border-[#C5A059]/30' : 'bg-[#C5A059]/5 border-[#C5A059]/20'} text-[#C5A059] py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#C5A059]/20 transition-all mb-2`}
                        >
                          <CreditCard size={14} />
                          Conheça nossos planos de assinatura
                        </button>
                      )}
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black uppercase tracking-wider text-[#C5A059]">Escolha a data e hora:</h3>
                        <button
                          onClick={() => setPortalStep(2)}
                          className="text-[10px] uppercase font-bold text-[#C5A059] hover:underline"
                        >
                          ← Voltar ao Profissional
                        </button>
                      </div>

                      {/* Selected Professional Context Summary */}
                      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 animate-fadeIn ${
                        theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-[#fffcf9] border-[#C5A059]/10'
                      }`}>
                         <div 
                            className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#C5A059] shadow-lg bg-[#111] shrink-0 cursor-zoom-in"
                            onClick={() => {
                              if (portalSelectedProfessional?.photo_url) {
                                setZoomedImage(portalSelectedProfessional.photo_url);
                              }
                            }}
                          >
                            {portalSelectedProfessional?.photo_url ? (
                              <img src={portalSelectedProfessional.photo_url} className="w-full h-full object-cover transition-transform hover:scale-110" />
                            ) : (
                              <div className={`w-full h-full flex items-center justify-center font-black text-xl uppercase ${getProfessionalColorStyles(portalSelectedProfessional?.id || '', clientPortalProfessionals, theme)}`}>
                                {portalSelectedProfessional?.name.slice(0, 1).toUpperCase()}
                              </div>
                            )}
                         </div>
                         <div className="flex-1">
                            <h4 className="font-black text-sm uppercase tracking-widest">{portalSelectedProfessional?.name}</h4>
                            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                               <Clock size={12} className="text-[#C5A059]" />
                               <span className="text-[10px] font-black uppercase text-[#C5A059] tracking-widest leading-tight">
                                  {portalSelectedProfessional?.working_hours_type === 'custom' 
                                    ? `Atendimento Personalizado: ${portalSelectedProfessional.custom_start_time} às ${portalSelectedProfessional.custom_end_time}`
                                    : 'Horário de Atendimento da Unidade'}
                               </span>
                            </div>
                            <p className="text-[9px] opacity-40 uppercase tracking-tighter mt-1">Selecione abaixo um horário dentro deste intervalo</p>
                         </div>
                      </div>

                      {/* Interactive Month/Year Calendar Picker */}
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-50 font-sans block">Selecione o Dia no Calendário:</label>
                        
                        <div className={`p-4 rounded-2xl border ${
                          theme === 'dark' ? 'bg-[#121212] border-white/5' : 'bg-white border-black/5 shadow-sm'
                        } space-y-4`}>
                          
                          {/* Calendar Month Header */}
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => {
                                const d = new Date(portalCalendarPivot);
                                d.setMonth(d.getMonth() - 1);
                                setPortalCalendarPivot(d);
                              }}
                              className={`p-2.5 rounded-xl border text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1 shrink-0 ${
                                theme === 'dark' 
                                  ? 'border-white/5 bg-[#1a1a1a] hover:bg-white/5 text-white/85' 
                                  : 'border-black/5 bg-gray-50 hover:bg-black/5 text-black/85 shadow-sm'
                              }`}
                            >
                              &larr; Voltar
                            </button>
                            
                            <div className="flex flex-col items-center">
                              <span className="text-xs font-black uppercase tracking-widest text-[#ffb77d] text-center font-sans">
                                {(() => {
                                  const ptMonthNames = [
                                    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                                    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
                                  ];
                                  return `${ptMonthNames[portalCalendarPivot.getMonth()]} ${portalCalendarPivot.getFullYear()}`;
                                })()}
                              </span>
                              <button
                                type="button"
                                onClick={() => setPortalCalendarPivot(new Date())}
                                className="text-[8px] font-extrabold text-[#ffb77d] hover:underline uppercase tracking-widest mt-0.5"
                              >
                                Ir para Hoje
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const d = new Date(portalCalendarPivot);
                                d.setMonth(d.getMonth() + 1);
                                setPortalCalendarPivot(d);
                              }}
                              className={`p-2.5 rounded-xl border text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1 shrink-0 ${
                                theme === 'dark' 
                                  ? 'border-white/5 bg-[#1a1a1a] hover:bg-white/5 text-white/85' 
                                  : 'border-black/5 bg-gray-50 hover:bg-black/5 text-black/85 shadow-sm'
                              }`}
                            >
                              Avançar &rarr;
                            </button>
                          </div>

                          {/* Days of Week Row */}
                          <div className="grid grid-cols-7 gap-1 text-center border-b border-white/5 pb-2">
                            {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map(dayLabel => (
                              <span key={dayLabel} className="text-[8px] font-black tracking-widest opacity-40 font-mono py-1">
                                {dayLabel}
                              </span>
                            ))}
                          </div>

                          {/* Calendar Matrix Grid */}
                          {(() => {
                            const pYear = portalCalendarPivot.getFullYear();
                            const pMonth = portalCalendarPivot.getMonth();
                            
                            const firstDay = new Date(pYear, pMonth, 1);
                            const lastDay = new Date(pYear, pMonth + 1, 0);
                            const daysInMonth = lastDay.getDate();
                            
                            const days = [];
                            
                            // Previous month padding
                            const startOffset = firstDay.getDay(); 
                            const prevMonthLastDay = new Date(pYear, pMonth, 0).getDate();
                            for (let i = startOffset - 1; i >= 0; i--) {
                              days.push({
                                date: new Date(pYear, pMonth - 1, prevMonthLastDay - i),
                                isCurrentMonth: false
                              });
                            }
                            
                            // Current month days
                            for (let i = 1; i <= daysInMonth; i++) {
                              days.push({
                                date: new Date(pYear, pMonth, i),
                                isCurrentMonth: true
                              });
                            }
                            
                            // Next month padding to fill complete grid of 42 (6 rows x 7)
                            const totalGridSize = 42;
                            const endOffset = totalGridSize - days.length;
                            for (let i = 1; i <= endOffset; i++) {
                              days.push({
                                date: new Date(pYear, pMonth + 1, i),
                                isCurrentMonth: false
                              });
                            }

                            const todayStr = new Date().toISOString().split('T')[0];

                            return (
                              <div className="grid grid-cols-7 gap-1.5">
                                {days.map((day, cellIdx) => {
                                  const y = day.date.getFullYear();
                                  const m = String(day.date.getMonth() + 1).padStart(2, '0');
                                  const d = String(day.date.getDate()).padStart(2, '0');
                                  const valStr = `${y}-${m}-${d}`;
                                  
                                  const isSelected = portalSelectedDate === valStr;
                                  const isPast = valStr < todayStr;
                                  
                                  // Find existing appointments on this cell day to render visual indicator dots
                                  const dayAppointments = clientPortalAppointments.filter(a => {
                                    const aptDate = a.date.split('T')[0];
                                    return aptDate === valStr && a.status !== 'cancelled';
                                  });

                                  // Unique professional IDs that have appointments on this day
                                  const uniqueProfIds = Array.from(new Set(dayAppointments.map(a => a.professional_id).filter(Boolean)));

                                  const shopData = clientPortalShop ? parseBarbershopAddress(clientPortalShop.address) : null;
                                  const maxDays = shopData?.extras?.maxBookingDays || 0;
                                  let isBeyondLimit = false;
                                  if (maxDays > 0) {
                                    const cellDate = new Date(valStr + 'T12:00:00');
                                    cellDate.setHours(0,0,0,0);
                                    const todayMidnight = new Date();
                                    todayMidnight.setHours(0,0,0,0);
                                    
                                    const diffTime = cellDate.getTime() - todayMidnight.getTime();
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                    if (diffDays > maxDays) {
                                      isBeyondLimit = true;
                                    }
                                  }

                                  const dayBlocks = shopData?.extras?.blocks || [];
                                  const activeDayBlock = dayBlocks.find(b => 
                                    (b.type === 'shop' && b.date === valStr && b.allDay) ||
                                    (portalSelectedProfessional?.id && b.type === 'barber' && b.professionalId === portalSelectedProfessional.id && b.date === valStr && b.allDay)
                                  );

                                  const isBlocked = !!activeDayBlock;
                                  const isDisabled = isPast || isBeyondLimit || isBlocked;
                                  const blockReason = activeDayBlock?.reason ? `Bloqueado: ${activeDayBlock.reason}` : "Dia indisponível / Fechado";

                                  return (
                                    <button
                                      key={`${valStr}-${cellIdx}`}
                                      type="button"
                                      disabled={isDisabled}
                                      title={isBlocked ? blockReason : undefined}
                                      onClick={() => {
                                        setPortalSelectedDate(valStr);
                                        setPortalSelectedTime(''); // Reset selected time
                                      }}
                                      className={`relative p-2 rounded-xl border flex flex-col items-center justify-between h-[52px] transition-all overflow-hidden ${
                                        isSelected
                                          ? 'bg-[#ffb77d] text-[#4d2600] border-[#ffb77d] scale-105 font-black shadow-md shadow-[#ffb77d]/20 z-10'
                                          : isDisabled
                                            ? isPast
                                              ? 'opacity-[0.15] bg-transparent border-transparent select-none cursor-not-allowed'
                                              : isBeyondLimit
                                                ? 'opacity-[0.25] bg-transparent border-transparent select-none cursor-not-allowed font-medium'
                                                : 'bg-rose-500/[0.04] border-rose-500/10 text-rose-500/40 select-none cursor-not-allowed line-through'
                                            : day.isCurrentMonth
                                              ? theme === 'dark'
                                                ? 'bg-[#151515] border-white/5 hover:border-[#ffb77d]/40 text-white'
                                                : 'bg-white border-black/5 hover:border-[#ffb77d]/50 text-black shadow-sm'
                                              : theme === 'dark'
                                                ? 'bg-[#0a0a0a]/20 border-transparent text-white/20'
                                                : 'bg-black/[0.01] border-transparent text-black/20'
                                      }`}
                                    >
                                      <span className="text-xs font-black font-sans leading-none">
                                        {day.date.getDate()}
                                      </span>
                                      
                                      {/* Little color indicator dots representing therapist tasks */}
                                      {dayAppointments.length > 0 && !isPast && (
                                        <div className="flex gap-1 justify-center max-w-full overflow-hidden absolute bottom-1.5">
                                          {uniqueProfIds.slice(0, 3).map(profId => {
                                            const sortedProfs = [...clientPortalProfessionals].sort((a, b) => {
                                              const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
                                              const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
                                              return timeA - timeB || a.name.localeCompare(b.name);
                                            });
                                            const colorIdx = sortedProfs.findIndex(p => p.id === profId);
                                            const colors = [
                                              'bg-emerald-500', 'bg-sky-500', 'bg-amber-500', 'bg-rose-500', 
                                              'bg-indigo-500', 'bg-amber-600', 'bg-fuchsia-500', 'bg-emerald-600'
                                            ];
                                            const activeColor = colors[(colorIdx >= 0 ? colorIdx : 0) % colors.length];
                                            return (
                                              <span 
                                                key={profId} 
                                                className={`w-1.5 h-1.5 rounded-full ${activeColor} border border-[#1b1b1b]/20 shrink-0`} 
                                              />
                                            );
                                          })}
                                          {uniqueProfIds.length > 3 && (
                                            <span className="text-[6px] font-black shrink-0 tracking-tight opacity-50 font-mono">+</span>
                                          )}
                                        </div>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            );
                          })()}

                        </div>
                      </div>

                      {/* Display Existing Busy Times to provide visual availability contexts */}
                      {portalSelectedDate && (
                        <div className={`p-4 rounded-2xl border ${
                          theme === 'dark' ? 'bg-[#151515] border-white/5' : 'bg-white border-black/5 shadow-sm'
                        } space-y-3.5 animate-fadeIn`}>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">📅</span>
                            <h4 className="text-xs font-black uppercase tracking-wider text-[#C5A059] font-sans">
                              Ocupação dos Profissionais - {new Date(portalSelectedDate + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </h4>
                          </div>
                          
                          {(() => {
                            const dayApts = clientPortalAppointments.filter(a => {
                              const aptDate = a.date.split('T')[0];
                              return aptDate === portalSelectedDate && a.status !== 'cancelled';
                            });

                            if (dayApts.length === 0) {
                              return (
                                <p className="text-[11px] font-bold italic opacity-40 py-1.5 font-sans">
                                  Todos os profissionais estão totalmente livres para este dia!
                                </p>
                              );
                            }

                            return (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                                {dayApts.map(appt => {
                                  const barberName = appt.professional?.name || clientPortalProfessionals.find(p => p.id === appt.professional_id)?.name || "Profissional";
                                  const serviceDuration = appt.service?.duration_minutes || 30;
                                  const colorClass = getProfessionalColorStyles(appt.professional_id, clientPortalProfessionals, theme);
                                  
                                  // Calculate clean end hour
                                  const [sh, sm] = (appt.time || "08:00").slice(0, 5).split(':').map(Number);
                                  const totalMin = sh * 60 + sm + serviceDuration;
                                  const eh = String(Math.floor(totalMin / 60)).padStart(2, '0');
                                  const em = String(totalMin % 60).padStart(2, '0');
                                  const durationLabel = `${appt.time.slice(0, 5)} às ${eh}:${em}`;

                                  return (
                                    <div 
                                      key={appt.id} 
                                      className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold leading-none ${colorClass}`}
                                    >
                                      <div className="flex items-center gap-2 max-w-[75%] truncate">
                                        <span className="text-[10px] bg-black/15 px-2 py-1 rounded-md shrink-0 uppercase tracking-tight select-none">
                                          {durationLabel}
                                        </span>
                                        <span className="uppercase tracking-wide font-black truncate">
                                          {barberName}
                                        </span>
                                      </div>
                                      <span className="text-[9px] uppercase tracking-wider opacity-75 shrink-0 text-right">
                                        {serviceDuration} min
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* Interactive responsive hour selection grid */}
                      {portalSelectedDate && (
                        <div className="space-y-2.5 animate-fadeIn">
                          {(() => {
                            const shopData = clientPortalShop ? parseBarbershopAddress(clientPortalShop.address) : null;
                            const dayBlocks = shopData?.extras?.blocks || [];
                            
                            // Achar bloqueios gerais ou específicos daquele dia selecionado
                            const relevantBlocks = dayBlocks.filter(b => {
                              if (b.date !== portalSelectedDate) return false;
                              const isShopType = b.type === 'shop';
                              const isBarberType = b.type === 'barber' && portalSelectedProfessional && b.professionalId === portalSelectedProfessional.id;
                              return isShopType || isBarberType;
                            });

                            if (relevantBlocks.length === 0) return null;

                            return (
                              <div className="space-y-2 mb-3">
                                {relevantBlocks.map((b, idx) => {
                                  const isShop = b.type === 'shop';
                                  const targetProf = b.type === 'barber' && clientPortalProfessionals.find(p => p.id === b.professionalId);
                                  return (
                                    <div 
                                      key={idx} 
                                      className={`p-3.5 ${
                                        theme === 'dark' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-red-50 border-red-200 text-red-700'
                                      } border rounded-xl text-xs font-bold leading-relaxed flex items-start gap-2.5 animate-fadeIn`}
                                    >
                                      <span className="text-sm shrink-0">🚫</span>
                                      <div>
                                        <p className={`uppercase tracking-wider font-extrabold ${theme === 'dark' ? 'text-rose-300' : 'text-red-800'}`}>
                                          {isShop ? 'Aviso da Unidade' : `Indisponibilidade de ${targetProf ? targetProf.name : 'Profissional'}`}
                                        </p>
                                        <p className="opacity-90 font-medium text-[11px] mt-0.5">
                                          {b.allDay 
                                            ? 'Bloqueio de dia inteiro aplicado nesta data.' 
                                            : `Bloqueio de horário aplicado das ${b.timeStart}h às ${b.timeEnd}h.`
                                          }
                                        </p>
                                        {b.reason && (
                                          <p className={`text-[11px] italic opacity-95 mt-1 ${theme === 'dark' ? 'text-rose-300' : 'text-red-900 font-extrabold'}`}>
                                            Motivo declarado: "{b.reason}"
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}

                          <label className="text-[9px] font-black uppercase tracking-widest opacity-50 font-sans block">Selecione o Horário Disponível:</label>
                          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                            {COMMON_TIME_SLOTS.map(tStr => {
                              // Filter client open status dynamically
                              const selectedDuration = portalSelectedService?.duration_minutes || 30;
                              const checkOpen = clientPortalShop?.address 
                                ? isBarbershopOpenAt(portalSelectedDate, tStr, clientPortalShop.address, selectedDuration) 
                                : { isOpen: true };
                              
                              if (!checkOpen.isOpen) return null;

                              // Garantir que estamos usando a versão mais recente do profissional do estado compartilhado (vinda do backend)
                              const currentProf = clientPortalProfessionals.find(p => p.id === portalSelectedProfessional?.id) || portalSelectedProfessional;

                              // Verificar se o profissional tem horário personalizado e se o slot está dentro desse horário
                              if (currentProf && String(currentProf.working_hours_type).toLowerCase() === 'custom') {
                                const [th, tm] = tStr.split(':').map(Number);
                                const slotMinutes = th * 60 + tm;
                                
                                const startTimeStr = currentProf.custom_start_time || '08:00';
                                const endTimeStr = currentProf.custom_end_time || '20:00';
                                
                                const [sh, sm] = startTimeStr.split(':').map(Number);
                                const [eh, em] = endTimeStr.split(':').map(Number);
                                const startMinutes = sh * 60 + sm;
                                const endMinutes = eh * 60 + em;
                                
                                const slotEndMinutes = slotMinutes + selectedDuration;
                                
                                // Se o início do slot for antes do início do profissional OU o fim do serviço for após o fim do profissional
                                if (slotMinutes < startMinutes || slotEndMinutes > endMinutes) {
                                  return null;
                                }
                              }

                              // Verificar se o slot está no passado
                              const isPastSlot = (() => {
                                const slotDateTime = new Date(`${portalSelectedDate}T${tStr}:00.000-03:00`);
                                return slotDateTime.getTime() < Date.now();
                              })();

                              if (isPastSlot) {
                                return (
                                  <button
                                    key={tStr}
                                    type="button"
                                    disabled={true}
                                    className={`py-2 px-1 rounded-xl border text-center font-bold text-[10px] opacity-[0.2] cursor-not-allowed line-through ${
                                      theme === 'dark' ? 'bg-[#151515] border-white/5 text-white/30' : 'bg-gray-100 border-black/5 text-gray-300'
                                    }`}
                                  >
                                    {tStr}
                                  </button>
                                );
                              }

                              // Verificar bloqueios salvos para este horário específico
                              const isSlotBlocked = (() => {
                                const shopData = clientPortalShop ? parseBarbershopAddress(clientPortalShop.address) : null;
                                const dayBlocks = shopData?.extras?.blocks || [];
                                
                                return dayBlocks.some(b => {
                                  if (b.date !== portalSelectedDate) return false;
                                  
                                  const isShopType = b.type === 'shop';
                                  const isBarberType = b.type === 'barber' && portalSelectedProfessional && b.professionalId === portalSelectedProfessional.id;
                                  
                                  if (!isShopType && !isBarberType) return false;
                                  if (b.allDay) return true;
                                  
                                  if (b.timeStart && b.timeEnd) {
                                    const [th, tm] = tStr.split(':').map(Number);
                                    const slotMinutes = th * 60 + tm;
                                    
                                    const [bsh, bsm] = b.timeStart.split(':').map(Number);
                                    const [beh, bem] = b.timeEnd.split(':').map(Number);
                                    const blockStart = bsh * 60 + bsm;
                                    const blockEnd = beh * 60 + bem;
                                    
                                    const selectedDuration = portalSelectedService?.duration_minutes || 30;
                                    const slotEndMinutes = slotMinutes + selectedDuration;
                                    return slotMinutes < blockEnd && blockStart < slotEndMinutes;
                                  }
                                  return false;
                                });
                              })();

                              if (isSlotBlocked) {
                                return (
                                  <button
                                    key={tStr}
                                    type="button"
                                    disabled={true}
                                    className={`py-2 px-1 rounded-xl border text-center font-bold text-[9px] opacity-[0.3] cursor-not-allowed line-through ${
                                      theme === 'dark' ? 'bg-rose-500/[0.04] border-rose-500/10 text-rose-500/50' : 'bg-rose-50 border-rose-150 text-rose-500'
                                    }`}
                                  >
                                    {tStr} (Bloqueado)
                                  </button>
                                );
                              }

                              // Calculate overlapping busy statuses
                              const isOccupied = portalSelectedProfessional ? (() => {
                                return clientPortalAppointments.some(a => {
                                  const aptDate = a.date.split('T')[0];
                                  if (aptDate !== portalSelectedDate || a.professional_id !== portalSelectedProfessional.id || a.status === 'cancelled') {
                                    return false;
                                  }
                                  const duration = a.service?.duration_minutes || 30;
                                  
                                  const [th, tm] = tStr.split(':').map(Number);
                                  const slotStart = th * 60 + tm;
                                  const selectedDuration = portalSelectedService?.duration_minutes || 30;
                                  const slotEnd = slotStart + selectedDuration;

                                  const [ah, am] = (a.time || "08:00").slice(0, 5).split(':').map(Number);
                                  const aptStart = ah * 60 + am;
                                  const aptEnd = aptStart + duration;

                                  return slotStart < aptEnd && aptStart < slotEnd;
                                });
                              })() : false;

                              if (isOccupied) {
                                return (
                                  <button
                                    key={tStr}
                                    type="button"
                                    disabled={true}
                                    className={`py-2 px-1 rounded-xl border text-center font-bold text-[9px] opacity-[0.25] cursor-not-allowed ${
                                      theme === 'dark' ? 'bg-[#151515] border-white/5 text-white/40' : 'bg-gray-100 border-black/5 text-gray-400'
                                    }`}
                                  >
                                    {tStr} (Ocupado)
                                  </button>
                                );
                              }

                              const isSelected = portalSelectedTime === tStr;
                              return (
                                <button
                                  key={tStr}
                                  type="button"
                                  onClick={() => setPortalSelectedTime(tStr)}
                                  className={`py-2 rounded-xl border text-center font-bold text-xs transition-all ${
                                    isSelected
                                      ? 'bg-[#ffb77d] text-[#4d2600] border-[#ffb77d] scale-105 shadow-md shadow-[#ffb77d]/20 font-black'
                                      : theme === 'dark'
                                        ? 'bg-[#151515] border-white/5 hover:border-white/15 hover:text-[#ffb77d]'
                                        : 'bg-white border-black/5 hover:border-black/15 shadow-sm text-black hover:text-[#ff8c00]'
                                  }`}
                                >
                                  {tStr}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* CONCLUDE SUMMARY CARD */}
                      {portalSelectedDate && portalSelectedTime && (
                        <div className={`p-4 rounded-2xl border ${
                          theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5 shadow-md font-sans'
                        } flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-scaleUp`}>
                          <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#ffb77d] font-sans">Resumo do Seu Corte:</p>
                            <h4 className="font-extrabold text-xs uppercase leading-normal font-sans">
                              {portalSelectedService?.name} com {portalSelectedProfessional?.name}
                            </h4>
                            <p className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} font-sans`}>
                              📅 {portalSelectedDate.split('-').reverse().join('/')} às {portalSelectedTime}h — Total: <strong>R$ {portalSelectedService?.price}</strong>
                            </p>
                          </div>
                          
                          <button
                            type="button"
                            disabled={portalBookingLoading}
                            onClick={handlePortalBookAppointment}
                            className="bg-green-500 text-white shrink-0 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all w-full sm:w-auto text-center flex items-center justify-center gap-1.5 shadow-md shadow-green-500/15 disabled:opacity-50"
                          >
                            {portalBookingLoading ? "RESERVANDO..." : "CONFIRMAR MEU HORÁRIO!"}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* STEP 4: SUCCESS SUMMARY SCREEN */}
                  {portalStep === 4 && portalBookingSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center p-8 rounded-3xl border border-green-500/25 bg-green-500/[0.03] space-y-6"
                    >
                      <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto shadow-inner border border-green-500/20">
                        <CheckCircle2 size={36} />
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-xl font-black text-green-400 uppercase tracking-tight font-sans">Horário Agendado com Sucesso!</h2>
                        <p className={`text-xs max-w-md mx-auto leading-relaxed font-sans ${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>
                          Seu agendamento foi registrado com sucesso. Abaixo estão os detalhes confirmados:
                        </p>
                      </div>

                      <div className={`p-5 rounded-2xl border ${
                        theme === 'dark' ? 'bg-[#151515] border-white/5' : 'bg-white border-black/5 shadow-sm'
                      } max-w-sm mx-auto text-left space-y-3`}>
                        <div className="border-b border-light-gray dark:border-white/5 pb-2">
                          <p className="text-[8px] font-black uppercase opacity-40">Estabelecimento</p>
                          <p className="font-extrabold text-xs uppercase mt-0.5">
                            <span className="notranslate" translate="no">{clientPortalShop?.name}</span>
                          </p>
                        </div>
                        <div className="border-b border-light-gray dark:border-white/5 pb-2">
                          <p className="text-[8px] font-black uppercase opacity-40">Serviço Escolhido</p>
                          <p className="font-extrabold text-[#ffb77d] text-xs uppercase mt-0.5">{portalSelectedService?.name}</p>
                        </div>
                        <div className="border-b border-light-gray dark:border-white/5 pb-2">
                          <p className="text-[8px] font-black uppercase opacity-40">Profissional / Atendimento</p>
                          <p className="font-extrabold text-xs uppercase mt-0.5">{portalSelectedProfessional?.name}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase opacity-40">Data & Horário Reservados</p>
                          <p className="font-extrabold text-xs text-green-400 uppercase mt-0.5">
                            {portalSelectedDate.split('-').reverse().join('/')} às {portalSelectedTime}h
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2.5 max-w-sm mx-auto">
                        <button
                          onClick={() => {
                            setPortalStep(1);
                            setPortalSelectedService(null);
                            setPortalSelectedProfessional(null);
                            setPortalSelectedDate('');
                            setPortalSelectedTime('');
                            setPortalBookingSuccess(false);
                            setPortalBookingError(null);
                          }}
                          className="bg-[#e07b39] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 shadow-md shadow-[#e07b39]/15"
                        >
                          Fazer Outro Agendamento
                        </button>
                      </div>
                    </motion.div>
                  )}
                    </>
                  )}

                  {portalTab === 'appointments' && (
                    <motion.div 
                      key="portal-appointments-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-[#ffb77d]">Meus Agendamentos</h3>
                        <p className={`text-[11px] ${theme === 'dark' ? 'text-white/55' : 'text-black/55'}`}>
                          Histórico e próximos horários agendados nesta unidade.
                        </p>
                      </div>

                      {(() => {
                        const cleanPhone = (p: string) => p.replace(/\D/g, '');
                        const matching = clientPortalAppointments.filter(appt => {
                          return cleanPhone(appt.customer_phone) === cleanPhone(clientPortalUser.phone);
                        });

                        if (matching.length === 0) {
                          return (
                            <div className={`p-8 text-center rounded-2xl border ${
                              theme === 'dark' ? 'bg-[#121212]/50 border-white/5' : 'bg-white border-black/5 shadow-sm'
                            } text-xs font-bold opacity-60 flex flex-col items-center gap-2`}>
                              <Calendar size={24} className="opacity-40 animate-pulse text-[#ffb77d]" />
                              Você ainda não tem nenhum agendamento nesta unidade.
                            </div>
                          );
                        }

                        // Order latest-created first
                        const sorted = [...matching].sort((a,b) => {
                          const dateA = `${a.date}T${a.time}`;
                          const dateB = `${b.date}T${b.time}`;
                          return dateB.localeCompare(dateA);
                        });

                        const isCompletedOrPassed = (a: Appointment) => {
                          if (a.status === 'cancelled') return false; 
                          if (a.status === 'completed') return true;
                          const apptDateTime = new Date(`${a.date}T${a.time}:00.000-03:00`);
                          return apptDateTime.getTime() < Date.now();
                        };

                        const upcoming = sorted.filter(a => a.status !== 'cancelled' && !isCompletedOrPassed(a));
                        const past = sorted.filter(a => a.status === 'cancelled' || isCompletedOrPassed(a));

                        const renderAppointmentCard = (appt: Appointment) => {
                          const barName = appt.professional?.name || clientPortalProfessionals.find(p => p.id === appt.professional_id)?.name || "Profissional";
                          const servName = appt.service?.name || clientPortalServices.find(s => s.id === appt.service_id)?.name || "Serviço";
                          const servPrice = appt.service?.price || clientPortalServices.find(s => s.id === appt.service_id)?.price || 0;
                          
                          const isPassed = isCompletedOrPassed(appt);
                          const isCancelable = appt.status !== 'cancelled' && !isPassed;
                          const showCompleted = appt.status === 'completed' || (appt.status !== 'cancelled' && isPassed);

                          return (
                            <div 
                              key={appt.id}
                              className={`p-4 rounded-2xl border ${
                                theme === 'dark' ? 'bg-[#121212] border-white/5' : 'bg-white border-black/5 shadow-sm'
                              } flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                    appt.status === 'cancelled'
                                      ? 'text-red-400 bg-red-500/10 border-red-500/20'
                                      : showCompleted
                                        ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                                        : appt.status === 'confirmed'
                                          ? 'text-green-400 bg-green-500/10 border-green-500/20'
                                          : 'text-[#ffb77d] bg-[#ffb77d]/10 border-[#ffb77d]/20'
                                  }`}>
                                    {appt.status === 'cancelled' ? 'Cancelado' : showCompleted ? 'Concluído' : appt.status === 'confirmed' ? 'Confirmado' : 'Aguardando'}
                                  </span>
                                  <span className="text-[10px] opacity-40 font-mono font-bold">#{appt.id.slice(0, 8).toUpperCase()}</span>
                                </div>
                                <h4 className="text-xs font-black uppercase text-[#ffb77d]">{servName}</h4>
                                <p className="text-[11px] font-bold flex items-center gap-1.5 opacity-80">
                                  <span>👤 {barName}</span>
                                  <span className="opacity-20">•</span>
                                  <span>💰 R$ {servPrice}</span>
                                </p>
                                <p className="text-[10px] font-semibold opacity-60">
                                  📅 {appt.date.split('-').reverse().join('/')} às {appt.time}h
                                </p>
                              </div>

                              {isCancelable && (
                                <button
                                  type="button"
                                  disabled={portalCancellingId === appt.id}
                                  onClick={() => triggerCancelConfirmation(appt, true)}
                                  className="w-full xs:w-auto px-4 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                                >
                                  {portalCancellingId === appt.id ? "Cancelando..." : "❌ Cancelar"}
                                </button>
                              )}
                            </div>
                          );
                        };

                        return (
                          <div className="space-y-6">
                            {/* UPCOMING */}
                            <div className="space-y-3">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-green-400 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                Horários Agendados ({upcoming.length})
                              </h4>
                              {upcoming.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3">
                                  {upcoming.map(renderAppointmentCard)}
                                </div>
                              ) : (
                                <p className={`text-[10px] font-semibold opacity-50 italic pl-3`}>Nenhum agendamento futuro ativo no momento.</p>
                              )}
                            </div>

                            {/* PAST / COMPLETED / CANCELLED */}
                            <div className="space-y-3 pt-2 border-t border-dashed border-white/5">
                              <h4 className="text-[10px] font-black uppercase tracking-widest opacity-50 flex items-center gap-1.5 font-sans">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                Histórico / Passados ({past.length})
                              </h4>
                              {past.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3 opacity-75 animate-fadeIn">
                                  {past.map(renderAppointmentCard)}
                                </div>
                              ) : (
                                <p className={`text-[10px] font-semibold opacity-50 italic pl-3`}>Nenhum registro histórico de agendamento.</p>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}

                  {portalTab === 'plans' && (
                    <motion.div
                      key="plans-tab"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <p className={`text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2`}>Role para baixo para ver nossos planos disponíveis.</p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* ALWAYS VISIBLE SUBSCRIPTION PLANS SECTION */}
              {clientPortalSubscriptionPlans.length > 0 && (
                <div id="plans-section" className="space-y-6 pt-6 border-t border-dashed border-white/5 animate-fadeIn">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-[#ffb77d] uppercase tracking-tighter italic">Nossos Planos de Assinatura</h4>
                    <p className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-white/50' : 'text-black/50'}`}>
                      Economize e garanta sua frequência mensal com nossos planos exclusivos.
                    </p>
                  </div>

                  {/* Current Plan Status if logged in */}
                  {clientPortalUser && clientPortalUser.subscription_plan && (
                    <div className={`${theme === 'dark' ? 'bg-green-500/5 border-green-500/20' : 'bg-green-50 border-green-200'} border rounded-2xl p-4 space-y-3`}>
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
                            <CheckCircle2 size={24} />
                         </div>
                         <div>
                        <p className={`text-[10px] font-bold uppercase tracking-widest text-black`}>Seu Plano Ativo</p>
                            <h5 className="font-bold text-sm text-[#ffb77d]">{clientPortalUser.subscription_plan.name}</h5>
                         </div>
                       </div>
                       
                       {(() => {
                         const now = new Date();
                         const currentMonth = now.getMonth();
                         const currentYear = now.getFullYear();
                         const planUsage = clientPortalAppointments.filter(a => {
                           const aDate = new Date(a.date);
                           return a.service_id === clientPortalUser.subscription_plan?.service_id &&
                                  a.status !== 'cancelled' &&
                                  aDate.getMonth() === currentMonth &&
                                  aDate.getFullYear() === currentYear;
                         }).length;
                         const limit = clientPortalUser.subscription_plan?.limit_count || 0;
                         
                         return (
                              <div className="space-y-2 pt-2 border-t border-white/5">
                                 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-black font-bold">Uso no mês atual</span>
                                    <span className={planUsage >= limit ? 'text-red-400' : 'text-green-400'}>
                                       {planUsage} / {limit}
                                    </span>
                                 </div>
                                 <div className={`w-full h-1.5 ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'} rounded-full overflow-hidden`}>
                                    <div 
                                      className={`h-full transition-all duration-700 ${planUsage >= limit ? 'bg-red-500' : 'bg-green-500 shadow-sm shadow-green-500/20'}`}
                                      style={{ width: `${Math.min(100, (planUsage / limit) * 100)}%` }}
                                    />
                                 </div>
                              {planUsage >= limit && (
                                 <p className="text-[9px] text-red-400 font-bold uppercase tracking-tighter animate-pulse">
                                    Você atingiu o limite mensal do seu plano.
                                  </p>
                               )}
                            </div>
                         );
                       })()}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    {clientPortalSubscriptionPlans.map(plan => {
                      const isCurrent = clientPortalUser?.plan_id === plan.id;
                      return (
                        <div key={plan.id} className={`${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5 shadow-sm'} p-5 rounded-2xl border transition-all relative overflow-hidden group`}>
                          {isCurrent && (
                            <div className="absolute top-0 right-0 bg-green-500 text-black px-3 py-1 rounded-bl-xl text-[9px] font-black uppercase tracking-widest">
                              Ativo
                            </div>
                          )}
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 bg-[#ffb77d]/10 rounded-xl flex items-center justify-center text-[#ffb77d]">
                              <CreditCard size={20} />
                            </div>
                            <div className="text-right">
                               <p className={`text-[10px] font-bold uppercase tracking-widest text-black`}>Valor Mensal</p>
                               <p className="text-lg font-black text-[#ffb77d]">R$ {plan.price}</p>
                            </div>
                          </div>
                          <h4 className={`font-bold text-sm uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{plan.name}</h4>
                          <div className="mt-3 space-y-2">
                             <div className={`flex items-center gap-2 text-[10px] font-semibold ${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>
                                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb77d]" />
                                {plan.limit_count} Agendamentos por mês
                             </div>
                             <div className={`flex items-center gap-2 text-[10px] font-semibold ${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>
                                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb77d]" />
                                Serviço: {plan.service?.name}
                             </div>
                          </div>
                          
                          <button 
                            disabled={isCurrent || isLoading}
                            onClick={() => {
                              if (!clientPortalUser) {
                                // Scroll to login section if not logged in
                                document.getElementById('shop-opening-section')?.scrollIntoView({ behavior: 'smooth' });
                                return;
                              }
                              handleClientSubscribe(plan.id);
                            }}
                            className={`w-full mt-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                              isCurrent 
                                ? theme === 'dark' ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-black/5 text-black/30 cursor-not-allowed'
                                : 'bg-[#ffb77d] text-[#4d2600] hover:brightness-110 active:scale-95 shadow-lg shadow-[#ffb77d]/10'
                            }`}
                          >
                            {!clientPortalUser ? 'Fazer Login para Assinar' : isCurrent ? 'Você já assina este plano' : 'Assinar Plano Agora'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* BRANDING FOOTER */}
              <div className="pt-10 pb-4 flex flex-col items-center justify-center gap-2 opacity-40 hover:opacity-85 transition-opacity duration-300">
                <span className="text-[8px] font-bold tracking-widest uppercase opacity-50">Plataforma de Agendamentos</span>
                <div className="px-3.5 py-1.5 rounded-full border border-[#C5A059]/20 bg-white shadow-lg flex items-center gap-1.5 text-[#C5A059]">
                  <Sparkles size={12} className="text-[#C5A059] shrink-0" />
                  <Calendar size={12} className="text-[#C5A059] shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest font-mono text-[#D4AF37]">Queen Agenda</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {cancelModalData && cancelModalData.isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCancelModalData(null)}
                className="absolute inset-0 bg-[#000]/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={`relative ${theme === 'dark' ? 'bg-[#20201f] border-white/10' : 'bg-white border-black/5'} w-full max-w-sm rounded-2xl p-8 shadow-2xl border transition-colors duration-300 z-50`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Cancelar Agendamento?</h3>
                  
                  <div className={`text-sm ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} mb-6 space-y-2 text-left w-full border-t border-b ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} py-4 mt-2`}>
                    <p className="text-xs text-center font-bold mb-2">Tem certeza que deseja cancelar?</p>
                    <div className="text-xs space-y-1.5 pl-1 font-semibold">
                      <p><strong>Cliente:</strong> {cancelModalData.customerName}</p>
                      <p><strong>Serviço:</strong> {cancelModalData.serviceName}</p>
                      <p><strong>Profissional:</strong> {cancelModalData.professionalName}</p>
                      <p><strong>Data:</strong> {cancelModalData.date.split('-').reverse().join('/')}</p>
                      <p><strong>Horário:</strong> {cancelModalData.time}h</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 w-full">
                    <button 
                      onClick={() => setCancelModalData(null)}
                      className={`py-3 rounded-xl font-bold text-sm ${theme === 'dark' ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-black/5 text-black hover:bg-black/10'} transition-all`}
                    >
                      NÃO, MANTER
                    </button>
                    <button 
                      onClick={async () => {
                        const { appointmentId, isPortal } = cancelModalData;
                        setCancelModalData(null);
                        if (isPortal) {
                          await handlePortalCancelAppointment(appointmentId);
                        } else {
                          await handleCancelAppointment(appointmentId);
                        }
                      }}
                      className="py-3 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                    >
                      SIM, CANCELAR
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`flex flex-col lg:flex-row min-h-screen ${theme === 'dark' ? 'bg-white text-black' : 'bg-white text-black'} overflow-y-auto lg:overflow-hidden`}>
        {/* Left Side: Premium SaaS Landing Page */}
        <div className={`w-full lg:w-3/5 flex flex-col justify-between p-6 sm:p-10 lg:p-10 xl:p-12 relative overflow-hidden lg:h-screen lg:overflow-hidden border-b lg:border-b-0 lg:border-r ${theme === 'dark' ? 'border-black/5' : 'border-[#C5A059]/10'}`}>
          {/* Subtle background decoration (glowing gold shadows, shapes) */}
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#C5A059]/5 filter blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#C5A059]/5 filter blur-[100px] pointer-events-none" />

          {/* Logo Top Left */}
          <div className="flex items-center gap-3.5 z-10 shrink-0">
            <div className="w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center text-white shadow-xl">
              <Calendar size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#D4AF37] uppercase tracking-tighter leading-none italic">Queen <span className="font-light">Agenda</span></h1>
            </div>
          </div>

          {/* Core App Information Display (Centered in Left Side) */}
          <div className="flex-1 flex flex-col justify-center max-w-xl z-10 py-6 lg:py-5">
            <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-1.5 rounded-full w-fit mb-4 border border-[#D4AF37]/15">
              Gestão e Agendamento Online
            </span>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none italic mb-3 text-[#D4AF37]">
              Seu Estabelecimento <br />
              <span className="text-[#D4AF37]">Em Outro Nível</span>
            </h2>
            <p className={`text-sm leading-relaxed mb-6 font-bold text-black`}>
              Uma ferramenta desenvolvida para salões, esmalterias, profissionais de estéticas e clínicas. Centralize seus agendamentos, automatize seu financeiro e ofereça experiências exclusivas para seus clientes.
            </p>

            {/* List of Benefits/Features - Clean Typography */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
              <div className="flex gap-3">
                <div className="p-2 h-fit bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/15 text-[#D4AF37] mt-0.5 shrink-0">
                  <Calendar size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Agenda Exclusiva</h4>
                  <p className="text-[11px] opacity-100 font-bold leading-normal mt-0.5 text-black">Gestão completa de horários, profissionais e salas de atendimento.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 h-fit bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/15 text-[#D4AF37] mt-0.5 shrink-0">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">ERP Premium</h4>
                  <p className="text-[11px] opacity-100 font-bold leading-normal mt-0.5 text-black">Controle financeiro detalhado, comissões e fluxo de caixa profissional.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 h-fit bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/15 text-[#D4AF37] mt-0.5 shrink-0">
                  <Users size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Multi-Profissional</h4>
                  <p className="text-[11px] opacity-100 font-bold leading-normal mt-0.5 text-black">Perfis individuais para cada profissional da sua equipe.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 h-fit bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/15 text-[#D4AF37] mt-0.5 shrink-0">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Portal da Cliente</h4>
                  <p className="text-[11px] opacity-100 font-bold leading-normal mt-0.5 text-black">Agendamento online independente com design clean e intuitivo.</p>
                </div>
              </div>
            </div>

            {/* CTA Section - Get a quote */}
            <div className={`mt-6 p-4.5 rounded-2xl border ${theme === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-[#D4AF37]/5 border-[#D4AF37]/10'} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
              <div className="flex-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">Transforme seu negócio agora</h4>
                <p className={`text-[10px] sm:text-[11px] leading-relaxed mt-0.5 font-bold text-black`}>
                  Fale com nossos especialistas no WhatsApp e descubra o poder do Queen Agenda.
                </p>
              </div>
              <a 
                href={`https://wa.me/5581998591594?text=${encodeURIComponent("Gostaria de mais informações e um orçamento do Queen Agenda para meu estabelecimento.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#D4AF37] hover:brightness-110 text-white text-[10px] font-black uppercase tracking-widest px-4.5 py-2.5 rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center gap-2 whitespace-nowrap self-stretch sm:self-auto justify-center"
              >
                <span>Solicitar Orçamento</span>
              </a>
            </div>
          </div>

          {/* Footer of Left Column */}
          <div className="hidden lg:flex justify-between items-center text-[9px] sm:text-[10px] font-bold tracking-widest uppercase opacity-50 z-10 shrink-0 gap-4">
            <span>© 2026 KIVVO AGENDA</span>
            <div className="flex gap-4">
              <button onClick={() => setView('terms')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">Termos</button>
              <button onClick={() => setView('privacy')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">Privacidade</button>
              <a 
                href={`https://wa.me/5581998591594?text=${encodeURIComponent("Olá! Preciso de suporte com o sistema KIVVO AGENDA.")}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#D4AF37] transition-colors"
              >
                Suporte
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Login Panel */}
        <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-6 sm:p-12 relative py-12 lg:py-0 lg:h-screen lg:overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={`w-full max-w-md p-6 sm:p-8 rounded-3xl ${theme === 'dark' ? 'bg-[#131313]/90 border-white/5 shadow-2xl shadow-orange-500/5' : 'bg-white border-black/5 shadow-xl'} border relative overflow-hidden`}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] to-[#8C6B39]" />

            <div className="mb-6 sm:mb-8 text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">CONECTAR AO SISTEMA</h3>
              <p className="text-[10px] sm:text-xs opacity-50 font-bold uppercase tracking-wider mt-1 text-[#D4AF37]">Acesse seu painel administrativo</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-70 text-black">Login (Telefone ou Admin)</label>
                <div className="relative">
                  <UserCircle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/50" />
                  <input 
                    required
                    type="text"
                    placeholder="admin ou telefone"
                    className={`w-full bg-white border border-black/5 rounded-xl p-4 pl-12 focus:outline-none focus:border-[#D4AF37] transition-all text-black`}
                    value={loginForm.login}
                    onChange={e => setLoginForm({...loginForm, login: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-70 text-black">Senha</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/50" />
                  <input 
                    required
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full bg-white border border-black/5 rounded-xl p-4 pl-12 pr-12 focus:outline-none focus:border-[#D4AF37] transition-all text-black`}
                    value={loginForm.password}
                    onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200 cursor-pointer ${
                      theme === 'dark' ? 'text-white/40 hover:text-white/80' : 'text-black/40 hover:text-black/80'
                    }`}
                    id="btn-toggle-login-password"
                  >
                    {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {errorStatus && (
                <p className="text-xs font-bold text-red-500 text-center">{errorStatus}</p>
              )}

              <button 
                disabled={isLoading}
                className="w-full bg-[#D4AF37] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#D4AF37]/20 disabled:opacity-50 mt-4"
              >
                {isLoading ? 'ENTRANDO...' : 'ACESSAR PAINEL'}
              </button>
            </form>

          </motion.div>

          {/* Footer for mobile devices & desktop login sidebar */}
          <div className="mt-8 lg:absolute lg:bottom-5 left-0 right-0 text-center px-4 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase opacity-50 select-none">
            Desenvolvido e comercializado por PREMIUM TECH SOLUÇÕES
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-white text-black' : 'bg-[#fafafa] text-[#1a1c1c]'} font-sans transition-colors duration-300`}>
      {/* Sidebar */}
      <aside className={`w-64 border-r ${theme === 'dark' ? 'border-black/10 bg-white' : 'border-[#D4AF37]/10 bg-white'} flex flex-col p-6 hidden md:flex transition-colors duration-300 shadow-sm`}>
        <div className="flex items-center gap-3 mb-10 pb-5 border-b border-[#D4AF37]/10">
          <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center text-white shadow-lg">
            <Calendar size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-[#D4AF37] uppercase tracking-tighter leading-none italic">Queen <span className="font-light">Agenda</span></h1>
            <p className={`text-[9px] font-bold ${theme === 'dark' ? 'text-black' : 'text-[#8B7344]'} opacity-50 mt-1 leading-none`}>
              {user.role === 'master' ? 'Admin Master' : 'Painel Parceiro'}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {user.role === 'master' ? (
            <>
              <button 
                onClick={() => setView('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'dashboard' ? 'bg-[#D4AF37] text-white font-bold shadow-lg shadow-[#D4AF37]/20' : 'text-[#8B7344] hover:bg-[#D4AF37]/5'}`}
              >
                <LayoutDashboard size={20} />
                Dashboard
              </button>
              <button 
                onClick={() => setView('plans')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'plans' ? 'bg-[#D4AF37] text-white font-bold shadow-lg shadow-[#D4AF37]/20' : 'text-[#8B7344] hover:bg-[#D4AF37]/5'}`}
              >
                <CreditCard size={20} />
                Planos
              </button>
              <button 
                onClick={() => setView('barbershops')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'barbershops' ? 'bg-[#D4AF37] text-white font-bold shadow-lg shadow-[#D4AF37]/20' : 'text-[#8B7344] hover:bg-[#D4AF37]/5'}`}
              >
                <Store size={20} />
                Estabelecimentos
              </button>
              <button 
                onClick={() => setView('financeiro-master')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  view === 'financeiro-master' 
                    ? 'bg-[#D4AF37] text-white font-bold shadow-lg shadow-[#D4AF37]/20' 
                    : theme === 'dark' ? 'text-black hover:bg-black/5' : 'text-[#8B7344] hover:bg-[#D4AF37]/5'
                }`}
              >
                <PieChart size={20} />
                Financeiro
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setView('shop-dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'shop-dashboard' ? 'bg-[#D4AF37] text-white font-bold shadow-lg shadow-[#D4AF37]/20' : 'text-[#8B7344] hover:bg-[#D4AF37]/5'}`}
              >
                <LayoutDashboard size={20} />
                Painel Geral
              </button>
              <button 
                onClick={() => setView('financeiro')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'financeiro' ? 'bg-[#D4AF37] text-white font-bold shadow-lg shadow-[#D4AF37]/20' : 'text-[#8B7344] hover:bg-[#D4AF37]/5'}`}
              >
                <TrendingUp size={20} />
                Financeiro
              </button>
              <button 
                onClick={() => setView('agenda')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'agenda' ? 'bg-[#D4AF37] text-white font-bold shadow-lg shadow-[#D4AF37]/20' : 'text-[#8B7344] hover:bg-[#D4AF37]/5'}`}
              >
                <Calendar size={20} />
                Agenda
              </button>
              {user.role === 'barber' && (
                <>
                  <button 
                    onClick={() => setView('clientes')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'clientes' ? 'bg-[#D4AF37] text-white font-bold shadow-lg shadow-[#D4AF37]/20' : 'text-[#8B7344] hover:bg-[#D4AF37]/5'}`}
                  >
                    <Users size={20} />
                    Clientes
                  </button>
                  <button 
                    onClick={() => setView('professionals')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'professionals' ? 'bg-[#D4AF37] text-white font-bold shadow-lg shadow-[#D4AF37]/20' : 'text-[#8B7344] hover:bg-[#D4AF37]/5'}`}
                  >
                    <UserCircle size={20} />
                    Profissionais
                  </button>
                  <button 
                    onClick={() => setView('services')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'services' ? 'bg-[#D4AF37] text-white font-bold shadow-lg shadow-[#D4AF37]/20' : 'text-[#8B7344] hover:bg-[#D4AF37]/5'}`}
                  >
                    <Sparkles size={20} />
                    Serviços
                  </button>
                  <button 
                    onClick={() => setView('barbershop-subscriptions')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'barbershop-subscriptions' ? 'bg-[#D4AF37] text-white font-bold shadow-lg shadow-[#D4AF37]/20' : 'text-[#8B7344] hover:bg-[#D4AF37]/5'}`}
                  >
                    <CreditCard size={20} />
                    Assinaturas
                  </button>
                  <button 
                    onClick={() => setView('extras')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'extras' ? 'bg-[#D4AF37] text-white font-bold shadow-lg shadow-[#D4AF37]/20' : 'text-[#8B7344] hover:bg-[#D4AF37]/5'}`}
                  >
                    <Star size={20} />
                    Recursos
                  </button>
                  <button 
                    onClick={() => setView('settings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'settings' ? 'bg-[#D4AF37] text-white font-bold shadow-lg shadow-[#D4AF37]/20' : 'text-[#8B7344] hover:bg-[#D4AF37]/5'}`}
                  >
                    <Settings size={20} />
                    Configurações
                  </button>
                </>
              )}

            </>
          )}
        </nav>

        <div className={`mt-auto border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} pt-6`}>
          <div className="flex items-center gap-3 mb-6 font-display">
            <div className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-black/5 border-black/10' : 'bg-black/5 border-black/5'} flex items-center justify-center border overflow-hidden`}>
              <UserCircle size={24} className="text-[#C5A059]" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className={`text-sm font-bold ${theme === 'dark' ? 'text-black' : 'text-black'} truncate`}>{user.name}</p>
              <p className="text-[10px] text-[#C5A059] uppercase tracking-widest">
                {user.role === 'master' ? 'Administrador Master' : user.role === 'barber' ? 'Proprietário' : 'Profissional'}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border ${theme === 'dark' ? 'border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white' : 'border-red-500/20 text-red-600 hover:bg-red-500 hover:text-white'} transition-all text-xs font-bold uppercase tracking-widest`}
          >
            <LogOut size={16} />
            SAIR DO SISTEMA
          </button>
          
          <div className="flex justify-center gap-3 mt-4 text-[8px] font-bold uppercase tracking-widest opacity-40">
            <button onClick={() => setView('terms')} className="hover:text-[#C5A059]">Termos</button>
            <span>•</span>
            <button onClick={() => setView('privacy')} className="hover:text-[#C5A059]">Privacidade</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col min-h-screen overflow-y-auto ${theme === 'dark' ? 'bg-white' : 'bg-[#fafafa]'}`}>
        {/* Header */}
        <header className={`h-16 border-b ${theme === 'dark' ? 'border-black/10 bg-white/80' : 'border-black/5 bg-[#ffffff]/80'} flex items-center justify-between px-8 sticky top-0 backdrop-blur-md z-30 transition-colors duration-300`}>
          <h2 className="text-sm md:text-xl font-bold uppercase tracking-tight truncate max-w-[140px] sm:max-w-none text-black">
            {user.role === 'master' 
              ? (view === 'dashboard' ? 'Painel Master' : view === 'plans' ? 'Gestão de Planos' : 'Gestão de Unidades')
              : (user.role === 'barber' ? 'Painel do Proprietário' : 'Painel do Profissional')}
          </h2>
          <div className="flex items-center gap-4">
            {(user?.role === 'barber' || user?.role === 'professional') && (
              <button
                onClick={() => setIsChangePasswordModalOpen(true)}
                className="bg-[#C5A059]/10 hover:bg-[#C5A059]/20 border border-[#C5A059]/30 text-[#C5A059] px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Lock size={14} />
                <span>Alterar Senha</span>
              </button>
            )}
            {user && (
              <button
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className={`flex md:hidden items-center justify-center gap-2 px-3.5 py-2 rounded-xl border font-black text-xs transition-all uppercase tracking-wider ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-[#ddc1ae] hover:text-[#ffb77d] hover:bg-white/10'
                    : 'bg-black/5 border-black/5 text-[#a48c7a] hover:text-[#ff8c00] hover:bg-black/10'
                }`}
                title="Menu de Navegação"
              >
                <Menu size={16} className="text-[#ffb77d]" />
                <span>Menu</span>
              </button>
            )}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 ${theme === 'dark' ? 'text-[#ddc1ae] hover:text-[#ffb77d]' : 'text-[#a48c7a] hover:text-[#ff8c00]'} transition-colors`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className={`p-2 ${theme === 'dark' ? 'text-[#ddc1ae] hover:text-[#ffb77d]' : 'text-[#a48c7a] hover:text-[#ff8c00]'} transition-colors`}>
              <UserCircle size={20} />
            </button>
          </div>
        </header>

        {/* Dynamic Mobile Slide-Over Drawer navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Overlay Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden"
              />

              {/* Slider Sheet Drawer Component */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                className={`fixed inset-y-0 right-0 w-[280px] h-full ${
                  theme === 'dark' ? 'bg-[#121212] border-l border-white/10' : 'bg-white border-l border-black/5'
                } p-6 flex flex-col z-50 md:hidden overflow-y-auto shadow-2xl`}
              >
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <img src="/logo_kivo.svg" alt="Queen Agenda" className="w-9 h-9 object-contain" />
                    <div>
                      <h3 className="text-md font-black text-[#D4AF37] uppercase tracking-tight leading-none">QUEEN AGENDA</h3>
                      <p className="text-[8px] font-bold opacity-60 uppercase tracking-widest text-[#C5A059] mt-1 leading-none">Menu do Sistema</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-2 rounded-xl border ${
                      theme === 'dark' 
                        ? 'border-white/5 text-white/70 hover:bg-white/5' 
                        : 'border-black/5 text-black/70 hover:bg-black/5'
                    }`}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Main mobile navigation links */}
                <nav className="flex-1 space-y-1.5">
                  {user.role === 'master' ? (
                    <>
                      <button 
                        onClick={() => { setView('dashboard'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${
                          view === 'dashboard'
                            ? 'bg-[#ffb77d] text-[#4d2600] font-black shadow-lg shadow-[#ffb77d]/20'
                            : theme === 'dark' ? 'text-[#ddc1ae] hover:bg-white/5' : 'text-[#a48c7a] hover:bg-black/5'
                        }`}
                      >
                        <LayoutDashboard size={18} />
                        Dashboard
                      </button>
                      <button 
                        onClick={() => { setView('plans'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${
                          view === 'plans'
                            ? 'bg-[#ffb77d] text-[#4d2600] font-black shadow-lg shadow-[#ffb77d]/20'
                            : theme === 'dark' ? 'text-[#ddc1ae] hover:bg-white/5' : 'text-[#a48c7a] hover:bg-black/5'
                        }`}
                      >
                        <CreditCard size={18} />
                        Planos
                      </button>
                      <button 
                        onClick={() => { setView('barbershops'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${
                          view === 'barbershops'
                            ? 'bg-[#ffb77d] text-[#4d2600] font-black shadow-lg shadow-[#ffb77d]/20'
                            : theme === 'dark' ? 'text-[#ddc1ae] hover:bg-white/5' : 'text-[#a48c7a] hover:bg-black/5'
                        }`}
                      >
                        <Store size={18} />
                        Unidades
                      </button>
                      <button 
                        onClick={() => { setView('financeiro-master'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${
                          view === 'financeiro-master'
                            ? 'bg-[#ffb77d] text-[#4d2600] font-black shadow-lg shadow-[#ffb77d]/20'
                            : theme === 'dark' ? 'text-[#ddc1ae] hover:bg-white/5' : 'text-[#a48c7a] hover:bg-black/5'
                        }`}
                      >
                        <PieChart size={18} />
                        Financeiro
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => { setView('shop-dashboard'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${
                          view === 'shop-dashboard'
                            ? 'bg-[#ffb77d] text-[#4d2600] font-black shadow-line border border-[#ffb77d]/20'
                            : theme === 'dark' ? 'text-[#ddc1ae] hover:bg-white/5' : 'text-[#a48c7a] hover:bg-black/5'
                        }`}
                      >
                        <LayoutDashboard size={18} />
                        Meu Painel
                      </button>

                      <button 
                        onClick={() => { setView('financeiro'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${
                          view === 'financeiro'
                            ? 'bg-[#ffb77d] text-[#4d2600] font-black shadow-line border border-[#ffb77d]/20'
                            : theme === 'dark' ? 'text-[#ddc1ae] hover:bg-white/5' : 'text-[#a48c7a] hover:bg-black/5'
                        }`}
                      >
                        <TrendingUp size={18} />
                        Financeiro
                      </button>

                      <button 
                        onClick={() => { setView('agenda'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${
                          view === 'agenda'
                            ? 'bg-[#ffb77d] text-[#4d2600] font-black shadow-line border border-[#ffb77d]/20'
                            : theme === 'dark' ? 'text-[#ddc1ae] hover:bg-white/5' : 'text-[#a48c7a] hover:bg-black/5'
                        }`}
                      >
                        <Calendar size={18} />
                        Minha Agenda
                      </button>

                      {user.role === 'barber' && (
                        <>
                          <button 
                            onClick={() => { setView('clientes'); setMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${
                              view === 'clientes'
                                ? 'bg-[#ffb77d] text-[#4d2600] font-black shadow-line border border-[#ffb77d]/20'
                                : theme === 'dark' ? 'text-[#ddc1ae] hover:bg-white/5' : 'text-[#a48c7a] hover:bg-black/5'
                            }`}
                          >
                            <Users size={18} />
                            Clientes
                          </button>

                          <button 
                            onClick={() => { setView('professionals'); setMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${
                              view === 'professionals'
                                ? 'bg-[#ffb77d] text-[#4d2600] font-black shadow-line border border-[#ffb77d]/20'
                                : theme === 'dark' ? 'text-[#ddc1ae] hover:bg-white/5' : 'text-[#a48c7a] hover:bg-black/5'
                            }`}
                          >
                            <Sparkles size={18} />
                            Profissionais
                          </button>

                          <button 
                            onClick={() => { setView('services'); setMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${
                              view === 'services'
                                ? 'bg-[#ffb77d] text-[#4d2600] font-black shadow-line border border-[#ffb77d]/20'
                                : theme === 'dark' ? 'text-[#ddc1ae] hover:bg-white/5' : 'text-[#a48c7a] hover:bg-black/5'
                            }`}
                          >
                            <Box size={18} />
                            Serviços
                          </button>

                          <button 
                            onClick={() => { setView('barbershop-subscriptions'); setMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${
                              view === 'barbershop-subscriptions'
                                ? 'bg-[#ffb77d] text-[#4d2600] font-black shadow-line border border-[#ffb77d]/20'
                                : theme === 'dark' ? 'text-[#ddc1ae] hover:bg-white/5' : 'text-[#a48c7a] hover:bg-black/5'
                            }`}
                          >
                            <CreditCard size={18} />
                            Assinaturas
                          </button>

                          <button 
                            onClick={() => { setView('extras'); setMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${
                              view === 'extras'
                                ? 'bg-[#ffb77d] text-[#4d2600] font-black shadow-line border border-[#ffb77d]/20'
                                : theme === 'dark' ? 'text-[#ddc1ae] hover:bg-white/5' : 'text-[#a48c7a] hover:bg-black/5'
                            }`}
                          >
                            <Sparkles size={18} />
                            Extras
                          </button>

                          <button 
                            onClick={() => { setView('settings'); setMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${
                              view === 'settings'
                                ? 'bg-[#C5A059] text-white font-black shadow-line border border-[#C5A059]/20'
                                : theme === 'dark' ? 'text-black hover:bg-black/5' : 'text-[#a48c7a] hover:bg-black/5'
                            }`}
                          >
                            <Settings size={18} />
                            Configurações
                          </button>
                        </>
                      )}
                    </>
                  )}
                </nav>

                {/* Mobile Session Profile Card */}
                <div className="mt-8 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-9 h-9 rounded-full ${theme === 'dark' ? 'bg-black/5 border-black/10' : 'bg-black/5 border-black/5'} flex items-center justify-center border overflow-hidden`}>
                      <UserCircle size={22} className="text-[#C5A059]" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className={`text-xs font-bold truncate ${theme === 'dark' ? 'text-black' : 'text-black'}`}>{user.name}</p>
                      <p className="text-[9px] text-[#C5A059] uppercase tracking-widest">
                        {user.role === 'master' ? 'Adm Master' : user.role === 'barber' ? 'Proprietário' : 'Profissional'}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border ${
                      theme === 'dark' ? 'border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white' : 'border-red-500/10 bg-red-500/5 text-red-600 hover:bg-red-500 hover:text-white'
                    } transition-all text-xs font-bold uppercase tracking-widest`}
                  >
                    <LogOut size={14} />
                    Sair do Sistema
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="p-8 max-w-7xl mx-auto w-full space-y-12">
          {errorStatus && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-100"
            >
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{errorStatus}</p>
              <button 
                onClick={() => setErrorStatus(null)}
                className="ml-auto p-1 hover:bg-white/10 rounded-lg"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {view === 'dashboard' && user.role === 'master' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                {/* Metrics */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={`${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5'} p-6 rounded-2xl border hover:border-[#C5A059]/30 transition-all group shadow-sm`}>
                    <div className="flex justify-between items-start mb-2">
                      <CreditCard className="text-[#C5A059]" size={24} />
                      <span className="text-green-400 text-xs font-bold">+12%</span>
                    </div>
                    <p className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#C5A059]' : 'text-[#8C7A6A]'} uppercase tracking-widest`}>Faturamento Mensal</p>
                    <h3 className="text-3xl font-black text-[#C5A059] mt-1">
                      R$ {metrics.monthlyRevenue.toLocaleString('pt-BR')}
                    </h3>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5'} p-6 rounded-2xl border hover:border-[#C5A059]/30 transition-all group shadow-sm`}>
                    <div className="flex justify-between items-start mb-2">
                      <Store className="text-[#C5A059]" size={24} />
                      <span className="text-green-400 text-xs font-bold">+5</span>
                    </div>
                    <p className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#C5A059]' : 'text-[#8C7A6A]'} uppercase tracking-widest`}>Total de Unidades</p>
                    <h3 className="text-3xl font-black text-[#C5A059] mt-1">{metrics.totalBarbershops}</h3>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5'} p-6 rounded-2xl border hover:border-[#C5A059]/30 transition-all group shadow-sm`}>
                    <div className="flex justify-between items-start mb-2">
                      <CheckCircle2 className="text-[#C5A059]" size={24} />
                      <span className="text-[#C5A059] text-xs font-bold">Ativas</span>
                    </div>
                    <p className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#C5A059]' : 'text-[#8C7A6A]'} uppercase tracking-widest`}>Assinaturas Ativas</p>
                    <h3 className="text-3xl font-black text-[#C5A059] mt-1">{metrics.activeSubscriptions}</h3>
                  </div>
                </section>
                
                <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-[#C5A059]/20 rounded-3xl opacity-50">
                  <LayoutDashboard size={48} className="text-[#C5A059] mb-4" />
                  <p className="font-bold text-lg">Selecione uma aba para gerenciar</p>
                  <p className="text-sm opacity-60">Utilize o menu lateral para configurar Planos ou Unidades</p>
                </div>
              </motion.div>
            )}

            {view === 'plans' && user.role === 'master' && (
              <motion.div
                key="plans"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Plans Header */}
                <div className={`flex justify-between items-end border-b ${theme === 'dark' ? 'border-white/10' : 'border-[#C5A059]/10'} pb-4`}>
                  <div>
                    <h2 className="text-2xl font-bold">Planos Premium</h2>
                    <p className={`text-sm text-black font-bold`}>Gerencie os pacotes de assinatura exclusivos da plataforma.</p>
                  </div>
                  <button 
                    onClick={() => setIsPlanModalOpen(true)}
                    className="bg-[#C5A059] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-[#C5A059]/20"
                  >
                    <Plus size={18} />
                    CRIAR NOVO PLANO
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.length > 0 ? plans.map((plan) => (
                    <div key={plan.id} className={`${theme === 'dark' ? 'bg-[#2a2a2a] border-white/10' : 'bg-white border-black/5 shadow-sm'} p-6 rounded-2xl relative overflow-hidden group hover:border-[#ffb77d]/50 transition-all border`}>
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditingPlan(plan);
                            setNewPlan({ name: plan.name, price: plan.price, professionals_count: plan.professionals_count });
                            setIsPlanModalOpen(true);
                          }}
                          className="p-2 bg-white/10 hover:bg-[#ffb77d]/20 text-[#ffb77d] rounded-lg transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => setDeletingPlan(plan)}
                          className="p-2 bg-white/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <h4 className="text-xl font-bold mb-1">{plan.name}</h4>
                      <p className={`text-xs ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} mb-6`}>Configuração do plano para parceiros.</p>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-black text-[#ffb77d]">R$ {plan.price}</span>
                        <span className={`text-xs font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'}`}>/mês</span>
                      </div>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle2 size={16} className="text-[#ffb77d]" />
                          Até {plan.professionals_count} Profissionais
                        </li>
                      </ul>
                      <button className={`w-full border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} py-2.5 rounded-xl text-sm font-bold hover:border-[#ffb77d] hover:text-[#ffb77d] transition-all`}>
                        VER MAIS
                      </button>
                    </div>
                  )) : (
                    <div className={`col-span-full py-12 text-center ${theme === 'dark' ? 'text-[#ddc1ae] border-white/10' : 'text-[#a48c7a] border-black/5'} border border-dashed rounded-2xl`}>
                      Nenhum plano cadastrado.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {view === 'barbershops' && user.role === 'master' && (
              <motion.div
                key="barbershops"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Barbershops Header */}
                <div className={`flex justify-between items-end border-b ${theme === 'dark' ? 'border-white/10' : 'border-[#C5A059]/10'} pb-4`}>
                  <div>
                    <h2 className="text-2xl font-bold">Estabelecimentos</h2>
                    <p className={`text-sm text-black font-bold`}>Lista de unidades de saúde e beleza cadastradas na plataforma.</p>
                  </div>
                  <button 
                    onClick={() => setIsBarbershopModalOpen(true)}
                    className="bg-[#C5A059] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-[#C5A059]/20"
                  >
                    <Plus size={18} />
                    NOVA UNIDADE
                  </button>
                </div>

                <div className={`overflow-x-auto ${theme === 'dark' ? 'bg-[#20201f] border-white/10' : 'bg-white border-black/5 shadow-sm'} rounded-2xl border`}>
                  <table className="w-full text-left min-w-[800px]">
                    <thead>
                      <tr className={`${theme === 'dark' ? 'bg-[#2a2a2a] border-white/10' : 'bg-[#fcfcfc] border-black/5'} border-b transition-colors`}>
                        <th className="p-4 text-xs font-bold text-[#ffb77d] uppercase tracking-widest">Nome</th>
                        <th className="p-4 text-xs font-bold text-[#ffb77d] uppercase tracking-widest">Endereço</th>
                        <th className="p-4 text-xs font-bold text-[#ffb77d] uppercase tracking-widest">Telefone</th>
                        <th className="p-4 text-xs font-bold text-[#ffb77d] uppercase tracking-widest">Senha</th>
                        <th className="p-4 text-xs font-bold text-[#ffb77d] uppercase tracking-widest">Plano</th>
                        <th className="p-4 text-xs font-bold text-[#ffb77d] uppercase tracking-widest">Status</th>
                        <th className="p-4 text-xs font-bold text-[#ffb77d] uppercase tracking-widest">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {barbershops.length > 0 ? barbershops.slice((masterBarbershopPage - 1) * 10, masterBarbershopPage * 10).map((shop) => (
                        <tr key={shop.id} className={`border-b ${theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-black/5 hover:bg-black/5'} transition-colors`}>
                          <td className="p-4 font-bold">{shop.name}</td>
                          <td className={`p-4 ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} max-w-xs truncate`}>{shop.address ? shop.address.split('|||')[0] : ''}</td>
                          <td className="p-4">{shop.phone}</td>
                          <td className="p-4 font-mono font-bold text-[#ffb77d]">{shop.password || '---'}</td>
                          <td className="p-4">
                            <span className="text-xs font-bold text-[#ffb77d]">{shop.plan?.name || '-'}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                              shop.status === 'active' 
                                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                : 'bg-red-500/10 text-red-100 border-red-500/20'
                            }`}>
                              {shop.status === 'active' ? 'ATIVA' : 'BLOQUEADA'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => {
                                  setEditingBarbershop(shop);
                                  setNewBarbershop({
                                    name: shop.name,
                                    address: shop.address ? shop.address.split('|||')[0] : '',
                                    phone: shop.phone,
                                    plan_id: shop.plan_id,
                                    password: shop.password || '',
                                    status: shop.status
                                  });
                                  setIsBarbershopModalOpen(true);
                                }}
                                className={`${theme === 'dark' ? 'text-[#ddc1ae] hover:text-[#ffb77d]' : 'text-[#a48c7a] hover:text-[#ff8c00]'} transition-all`}
                                title="Editar Unidade"
                              >
                                <Edit3 size={18} />
                              </button>
                              
                              <button 
                                onClick={async () => {
                                  const newStatus = shop.status === 'blocked' ? 'active' : 'blocked';
                                  try {
                                    setIsLoading(true);
                                    const res = await fetch(`/api/barbershops/${shop.id}`, {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({
                                        ...shop,
                                        status: newStatus
                                      })
                                    });
                                    if (res.ok) {
                                      // Refresh local list state instantly
                                      setBarbershops(prev => prev.map(b => b.id === shop.id ? { ...b, status: newStatus } : b));
                                    }
                                  } catch (err) {
                                    console.error(err);
                                  } finally {
                                    setIsLoading(false);
                                  }
                                }}
                                title={shop.status === 'blocked' ? 'Desbloquear Barbearia' : 'Bloquear Barbearia'}
                                className={`transition-all ${
                                  shop.status === 'blocked'
                                    ? 'text-green-500 hover:text-green-400'
                                    : 'text-red-500 hover:text-red-400'
                                }`}
                              >
                                {shop.status === 'blocked' ? <CheckCircle2 size={18} /> : <Ban size={18} />}
                              </button>

                              <button 
                                onClick={() => setDeletingBarbershop(shop)}
                                className={`${theme === 'dark' ? 'text-[#ddc1ae] hover:text-red-400' : 'text-[#a48c7a] hover:text-red-600'} transition-all`}
                                title="Excluir Unidade"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={6} className={`p-12 text-center ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'}`}>
                            Nenhuma unidade cadastrada.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <Pagination 
                  currentPage={masterBarbershopPage}
                  totalItems={barbershops.length}
                  itemsPerPage={10}
                  onPageChange={setMasterBarbershopPage}
                  theme={theme}
                />
              </motion.div>
            )}

            {view === 'terms' && (
              <motion.div
                key="terms"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={`p-8 sm:p-12 rounded-3xl border ${theme === 'dark' ? 'bg-[#121212] border-white/10' : 'bg-white border-black/5 shadow-xl'} max-w-4xl mx-auto`}
              >
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                  <div className="p-3 bg-[#ffb77d]/10 rounded-2xl text-[#ffb77d]">
                    <FileText size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-[#C5A059]">Termos de Uso</h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-white/50' : 'text-black/50'}`}>Última atualização: Julho de 2026</p>
                  </div>
                </div>

                <div className={`space-y-6 text-sm leading-relaxed ${theme === 'dark' ? 'text-white/80' : 'text-black/80'}`}>
                  <section>
                    <h3 className="text-lg font-bold text-[#C5A059] mb-2 uppercase tracking-wide">1. Aceitação dos Termos</h3>
                    <p>Ao acessar e utilizar a plataforma Queen Agenda, você concorda em cumprir e estar vinculado aos seguintes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-[#C5A059] mb-2 uppercase tracking-wide">2. Descrição do Serviço</h3>
                    <p>O Queen Agenda é um sistema de agendamento e gestão online para barbearias, clínicas de estética, salões e beleza, oferecendo ferramentas para marcação de horários online, controle financeiro, gestão de profissionais e relacionamento com clientes.</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-[#C5A059] mb-2 uppercase tracking-wide">3. Responsabilidades do Usuário</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Fornecer informações precisas e completas durante o cadastro.</li>
                      <li>Manter a segurança de sua senha de acesso.</li>
                      <li>Não utilizar a plataforma para fins ilícitos ou que violem direitos de terceiros.</li>
                      <li>Cumprir com os horários agendados ou realizar o cancelamento com antecedência mínima de 2 horas.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-[#C5A059] mb-2 uppercase tracking-wide">4. Planos e Pagamentos</h3>
                    <p>O acesso para proprietários de unidades é baseado em planos de assinatura mensal. A inadimplência poderá resultar na suspensão temporária do acesso à plataforma até a regularização dos valores em aberto.</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-[#C5A059] mb-2 uppercase tracking-wide">5. Modificações</h3>
                    <p>Reservamos o direito de modificar estes termos a qualquer momento. Alterações significativas serão notificadas através da plataforma ou via e-mail/WhatsApp cadastrado.</p>
                  </section>
                </div>

                <div className="mt-12 flex justify-center">
                  <button 
                    onClick={() => setView(user ? (user.role === 'master' ? 'dashboard' : 'shop-dashboard') : 'dashboard')}
                    className="bg-[#C5A059] text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all border border-[#C5A059]/20 shadow-lg shadow-[#C5A059]/10"
                  >
                    Voltar para o Painel
                  </button>
                </div>
              </motion.div>
            )}

            {view === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={`p-8 sm:p-12 rounded-3xl border ${theme === 'dark' ? 'bg-[#121212] border-white/10' : 'bg-white border-black/5 shadow-xl'} max-w-4xl mx-auto`}
              >
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                  <div className="p-3 bg-green-500/10 rounded-2xl text-green-400">
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-green-400">Privacidade & LGPD</h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-white/50' : 'text-black/50'}`}>Segurança dos seus dados em primeiro lugar</p>
                  </div>
                </div>

                <div className={`space-y-6 text-sm leading-relaxed ${theme === 'dark' ? 'text-white/80' : 'text-black/80'}`}>
                  <section>
                    <h3 className="text-lg font-bold text-green-400 mb-2 uppercase tracking-wide">1. Coleta de Dados</h3>
                    <p>Coletamos apenas as informações necessárias para a prestação do nosso serviço: nome, telefone (WhatsApp) e histórico de agendamentos. Para estabelecimentos, coletamos também dados de endereço e informações fiscais básicas.</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-green-400 mb-2 uppercase tracking-wide">2. Finalidade do Tratamento</h3>
                    <p>Seus dados são utilizados exclusivamente para:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                      <li>Gerenciamento de agendamentos na unidade escolhida.</li>
                      <li>Envio de lembretes e confirmações via WhatsApp.</li>
                      <li>Análise estatística de faturamento e performance (apenas para proprietários).</li>
                      <li>Garantir a segurança e autenticidade dos acessos.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-green-400 mb-2 uppercase tracking-wide">3. Seus Direitos (LGPD)</h3>
                    <p>Em conformidade com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                      <li>Acesso aos seus dados cadastrados.</li>
                      <li>Correção de dados incompletos ou inexatos.</li>
                      <li>Eliminação de dados pessoais (exceto quando o armazenamento é exigido por lei).</li>
                      <li>Revogação do consentimento para tratamento de dados.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-green-400 mb-2 uppercase tracking-wide">4. Segurança</h3>
                    <p>Utilizamos tecnologias de criptografia e protocolos de segurança rigorosos para proteger suas informações contra acessos não autorizados ou uso indevido.</p>
                  </section>
                </div>

                <div className="mt-12 flex justify-center">
                  <button 
                    onClick={() => setView(user ? (user.role === 'master' ? 'dashboard' : 'shop-dashboard') : 'dashboard')}
                    className="bg-green-500 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all border border-green-500/20 shadow-lg shadow-green-500/10"
                  >
                    Entendido, voltar
                  </button>
                </div>
              </motion.div>
            )}

            {view === 'financeiro-master' && user.role === 'master' && (() => {
              // Get accurate plan for each shop
              const getShopPlan = (shop: Barbershop) => {
                if (shop.plan) return shop.plan;
                return plans.find(p => p.id === shop.plan_id);
              };

              // Financial stats
              const activeBarbershops = barbershops.filter(b => b.status === 'active');
              const blockedBarbershops = barbershops.filter(b => b.status === 'blocked');
              const totalActiveShopsCount = activeBarbershops.length;

              const totalMonthlyRecurringRevenue = activeBarbershops.reduce((acc, b) => {
                const p = getShopPlan(b);
                return acc + (p?.price || 0);
              }, 0);

              const totalLossSuspended = blockedBarbershops.reduce((acc, b) => {
                const p = getShopPlan(b);
                return acc + (p?.price || 0);
              }, 0);

              const annualProjectionWithGrowth = totalMonthlyRecurringRevenue * 12;

              // Filtered list
              const filteredShops = barbershops.filter(shop => {
                // Name or phone search
                const matchesSearch = shop.name.toLowerCase().includes(masterFinanceSearch.toLowerCase()) ||
                  (shop.phone && shop.phone.includes(masterFinanceSearch));

                // Status filter
                const matchesStatus = masterFinanceStatusFilter === 'all' || shop.status === masterFinanceStatusFilter;

                // Price/Value filter
                const sPlan = getShopPlan(shop);
                const planPrice = sPlan?.price || 0;
                let matchesPrice = true;
                
                if (masterFinancePriceFilter === 'free') {
                  matchesPrice = planPrice === 0;
                } else if (masterFinancePriceFilter === 'premium') {
                  matchesPrice = planPrice > 50;
                } else if (masterFinancePriceFilter === 'cheap') {
                  matchesPrice = planPrice > 0 && planPrice <= 50;
                } else if (masterFinancePriceFilter !== 'all') {
                  // Specific value match or specific plan id match
                  matchesPrice = sPlan?.id === masterFinancePriceFilter || String(planPrice) === masterFinancePriceFilter;
                }

                return matchesSearch && matchesStatus && matchesPrice;
              });

              // Breakdown of MRR by plan type
              const planBreakdown = plans.map(p => {
                const subset = activeBarbershops.filter(b => {
                  const sp = getShopPlan(b);
                  return sp?.id === p.id;
                });
                const totalVal = subset.reduce((acc, b) => acc + p.price, 0);
                const percent = totalMonthlyRecurringRevenue > 0 ? (totalVal / totalMonthlyRecurringRevenue) * 100 : 0;
                return {
                  ...p,
                  count: subset.length,
                  totalValue: totalVal,
                  percentage: percent
                };
              });

              return (
                <motion.div
                  key="financeiro-master"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 pb-12 w-full"
                >
                  {/* Master Finance Header */}
                  <div className={`flex flex-col md:flex-row justify-between items-start md:items-end border-b ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} pb-4 gap-4`}>
                    <div>
                      <h2 className="text-3xl font-black uppercase tracking-tight text-[#ffb77d] italic">Controle Financeiro Master</h2>
                      <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${theme === 'dark' ? 'text-[#ddc1ae]/70' : 'text-[#a48c7a]/70'}`}>
                        Gestão da Receita Recorrente Mensal (MRR), Saúde Comercial e Projeções
                      </p>
                    </div>
                  </div>

                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* MRR Card */}
                    <div className={`${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5 shadow-xs'} p-6 rounded-2xl border transition-all hover:border-[#ffb77d]/20 relative overflow-hidden group`}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffb77d]/5 rounded-bl-full transition-transform group-hover:scale-110 pointer-events-none" />
                      <div className="flex justify-between items-start mb-3">
                        <span className="p-3 bg-[#ffb77d]/10 text-[#ffb77d] rounded-xl border border-[#ffb77d]/15">
                          <TrendingUp size={20} className="text-[#ffb77d]" />
                        </span>
                        <span className="text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border border-green-500/15">Ativo</span>
                      </div>
                      <p className={`text-[10px] font-black ${theme === 'dark' ? 'text-[#ddc1ae]/60' : 'text-[#a48c7a]/60'} uppercase tracking-widest`}>
                        Receita Mensal Recorrente (MRR)
                      </p>
                      <h3 className="text-3xl font-black text-[#ffb77d] mt-2 tracking-tight">
                        R$ {totalMonthlyRecurringRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </h3>
                      <p className="text-[11px] opacity-60 mt-1 font-semibold">
                        Soma dos planos de {totalActiveShopsCount} unidades ativas.
                      </p>
                    </div>

                    {/* Suspended/Lost Card */}
                    <div className={`${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5 shadow-xs'} p-6 rounded-2xl border transition-all hover:border-red-500/20 relative overflow-hidden group`}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/3 rounded-bl-full pointer-events-none" />
                      <div className="flex justify-between items-start mb-3">
                        <span className="p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/15">
                          <Ban size={20} />
                        </span>
                        <span className="text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border border-red-500/15">Suspenso</span>
                      </div>
                      <p className={`text-[10px] font-black ${theme === 'dark' ? 'text-[#ddc1ae]/60' : 'text-[#a48c7a]/60'} uppercase tracking-widest`}>
                        Receita Retida / Inadimplência
                      </p>
                      <h3 className="text-3xl font-black text-red-500 mt-2 tracking-tight">
                        R$ {totalLossSuspended.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </h3>
                      <p className="text-[11px] opacity-60 mt-1 font-semibold">
                        Perda temporária devido a {blockedBarbershops.length} unidades suspensas.
                      </p>
                    </div>

                    {/* ARR Projections Card */}
                    <div className={`${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5 shadow-xs'} p-6 rounded-2xl border transition-all hover:border-[#ff9d54]/20 relative overflow-hidden group`}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff9d54]/5 rounded-bl-full pointer-events-none" />
                      <div className="flex justify-between items-start mb-3">
                        <span className="p-3 bg-amber-500/10 text-[#ffb77d] rounded-xl border border-amber-500/15">
                          <Sparkles size={20} />
                        </span>
                        <span className="text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border border-amber-500/15">Projeção 12m</span>
                      </div>
                      <p className={`text-[10px] font-black ${theme === 'dark' ? 'text-[#ddc1ae]/60' : 'text-[#a48c7a]/60'} uppercase tracking-widest`}>
                        Faturamento Anual Projetado (ARR)
                      </p>
                      <h3 className="text-3xl font-black text-amber-400 mt-2 tracking-tight">
                        R$ {annualProjectionWithGrowth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </h3>
                      <p className="text-[11px] opacity-60 mt-1 font-semibold">
                        Projeção anual direta sem considerar nova tração.
                      </p>
                    </div>
                  </div>

                  {/* Graph & Breakdown Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Simulated visual growth chart - Elegant Custom SVG Chart */}
                    <div className={`col-span-1 lg:col-span-8 p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h4 className="text-sm font-black uppercase tracking-wider text-[#ffb77d]">Projeção de Escala de Recorrência</h4>
                          <p className={`text-[11px] ${theme === 'dark' ? 'text-[#ddc1ae]/60' : 'text-[#a48c7a]/60'} font-bold`}>
                            Simulação de crescimento do faturamento com base no MRR atual
                          </p>
                        </div>
                        <span className="text-[10px] font-black uppercase bg-[#ffb77d]/10 text-[#ffb77d] px-2.5 py-1 rounded-lg">Estabilidade SaaS</span>
                      </div>

                      {/* SVG Line/Area Chart */}
                      <div className="h-44 w-full mt-2 relative">
                        {/* Interactive chart labels */}
                        <div className="absolute top-1 left-1 flex items-center gap-4 text-[10px] font-bold">
                          <span className="flex items-center gap-1.5 text-[#ffb77d]">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb77d]" /> Projeção Orgânica (1.5x)
                          </span>
                          <span className="flex items-center gap-1.5 text-[#ddc1ae]/40">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#ddc1ae]/40" /> MRR Atual Estático
                          </span>
                        </div>

                        {/* Chart Render */}
                        <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                          <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#ffb77d" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#ffb77d" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Grid Lines */}
                          <line x1="10" y1="120" x2="490" y2="120" stroke={theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeDasharray="3 3" />
                          <line x1="10" y1="80" x2="490" y2="80" stroke={theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeDasharray="3 3" />
                          <line x1="10" y1="40" x2="490" y2="40" stroke={theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeDasharray="3 3" />

                          {/* Static Line */}
                          <line x1="30" y1="110" x2="470" y2="110" stroke={theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} strokeWidth="1.5" strokeDasharray="4 4" />

                          {/* Curved Growth Area Path */}
                          <path
                            d="M 30,110 Q 140,95 250,75 T 470,35 L 470,120 L 30,120 Z"
                            fill="url(#chartGrad)"
                          />

                          {/* Curved Growth Line Path */}
                          <path
                            d="M 30,110 Q 140,95 250,75 T 470,35"
                            fill="none"
                            stroke="#ffb77d"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />

                          {/* Bullet Dots */}
                          <circle cx="30" cy="110" r="4.5" fill="#4d2600" stroke="#ffb77d" strokeWidth="2.5" />
                          <circle cx="140" cy="98" r="4" fill="#4d2600" stroke="#ffb77d" strokeWidth="2" />
                          <circle cx="250" cy="75" r="4" fill="#4d2600" stroke="#ffb77d" strokeWidth="2" />
                          <circle cx="360" cy="58" r="4" fill="#4d2600" stroke="#ffb77d" strokeWidth="2" />
                          <circle cx="470" cy="35" r="5" fill="#4d2600" stroke="#ffb77d" strokeWidth="3" />

                          {/* Text labels on the months */}
                          <text x="30" y="138" fill={theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)'} fontSize="8" fontWeight="bold" textAnchor="middle">Mes 1</text>
                          <text x="140" y="138" fill={theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)'} fontSize="8" fontWeight="bold" textAnchor="middle">Mes 2</text>
                          <text x="250" y="138" fill={theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)'} fontSize="8" fontWeight="bold" textAnchor="middle">Mes 3</text>
                          <text x="360" y="138" fill={theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)'} fontSize="8" fontWeight="bold" textAnchor="middle">Mes 4</text>
                          <text x="470" y="138" fill={theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)'} fontSize="8" fontWeight="bold" textAnchor="middle">Mes 6</text>
                        </svg>
                      </div>

                      <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} flex justify-between items-center text-[11px] font-bold`}>
                        <span className="opacity-60 text-xs">Faturamento Atual Estável: <strong>R$ {totalMonthlyRecurringRevenue.toLocaleString('pt-BR')}</strong></span>
                        <span className="text-[#ffb77d] uppercase tracking-wider text-[10px]">Atingindo estabilidade escalar comercial</span>
                      </div>
                    </div>

                    {/* Breakdown by Plan */}
                    <div className={`col-span-1 lg:col-span-4 p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                      <h4 className="text-sm font-black uppercase tracking-wider text-[#ffb77d] mb-4">Faturamento por Plano</h4>

                      <div className="space-y-4">
                        {planBreakdown.map(pb => (
                          <div key={pb.id} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <div>
                                <span className={`font-extrabold uppercase ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{pb.name}</span>
                                <span className="opacity-50 text-[10px] ml-1.5 font-bold">({pb.count} unidades)</span>
                              </div>
                              <span className="font-extrabold text-[#ffb77d]">R$ {pb.totalValue.toLocaleString('pt-BR')}</span>
                            </div>

                            {/* Custom progress bar */}
                            <div className={`w-full h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}>
                              <div
                                className="h-full bg-gradient-to-r from-[#8C6B39] to-[#C5A059] rounded-full transition-all duration-700"
                                style={{ width: `${pb.percentage || 0}%` }}
                              />
                            </div>

                            <div className="flex justify-between text-[10px] opacity-100 font-bold uppercase">
                              <span className="opacity-55">Participação: {pb.percentage.toFixed(1)}%</span>
                              <span className="text-[#ffb77d]">R$ {pb.price}/mês</span>
                            </div>
                          </div>
                        ))}

                        {planBreakdown.length === 0 && (
                          <p className="text-xs text-center opacity-60 py-6">Nenhum plano para detalhar.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Filter and Detailed Table Section */}
                  <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5 shadow-sm'} space-y-6`}>
                    {/* Filter and search bar header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h4 className="text-md font-black uppercase tracking-tight text-white dark:text-white">Assinaturas e Detalhamento Recorrente</h4>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-[#ddc1ae]/60' : 'text-[#a48c7a]/60'}`}>
                          Consulte os valores individuais, filtre e audite a saúde de cada cliente
                        </p>
                      </div>

                      {/* Small Indicator - Total Filtered */}
                      <span className="text-[10px] font-bold px-3 py-1 rounded-xl bg-[#ffb77d]/10 text-[#ffb77d] border border-[#ffb77d]/15">
                        {filteredShops.length} Unidades encontradas
                      </span>
                    </div>

                    {/* Integrated dynamic filters row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Search client input */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Buscar unidade ou fone..."
                          value={masterFinanceSearch}
                          onChange={(e) => setMasterFinanceSearch(e.target.value)}
                          className={`w-full pl-4 pr-4 py-2.5 rounded-xl text-xs font-bold ${
                            theme === 'dark' 
                              ? 'bg-black/30 border-white/10 text-white placeholder-white/30 focus:border-[#ffb77d]' 
                              : 'bg-black/[0.02] border-black/10 text-black placeholder-black/40 focus:border-[#ff8c00]'
                          } border transition-all focus:outline-none`}
                        />
                      </div>

                      {/* Dynamic monthly value range/select filter */}
                      <div>
                        <select
                          value={masterFinancePriceFilter}
                          onChange={(e) => setMasterFinancePriceFilter(e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold ${
                            theme === 'dark' 
                              ? 'bg-[#20201f] border-white/10 text-white focus:border-[#ffb77d]' 
                              : 'bg-white border-black/10 text-black focus:border-[#ff8c00]'
                          } border transition-all focus:outline-none cursor-pointer`}
                        >
                          <option value="all">Filtro por Valor (Qualquer valor mensal)</option>
                          <option value="free">Grátis (R$ 0 / mês)</option>
                          <option value="cheap">Baixo Custo (Até R$ 50 / mês)</option>
                          <option value="premium">Premium (Acima de R$ 50 / mês)</option>
                          <optgroup label="Valores de Planos Existentes">
                            {plans.map(p => (
                              <option key={p.id} value={p.id}>{p.name} — R$ {p.price}/mês</option>
                            ))}
                          </optgroup>
                        </select>
                      </div>

                      {/* Status select filter */}
                      <div>
                        <select
                          value={masterFinanceStatusFilter}
                          onChange={(e) => setMasterFinanceStatusFilter(e.target.value as any)}
                          className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold ${
                            theme === 'dark' 
                              ? 'bg-[#20201f] border-white/10 text-white focus:border-[#ffb77d]' 
                              : 'bg-white border-black/10 text-black focus:border-[#ff8c00]'
                          } border transition-all focus:outline-none cursor-pointer`}
                        >
                          <option value="all">Filtrar por Status (Todos)</option>
                          <option value="active">Apenas Ativas</option>
                          <option value="blocked">Apenas Suspensas / Canceladas</option>
                        </select>
                      </div>
                    </div>

                    {/* Table of Recurring Accounts */}
                    <div className={`overflow-x-auto border ${theme === 'dark' ? 'bg-[#151515] border-white/5' : 'bg-black/[0.01] border-black/5'} rounded-2xl`}>
                      <table className="w-full text-left min-w-[700px]">
                        <thead>
                          <tr className={`border-b ${theme === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-black/[0.02] border-black/5'} uppercase text-[10px] tracking-widest font-black text-[#ffb77d]`}>
                            <th className="p-4">Unidade</th>
                            <th className="p-4">Plano Ativo</th>
                            <th className="p-4">Valor Mensal</th>
                            <th className="p-4">Faturamento Anual</th>
                            <th className="p-4">Contato</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs">
                          {filteredShops.map((shop) => {
                            const pObj = getShopPlan(shop);
                            const planPrice = pObj?.price || 0;
                            const isActive = shop.status === 'active';

                            return (
                              <tr key={shop.id} className={`border-b transition-colors ${
                                theme === 'dark' 
                                  ? 'border-white/5 hover:bg-white/5' 
                                  : 'border-black/5 hover:bg-black/5'
                              }`}>
                                <td className="p-4">
                                  <div className="font-extrabold uppercase tracking-tight">
                                    <span className="notranslate" translate="no">{shop.name}</span>
                                  </div>
                                  <span className={`text-[9px] opacity-50`}>{shop.address ? shop.address.split('|||')[0] : 'Sem endereço'}</span>
                                </td>
                                <td className="p-4">
                                  <span className="font-bold text-[#ffb77d] uppercase">{pObj?.name || 'Sem plano'}</span>
                                </td>
                                <td className="p-4">
                                  <span className="font-extrabold text-sm">
                                    R$ {planPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </span>
                                  <span className="text-[10px] opacity-50 font-bold uppercase ml-1">/mês</span>
                                </td>
                                <td className="p-4 font-bold opacity-85">
                                  R$ {(planPrice * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="p-4 font-mono font-medium opacity-80">{shop.phone || 'Sem contato'}</td>
                                <td className="p-4 text-center">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest ${
                                    isActive
                                      ? 'bg-green-500/10 text-green-400 border border-green-500/15'
                                      : 'bg-red-500/10 text-red-100 border border-red-500/15'
                                  }`}>
                                    {isActive ? 'ATIVA' : 'SUSPENSA'}
                                  </span>
                                </td>
                                <td className="p-4 text-center">
                                  <button 
                                    onClick={async () => {
                                      const newStatus = shop.status === 'blocked' ? 'active' : 'blocked';
                                      try {
                                        setIsLoading(true);
                                        const res = await fetch(`/api/barbershops/${shop.id}`, {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({
                                            ...shop,
                                            status: newStatus
                                          })
                                        });
                                        if (res.ok) {
                                          setBarbershops(prev => prev.map(b => b.id === shop.id ? { ...b, status: newStatus } : b));
                                        }
                                      } catch (err) {
                                        console.error(err);
                                      } finally {
                                        setIsLoading(false);
                                      }
                                    }}
                                    title={shop.status === 'blocked' ? 'Desbloquear Unidade' : 'Bloquear Unidade'}
                                    className={`transition-all ${
                                      shop.status === 'blocked'
                                        ? 'text-green-500 hover:text-green-400'
                                        : 'text-red-400 hover:text-red-300'
                                    }`}
                                  >
                                    {shop.status === 'blocked' ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}

                          {filteredShops.length === 0 && (
                            <tr>
                              <td colSpan={7} className="p-12 text-center font-bold opacity-60">
                                Nenhuma assinatura atende aos filtros definidos.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              );
            })()}

            {view === 'shop-dashboard' && (user.role === 'barber' || user.role === 'professional') && (
              <motion.div
                key="shop-dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <div>
                   <h2 className="text-4xl font-black uppercase tracking-tighter italic">
                      {user.role === 'barber' ? (
                        <span className="notranslate" translate="no">{user.shop?.name || 'KIVVO AGENDA'}</span>
                      ) : (
                        <span>Bem-vindo, {user.name}</span>
                      )}
                   </h2>
                   <p className="opacity-40 text-xs font-bold uppercase tracking-widest mt-1">
                      {user.role === 'barber' ? 'Painel do Proprietário' : 'Sua agenda pessoal e atendimentos'}
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className={`${theme === 'dark' ? 'bg-[#1c1b1b]' : 'bg-white'} p-6 rounded-2xl border ${theme === 'dark' ? 'border-white/5' : 'border-[#C5A059]/10'} shadow-sm`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black">Agendamentos Hoje</p>
                    <h3 className="text-3xl font-black text-[#C5A059] mt-2">
                       {appointments.filter(a => {
                          const today = new Date().toISOString().split('T')[0];
                          return a.date === today;
                       }).length}
                    </h3>
                    <div className="mt-4 flex items-center gap-2 text-xs text-green-500">
                      <Plus size={14} />
                      <button onClick={() => setView('agenda')} className="hover:underline">Ver lista completa</button>
                    </div>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-[#1c1b1b]' : 'bg-white'} p-6 rounded-2xl border ${theme === 'dark' ? 'border-white/5' : 'border-[#C5A059]/10'} shadow-sm`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black">Atendimentos Realizados</p>
                    <h3 className="text-3xl font-black text-[#C5A059] mt-2">
                       {appointments.filter(a => {
                          if (a.status === 'completed') return true;
                          if (a.status === 'cancelled') return false;
                          const apptDateTime = new Date(`${a.date}T${a.time}:00.000-03:00`);
                          return apptDateTime.getTime() < Date.now();
                       }).length}
                    </h3>
                    <p className="mt-4 text-[10px] opacity-40 uppercase tracking-widest">Este mês</p>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-[#1c1b1b]' : 'bg-white'} p-6 rounded-2xl border ${theme === 'dark' ? 'border-white/5' : 'border-[#C5A059]/10'} shadow-sm`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black">
                      {user.role === 'professional' ? 'Comissão Estimada' : 'Receita Estimada'}
                    </p>
                    <h3 className="text-3xl font-black text-green-500 mt-2">
                       R$ {(() => {
                         const sum = appointments.filter(a => a.status !== 'cancelled').reduce((acc, a) => {
                           const price = a.service?.price || 0;
                           if (user.role === 'professional') {
                             const prof = professionals.find(p => p.id === user.id);
                             const pct = prof && prof.commission_percentage !== undefined ? prof.commission_percentage : 40;
                             return acc + (price * pct) / 100;
                           }
                           return acc + price;
                         }, 0);
                         return sum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                       })()}
                    </h3>
                    <p className="mt-4 text-[10px] opacity-40 uppercase tracking-widest">
                      {user.role === 'professional' ? (() => {
                        const prof = professionals.find(p => p.id === user.id);
                        const pct = prof && prof.commission_percentage !== undefined ? prof.commission_percentage : 40;
                        return `Comissão de ${pct}% sobre serviços`;
                      })() : 'Calculado por serviços'}
                    </p>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-[#1c1b1b]' : 'bg-white'} p-6 rounded-2xl border ${theme === 'dark' ? 'border-white/5' : 'border-[#C5A059]/10'} shadow-sm`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black">Meu Plano Premium</p>
                    <h3 className="text-xl font-bold text-[#C5A059] mt-2">{user.shop?.plan?.name || 'Luxury Platinum'}</h3>
                    <div className="mt-4 flex items-center gap-2 text-[10px] text-green-500 font-bold uppercase tracking-widest">
                      <CheckCircle2 size={12} />
                      <span>Fatura em dia</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h4 className="text-lg font-bold">Próximos Horários</h4>
                    <div className="space-y-3">
                      {appointments
                        .filter(a => a.status === 'pending' || a.status === 'confirmed')
                        .slice(0, 5)
                        .map(appointment => (
                        <div key={appointment.id} className={`${theme === 'dark' ? 'bg-[#1c1b1b]' : 'bg-white'} p-4 rounded-xl border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} flex items-center justify-between`}>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[#C5A059]/10 flex items-center justify-center font-black text-[#C5A059]">
                               {appointment.time.slice(0, 5)}
                            </div>
                            <div>
                              <p className="font-bold">{appointment.customer_name}</p>
                              <p className="text-xs opacity-50">{appointment.service?.name || 'Serviço'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] opacity-60">{new Date(appointment.date).toLocaleDateString('pt-BR')}</p>
                             <button className="text-[10px] font-bold text-[#ffb77d] hover:underline uppercase tracking-widest">Detalhes</button>
                          </div>
                        </div>
                      ))}
                      {appointments.length === 0 && (
                        <p className="text-center py-8 opacity-40 text-sm italic">Nenhum agendamento futuro ainda.</p>
                      )}
                    </div>
                  </div>
                  {(() => {
                    const parsed = parseBarbershopAddress(user.shop?.address);
                    const showBrand = parsed.logoUrl || parsed.bannerUrl;

                    return showBrand ? (
                      <div className={`${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5 shadow-sm'} rounded-3xl overflow-hidden border flex flex-col justify-between h-full`}>
                        <div>
                          {parsed.bannerUrl ? (
                            <div className="h-44 w-full overflow-hidden relative border-b border-black/5">
                              <img 
                                src={parsed.bannerUrl} 
                                alt="Banner da Barbearia" 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              {parsed.logoUrl && (
                                <div className="absolute -bottom-8 left-6 w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-lg bg-white z-10">
                                  <img 
                                    src={parsed.logoUrl} 
                                    alt="Logo" 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            parsed.logoUrl && (
                              <div className="p-6 border-b border-white/5 flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-white shrink-0 shadow-md">
                                  <img 
                                    src={parsed.logoUrl} 
                                    alt="Logo" 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div className="overflow-hidden">
                                  <h5 className="font-black text-lg uppercase tracking-tight truncate notranslate" translate="no">{user.shop?.name}</h5>
                                  <p className="text-xs text-black font-bold truncate">{parsed.addressOnly}</p>
                                </div>
                              </div>
                            )
                          )}
                          
                          <div className={`p-6 ${parsed.bannerUrl && parsed.logoUrl ? 'pt-12' : 'pt-6'} space-y-3`}>
                            <h5 className="font-bold uppercase tracking-wide text-xs text-[#C5A059] flex items-center gap-2">
                              <ImageIcon size={14} />
                              Painel de Recados do Estabelecimento
                            </h5>
                            <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-white/70' : 'text-black/70'}`}>
                              Este espaço representa a vitrine visual que seus clientes acessarão online! Use-o para postar recados, avisos importantes e ofertas sazonais de forma totalmente interativa.
                            </p>
                          </div>
                        </div>

                        <div className="p-6 border-t border-white/5">
                          <div className={`text-[10px] p-3 rounded-xl bg-[#C5A059]/5 text-black flex items-center gap-2 font-bold uppercase tracking-wide`}>
                            <Store size={14} className="text-[#C5A059] shrink-0" />
                            <span>Identidade ativa de: <strong className="notranslate" translate="no">{user.shop?.name || 'KIVVO AGENDA'}</strong></span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5 shadow-sm'} rounded-3xl p-12 border flex flex-col items-center justify-center text-center`}>
                        <Store size={48} className="text-[#ffb77d]/40 mb-4 animate-pulse" />
                        <h5 className="font-black text-lg uppercase tracking-tighter text-[#C5A059]">Espaço da Unidade</h5>
                        <p className={`text-xs ${theme === 'dark' ? 'text-white/50' : 'text-black/50'} mt-2 max-w-xs leading-relaxed`}>
                          Sua identidade visual unificada do estabelecimento está a um clique de distância!
                        </p>
                        <p className={`text-[10px] ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} bg-[#ffb77d]/10 px-3 py-1.5 rounded-lg mt-4 font-bold uppercase tracking-wider`}>
                          Envie um Logo e Banner em Configurações
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </motion.div>
            )}

            {view === 'financeiro' && (user.role === 'barber' || user.role === 'professional') && (
              <motion.div
                key="financeiro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                   <h2 className="text-4xl font-black uppercase tracking-tighter italic">
                      ERP Financeiro & Relatórios
                   </h2>
                   <p className="opacity-40 text-xs font-bold uppercase tracking-widest mt-1">
                      Acompanhe o faturamento, ticket médio e performance da unidade
                   </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <FinancialERP 
                    appointments={appointments}
                    services={services}
                    professionals={professionals}
                    theme={theme}
                    userRole={user.role}
                    userId={user.id}
                  />
                </div>
              </motion.div>
            )}

            {view === 'agenda' && (user.role === 'barber' || user.role === 'professional') && (
              <motion.div
                key="agenda"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Header Section */}
                <div className={`flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} pb-4`}>
                  <div>
                    <h2 className="text-2xl font-bold uppercase tracking-tighter">Minha Agenda</h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'}`}>
                       {selectedProfessionalFilter === 'all' 
                         ? (user.role === 'barber' ? 'Visão geral da unidade' : `Agenda pessoal: ${user.name}`) 
                         : `Agenda: ${professionals.find(p => p.id === selectedProfessionalFilter)?.name || 'Profissional'}`}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Filtro de Profissional (Apenas para Master ou Admin) */}
                    {(user.role === 'master' || user.role === 'barber') && (
                      <div className="flex items-center gap-2 mr-2">
                        <User size={16} className="text-[#ffb77d] opacity-50" />
                        <select
                          value={selectedProfessionalFilter}
                          onChange={(e) => setSelectedProfessionalFilter(e.target.value)}
                          className={`px-4 py-2 rounded-xl border outline-none font-bold text-xs appearance-none cursor-pointer ${
                            theme === 'dark'
                              ? 'bg-[#151515] border-white/10 text-white focus:border-[#ffb77d]'
                              : 'bg-white border-black/10 text-black focus:border-[#ffb77d]'
                          } transition-all`}
                        >
                          <option value="all">TODOS OS PROFISSIONAIS</option>
                          {professionals.map(p => (
                            <option key={p.id} value={p.id}>{p.name.toUpperCase()}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {/* View Switcher */}
                    <div className={`flex rounded-xl p-1 border ${theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-black/5 border-black/5'}`}>
                      <button 
                        onClick={() => setAgendaTab('calendar')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${agendaTab === 'calendar' ? 'bg-[#ffb77d] text-[#4d2600] shadow-md' : 'text-[#ddc1ae] hover:text-white'}`}
                      >
                        Agenda
                      </button>
                      <button 
                        onClick={() => setAgendaTab('list')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${agendaTab === 'list' ? 'bg-[#ffb77d] text-[#4d2600] shadow-md' : 'text-[#ddc1ae] hover:text-white'}`}
                      >
                        Tabela
                      </button>
                    </div>

                    <button 
                      onClick={() => handleOpenNewAppointment()}
                      className="bg-[#ffb77d] text-[#4d2600] px-6 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-[#ffb77d]/20"
                    >
                      <Plus size={18} />
                      NOVO AGENDAMENTO
                    </button>
                  </div>
                </div>

                {/* Calendar View */}
                {agendaTab === 'calendar' ? (
                  <div className="space-y-4">
                    {/* Month Picker Controls */}
                    <div className={`flex items-center justify-between p-4 rounded-2xl border ${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            const today = new Date();
                            setSelectedMonth(today.getMonth());
                            setSelectedYear(today.getFullYear());
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase bg-white/5 hover:bg-white/10 ${theme === 'dark' ? 'text-white' : 'text-black bg-black/5 hover:bg-black/10'} transition-all`}
                        >
                          Hoje
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => {
                            if (selectedMonth === 0) {
                              setSelectedMonth(11);
                              setSelectedYear(prev => prev - 1);
                            } else {
                              setSelectedMonth(prev => prev - 1);
                            }
                          }}
                          className={`p-2.5 rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white' : 'border-black/5 bg-black/5 hover:bg-black/10 text-black'} transition-all`}
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <h3 className="text-lg font-black uppercase tracking-tighter w-40 text-center">
                          {[
                            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
                          ][selectedMonth]} {selectedYear}
                        </h3>
                        <button 
                          onClick={() => {
                            if (selectedMonth === 11) {
                              setSelectedMonth(0);
                              setSelectedYear(prev => prev + 1);
                            } else {
                              setSelectedMonth(prev => prev + 1);
                            }
                          }}
                          className={`p-2.5 rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white' : 'border-black/5 bg-black/5 hover:bg-black/10 text-black'} transition-all`}
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>

                      <div className="text-xs text-[#ddc1ae] hidden sm:block opacity-70">
                        Clique em uma data para agendar
                      </div>
                    </div>

                    {/* Weekday Grid Header */}
                    <div className="grid grid-cols-7 gap-2 text-center">
                      {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((w, idx) => (
                        <div key={idx} className={`p-2 font-bold uppercase tracking-wider text-[11px] ${idx === 0 || idx === 6 ? 'text-[#a48c7a]' : 'text-[#ffb77d]'}`}>
                          {w}
                        </div>
                      ))}
                    </div>

                    {/* Monthly Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2 md:gap-3">
                      {/* Blank Offset Days */}
                      {Array.from({ length: new Date(selectedYear, selectedMonth, 1).getDay() }).map((_, idx) => (
                        <div 
                          key={`empty-${idx}`} 
                          className={`h-14 md:h-32 rounded-xl md:rounded-2xl border ${theme === 'dark' ? 'bg-[#151515]/30 border-white/5' : 'bg-black/[0.01] border-black/5'} opacity-20`}
                        />
                      ))}

                      {/* Actual Day Tiles */}
                      {Array.from({ length: new Date(selectedYear, selectedMonth + 1, 0).getDate() }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const dateStr = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
                        const dayApts = appointments.filter(a => 
                          a.date.split('T')[0] === dateStr && 
                          a.status !== 'cancelled' &&
                          (selectedProfessionalFilter === 'all' || a.professional_id === selectedProfessionalFilter)
                        );
                        const isDayToday = new Date().getDate() === dayNum && new Date().getMonth() === selectedMonth && new Date().getFullYear() === selectedYear;

                        const isDayClosed = (() => {
                          try {
                            const dateObj = new Date(dateStr + 'T12:00:00');
                            const dayIdx = dateObj.getDay();
                            const dayName = weekdayKeys[dayIdx];
                            const { hours } = parseBarbershopAddress(user?.shop?.address);
                            return hours[dayName]?.closed;
                          } catch (e) {
                            return false;
                          }
                        })();

                        const isSelected = selectedCalendarDay === dateStr;

                        return (
                          <div 
                            key={dayNum} 
                            onClick={() => setSelectedCalendarDay(dateStr)}
                            className={`h-14 md:h-36 rounded-xl md:rounded-2xl border p-1 md:p-2 text-left flex flex-col justify-between transition-all group cursor-pointer relative overflow-hidden ${
                              isSelected
                                ? theme === 'dark'
                                  ? 'bg-[#ffb77d]/10 border-[#ffb77d] ring-2 ring-[#ffb77d]/30'
                                  : 'bg-[#fff5eb] border-[#ffb77d] ring-2 ring-[#ffb77d]/20'
                                : isDayClosed
                                  ? theme === 'dark'
                                    ? 'bg-[#121212]/30 border-white/5 opacity-55'
                                    : 'bg-black/[0.04] border-black/5 opacity-55'
                                  : theme === 'dark' 
                                    ? 'bg-[#1c1b1b] border-white/5 hover:border-[#ffb77d]/30 hover:bg-[#20201f]' 
                                    : 'bg-white border-black/5 hover:border-[#ffb77d]/50 hover:bg-[#fff9f4] shadow-sm'
                            }`}
                          >
                            {/* Day Header Row */}
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-1">
                                {isDayToday ? (
                                  <span className="flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-lg md:rounded-xl bg-[#ffb77d] text-[#4d2600] font-black text-[10px] md:text-xs shadow-md shadow-[#ffb77d]/20 scale-105">
                                    {dayNum}
                                  </span>
                                ) : (
                                  <span className={`font-bold text-xs md:text-sm ${theme === 'dark' ? 'text-white/80' : 'text-black/80'}`}>
                                    {dayNum}
                                  </span>
                                )}

                                {isDayClosed && (
                                  <span className="text-[7.5px] md:text-[9px] font-black px-1 md:px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/15 uppercase tracking-wider scale-95 origin-left hidden md:inline">
                                    Fechado
                                  </span>
                                )}
                              </div>

                              {/* Mobile badge representation showing count of appointments */}
                              {dayApts.length > 0 && (
                                <span className={`md:hidden flex items-center justify-center text-[9px] font-black w-5 h-5 rounded-full ${
                                  isSelected 
                                    ? 'bg-[#ffb77d] text-[#4d2600]' 
                                    : 'bg-[#ffb77d] text-[#4d2600]'
                                } shadow-xs ring-2 ring-[#ffb77d]/10`}>
                                  {dayApts.length}
                                </span>
                              )}
                            </div>

                            {/* Desktop Appointments List inside cell */}
                            <div className="hidden md:flex flex-col gap-1 mt-1.5 overflow-y-auto max-h-[82px] pr-0.5 scrollbar-thin">
                              {dayApts.slice(0, 3).map((a) => {
                                const timeStr = a.time.slice(0, 5);
                                return (
                                  <div 
                                    key={a.id} 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingAppointment(a);
                                      setNewAppointment({
                                        customer_name: a.customer_name,
                                        customer_phone: a.customer_phone || '',
                                        service_id: a.service_id,
                                        professional_id: a.professional_id,
                                        date: a.date.split('T')[0],
                                        time: a.time.slice(0, 5)
                                      });
                                      setIsAppointmentModalOpen(true);
                                    }}
                                    className={`text-[10px] p-1 rounded-lg border font-medium truncate flex items-center justify-between text-left transition-all ${
                                      getProfessionalColorStyles(a.professional_id, professionals, theme)
                                    }`}
                                    title={`${timeStr} - ${a.customer_name} / ${a.professional?.name || professionals.find(p => p.id === a.professional_id)?.name || 'Profissional'} (${a.service?.name || "Serviço"})`}
                                  >
                                    <span className="truncate font-black mr-1 shrink-0">{timeStr}</span>
                                    <span className="truncate flex-grow opacity-95">
                                      {a.customer_name} / {a.professional?.name || professionals.find(p => p.id === a.professional_id)?.name || 'Prof'}
                                    </span>
                                  </div>
                                );
                              })}
                              {dayApts.length > 3 && (
                                <span className="text-[9px] font-black text-[#ffb77d] text-center block mt-0.5 uppercase tracking-widest opacity-80">
                                  + {dayApts.length - 3} mais
                                </span>
                              )}
                            </div>

                            {/* Background touch info */}
                            <div className="absolute right-2 bottom-2 text-[9px] opacity-0 group-hover:opacity-40 transition-opacity hidden md:block">
                              Selecionar
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Compact Daily Agenda panel - vital for mobile and highly convenient for desktop */}
                    <div className={`mt-6 p-5 rounded-2xl border ${
                      theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5 shadow-sm'
                    }`}>
                      {/* Section Header */}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-dashed border-white/10 pb-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb77d] animate-pulse" />
                            <h4 className="font-black text-sm uppercase tracking-wider text-[#ffb77d] font-sans">
                              Atendimentos Selecionados
                            </h4>
                          </div>
                          <p className={`text-xs ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} opacity-80 mt-0.5 font-semibold`}>
                            Agenda para o dia {(() => {
                              try {
                                return new Date(selectedCalendarDay + 'T12:00:00').toLocaleDateString('pt-BR', {
                                  weekday: 'long',
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                });
                              } catch(e) {
                                return selectedCalendarDay;
                              }
                            })()}
                          </p>
                        </div>

                        {(() => {
                          const isDayClosed = (() => {
                            try {
                              const dateObj = new Date(selectedCalendarDay + 'T12:00:00');
                              const dayIdx = dateObj.getDay();
                              const dayName = weekdayKeys[dayIdx];
                              const { hours } = parseBarbershopAddress(user?.shop?.address);
                              return hours[dayName]?.closed;
                            } catch (e) {
                              return false;
                            }
                          })();

                          const isDayBlocked = (() => {
                            try {
                              const { extras } = parseBarbershopAddress(user?.shop?.address);
                              const dayBlocks = extras?.blocks || [];
                              return dayBlocks.some(b => 
                                b.date === selectedCalendarDay && 
                                b.allDay && 
                                (b.type === 'shop' || (b.type === 'barber' && b.professionalId === (user?.role === 'professional' ? user.id : undefined)))
                              );
                            } catch (e) {
                              return false;
                            }
                          })();

                          if (isDayClosed) {
                            return (
                              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/25 rounded-xl text-xs font-black uppercase tracking-wider">
                                🔒 FECHADO NESTE DIA
                              </div>
                            );
                          }

                          if (isDayBlocked) {
                            return (
                              <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/25 rounded-xl text-xs font-black uppercase tracking-wider">
                                🚫 DIA BLOQUEADO
                              </div>
                            );
                          }

                          return (
                            <button 
                              onClick={() => handleOpenNewAppointment(selectedCalendarDay)}
                              className="bg-[#ffb77d]/10 hover:bg-[#ffb77d]/20 text-[#ffb77d] border border-[#ffb77d]/30 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
                            >
                              <Plus size={14} />
                              Agendar neste dia
                            </button>
                          );
                        })()}
                      </div>

                      {/* Appointments List for selected calendar day */}
                      {(() => {
                        const dayApts = appointments.filter(a => 
                          a.date.split('T')[0] === selectedCalendarDay && 
                          a.status !== 'cancelled' &&
                          (selectedProfessionalFilter === 'all' || a.professional_id === selectedProfessionalFilter)
                        );
                        if (dayApts.length === 0) {
                          return (
                            <div className="py-8 text-center text-xs opacity-50 font-bold italic">
                              Nenhum agendamento ativo registrado para esta data.
                            </div>
                          );
                        }

                        // Sort appointments of the day by time ascending
                        const sortedDayApts = [...dayApts].sort((a, b) => a.time.localeCompare(b.time));

                        return (
                          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                            {sortedDayApts.map((apt) => {
                              const timeStr = apt.time.slice(0, 5);
                              return (
                                <div 
                                  key={apt.id}
                                  onClick={() => {
                                    setEditingAppointment(apt);
                                    setNewAppointment({
                                      customer_name: apt.customer_name,
                                      customer_phone: apt.customer_phone || '',
                                      service_id: apt.service_id,
                                      professional_id: apt.professional_id,
                                      date: apt.date.split('T')[0],
                                      time: apt.time.slice(0, 5)
                                    });
                                    setIsAppointmentModalOpen(true);
                                  }}
                                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all hover:brightness-110 hover:scale-[1.005] ${
                                    theme === 'dark' 
                                      ? 'bg-black/20 border-white/5 hover:bg-black/30' 
                                      : 'bg-black/[0.015] border-black/5 hover:bg-black/[0.035] shadow-xs'
                                  }`}
                                >
                                  {/* Left: Horário & Cliente */}
                                  <div className="flex items-center gap-3">
                                    <div className="px-3 py-2 rounded-lg bg-[#ffb77d]/10 text-[#ffb77d] font-black text-xs tracking-tight font-mono border border-[#ffb77d]/15 shrink-0">
                                      {timeStr}
                                    </div>
                                    <div className="min-w-0">
                                      <h5 className="font-extrabold text-[#ffb77d] text-sm truncate">{apt.customer_name}</h5>
                                      {apt.customer_phone && (
                                        <p className="text-xs opacity-50 truncate font-mono mt-0.5">{apt.customer_phone}</p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Middle: Serviço & Profissional */}
                                  <div className="flex flex-wrap gap-2 items-center text-xs">
                                    <span className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] ${
                                      theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-100 border-black/5 text-black'
                                    }`}>
                                      ✂️ {apt.service?.name || 'Serviço'}
                                    </span>
                                    {apt.professional?.name && (
                                      <span className="px-2.5 py-1 rounded-lg bg-[#ddc1ae]/10 text-[#ddc1ae] font-black text-[10px] border border-[#ddc1ae]/10">
                                        👤 {apt.professional.name}
                                      </span>
                                    )}
                                    <span className="opacity-50 text-[10.5px]">• {apt.service?.duration_minutes || 30} min</span>
                                  </div>

                                  {/* Right: Status e Ações */}
                                  <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto border-t sm:border-t-0 pt-2.5 sm:pt-0 border-white/5">
                                    <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-wider border shrink-0 ${
                                      apt.status === 'completed' || (new Date(`${apt.date}T${apt.time}:00.000-03:00`).getTime() < Date.now())
                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/15'
                                        : 'bg-green-500/10 text-green-400 border-green-500/15'
                                    }`}>
                                      {apt.status === 'completed' || (new Date(`${apt.date}T${apt.time}:00.000-03:00`).getTime() < Date.now()) ? 'Realizado' : 'Amanhã/Pendente'}
                                    </span>
                                    <span className="text-[10px] font-black text-[#ffb77d] uppercase tracking-wider group-hover:underline hidden sm:block">
                                      Editar Atendimento &rarr;
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ) : (
                  /* Standard List Table View */
                  <div className={`overflow-x-auto ${theme === 'dark' ? 'bg-[#20201f] border-white/10' : 'bg-white border-black/5 shadow-sm'} rounded-2xl border`}>
                    <table className="w-full text-left min-w-[800px]">
                      <thead>
                        <tr className={`${theme === 'dark' ? 'bg-[#2a2a2a] border-white/10' : 'bg-[#fcfcfc] border-black/5'} border-b transition-colors`}>
                          <th className="p-4 text-xs font-bold text-[#ffb77d] uppercase tracking-widest">Horário</th>
                          <th className="p-4 text-xs font-bold text-[#ffb77d] uppercase tracking-widest">Data</th>
                          <th className="p-4 text-xs font-bold text-[#ffb77d] uppercase tracking-widest">Cliente</th>
                          <th className="p-4 text-xs font-bold text-[#ffb77d] uppercase tracking-widest">Serviço</th>
                          {user.role === 'barber' && <th className="p-4 text-xs font-bold text-[#ffb77d] uppercase tracking-widest">Profissional</th>}
                          <th className="p-4 text-xs font-bold text-[#ffb77d] uppercase tracking-widest">Status</th>
                          <th className="p-4 text-xs font-bold text-[#ffb77d] uppercase tracking-widest text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {appointments.length > 0 ? (
                          // Sort by date then time descendente
                          [...appointments]
                            .filter(a => selectedProfessionalFilter === 'all' || a.professional_id === selectedProfessionalFilter)
                            .sort((a,b) => b.date.localeCompare(a.date) || a.time.localeCompare(b.time))
                            .map((apt) => (
                            <tr key={apt.id} className={`border-b ${theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-black/5 hover:bg-black/5'} transition-colors`}>
                              <td className="p-4 font-black text-[#ffb77d] text-base">{apt.time.slice(0, 5)}</td>
                              <td className="p-4">{new Date(apt.date + 'T12:00:00').toLocaleDateString('pt-BR')}</td>
                              <td className="p-4 font-bold">
                                <div>{apt.customer_name}</div>
                                {apt.customer_phone && <div className="text-xs opacity-50 font-normal">{apt.customer_phone}</div>}
                              </td>
                              <td className="p-4">
                                <div className="font-semibold">{apt.service?.name || 'Serviço'}</div>
                                <div className="text-xs text-[#ffb77d]">{apt.service?.duration_minutes || 30} min</div>
                              </td>
                              {user.role === 'barber' && <td className="p-4 font-bold text-[#ddc1ae]">{apt.professional?.name || 'Não assinalado'}</td>}
                              <td className="p-4">
                                {(() => {
                                  const apptDateTime = new Date(`${apt.date}T${apt.time}:00.000-03:00`);
                                  const isPassed = apt.status !== 'cancelled' && apptDateTime.getTime() < Date.now();
                                  const isRealizado = apt.status === 'completed' || isPassed;
                                  
                                  return (
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                                      apt.status === 'cancelled'
                                        ? 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                        : isRealizado
                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        : apt.status === 'confirmed'
                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                        : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                    }`}>
                                      {apt.status === 'cancelled' ? 'CANCELADO' : isRealizado ? 'REALIZADO' : apt.status === 'confirmed' ? 'CONFIRMADO' : 'PENDENTE'}
                                    </span>
                                  );
                                })()}
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex gap-2 justify-end">
                                  {apt.status === 'pending' && (
                                    <button 
                                      onClick={() => handleUpdateAppointmentStatus(apt.id, 'confirmed')}
                                      className="px-2.5 py-1.5 bg-green-500/10 text-green-400 text-xs font-bold rounded-lg border border-green-500/25 hover:bg-green-500/20 transition-all uppercase"
                                    >
                                      Confirmar
                                    </button>
                                  )}
                                  {apt.status === 'confirmed' && (
                                    <button 
                                      onClick={() => handleUpdateAppointmentStatus(apt.id, 'completed')}
                                      className="px-2.5 py-1.5 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/25 hover:bg-blue-500/20 transition-all uppercase"
                                    >
                                      Concluir
                                    </button>
                                  )}
                                  {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                                    <button 
                                      onClick={() => triggerCancelConfirmation(apt, false)}
                                      className="px-2.5 py-1.5 bg-red-500/10 text-red-400 text-xs font-bold rounded-lg border border-red-500/25 hover:bg-red-500/20 transition-all uppercase"
                                      title="Cancelar"
                                    >
                                      Cancelar
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => {
                                      setEditingAppointment(apt);
                                      setNewAppointment({
                                        customer_name: apt.customer_name,
                                        customer_phone: apt.customer_phone || '',
                                        service_id: apt.service_id,
                                        professional_id: apt.professional_id,
                                        date: apt.date.split('T')[0],
                                        time: apt.time.slice(0, 5)
                                      });
                                      setIsAppointmentModalOpen(true);
                                    }}
                                    className="p-1.5 hover:bg-white/5 rounded-lg text-white"
                                    title="Editar"
                                  >
                                    <Edit3 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={user.role === 'barber' ? 7 : 6} className={`p-12 text-center ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'}`}>
                              Nenhum agendamento encontrado.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {view === 'services' && user.role === 'barber' && (
              <motion.div
                key="services"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className={`flex justify-between items-end border-b ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} pb-4`}>
                  <div>
                    <h2 className="text-2xl font-bold uppercase tracking-tighter">Serviços</h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'}`}>Cadastre os serviços oferecidos pela sua unidade.</p>
                  </div>
                  <button 
                    onClick={() => setIsServiceModalOpen(true)}
                    className="bg-[#ffb77d] text-[#4d2600] px-6 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-[#ffb77d]/20"
                  >
                    <Plus size={18} />
                    NOVO SERVIÇO
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {services.length > 0 ? services.map(service => (
                    <div key={service.id} className={`${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5 shadow-sm'} p-6 rounded-2xl border hover:border-[#ffb77d]/50 transition-all group`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-[#C5A059]/10 rounded-xl flex items-center justify-center text-[#C5A059]">
                          <Sparkles size={24} />
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => {
                            setEditingService(service);
                            setNewService({ name: service.name, price: service.price, duration_minutes: service.duration_minutes });
                            setIsServiceModalOpen(true);
                          }} className="p-2 hover:bg-[#ffb77d]/10 text-[#ffb77d] rounded-lg">
                            <Edit3 size={16} />
                          </button>
                          <button onClick={() => setDeletingService(service)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-lg">{service.name}</h4>
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Valor</p>
                          <p className="text-xl font-black text-[#ffb77d]">R$ {service.price}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Duração</p>
                          <p className={`font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'}`}>{service.duration_minutes} min</p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-[#ffb77d]/10 rounded-3xl opacity-50">
                      <Box size={48} className="text-[#ffb77d] mx-auto mb-4" />
                      <p className="font-bold">Nenhum serviço cadastrado.</p>
                      <p className="text-sm">Comece cadastrando seu primeiro serviço no botão acima.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {view === 'barbershop-subscriptions' && user.role === 'barber' && (
              <motion.div
                key="barbershop-subscriptions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className={`flex justify-between items-end border-b ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} pb-4`}>
                  <div>
                    <h2 className="text-2xl font-bold uppercase tracking-tighter">Assinaturas</h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'}`}>Crie e gerencie planos de assinatura para seus clientes fiéis.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingSubscriptionPlan(null);
                      setNewSubscriptionPlanForm({ name: '', price: '', limit_count: '4', service_id: services[0]?.id || '' });
                      setIsSubscriptionPlanModalOpen(true);
                    }}
                    className="bg-[#ffb77d] text-[#4d2600] px-6 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-[#ffb77d]/20"
                  >
                    <Plus size={18} />
                    NOVO PLANO
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {subscriptionPlans.length > 0 ? subscriptionPlans.map(plan => (
                    <div key={plan.id} className={`${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5 shadow-sm'} p-6 rounded-2xl border hover:border-[#ffb77d]/50 transition-all group`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-[#ffb77d]/10 rounded-xl flex items-center justify-center text-[#ffb77d]">
                          <CreditCard size={24} />
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            type="button"
                            onClick={() => {
                              setEditingSubscriptionPlan(plan);
                              setNewSubscriptionPlanForm({
                                name: plan.name,
                                price: plan.price.toString(),
                                limit_count: plan.limit_count.toString(),
                                service_id: plan.service_id
                              });
                              setIsSubscriptionPlanModalOpen(true);
                            }} 
                            className={`p-2 ${theme === 'dark' ? 'hover:bg-white/5 text-[#ddc1ae]' : 'hover:bg-black/5 text-[#a48c7a]'} rounded-lg transition-colors`}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPlanToDelete(plan);
                            }} 
                            className="p-2.5 hover:bg-red-500/10 text-red-500 rounded-xl transition-all active:scale-90 cursor-pointer shadow-sm hover:shadow-red-500/20"
                            title="Excluir Plano"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <h4 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-[#4d2600]'}`}>{plan.name}</h4>
                      <div className="mt-2 flex items-center gap-2">
                         <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${theme === 'dark' ? 'bg-white/5 text-[#ddc1ae]' : 'bg-black/5 text-[#a48c7a]'}`}>
                            {plan.service?.name || 'Serviço não encontrado'}
                         </span>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>Valor Mensal</p>
                          <p className="text-xl font-black text-[#ffb77d]">R$ {plan.price}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-[10px] font-bold uppercase tracking-widest text-black`}>Agendamentos</p>
                          <p className={`font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#4d2600]'}`}>{plan.limit_count}x /mês</p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-[#ffb77d]/10 rounded-3xl opacity-50">
                      <CreditCard size={48} className="text-[#ffb77d] mx-auto mb-4" />
                      <p className="font-bold">Nenhum plano de assinatura criado.</p>
                      <p className="text-sm">Comece criando seu primeiro plano de assinatura no botão acima.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {view === 'settings' && user.role === 'barber' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Header Section */}
                <div className={`flex justify-between items-end border-b ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} pb-4`}>
                  <div>
                    <h2 className="text-2xl font-bold uppercase tracking-tighter flex items-center gap-2">
                      <Settings size={24} className="text-[#ffb77d]" />
                      Configurações do Estabelecimento
                    </h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'}`}>
                      Gerencie as informações da unidade e defina os horários de expediente flexíveis.
                    </p>
                  </div>
                </div>

                {/* Subdivisions Tab Navigation */}
                <div className="flex gap-2 p-1 border rounded-xl w-fit max-w-full overflow-x-auto shrink-0 bg-opacity-20 backdrop-blur-sm shadow-inner border-white/5 bg-black/10">
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsSuccess(null);
                      setSettingsError(null);
                      setSettingsTab('general');
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                      settingsTab === 'general'
                        ? 'bg-[#ffb77d] text-[#4d2600]'
                        : theme === 'dark'
                          ? 'text-[#ddc1ae] hover:bg-white/5'
                          : 'text-[#a48c7a] hover:bg-black/5'
                    }`}
                  >
                    <Store size={14} />
                    Dados da Unidade
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsSuccess(null);
                      setSettingsError(null);
                      setSettingsTab('hours');
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                      settingsTab === 'hours'
                        ? 'bg-[#ffb77d] text-[#4d2600]'
                        : theme === 'dark'
                          ? 'text-[#ddc1ae] hover:bg-white/5'
                          : 'text-[#a48c7a] hover:bg-black/5'
                    }`}
                  >
                    <Calendar size={14} />
                    Dias e Horários de Funcionamento
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsSuccess(null); setSettingsError(null); setSettingsTab('portal'); }}> <Globe size={14} />
                    Link de Agendamento Online
                  </button>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-6">
                  {settingsSuccess && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-start gap-3 text-sm font-semibold animate-fadeIn">
                      <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                      <span>{settingsSuccess}</span>
                    </div>
                  )}

                  {settingsError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 text-sm font-semibold animate-fadeIn">
                      <AlertCircle size={18} className="shrink-0 mt-0.5" />
                      <span>{settingsError}</span>
                    </div>
                  )}

                  {settingsTab === 'general' && (
                    <motion.div
                      key="general-settings"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5 shadow-sm'} space-y-6`}
                    >
                      <h3 className="text-lg font-bold text-[#ffb77d] uppercase tracking-wider mb-2">Informações Gerais</h3>
                      
                      <div className="space-y-1">
                        <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>
                          Nome da Unidade
                        </label>
                        <input
                          required
                          type="text"
                          className={`w-full ${theme === 'dark' ? 'bg-[#131313] text-white' : 'bg-[#f5f5f5] text-black'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ffb77d] transition-all`}
                          placeholder="Ex: Queen Agenda"
                          value={settingsForm.name}
                          onChange={e => setSettingsForm({ ...settingsForm, name: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>
                          Endereço Completo
                        </label>
                        <input
                          required
                          type="text"
                          className={`w-full ${theme === 'dark' ? 'bg-[#131313] text-white' : 'bg-[#f5f5f5] text-black'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ffb77d] transition-all`}
                          placeholder="Ex: Av. Principal, 123 - Centro"
                          value={settingsForm.address}
                          onChange={e => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>
                          Telefone de Contato
                        </label>
                        <input
                          required
                          type="text"
                          className={`w-full ${theme === 'dark' ? 'bg-[#131313] text-white' : 'bg-[#f5f5f5] text-black'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ffb77d] transition-all`}
                          placeholder="Ex: (11) 99999-9999"
                          value={settingsForm.phone}
                          onChange={e => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        />
                      </div>



                          {/* --- ESPAÇOS DE UPLOAD DE IMAGENS --- */}
                      <div className={`pt-6 border-t ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} space-y-4`}>
                        <div className="flex items-center gap-2">
                          <ImageIcon size={18} className="text-[#ffb77d]" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-[#ffb77d]">Imagens e Identidade Visual</h4>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-white/50' : 'text-black/50'} -mt-2`}>
                          Carregue a marca da sua unidade para personalizar as telas do sistema e aproximar ainda mais os seus clientes.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          {/* LOGO DA BARBEARIA (1080x1080 px) */}
                          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#131313]/50 border-white/5' : 'bg-[#fbfbfb] border-black/5'} space-y-3 flex flex-col justify-between`}>
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Logo da Unidade</span>
                                {settingsForm.logoUrl && (
                                  <button 
                                    type="button"
                                    onClick={() => setSettingsForm({ ...settingsForm, logoUrl: '' })}
                                    className="text-[9px] text-red-500 font-extrabold hover:underline uppercase tracking-wider"
                                  >
                                    Remover
                                  </button>
                                )}
                              </div>
                              <p className={`text-[9px] ${theme === 'dark' ? 'text-white/40' : 'text-black/40'} uppercase tracking-wider font-semibold`}>
                                Formato ideal: 1080x1080 px (Quadrado)
                              </p>
                            </div>

                            <div className={`mt-2 h-44 rounded-xl border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden transition-all ${
                              theme === 'dark' 
                                ? 'border-white/10 bg-[#161616] hover:border-[#ffb77d]/30' 
                                : 'border-black/5 bg-black/[0.01] hover:border-[#ffb77d]/50 shadow-inner'
                            }`}>
                              {settingsForm.logoUrl ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-3 gap-2 bg-black/45 backdrop-blur-[1px] group">
                                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-[#1e1e1e] relative">
                                    <img 
                                      src={settingsForm.logoUrl} 
                                      alt="Logo" 
                                      className="w-full h-full object-cover" 
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <span className="text-[9px] font-black text-white bg-black/40 px-2 py-0.5 rounded uppercase tracking-wider">Logo Ativa</span>
                                  
                                  {/* Overlay for quick hover update */}
                                  <label className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer gap-1.5 p-2 text-center">
                                    <UploadCloud size={20} className="text-[#ffb77d]" />
                                    <span className="text-[10px] font-bold text-[#ffb77d] uppercase tracking-wider">Substituir Imagem</span>
                                    <input 
                                      type="file" 
                                      accept="image/*" 
                                      className="sr-only" 
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const compressed = await resizeImage(file, 400, 400);
                                          setSettingsForm(prev => ({ ...prev, logoUrl: compressed }));
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
                              ) : (
                                <label className="cursor-pointer text-center space-y-1.5 flex flex-col items-center p-4 w-full h-full justify-center">
                                  <div className="w-10 h-10 rounded-xl bg-[#ffb77d]/10 flex items-center justify-center text-[#ffb77d] shadow-sm">
                                    <UploadCloud size={20} />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-[#ffb77d] uppercase tracking-wide">Escolher Logo</p>
                                    <p className={`text-[8px] uppercase tracking-wider ${theme === 'dark' ? 'text-white/30' : 'text-black/30'} mt-0.5 font-bold`}>
                                      Clique ou Solte o Arquivo
                                    </p>
                                  </div>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="sr-only" 
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const compressed = await resizeImage(file, 400, 400);
                                        setSettingsForm(prev => ({ ...prev, logoUrl: compressed }));
                                      }
                                    }}
                                  />
                                </label>
                              )}
                            </div>
                          </div>

                          {/* BANNER DE RECADOS DA BARBEARIA (1200x480 px ou 1200x400 px) */}
                          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#131313]/50 border-white/5' : 'bg-[#fbfbfb] border-black/5'} space-y-3 flex flex-col justify-between`}>
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Banner da Unidade</span>
                                {settingsForm.bannerUrl && (
                                  <button 
                                    type="button"
                                    onClick={() => setSettingsForm({ ...settingsForm, bannerUrl: '' })}
                                    className="text-[9px] text-red-500 font-extrabold hover:underline uppercase tracking-wider"
                                  >
                                    Remover
                                  </button>
                                )}
                              </div>
                              <p className={`text-[9px] ${theme === 'dark' ? 'text-white/40' : 'text-black/40'} uppercase tracking-wider font-semibold`}>
                                Sugerido: 1200x400 px (Horizontal/Estreito)
                              </p>
                            </div>

                            <div className={`mt-2 h-44 rounded-xl border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden transition-all ${
                              theme === 'dark' 
                                ? 'border-white/10 bg-[#161616] hover:border-[#ffb77d]/30' 
                                : 'border-black/5 bg-black/[0.01] hover:border-[#ffb77d]/50 shadow-inner'
                            }`}>
                              {settingsForm.bannerUrl ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-3 gap-2 bg-black/45 backdrop-blur-[1px] group">
                                  <div className="w-full h-24 rounded-lg overflow-hidden border border-white/20 shadow-xl bg-[#1e1e1e] relative">
                                    <img 
                                      src={settingsForm.bannerUrl} 
                                      alt="Banner" 
                                      className="w-full h-full object-cover" 
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <span className="text-[9px] font-black text-white bg-black/40 px-2 py-0.5 rounded uppercase tracking-wider">Banner Ativo</span>
                                  
                                  {/* Overlay for quick hover update */}
                                  <label className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer gap-1.5 p-2 text-center">
                                    <UploadCloud size={20} className="text-[#ffb77d]" />
                                    <span className="text-[10px] font-bold text-[#ffb77d] uppercase tracking-wider">Substituir Imagem</span>
                                    <input 
                                      type="file" 
                                      accept="image/*" 
                                      className="sr-only" 
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const compressed = await resizeImage(file, 800, 266);
                                          setSettingsForm(prev => ({ ...prev, bannerUrl: compressed }));
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
                              ) : (
                                <label className="cursor-pointer text-center space-y-1.5 flex flex-col items-center p-4 w-full h-full justify-center">
                                  <div className="w-10 h-10 rounded-xl bg-[#ffb77d]/10 flex items-center justify-center text-[#ffb77d] shadow-sm">
                                    <UploadCloud size={20} />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-[#ffb77d] uppercase tracking-wide">Escolher Banner</p>
                                    <p className={`text-[8px] uppercase tracking-wider ${theme === 'dark' ? 'text-white/30' : 'text-black/30'} mt-0.5 font-bold`}>
                                      Clique ou Solte o Arquivo
                                    </p>
                                  </div>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="sr-only" 
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const compressed = await resizeImage(file, 800, 266);
                                        setSettingsForm(prev => ({ ...prev, bannerUrl: compressed }));
                                      }
                                    }}
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* --- BIOGRAFIA DA UNIDADE --- */}
                      <div className={`pt-6 border-t ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} space-y-3`}>
                        <div className="flex items-center gap-2">
                          <UserCircle size={18} className="text-[#ffb77d]" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-[#C5A059]">Biografia da Unidade</h4>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-white/50' : 'text-black/50'} -mt-1`}>
                          Uma descrição curta que aparecerá na página do cliente como boas-vindas. Conte um pouco do seu estilo ou história.
                        </p>
                        <div className="relative">
                          <textarea
                            rows={3}
                            maxLength={180}
                            className={`w-full ${theme === 'dark' ? 'bg-[#131313] text-white font-medium' : 'bg-[#f5f5f5] text-black font-medium'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 text-xs focus:outline-none focus:border-[#ffb77d] transition-all resize-none`}
                            placeholder="Escreva uma breve biografia da sua unidade (ex: Há mais de 10 anos oferecendo o melhor atendimento..."
                            value={settingsForm.bio}
                            onChange={e => setSettingsForm({ ...settingsForm, bio: e.target.value.slice(0, 180) })}
                          />
                          <span className={`absolute bottom-2.5 right-3 text-[9px] font-mono font-bold ${
                            (settingsForm.bio?.length || 0) >= 160 ? 'text-amber-500' : 'opacity-40'
                          }`}>
                            {settingsForm.bio?.length || 0} / 180
                          </span>
                        </div>
                      </div>

                      {/* --- TRÊS FOTOS DA UNIDADE PARA CARROSSEL --- */}
                      <div className={`pt-6 border-t ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} space-y-4`}>
                        <div className="flex items-center gap-2">
                          <ImageIcon size={18} className="text-[#ffb77d]" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-[#C5A059]">Fotos da Unidade (Carrossel)</h4>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-white/50' : 'text-black/50'} -mt-2`}>
                          Carregue até 3 fotos do seu estabelecimento (espaço interno, detalhes, etc.) que serão exibidas em um carrossel interativo na página de agendamento do cliente.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                          {[1, 2, 3].map((num) => {
                            const photoField = `photo${num}` as 'photo1' | 'photo2' | 'photo3';
                            const currentPhotoUrl = settingsForm[photoField];

                            return (
                              <div key={num} className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-[#131313]/50 border-white/5' : 'bg-[#fbfbfb] border-black/5'} space-y-2.5 flex flex-col justify-between`}>
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Foto {num}</span>
                                  {currentPhotoUrl && (
                                    <button 
                                      type="button"
                                      onClick={() => setSettingsForm({ ...settingsForm, [photoField]: '' })}
                                      className="text-[9px] text-red-500 font-extrabold hover:underline uppercase tracking-wider"
                                    >
                                      Remover
                                    </button>
                                  )}
                                </div>

                                <div className={`h-28 rounded-lg border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden transition-all ${
                                  theme === 'dark' 
                                    ? 'border-white/10 bg-[#161616] hover:border-[#ffb77d]/30' 
                                    : 'border-black/5 bg-black/[0.01] hover:border-[#ffb77d]/50 shadow-inner'
                                }`}>
                                  {currentPhotoUrl ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 backdrop-blur-[1px]">
                                      <img 
                                        src={currentPhotoUrl} 
                                        alt={`Foto ${num}`} 
                                        className="w-full h-full object-cover" 
                                        referrerPolicy="no-referrer"
                                      />
                                      <label className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer p-2 text-center">
                                        <UploadCloud size={16} className="text-[#ffb77d] mb-1" />
                                        <span className="text-[8px] font-black text-[#ffb77d] uppercase tracking-widest">Alterar</span>
                                        <input 
                                          type="file" 
                                          accept="image/*" 
                                          className="sr-only" 
                                          onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const compressed = await resizeImage(file, 600, 400);
                                              setSettingsForm(prev => ({ ...prev, [photoField]: compressed }));
                                            }
                                          }}
                                        />
                                      </label>
                                    </div>
                                  ) : (
                                    <label className="cursor-pointer text-center space-y-1 flex flex-col items-center p-2.5 w-full h-full justify-center">
                                      <div className="w-8 h-8 rounded-lg bg-[#ffb77d]/10 flex items-center justify-center text-[#ffb77d] shadow-sm">
                                        <UploadCloud size={16} />
                                      </div>
                                      <div>
                                        <span className="text-[9px] font-bold text-[#ffb77d] uppercase tracking-wide font-sans">Upload</span>
                                      </div>
                                      <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="sr-only" 
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            const compressed = await resizeImage(file, 600, 400);
                                            setSettingsForm(prev => ({ ...prev, [photoField]: compressed }));
                                          }
                                        }}
                                      />
                                    </label>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {settingsTab === 'hours' && (
                    <motion.div
                      key="hours-settings"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-amber-500/5 border-amber-500/10 text-amber-300' : 'bg-amber-100/30 border-amber-200 text-[#4d2600]'} text-xs leading-relaxed`}>
                        <p className="font-bold flex items-center gap-1.5 mb-1">
                          <AlertCircle size={14} className="shrink-0" />
                          EXPEDIENTE INDEPENDENTE POR DIA
                        </p>
                        Configure horários exclusivos para cada dia da semana. Ative ou desative o funcionamento conforme a necessidade. O sistema impedirá automaticamente qualquer tentativa de marcação fora destes limites.
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dayKeysOrdered.map(dayKey => {
                          const dayObj = settingsHours[dayKey] || defaultOperatingHours[dayKey];
                          return (
                            <div 
                              key={dayKey}
                              className={`p-5 rounded-2xl border transition-all ${
                                dayObj.closed 
                                  ? theme === 'dark'
                                    ? 'bg-[#121212]/30 border-white/5 opacity-60'
                                    : 'bg-black/[0.02] border-black/5 opacity-60'
                                  : theme === 'dark'
                                    ? 'bg-[#1c1b1b] border-[#ffb77d]/10'
                                    : 'bg-white border-black/5 shadow-sm'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                                <span className="font-bold text-sm uppercase tracking-wider">{ptDayNames[dayKey]}</span>
                                
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={!dayObj.closed}
                                    onChange={e => {
                                      setSettingsHours({
                                        ...settingsHours,
                                        [dayKey]: {
                                          ...dayObj,
                                          closed: !e.target.checked
                                        }
                                      });
                                    }}
                                  />
                                  <div className={`w-9 h-5 rounded-full relative transition-all ${
                                    !dayObj.closed ? 'bg-amber-500' : 'bg-white/10'
                                  }`}>
                                    <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-4 w-4 transition-transform ${
                                      !dayObj.closed ? 'translate-x-[16px]' : 'translate-x-0'
                                    }`}></div>
                                  </div>
                                  <span className="ml-2 text-[10px] font-bold uppercase tracking-widest select-none">
                                    {dayObj.closed ? 'Fechado' : 'Aberto'}
                                  </span>
                                </label>
                              </div>

                              {!dayObj.closed ? (
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase opacity-60 tracking-wider">Abertura</label>
                                    <input 
                                      type="time"
                                      required
                                      className={`w-full text-xs ${theme === 'dark' ? 'bg-[#131313] text-white' : 'bg-[#f5f5f5] text-black'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-2.5 focus:outline-none focus:border-[#ffb77d]`}
                                      value={dayObj.open}
                                      onChange={e => {
                                        setSettingsHours({
                                          ...settingsHours,
                                          [dayKey]: {
                                            ...dayObj,
                                            open: e.target.value
                                          }
                                        });
                                      }}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase opacity-60 tracking-wider">Fechamento</label>
                                    <input 
                                      type="time"
                                      required
                                      className={`w-full text-xs ${theme === 'dark' ? 'bg-[#131313] text-white' : 'bg-[#f5f5f5] text-black'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-2.5 focus:outline-none focus:border-[#ffb77d]`}
                                      value={dayObj.close}
                                      onChange={e => {
                                        setSettingsHours({
                                          ...settingsHours,
                                          [dayKey]: {
                                            ...dayObj,
                                            close: e.target.value
                                          }
                                        });
                                      }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="h-[46px] flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl opacity-30 text-[10px] font-bold uppercase tracking-widest">
                                  Sem Expediente
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {settingsTab === 'portal' && (
                    <motion.div
                      key="portal-settings"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5 shadow-sm'} space-y-6`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#ffb77d]/10 rounded-2xl flex items-center justify-center text-[#ffb77d] shadow-sm shrink-0">
                          <Globe size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#ffb77d] uppercase tracking-wider mb-0.5">Seu Canal de Agendamento Online</h3>
                          <p className={`text-xs ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'}`}>
                            Divulgue o link abaixo para seus clientes fazerem login e agendarem sem precisar falar com você.
                          </p>
                        </div>
                      </div>

                      <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-[#121212]' : 'bg-[#f5f5f5]'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/10'} space-y-4 shadow-xl`}>
                        <div className="space-y-1">
                          <h3 className="text-sm font-black uppercase text-[#ffb77d] tracking-wider flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#C5A059]" /> Link para compartilhamento
                          </h3>
                          <p className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-black/60'} leading-relaxed`}>
                            Envie este link para seus clientes ou insira em suas redes sociais para permitir agendamentos online:
                          </p>
                        </div>

                        {/* Single Link Container */}
                        <div className="space-y-4">
                          {(() => {
                            let origin = window.location.origin;
                            const shareUrl = `${origin}/?shop=${user?.shopId}`;

                            return (
                              <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-black/40 border-white/5 hover:border-white/10' : 'bg-white border-black/5 hover:border-black/10'} transition-all space-y-2`}>
                                <div className="flex gap-2 animate-fade-in">
                                  <input
                                    type="text"
                                    readOnly
                                    value={shareUrl}
                                    className={`w-full font-mono text-xs ${theme === 'dark' ? 'bg-zinc-900 text-zinc-300 border-zinc-800' : 'bg-zinc-50 text-zinc-700 border-zinc-200'} border rounded-xl p-3 focus:outline-none select-all`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(shareUrl);
                                      setPortalCopiedLink(true);
                                      setTimeout(() => setPortalCopiedLink(false), 3000);
                                    }}
                                    className="bg-[#ffb77d] text-[#4d2600] px-5 rounded-xl font-bold text-xs hover:brightness-110 shrink-0 transition-all uppercase tracking-wider shadow-sm flex items-center justify-center min-w-[120px]"
                                  >
                                    {portalCopiedLink ? 'Copiado!' : 'Copiar Link'}
                                  </button>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        <div className={`p-4 rounded-xl border-dashed border ${theme === 'dark' ? 'border-white/10 text-white/75 bg-white/[0.01]' : 'border-black/10 text-black/75 bg-black/[0.01]'} text-xs leading-relaxed space-y-2`}>
                          <p className="font-extrabold uppercase text-[#ffb77d] tracking-wider text-[10px] flex items-center gap-1.5">
                            💡 Onde usar este link de agendamento?
                          </p>
                          <ul className="list-disc list-inside space-y-1 ml-1">
                            <li>Insira no link da sua <strong>Bio do Instagram</strong> para facilitar o acesso.</li>
                            <li>Configure nas respostas automáticas do seu <strong>WhatsApp Business</strong>.</li>
                            <li>Adicione ao status do WhatsApp ou envie aos clientes quando pedirem horário.</li>
                          </ul>
                        </div>
                      </div>

                      </motion.div>
                  )}

                  {/* Actions Bar */}
                  <div className={`pt-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} flex justify-end gap-3`}>
                    <button
                      type="button"
                      onClick={() => setView('shop-dashboard')}
                      className={`px-6 py-2.5 rounded-xl font-bold text-sm ${
                        theme === 'dark' ? 'hover:bg-white/5 text-white' : 'hover:bg-black/5 text-[#4d2600]'
                      } transition-all`}
                    >
                      CANCELAR
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      className="bg-[#ffb77d] text-[#4d2600] px-8 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-[#ffb77d]/20 disabled:opacity-50"
                    >
                      {isSavingSettings ? 'SALVANDO...' : 'SALVAR CONFIGURAÇÕES'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {view === 'clientes' && user.role === 'barber' && (
              <motion.div
                key="clientes"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className={`flex flex-col sm:flex-row justify-between sm:items-end border-b ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} pb-4 gap-4`}>
                  <div>
                    <h2 className="text-2xl font-bold uppercase tracking-tighter">Gestão de Clientes</h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'}`}>
                      Visualize a base de clientes cadastrados, histórico de visitas e faça contato direto via WhatsApp.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingClient(null);
                      setNewClientForm({ name: '', phone: '', password: '' });
                      setErrorStatus(null);
                      setIsClientModalOpen(true);
                    }}
                    className="bg-[#ffb77d] text-[#4d2600] px-6 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ffb77d]/20"
                  >
                    <Plus size={18} />
                    NOVO CLIENTE
                  </button>
                </div>

                {/* Cards de Métricas */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className={`${theme === 'dark' ? 'bg-[#1c1b1b]' : 'bg-white'} p-6 rounded-2xl border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} shadow-sm`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Clientes Cadastrados</p>
                    <h3 className="text-3xl font-black text-[#ffb77d] mt-2">{clients.length}</h3>
                    <p className="mt-2 text-[10px] opacity-40 uppercase tracking-widest">Base de dados completa</p>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-[#1c1b1b]' : 'bg-white'} p-6 rounded-2xl border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} shadow-sm`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Fidelizados (2+ cortes)</p>
                    <h3 className="text-3xl font-black text-green-400 mt-2">
                      {clients.filter(c => {
                        const count = appointments.filter(a => a.customer_phone?.replace(/\D/g, '') === c.phone?.replace(/\D/g, '')).length;
                        return count >= 2;
                      }).length}
                    </h3>
                    <p className="mt-2 text-[10px] opacity-40 uppercase tracking-widest">Retorno garantido</p>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-[#1c1b1b]' : 'bg-white'} p-6 rounded-2xl border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} shadow-sm`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Último cadastro</p>
                    <h3 className="text-sm font-bold text-white mt-4 truncate">
                      {clients.length > 0 
                        ? [...clients].sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))[0].name 
                        : "Nenhum cadastrado"}
                    </h3>
                    <p className="mt-2 text-[10px] opacity-40 uppercase tracking-widest">Novidade recente</p>
                  </div>
                </div>

                {/* Filtro de Busca e Datas */}
                <div className="flex flex-col lg:flex-row gap-4 items-end">
                  <div className="relative w-full flex-1">
                    <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} uppercase tracking-widest mb-1.5 block`}>Pesquisar por nome ou telefone</label>
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="Ex: João Silva ou 8199..."
                        value={searchClientQuery}
                        onChange={(e) => setSearchClientQuery(e.target.value)}
                        className={`w-full px-5 py-3 rounded-xl border outline-none font-bold text-sm ${
                          theme === 'dark'
                            ? 'bg-[#151515] border-white/10 text-white focus:border-[#ffb77d]'
                            : 'bg-white border-black/10 text-black focus:border-[#ffb77d]'
                        } transition-all`}
                      />
                      {searchClientQuery && (
                        <button 
                          onClick={() => setSearchClientQuery('')}
                          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="flex-1 lg:w-40">
                      <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} uppercase tracking-widest mb-1.5 block`}>Data Início</label>
                      <input 
                        type="date"
                        value={clientFilterStartDate}
                        onChange={(e) => setClientFilterStartDate(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border outline-none font-bold text-xs ${
                          theme === 'dark'
                            ? 'bg-[#151515] border-white/10 text-white focus:border-[#ffb77d]'
                            : 'bg-white border-black/10 text-black focus:border-[#ffb77d]'
                        } transition-all`}
                      />
                    </div>
                    <div className="flex-1 lg:w-40">
                      <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} uppercase tracking-widest mb-1.5 block`}>Data Fim</label>
                      <input 
                        type="date"
                        value={clientFilterEndDate}
                        onChange={(e) => setClientFilterEndDate(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border outline-none font-bold text-xs ${
                          theme === 'dark'
                            ? 'bg-[#151515] border-white/10 text-white focus:border-[#ffb77d]'
                            : 'bg-white border-black/10 text-black focus:border-[#ffb77d]'
                        } transition-all`}
                      />
                    </div>
                    {(clientFilterStartDate || clientFilterEndDate) && (
                      <button 
                        onClick={() => {
                          setClientFilterStartDate('');
                          setClientFilterEndDate('');
                        }}
                        className={`px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all border ${
                          theme === 'dark' 
                            ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' 
                            : 'bg-red-50 border-red-100 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        Limpar Datas
                      </button>
                    )}
                  </div>
                </div>

                {/* Tabela de Clientes */}
                <div className={`${theme === 'dark' ? 'bg-[#121212] border-white/5' : 'bg-white border-black/5'} rounded-2xl border overflow-hidden shadow-sm`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={`border-b ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-black/5 bg-black/[0.01]'}`}>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest opacity-60">Cliente</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest opacity-60">Plano / Assinatura</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest opacity-60">Uso no Mês</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest opacity-60 text-center">Total Atendimentos</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest opacity-60">Último Atendimento</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest opacity-60 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {clients && clients.length > 0 ? (
                          clients
                            .filter(c => {
                              const search = searchClientQuery.toLowerCase();
                              return c.name?.toLowerCase().includes(search) || c.phone?.includes(search);
                            })
                            .slice((shopClientPage - 1) * 10, shopClientPage * 10)
                            .map(c => {
                              // Contar agendamentos relativos ao telefone dele, considerando o filtro de data
                              let clientAppts = appointments.filter(a => a.customer_phone?.replace(/\D/g, '') === c.phone?.replace(/\D/g, ''));
                              
                              // Aplicar filtros de data se presentes
                              if (clientFilterStartDate) {
                                clientAppts = clientAppts.filter(a => a.date >= clientFilterStartDate);
                              }
                              if (clientFilterEndDate) {
                                clientAppts = clientAppts.filter(a => a.date <= clientFilterEndDate);
                              }

                              const lastAppt = clientAppts.length > 0 
                                ? [...clientAppts].sort((a,b) => b.date.localeCompare(a.date))[0]
                                : null;

                              const cleanPhone = c.phone?.replace(/\D/g, '');
                              const waUrl = cleanPhone 
                                ? `https://wa.me/55${cleanPhone}?text=Olá,%20${encodeURIComponent(c.name)}!%20Tudo%20bem?%20Estamos%20entrando%20em%20contato%20da%20unidade%20${encodeURIComponent(user.shop?.name || 'Queen Agenda')}.%20Gostaria%20de%20agendar%20um%20novo%20horário?`
                                : '';

                              // Calcular uso do plano no mês atual
                              const now = new Date();
                              const currentMonth = now.getMonth();
                              const currentYear = now.getFullYear();
                              
                              const planUsage = c.subscription_plan ? appointments.filter(a => {
                                const aDate = new Date(a.date);
                                return a.customer_phone?.replace(/\D/g, '') === cleanPhone &&
                                       a.service_id === c.subscription_plan.service_id &&
                                       a.status !== 'cancelled' &&
                                       aDate.getMonth() === currentMonth &&
                                       aDate.getFullYear() === currentYear;
                              }).length : 0;

                              return (
                                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                                  <td className="px-6 py-4">
                                    <div>
                                      <p className="font-bold text-sm text-white">{c.name}</p>
                                      {c.phone ? (
                                        <a 
                                          href={waUrl} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-[10px] font-bold text-green-400 hover:underline uppercase tracking-widest flex items-center gap-1"
                                        >
                                          <MessageSquare size={10} />
                                          {c.phone}
                                        </a>
                                      ) : (
                                        <p className="text-[10px] opacity-40 uppercase tracking-widest">Sem telefone</p>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="relative group/plan">
                                      <button 
                                        onClick={() => {
                                          setEditingClient(c);
                                          setIsPlanSelectorOpen(true);
                                        }}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                                          c.plan_id 
                                            ? 'bg-[#ffb77d]/10 border-[#ffb77d]/30 text-[#ffb77d]' 
                                            : 'bg-white/5 border-white/10 text-white/40'
                                        } hover:border-[#ffb77d]`}
                                      >
                                        <CreditCard size={14} />
                                        {c.subscription_plan?.name || 'Cliente Livre'}
                                      </button>
                                      
                                      {isPlanSelectorOpen && editingClient?.id === c.id && (
                                        <>
                                          <div className="fixed inset-0 z-40" onClick={() => setIsPlanSelectorOpen(false)} />
                                          <div className={`absolute left-0 top-full mt-2 w-48 p-2 rounded-xl border z-50 shadow-2xl ${theme === 'dark' ? 'bg-[#1c1b1b] border-white/10' : 'bg-white border-black/5'}`}>
                                             <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 p-2 border-b border-white/5 mb-1">Selecionar Plano</p>
                                             <button 
                                               onClick={() => handleUpdateClientPlan(c.id, 'free')}
                                               className={`w-full text-left p-2 rounded-lg text-xs font-bold transition-all ${!c.plan_id ? 'bg-[#ffb77d] text-[#4d2600]' : 'hover:bg-white/5'}`}
                                             >
                                               Cliente Livre (Sem Plano)
                                              </button>
                                              {subscriptionPlans.map(p => (
                                                <button 
                                                  key={p.id}
                                                  onClick={() => handleUpdateClientPlan(c.id, p.id)}
                                                  className={`w-full text-left p-2 rounded-lg text-xs font-bold transition-all mt-1 ${c.plan_id === p.id ? 'bg-[#ffb77d] text-[#4d2600]' : 'hover:bg-white/5'}`}
                                                >
                                                  {p.name}
                                                </button>
                                              ))}
                                           </div>
                                         </>
                                       )}
                                     </div>
                                   </td>
                                   <td className="px-6 py-4">
                                      {c.subscription_plan ? (
                                        <div className="space-y-1">
                                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                            <span className={planUsage >= c.subscription_plan.limit_count ? 'text-red-400' : 'text-green-400'}>
                                              {planUsage} / {c.subscription_plan.limit_count}
                                            </span>
                                            <span className="opacity-40">Uso no mês</span>
                                          </div>
                                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                              className={`h-full transition-all duration-500 ${planUsage >= c.subscription_plan.limit_count ? 'bg-red-500' : 'bg-[#ffb77d]'}`}
                                              style={{ width: `${Math.min(100, (planUsage / c.subscription_plan.limit_count) * 100)}%` }}
                                            />
                                          </div>
                                        </div>
                                      ) : (
                                        <span className="text-[10px] opacity-20 uppercase tracking-widest font-bold">N/A</span>
                                      )}
                                   </td>
                                  <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#ffb77d]/10 text-[#ffb77d]">
                                      {clientAppts.length}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-xs font-semibold">
                                    {lastAppt ? (
                                      <div>
                                        <p className="text-white">{lastAppt.date.split('-').reverse().join('/')}</p>
                                        <p className="text-[10px] opacity-40">{lastAppt.time}h - {lastAppt.service?.name}</p>
                                      </div>
                                    ) : (
                                      <span className="opacity-40">Nenhum atendimento</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                      <button 
                                        onClick={() => {
                                          setEditingClient(c);
                                          setNewClientForm({ name: c.name || '', phone: c.phone || '', password: c.password || '' });
                                          setErrorStatus(null);
                                          setIsClientModalOpen(true);
                                        }}
                                        className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-[#ffb77d]' : 'bg-black/5 hover:bg-black/10 text-[#ff8c00]'} transition-all`}
                                        title="Editar"
                                      >
                                        <Edit3 size={14} />
                                      </button>
                                      <button 
                                        onClick={() => setDeletingClient(c)}
                                        className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5 hover:bg-red-500/20 text-red-400' : 'bg-black/5 hover:bg-red-500/20 text-red-500'} transition-all`}
                                        title="Excluir"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center py-12 opacity-50 font-bold text-xs text-white">
                              Nenhum cliente cadastrado no momento. Divulgue o Link para obter cadastros rápidos!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <Pagination 
                    currentPage={shopClientPage}
                    totalItems={clients.filter(c => {
                      const search = searchClientQuery.toLowerCase();
                      return c.name?.toLowerCase().includes(search) || c.phone?.includes(search);
                    }).length}
                    itemsPerPage={10}
                    onPageChange={setShopClientPage}
                    theme={theme}
                  />
                </div>
              </motion.div>
            )}

            {view === 'extras' && user.role === 'barber' && (
              <motion.div
                key="extras"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 animate-fadeIn"
              >
                <div>
                  <h2 className="text-2xl font-bold uppercase tracking-tighter text-[#ffb77d] italic">Configurações Extras</h2>
                  <p className={`text-sm ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'}`}>
                    Gerencie o limite máximo de agendamento online e bloqueie horários ou períodos/dias inteiros para a unidade geral ou profissionais específicos.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Bloco 1: Limite de Tempo Mínimo (Lookahead Limit) */}
                  <div className={`lg:col-span-12 p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5'} shadow-sm space-y-4`}>
                    <div className="flex items-center gap-2 text-[#ffb77d]">
                      <Calendar size={18} />
                      <h4 className="font-bold text-sm uppercase tracking-wide">Janela de Agendamento Disponível</h4>
                    </div>
                    <p className="text-[12px] opacity-60 text-neutral-300">
                      Defina com quantos dias de antecedência o cliente pode agendar um serviço. Ideal para manter os agendamentos controlados nos próximos 15, 30 ou 60 dias.
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="unlimited_lookahead"
                          checked={isUnlimitedLookahead}
                          onChange={async (e) => {
                            const isChecked = e.target.checked;
                            setIsUnlimitedLookahead(isChecked);
                            const nextDays = isChecked ? 0 : 15;
                            if (isChecked) {
                              setLookaheadDays("0");
                            } else {
                              setLookaheadDays("15");
                            }
                            await handleSaveExtras(extrasBlocks, isChecked, nextDays);
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-[#ffb77d] focus:ring-[#ffb77d] cursor-pointer"
                        />
                        <label htmlFor="unlimited_lookahead" className="text-xs font-bold uppercase tracking-wider cursor-pointer text-[#ffb77d]">
                          Agenda Livre (Sem limite de antecedência e salva automaticamente)
                        </label>
                      </div>

                      {!isUnlimitedLookahead && (
                        <div className="flex items-center gap-2 animate-fadeIn">
                          <span className="text-xs font-mono">Disponível nos próximos:</span>
                          <input
                            type="number"
                            min="1"
                            max="365"
                            value={lookaheadDays}
                            onChange={(e) => setLookaheadDays(e.target.value)}
                            className={`w-20 ${theme === 'dark' ? 'bg-[#121212] border-white/5' : 'bg-gray-100 border-black/5'} border rounded-xl px-3 py-1.5 text-center font-bold font-mono text-sm focus:outline-none focus:border-[#ffb77d] text-[#ffb77d]`}
                          />
                          <span className="text-xs font-bold uppercase tracking-widest text-[#ffb77d]">dias</span>
                        </div>
                      )}
                    </div>

                    {!isUnlimitedLookahead && (
                      <button
                        onClick={() => handleSaveExtras(extrasBlocks, false, Number(lookaheadDays))}
                        disabled={isSavingExtras}
                        className="bg-[#ffb77d] text-[#4d2600] px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#ffb77d]/10 disabled:opacity-50 mt-2"
                      >
                        {isSavingExtras ? 'Salvando...' : 'Salvar Limite de Dias'}
                      </button>
                    )}
                  </div>

                  {/* Esquerda: Quadros de Bloqueio Separados */}
                  <div className="lg:col-span-6 space-y-6">
                    {/* Quadro 1: Bloquear Barbearia Completa */}
                    <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5'} shadow-sm space-y-4`}>
                      <div className="flex items-center gap-2 text-[#ffb77d]">
                        <Store size={18} />
                        <h4 className="font-bold text-sm uppercase tracking-wide">Bloquear Barbearia Inteira (Geral/Recesso)</h4>
                      </div>
                      <p className="text-[11px] opacity-40 text-neutral-400">
                        Crie folgas gerais ou períodos de recesso de um ou múltiplos dias. Nenhum cliente conseguirá marcar agendamento online de nenhum serviço nesse período escolhido.
                      </p>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const dateList = getDatesInRange(shopBlockStartDate, shopBlockEndDate);
                          
                          const newBlocks = dateList.map(dateStr => ({
                            id: Math.random().toString(36).slice(2, 9),
                            type: 'shop' as const,
                            date: dateStr,
                            allDay: true,
                            reason: shopBlockReason.trim() || undefined
                          }));

                          const updatedList = [...newBlocks, ...extrasBlocks];
                          setExtrasBlocks(updatedList);
                          handleSaveExtras(updatedList);
                          setShopBlockReason('');
                        }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-[#ffb77d]">De (Data Inicial):</label>
                            <input
                              type="date"
                              required
                              value={shopBlockStartDate}
                              onChange={(e) => setShopBlockStartDate(e.target.value)}
                              className={`w-full ${theme === 'dark' ? 'bg-[#121212]' : 'bg-white'} ${theme === 'dark' ? 'text-white' : 'text-black'} border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ffb77d] text-xs font-bold transition-all`}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-[#ffb77d]">Até (Data Final):</label>
                            <input
                              type="date"
                              required
                              value={shopBlockEndDate}
                              onChange={(e) => setShopBlockEndDate(e.target.value)}
                              className={`w-full ${theme === 'dark' ? 'bg-[#121212]' : 'bg-white'} ${theme === 'dark' ? 'text-white' : 'text-black'} border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ffb77d] text-xs font-bold transition-all`}
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-[#ffb77d]">Motivo ou Descrição (opcional)</label>
                          <input
                            type="text"
                            placeholder="Ex: Feriado Nacional, Recesso de Fim de Ano..."
                            value={shopBlockReason}
                            onChange={(e) => setShopBlockReason(e.target.value)}
                            className={`w-full ${theme === 'dark' ? 'bg-[#121212]' : 'bg-white'} ${theme === 'dark' ? 'text-white' : 'text-black'} border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ffb77d] text-xs font-bold transition-all`}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSavingExtras}
                          className="w-full bg-[#ffb77d] hover:brightness-110 text-[#4d2600] py-3 rounded-xl font-bold uppercase tracking-widest text-xs active:scale-95 transition-all shadow-lg font-sans"
                        >
                          {isSavingExtras ? 'Bloqueando...' : 'Aplicar Bloqueio de Unidade'}
                        </button>
                      </form>
                    </div>

                    {/* Quadro 2: Bloquear Barbeiro Específico */}
                    <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5'} shadow-sm space-y-4`}>
                      <div className="flex items-center gap-2 text-rose-400">
                        <UserCircle size={18} />
                        <h4 className="font-bold text-sm uppercase tracking-wide">Bloquear Barbeiro (Folga/Férias/Horário)</h4>
                      </div>
                      <p className="text-[11px] opacity-40 text-neutral-400">
                        Crie bloqueios específicos para um colaborador. Defina férias de dias inteiros ou bloqueie apenas algumas horas de um dia específico.
                      </p>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const selectedProfId = barberBlockProfId || (professionals[0]?.id || '');
                          if (!selectedProfId) {
                            alert("Cadastre profissionais antes de aplicar bloqueio individual!");
                            return;
                          }

                          let newBlocks: any[] = [];
                          if (barberBlockPeriodType === 'days') {
                            const dateList = getDatesInRange(barberBlockStartDate, barberBlockEndDate);
                            newBlocks = dateList.map(dateStr => ({
                              id: Math.random().toString(36).slice(2, 9),
                              type: 'barber' as const,
                              professionalId: selectedProfId,
                              date: dateStr,
                              allDay: true,
                              reason: barberBlockReason.trim() || undefined
                            }));
                          } else {
                            newBlocks = [{
                              id: Math.random().toString(36).slice(2, 9),
                              type: 'barber' as const,
                              professionalId: selectedProfId,
                              date: barberBlockSingleDate,
                              allDay: false,
                              timeStart: barberBlockTimeStart,
                              timeEnd: barberBlockTimeEnd,
                              reason: barberBlockReason.trim() || undefined
                            }];
                          }

                          const updatedList = [...newBlocks, ...extrasBlocks];
                          setExtrasBlocks(updatedList);
                          handleSaveExtras(updatedList);
                          setBarberBlockReason('');
                        }}
                        className="space-y-4"
                      >
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-[#C5A059]">Selecione o Profissional:</label>
                          <select
                            value={barberBlockProfId || (professionals[0]?.id || '')}
                            onChange={(e) => setBarberBlockProfId(e.target.value)}
                            required
                            className={`w-full ${theme === 'dark' ? 'bg-[#121212]' : 'bg-[#f5f5f5]'} border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ffb77d] text-xs font-bold transition-all text-white`}
                          >
                            <option value="" disabled>Escolha o profissional...</option>
                            {professionals.map(p => (
                              <option key={p.id} value={p.id} className="text-black bg-white">{p.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-[#ffb77d]">Modo de Bloqueio:</label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold">
                              <input
                                type="radio"
                                name="barber_block_mode"
                                checked={barberBlockPeriodType === 'days'}
                                onChange={() => setBarberBlockPeriodType('days')}
                                className="text-[#ffb77d] focus:ring-[#ffb77d]"
                              />
                              Período de Dias (Dia Todo)
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold">
                              <input
                                type="radio"
                                name="barber_block_mode"
                                checked={barberBlockPeriodType === 'hours'}
                                onChange={() => setBarberBlockPeriodType('hours')}
                                className="text-[#ffb77d] focus:ring-[#ffb77d]"
                              />
                              Horário Específico (Mesmo Dia)
                            </label>
                          </div>
                        </div>

                        {barberBlockPeriodType === 'days' ? (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-[#ffb77d]">De (Data Inicial):</label>
                              <input
                                type="date"
                                required
                                value={barberBlockStartDate}
                                onChange={(e) => setBarberBlockStartDate(e.target.value)}
                                className={`w-full ${theme === 'dark' ? 'bg-[#121212]' : 'bg-white'} ${theme === 'dark' ? 'text-white' : 'text-black'} border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ffb77d] text-xs font-bold transition-all`}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-[#ffb77d]">Até (Data Final):</label>
                              <input
                                type="date"
                                required
                                value={barberBlockEndDate}
                                onChange={(e) => setBarberBlockEndDate(e.target.value)}
                                className={`w-full ${theme === 'dark' ? 'bg-[#121212]' : 'bg-white'} ${theme === 'dark' ? 'text-white' : 'text-black'} border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ffb77d] text-xs font-bold transition-all`}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-[#ffb77d]">Escolha o Dia:</label>
                              <input
                                type="date"
                                required
                                value={barberBlockSingleDate}
                                onChange={(e) => setBarberBlockSingleDate(e.target.value)}
                                className={`w-full ${theme === 'dark' ? 'bg-[#121212]' : 'bg-white'} ${theme === 'dark' ? 'text-white' : 'text-black'} border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ffb77d] text-xs font-bold transition-all`}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-[#C5A059]">Hora de Início:</label>
                                <select
                                  value={barberBlockTimeStart}
                                  onChange={(e) => setBarberBlockTimeStart(e.target.value)}
                                  className={`w-full ${theme === 'dark' ? 'bg-[#121212]' : 'bg-[#f5f5f5]'} border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ffb77d] text-xs font-bold transition-all text-white`}
                                >
                                  {COMMON_TIME_SLOTS.map(t => (
                                    <option key={t} value={t} className="text-black bg-white">{t}h</option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-[#C5A059]">Hora de Término:</label>
                                <select
                                  value={barberBlockTimeEnd}
                                  onChange={(e) => setBarberBlockTimeEnd(e.target.value)}
                                  className={`w-full ${theme === 'dark' ? 'bg-[#121212]' : 'bg-[#f5f5f5]'} border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ffb77d] text-xs font-bold transition-all text-white`}
                                >
                                  {COMMON_TIME_SLOTS.concat(["23:59"]).map(t => (
                                    <option key={t} value={t} className="text-black bg-white">{t}h</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-[#ffb77d]">Motivo ou Descrição (opcional)</label>
                          <input
                            type="text"
                            placeholder="Ex: Consulta médica, Assuntos pessoais..."
                            value={barberBlockReason}
                            onChange={(e) => setBarberBlockReason(e.target.value)}
                            className={`w-full ${theme === 'dark' ? 'bg-[#121212]' : 'bg-white'} ${theme === 'dark' ? 'text-white' : 'text-black'} border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ffb77d] text-xs font-bold transition-all`}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSavingExtras}
                          className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs active:scale-95 transition-all shadow-lg shadow-rose-500/10"
                        >
                          {isSavingExtras ? 'Bloqueando...' : 'Aplicar Bloqueio de Profissional'}
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Direita: Lista de Bloqueios de Agenda no Sistema */}
                  <div className={`lg:col-span-6 p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-black/5'} shadow-sm space-y-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-[#C5A059]" />
                        <h4 className="font-bold text-sm uppercase tracking-wide">Bloqueios Ativos da Agenda</h4>
                      </div>
                      <span className="text-[10px] px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg font-mono font-bold text-[#C5A059]">
                        {extrasBlocks.length} Ativo(s)
                      </span>
                    </div>

                    <div className="overflow-hidden border border-white/5 rounded-xl">
                      <div className="max-h-[850px] overflow-y-auto divide-y divide-white/5">
                        {extrasBlocks && extrasBlocks.length > 0 ? (
                          extrasBlocks.map((block) => {
                            const targetProf = block.type === 'barber'
                              ? professionals.find(p => p.id === block.professionalId)
                              : null;

                            return (
                              <div key={block.id} className="p-4 flex items-center justify-between hover:bg-white/[0.01] transition-all">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                                      block.type === 'shop' ? 'bg-[#C5A059]/10 text-[#C5A059]' : 'bg-rose-500/10 text-rose-400'
                                    }`}>
                                      {block.type === 'shop' ? 'Geral (Unidade)' : 'Profissional'}
                                    </span>
                                    {block.reason && (
                                      <span className="text-[10px] opacity-40 font-mono italic">
                                        "{block.reason}"
                                      </span>
                                    )}
                                  </div>
                                  
                                  <p className="text-sm font-bold text-slate-200">
                                    {block.type === 'shop' ? 'Unidade Inteira Travada' : (targetProf?.name || 'Profissional específico')}
                                  </p>

                                  <div className="flex items-center gap-3 text-[10px] text-neutral-400 font-mono">
                                    <span>Dia: {block.date.split('-').reverse().join('/')}</span>
                                    <span>•</span>
                                    <span>
                                      {block.allDay ? 'Dia Inteiro' : `Horas: ${block.timeStart}h às ${block.timeEnd}h`}
                                    </span>
                                  </div>
                                </div>

                                <button
                                  disabled={isSavingExtras}
                                  onClick={() => {
                                    const updated = extrasBlocks.filter(b => {
                                      if (block.id && b.id) {
                                        return b.id !== block.id;
                                      }
                                      return !(
                                        b.date === block.date &&
                                        b.type === block.type &&
                                        b.professionalId === block.professionalId &&
                                        b.timeStart === block.timeStart &&
                                        b.timeEnd === block.timeEnd
                                      );
                                    });
                                    setExtrasBlocks(updated);
                                    handleSaveExtras(updated);
                                  }}
                                  className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-all"
                                  title="Remover este bloqueio"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <div className="py-16 text-center opacity-40 space-y-2">
                            <Ban className="mx-auto text-[#C5A059]/40" size={32} />
                            <p className="text-xs font-bold uppercase tracking-wider">Nenhum bloqueio de agenda configurado.</p>
                            <p className="text-[10.5px] max-w-sm mx-auto p-4 text-center">Crie bloqueios no painel ao lado para travar dias ou horários e impedir agendamentos indesejados online.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {view === 'professionals' && user.role === 'barber' && (
              <motion.div
                key="professionals"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className={`flex justify-between items-end border-b ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} pb-4`}>
                  <div>
                    <h2 className="text-2xl font-bold uppercase tracking-tighter">Profissionais</h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'}`}>
                      Gerencie sua equipe. Seu plano permite até {user.shop?.plan?.professionals_count || 3} profissionais.
                    </p>
                  </div>
                  <button 
                    disabled={professionals.length >= (user.shop?.plan?.professionals_count || 3)}
                    onClick={() => {
                      setErrorStatus(null);
                      setEditingProfessional(null);
                      setNewProfessional({ 
                        name: '', 
                        phone: '', 
                        password: '', 
                        commission_percentage: '40',
                        working_hours_type: 'shop',
                        custom_start_time: '08:00',
                        custom_end_time: '20:00'
                      });
                      setIsProfessionalModalOpen(true);
                    }}
                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg ${
                      professionals.length >= (user.shop?.plan?.professionals_count || 3)
                        ? 'opacity-50 cursor-not-allowed bg-gray-500/20 text-gray-400 border border-gray-500/10 shadow-none'
                        : 'bg-[#C5A059] text-white hover:brightness-110 active:scale-95 shadow-[#C5A059]/20'
                    }`}
                  >
                    <Plus size={18} />
                    NOVO PROFISSIONAL
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {professionals.length > 0 ? professionals.map(prof => (
                    <div key={prof.id} className={`${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-[#C5A059]/10 shadow-sm'} p-6 rounded-2xl border group relative`}>
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditingProfessional(prof);
                            setNewProfessional({ 
                              name: prof.name, 
                              phone: prof.phone, 
                              password: prof.password || '',
                              commission_percentage: prof.commission_percentage !== undefined ? String(prof.commission_percentage) : '40',
                              photo_url: prof.photo_url || '',
                              working_hours_type: prof.working_hours_type || 'shop',
                              custom_start_time: prof.custom_start_time || '08:00',
                              custom_end_time: prof.custom_end_time || '20:00'
                            });
                            setErrorStatus(null);
                            setIsProfessionalModalOpen(true);
                          }}
                          className="p-2 hover:bg-[#C5A059]/10 text-[#C5A059] rounded-lg"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => setDeletingProfessional(prof)}
                          className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                       <div className="w-16 h-16 rounded-full overflow-hidden border border-[#C5A059]/20 shadow-lg bg-[#1a1a1a] mb-4">
                        {prof.photo_url ? (
                          <img 
                            src={prof.photo_url} 
                            alt={prof.name} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-[#C5A059] to-[#8B7344] flex items-center justify-center font-black text-2xl text-white">
                            {prof.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <h4 className="font-bold text-lg">{prof.name}</h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] mt-1">Ativo</p>
                      
                      <div className="mt-4 space-y-1 block text-xs opacity-80">
                         <div><span className="font-semibold">Telefone:</span> {prof.phone}</div>
                         <div><span className="font-semibold">Senha de Acesso:</span> <span className="font-mono bg-[#C5A059]/5 border border-[#C5A059]/10 px-1 py-0.5 rounded text-[#C5A059]">{prof.password || '---'}</span></div>
                         <div><span className="font-semibold">Comissão:</span> <span className="font-bold text-[#C5A059]">{prof.commission_percentage !== undefined ? prof.commission_percentage : 40}%</span></div>
                         <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-black/5">
                            <Clock size={12} className="text-[#C5A059]" />
                            <span className="font-semibold uppercase text-[9px] tracking-wider text-[#C5A059]">
                               {prof.working_hours_type === 'custom' ? `${prof.custom_start_time} às ${prof.custom_end_time}` : 'Horário da Unidade'}
                            </span>
                         </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-white/5">
                         <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-40">
                            <span>Agendas Hoje</span>
                            <span>8</span>
                         </div>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-[#C5A059]/10 rounded-3xl opacity-50">
                      <Users size={48} className="text-[#C5A059] mx-auto mb-4" />
                      <p className="font-bold">Nenhum profissional cadastrado.</p>
                    </div>
                  )}

                  {/* Plan Limit Slot info */}
                  {professionals.length < (user.shop?.plan?.professionals_count || 3) && (
                    <button 
                      onClick={() => setIsProfessionalModalOpen(true)}
                      className="border-2 border-dashed border-[#C5A059]/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-[#C5A059]/5 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full border-2 border-[#C5A059]/20 flex items-center justify-center text-[#C5A059]/50 group-hover:scale-110 transition-transform">
                        <Plus size={24} />
                      </div>
                      <p className="mt-4 text-xs font-bold uppercase tracking-widest opacity-40">Vaga disponível</p>
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className={`mt-auto border-t ${theme === 'dark' ? 'border-white/10 bg-[#0e0e0e]' : 'border-black/5 bg-[#ffffff]'} p-6 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold text-[#8B7344] transition-colors duration-300`}>
          <p>© 2026 Queen Agenda. TODOS OS DIREITOS RESERVADOS.</p>
            <div className="flex gap-6 mt-2 md:mt-0 uppercase tracking-widest">
              <button onClick={() => setView('terms')} className="hover:text-[#C5A059] cursor-pointer transition-colors">Termos</button>
              <button onClick={() => setView('privacy')} className="hover:text-[#C5A059] cursor-pointer transition-colors">Privacidade</button>
              <a 
                href={`https://wa.me/5581998591594?text=${encodeURIComponent("Olá! Preciso de suporte com o sistema Queen Agenda.")}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#C5A059]"
              >
                Suporte
              </a>
            </div>
        </footer>
      </main>

      {/* Modals are unchanged below */}
      {/* ... (Plan Modal, Barbershop Modal, Delete Modal) ... */}
      <AnimatePresence>
        {isPlanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPlanModalOpen(false)}
              className="absolute inset-0 bg-[#000]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative ${theme === 'dark' ? 'bg-[#20201f] border-white/10' : 'bg-white border-black/5'} w-full max-w-md rounded-2xl p-8 shadow-2xl border transition-colors duration-300`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#C5A059]">{editingPlan ? 'Editar Plano' : 'Novo Plano'}</h3>
                <button onClick={() => {
                  setIsPlanModalOpen(false);
                  setEditingPlan(null);
                  setNewPlan({ name: '', price: 0, professionals_count: 0 });
                }} className={`${theme === 'dark' ? 'text-[#8B7344] hover:text-white' : 'text-[#a48c7a] hover:text-black'}`}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreatePlan} className="space-y-4">
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#8B7344]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>Nome do Plano</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: Plano Master"
                    className={`w-full ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f5f5f5]'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#C5A059] transition-all`}
                    value={newPlan.name}
                    onChange={e => setNewPlan({...newPlan, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#8B7344]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>Valor Mensal (R$)</label>
                    <input 
                      required
                      type="number" 
                      placeholder="89.90"
                      className={`w-full ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f5f5f5]'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#C5A059] transition-all`}
                      value={newPlan.price}
                      onChange={e => setNewPlan({...newPlan, price: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#8B7344]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>Profissionais</label>
                    <input 
                      required
                      type="number" 
                      placeholder="5"
                      className={`w-full ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f5f5f5]'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#C5A059] transition-all`}
                      value={newPlan.professionals_count}
                      onChange={e => setNewPlan({...newPlan, professionals_count: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <button 
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-[#C5A059] text-white py-4 rounded-xl font-bold uppercase tracking-widest mt-4 hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#C5A059]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Salvando...' : 'Salvar Plano'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBarbershopModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsBarbershopModalOpen(false);
                setErrorStatus(null);
              }}
              className="absolute inset-0 bg-[#000]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative ${theme === 'dark' ? 'bg-[#20201f] border-white/10' : 'bg-white border-black/5'} w-full max-w-lg rounded-2xl p-8 shadow-2xl border transition-colors duration-300`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#C5A059]">{editingBarbershop ? 'Editar Unidade' : 'Nova Unidade'}</h3>
                <button onClick={() => {
                  setIsBarbershopModalOpen(false);
                  setEditingBarbershop(null);
                  setErrorStatus(null);
                  setNewBarbershop({
                    name: '',
                    address: '',
                    phone: '',
                    plan_id: '',
                    password: '',
                    status: 'active'
                  });
                }} className={`${theme === 'dark' ? 'text-[#ddc1ae] hover:text-white' : 'text-[#a48c7a] hover:text-black'}`}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateBarbershop} className="space-y-4">
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>Nome da Unidade</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: Barber Shop Downtown"
                    className={`w-full ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f5f5f5]'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ff8c00] transition-all`}
                    value={newBarbershop.name}
                    onChange={e => setNewBarbershop({...newBarbershop, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>Endereço Completo</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Rua, Número, Bairro, Cidade - UF"
                    className={`w-full ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f5f5f5]'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ff8c00] transition-all`}
                    value={newBarbershop.address}
                    onChange={e => setNewBarbershop({...newBarbershop, address: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>Telefone (Login)</label>
                    <input 
                      required
                      type="tel" 
                      placeholder="(00) 00000-0000"
                      className={`w-full ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f5f5f5]'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ff8c00] transition-all`}
                      value={newBarbershop.phone}
                      onChange={e => setNewBarbershop({...newBarbershop, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>Senha de Acesso</label>
                    <input 
                      required={!editingBarbershop}
                      type="password" 
                      placeholder="••••••••"
                      className={`w-full ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f5f5f5]'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ff8c00] transition-all`}
                      value={newBarbershop.password}
                      onChange={e => setNewBarbershop({...newBarbershop, password: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>Plano de Assinatura</label>
                    <select 
                      required
                      className={`w-full ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f5f5f5]'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ff8c00] transition-all cursor-pointer`}
                      value={newBarbershop.plan_id}
                      onChange={e => setNewBarbershop({...newBarbershop, plan_id: e.target.value})}
                    >
                      <option value="">Selecione...</option>
                      {plans.map(p => <option key={p.id} value={p.id}>{p.name} - R${p.price}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>Status Inicial</label>
                    <select 
                      className={`w-full ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f5f5f5]'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ff8c00] transition-all cursor-pointer`}
                      value={newBarbershop.status}
                      onChange={e => setNewBarbershop({...newBarbershop, status: e.target.value as 'active' | 'blocked'})}
                    >
                      <option value="active">Ativo</option>
                      <option value="blocked">Bloqueado</option>
                    </select>
                  </div>
                </div>

                {errorStatus && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-3 rounded-xl text-center">
                    {errorStatus}
                  </div>
                )}

                <button 
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-[#C5A059] text-white py-4 rounded-xl font-bold uppercase tracking-widest mt-4 hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#C5A059]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Salvando...' : 'Salvar Cadastro'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isServiceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsServiceModalOpen(false)}
              className="absolute inset-0 bg-[#000]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative ${theme === 'dark' ? 'bg-[#20201f] border-white/10' : 'bg-white border-black/5'} w-full max-w-md rounded-2xl p-8 shadow-2xl border transition-colors duration-300`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#C5A059]">{editingService ? 'Editar Serviço' : 'Novo Serviço'}</h3>
                <button onClick={() => {
                  setIsServiceModalOpen(false);
                  setEditingService(null);
                  setNewService({ name: '', price: 0, duration_minutes: 30 });
                }} className={`${theme === 'dark' ? 'text-[#ddc1ae] hover:text-white' : 'text-[#a48c7a] hover:text-black'}`}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSaveService} className="space-y-4">
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>Nome do Serviço</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: Corte de Cabelo"
                    className={`w-full bg-white border border-black/5 rounded-xl p-3 focus:outline-none focus:border-[#C5A059] transition-all text-black`}
                    value={newService.name}
                    onChange={e => setNewService({...newService, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-black' : 'text-[#a48c7a]'} uppercase tracking-widest`}>Valor (R$)</label>
                    <input 
                      required
                      type="number" 
                      placeholder="50"
                      className={`w-full bg-white border border-black/5 rounded-xl p-3 focus:outline-none focus:border-[#C5A059] transition-all text-black`}
                      value={newService.price}
                      onChange={e => setNewService({...newService, price: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-black' : 'text-[#a48c7a]'} uppercase tracking-widest`}>Duração (min)</label>
                    <input 
                      required
                      type="number" 
                      placeholder="30"
                      className={`w-full bg-white border border-black/5 rounded-xl p-3 focus:outline-none focus:border-[#C5A059] transition-all text-black`}
                      value={newService.duration_minutes}
                      onChange={e => setNewService({...newService, duration_minutes: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <button 
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-[#C5A059] text-white py-4 rounded-xl font-bold uppercase tracking-widest mt-4 hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#C5A059]/10 disabled:opacity-50"
                >
                  {isLoading ? 'Salvando...' : 'Salvar Serviço'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSubscriptionPlanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSubscriptionPlanModalOpen(false)}
              className="absolute inset-0 bg-[#000]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative ${theme === 'dark' ? 'bg-[#20201f] border-white/10' : 'bg-white border-black/5'} w-full max-w-md rounded-2xl p-8 shadow-2xl border transition-colors duration-300`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#C5A059] uppercase tracking-tighter italic">
                  {editingSubscriptionPlan ? 'Editar Plano' : 'Novo Plano de Assinatura'}
                </h3>
                <button 
                  onClick={() => setIsSubscriptionPlanModalOpen(false)}
                  className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'hover:bg-black/5 text-black' : 'hover:bg-black/5 text-[#a48c7a]'}`}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveSubscriptionPlan} className="space-y-4">
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-black' : 'text-[#a48c7a]'} uppercase tracking-widest`}>Nome do Plano</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: Assinatura Mensal Corte"
                    className={`w-full bg-white border border-black/5 rounded-xl p-3 focus:outline-none focus:border-[#C5A059] transition-all text-black`}
                    value={newSubscriptionPlanForm.name}
                    onChange={e => setNewSubscriptionPlanForm({...newSubscriptionPlanForm, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-black' : 'text-[#a48c7a]'} uppercase tracking-widest`}>Valor Mensal (R$)</label>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      placeholder="0,00"
                      className={`w-full bg-white border border-black/5 rounded-xl p-3 focus:outline-none focus:border-[#C5A059] transition-all text-black`}
                      value={newSubscriptionPlanForm.price}
                      onChange={e => setNewSubscriptionPlanForm({...newSubscriptionPlanForm, price: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-black' : 'text-[#a48c7a]'} uppercase tracking-widest`}>Qtd. de Vezes</label>
                    <input 
                      required
                      type="number" 
                      placeholder="Ex: 4"
                      className={`w-full bg-white border border-black/5 rounded-xl p-3 focus:outline-none focus:border-[#C5A059] transition-all text-black`}
                      value={newSubscriptionPlanForm.limit_count}
                      onChange={e => setNewSubscriptionPlanForm({...newSubscriptionPlanForm, limit_count: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-black' : 'text-[#a48c7a]'} uppercase tracking-widest`}>Serviço Incluído</label>
                  <select 
                    required
                    className={`w-full bg-white border border-black/5 rounded-xl p-3 focus:outline-none focus:border-[#C5A059] transition-all cursor-pointer text-black`}
                    value={newSubscriptionPlanForm.service_id}
                    onChange={e => setNewSubscriptionPlanForm({...newSubscriptionPlanForm, service_id: e.target.value})}
                  >
                    <option value="">Selecione o serviço...</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <button 
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-[#C5A059] text-white py-4 rounded-xl font-bold uppercase tracking-widest mt-4 hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#C5A059]/10 disabled:opacity-50"
                >
                  {isLoading ? 'Salvando...' : 'Salvar Plano'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isClientModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsClientModalOpen(false);
                setEditingClient(null);
                setNewClientForm({ name: '', phone: '', password: '' });
                setErrorStatus(null);
              }}
              className="absolute inset-0 bg-[#000]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative ${theme === 'dark' ? 'bg-[#20201f] border-white/10' : 'bg-white border-black/5'} w-full max-w-md rounded-2xl p-8 shadow-2xl border transition-colors duration-300`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#C5A059] uppercase tracking-tighter italic">
                  {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
                </h3>
                <button 
                  onClick={() => {
                    setIsClientModalOpen(false);
                    setEditingClient(null);
                    setNewClientForm({ name: '', phone: '', password: '' });
                    setErrorStatus(null);
                  }}
                  className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'hover:bg-white/5 text-[#ddc1ae]' : 'hover:bg-black/5 text-[#a48c7a]'}`}
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveClient} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-[#D4AF37]">Nome Completo</label>
                  <input 
                    type="text"
                    required
                    placeholder="Nome do cliente"
                    value={newClientForm.name}
                    onChange={e => setNewClientForm({...newClientForm, name: e.target.value})}
                    className={`w-full ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f5f5f5]'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ffb77d] transition-all font-bold text-sm text-[white]`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-[#D4AF37]">WhatsApp (apenas números)</label>
                  <input 
                    type="text"
                    required
                    placeholder="ex: 11999998888"
                    value={newClientForm.phone}
                    onChange={e => setNewClientForm({...newClientForm, phone: e.target.value})}
                    className={`w-full ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f5f5f5]'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ffb77d] transition-all font-bold text-sm text-[white]`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-[#D4AF37]">Senha de Agendamento</label>
                  <input 
                    type="text"
                    placeholder="Senha do cliente (padrão '123')"
                    value={newClientForm.password}
                    onChange={e => setNewClientForm({...newClientForm, password: e.target.value})}
                    className={`w-full ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f5f5f5]'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ffb77d] transition-all font-bold text-sm text-[white]`}
                  />
                </div>

                {errorStatus && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-3 rounded-xl text-center">
                    {errorStatus}
                  </div>
                )}

                <button 
                  disabled={isSavingClient}
                  type="submit"
                  className="w-full bg-[#ffb77d] text-[#4d2600] py-4 rounded-xl font-bold uppercase tracking-widest mt-4 hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#ffb77d]/10 disabled:opacity-50"
                >
                  {isSavingClient ? 'Salvando...' : 'Salvar Cliente'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAppointmentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAppointmentModalOpen(false);
                setEditingAppointment(null);
              }}
              className="absolute inset-0 bg-[#000]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative ${theme === 'dark' ? 'bg-[#20201f] border-white/10' : 'bg-white border-black/5'} w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl border transition-colors duration-300`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#D4AF37]">
                  {editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
                </h3>
                <button onClick={() => {
                  setIsAppointmentModalOpen(false);
                  setEditingAppointment(null);
                }} className={`${theme === 'dark' ? 'text-[#ddc1ae] hover:text-white' : 'text-[#a48c7a] hover:text-black'}`}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveAppointment} className="space-y-4">
                {appointmentError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl flex items-start gap-2.5 text-xs font-semibold leading-relaxed">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{appointmentError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>
                    Nome do Cliente
                  </label>
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: João Silva"
                    disabled={!!editingAppointment}
                    className={`w-full ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f5f5f5]'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ffb77d] transition-all disabled:opacity-50`}
                    value={newAppointment.customer_name}
                    onChange={e => setNewAppointment({...newAppointment, customer_name: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>
                    Telefone de Contato (Opcional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: 81999998888"
                    disabled={!!editingAppointment}
                    className={`w-full ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f5f5f5]'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ffb77d] transition-all disabled:opacity-50`}
                    value={newAppointment.customer_phone}
                    onChange={e => setNewAppointment({...newAppointment, customer_phone: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>
                    Serviço
                  </label>
                  <select 
                    required
                    className={`w-full ${theme === 'dark' ? 'bg-[#131313] text-white' : 'bg-[#f5f5f5] text-black'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ffb77d] transition-all`}
                    value={newAppointment.service_id}
                    onChange={e => setNewAppointment({...newAppointment, service_id: e.target.value, time: ''})}
                  >
                    <option value="" disabled>Selecione o serviço...</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id} className={theme === 'dark' ? 'bg-[#20201f] text-white' : 'bg-white text-black'}>
                        {s.name} - R$ {s.price} ({s.duration_minutes} min)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>
                    Profissional
                  </label>
                  <select 
                    required
                    disabled={user?.role === 'professional'}
                    className={`w-full ${theme === 'dark' ? 'bg-[#131313] text-white' : 'bg-[#f5f5f5] text-black'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ffb77d] transition-all disabled:opacity-50`}
                    value={newAppointment.professional_id}
                    onChange={e => setNewAppointment({...newAppointment, professional_id: e.target.value, time: ''})}
                  >
                    <option value="" disabled>Selecione o profissional...</option>
                    {user?.role === 'professional' ? (
                      <option value={user.id}>{user.name}</option>
                    ) : (
                      professionals.map(p => (
                        <option key={p.id} value={p.id} className={theme === 'dark' ? 'bg-[#20201f] text-white' : 'bg-white text-black'}>
                          {p.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>
                      Data
                    </label>
                    {(() => {
                      const d = new Date();
                      const year = d.getFullYear();
                      const month = String(d.getMonth() + 1).padStart(2, '0');
                      const day = String(d.getDate()).padStart(2, '0');
                      const todayStr = `${year}-${month}-${day}`;
                      return (
                        <>
                          <input 
                            required
                            type="date"
                            min={todayStr}
                            className={`w-full ${theme === 'dark' ? 'bg-[#131313] text-white' : 'bg-[#f5f5f5] text-black'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ffb77d] transition-all`}
                            value={newAppointment.date}
                            onChange={e => setNewAppointment({...newAppointment, date: e.target.value, time: ''})}
                          />
                          {(() => {
                            if (newAppointment.date) {
                              const checkOpen = isBarbershopOpenAt(newAppointment.date, "12:00", user?.shop?.address);
                              const shopAddress = user?.shop?.address;
                              const shopData = shopAddress ? parseBarbershopAddress(shopAddress) : null;
                              const dayBlocks = shopData?.extras?.blocks || [];
                              const selectedProfId = newAppointment.professional_id || (user?.role === 'professional' ? user.id : '');
                              
                              const isDayBlocked = dayBlocks.some(b => 
                                b.date === newAppointment.date && 
                                b.allDay && 
                                (b.type === 'shop' || (b.type === 'barber' && b.professionalId === selectedProfId))
                              );
                              
                              if (isDayBlocked) {
                                return (
                                  <p className="text-rose-500 font-extrabold text-[9px] mt-1 uppercase tracking-wider leading-tight">
                                    ⚠️ DIA BLOQUEADO!
                                  </p>
                                );
                              } else if (!checkOpen.isOpen && checkOpen.reason && checkOpen.reason.includes("fechada")) {
                                return (
                                  <p className="text-red-500 font-extrabold text-[9px] mt-1 uppercase tracking-wider leading-tight">
                                    ⚠️ FECHADO NESTE DIA!
                                  </p>
                                );
                              }
                            }
                            return null;
                          })()}
                        </>
                      );
                    })()}
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>
                      Horário
                    </label>
                    {(() => {
                      const availableSlotsList = getAvailableSlots();
                      const displayedSlots = [...availableSlotsList];
                      if (editingAppointment && editingAppointment.time) {
                        const formattedTime = editingAppointment.time.slice(0, 5);
                        if (!displayedSlots.includes(formattedTime) && newAppointment.date === editingAppointment.date.split('T')[0]) {
                          displayedSlots.push(formattedTime);
                          displayedSlots.sort();
                        }
                      }
                      return (
                        <select
                          required
                          className={`w-full ${theme === 'dark' ? 'bg-[#131313] text-white' : 'bg-[#f5f5f5] text-black'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#ffb77d] transition-all`}
                          value={newAppointment.time}
                          onChange={e => setNewAppointment({...newAppointment, time: e.target.value})}
                        >
                          <option value="">Selecione...</option>
                          {displayedSlots.map(tOption => (
                            <option key={tOption} value={tOption} className={theme === 'dark' ? 'bg-[#20201f] text-white' : 'bg-white text-black'}>
                              {tOption}
                            </option>
                          ))}
                          {displayedSlots.length === 0 && newAppointment.date && (
                            <option disabled value="">❌ Sem vagas</option>
                          )}
                        </select>
                      );
                    })()}
                  </div>
                </div>

                {editingAppointment && (
                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>
                      Status do Agendamento
                    </label>
                       <select 
                        required
                        className={`w-full ${theme === 'dark' ? 'bg-[#131313] text-white' : 'bg-[#f5f5f5] text-black'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#C5A059] transition-all`}
                        value={editingAppointment.status}
                        onChange={e => setEditingAppointment({...editingAppointment, status: e.target.value as any})}
                      >
                      <option value="pending">PENDENTE</option>
                      <option value="confirmed">CONFIRMADO</option>
                      <option value="completed">REALIZADO</option>
                      <option value="cancelled">CANCELADO</option>
                    </select>
                  </div>
                )}

                {editingAppointment && newAppointment.customer_phone && (
                  <button
                    type="button"
                    onClick={() => {
                      const profName = professionals.find(p => p.id === newAppointment.professional_id)?.name || '';
                      const shopName = user?.shop?.name || 'nosso estabelecimento';
                      const time = newAppointment.time;
                      const dateParts = newAppointment.date.split('-');
                      const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : newAppointment.date;
                      
                      const message = `Olá, passando para lembrar do seu agendamento no ${shopName} às ${time} do dia ${formattedDate} com o profissional ${profName}.`;
                      const cleanPhone = newAppointment.customer_phone.replace(/\D/g, '');
                      const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-bold uppercase tracking-widest mt-2 hover:brightness-110 active:scale-95 transition-all shadow-lg"
                  >
                    <MessageSquare size={18} />
                    Confirmar via WhatsApp
                  </button>
                )}

                <button 
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-[#C5A059] text-white py-4 rounded-xl font-bold uppercase tracking-widest mt-4 hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#C5A059]/10 disabled:opacity-50"
                >
                  {isLoading ? 'Salvando...' : editingAppointment ? 'Atualizar Agendamento' : 'Agendar Cliente'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProfessionalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsProfessionalModalOpen(false);
                setErrorStatus(null);
              }}
              className="absolute inset-0 bg-[#000]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative ${theme === 'dark' ? 'bg-[#20201f] border-white/10' : 'bg-white border-black/5'} w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl border transition-colors duration-300`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#C5A059]">{editingProfessional ? 'Editar Profissional' : 'Novo Profissional'}</h3>
                <button onClick={() => {
                  setIsProfessionalModalOpen(false);
                  setEditingProfessional(null);
                  setNewProfessional({ 
                    name: '', 
                    phone: '', 
                    password: '', 
                    commission_percentage: '40', 
                    photo_url: '',
                    working_hours_type: 'shop',
                    custom_start_time: '08:00',
                    custom_end_time: '20:00'
                  });
                  setErrorStatus(null);
                }} className={`${theme === 'dark' ? 'text-[#ddc1ae] hover:text-white' : 'text-[#a48c7a] hover:text-black'}`}>
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col items-center mb-4 pt-1">
                <div className="relative group">
                  <div className={`w-20 h-20 rounded-3xl overflow-hidden border-2 border-[#C5A059] shadow-2xl bg-${theme === 'dark' ? '[#1a1a1a]' : '[#f5f5f5]'} flex items-center justify-center transition-all ${!newProfessional.photo_url ? 'grayscale opacity-50' : ''}`}>
                    {newProfessional.photo_url ? (
                      <img src={newProfessional.photo_url} alt="Profissional" className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={32} className="text-[#C5A059]" />
                    )}
                  </div>
                  <button 
                    type="button"
                    onClick={() => document.getElementById('prof-photo-upload')?.click()}
                    className="absolute -bottom-2 -right-2 bg-[#C5A059] text-white p-2 rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-black"
                  >
                    <Plus size={16} strokeWidth={3} />
                  </button>
                  <input 
                    id="prof-photo-upload"
                    type="file" 
                    accept="image/*"
                    className="hidden" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const base64 = await resizeImage(file, 1080, 1080);
                        setNewProfessional({ ...newProfessional, photo_url: base64 });
                      }
                    }}
                  />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] mt-4 opacity-70">Foto do Profissional (1080x1080)</p>
              </div>

              <form onSubmit={handleSaveProfessional} className="space-y-4">
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#8B7344]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>Nome do Profissional</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: João Silva"
                    className={`w-full ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f5f5f5]'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#C5A059] transition-all`}
                    value={newProfessional.name}
                    onChange={e => setNewProfessional({ ...newProfessional, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#8B7344]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>Comissão (%)</label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    max="100"
                    placeholder="Ex: 40"
                    className={`w-full ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f5f5f5]'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#C5A059] transition-all`}
                    value={newProfessional.commission_percentage}
                    onChange={e => setNewProfessional({ ...newProfessional, commission_percentage: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#8B7344]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>Telefone (Login)</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: 11999999999"
                    className={`w-full ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f5f5f5]'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#C5A059] transition-all`}
                    value={newProfessional.phone}
                    onChange={e => setNewProfessional({ ...newProfessional, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#8B7344]' : 'text-[#a48c7a]'} uppercase tracking-widest`}>Senha de Acesso</label>
                  <input 
                    required={!editingProfessional}
                    type="password" 
                    placeholder="••••••••"
                    className={`w-full ${theme === 'dark' ? 'bg-[#131313]' : 'bg-[#f5f5f5]'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-xl p-3 focus:outline-none focus:border-[#C5A059] transition-all`}
                    value={newProfessional.password}
                    onChange={e => setNewProfessional({ ...newProfessional, password: e.target.value })}
                  />
                </div>

                <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-gray-50 border-black/5'} space-y-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Clock size={16} className="text-[#C5A059]" />
                       <label className={`text-[10px] font-extrabold ${theme === 'dark' ? 'text-white' : 'text-black'} uppercase tracking-widest`}>Horário de Trabalho</label>
                    </div>
                    <div className="flex bg-black/20 p-1 rounded-lg">
                      <button 
                        type="button"
                        onClick={() => setNewProfessional({ ...newProfessional, working_hours_type: 'shop' })}
                        className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${newProfessional.working_hours_type === 'shop' ? 'bg-[#C5A059] text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                      >
                        Unidade
                      </button>
                      <button 
                        type="button"
                        onClick={() => setNewProfessional({ ...newProfessional, working_hours_type: 'custom' })}
                        className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${newProfessional.working_hours_type === 'custom' ? 'bg-[#C5A059] text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                      >
                        Personalizado
                      </button>
                    </div>
                  </div>

                  {newProfessional.working_hours_type === 'shop' ? (
                    <div className="flex items-center gap-2 opacity-60">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <p className="text-[10px] font-bold uppercase tracking-tight">Seguindo horário padrão da unidade</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold opacity-50 uppercase block">Início</label>
                        <input 
                          type="time" 
                          value={newProfessional.custom_start_time}
                          onChange={e => setNewProfessional({ ...newProfessional, custom_start_time: e.target.value })}
                          className={`w-full ${theme === 'dark' ? 'bg-black/40' : 'bg-white'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-lg p-2 text-xs focus:border-[#C5A059] outline-none transition-all`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold opacity-50 uppercase block">Fim</label>
                        <input 
                          type="time" 
                          value={newProfessional.custom_end_time}
                          onChange={e => setNewProfessional({ ...newProfessional, custom_end_time: e.target.value })}
                          className={`w-full ${theme === 'dark' ? 'bg-black/40' : 'bg-white'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} rounded-lg p-2 text-xs focus:border-[#C5A059] outline-none transition-all`}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {!editingProfessional && (
                  <div className="p-4 bg-[#C5A059]/5 rounded-xl border border-[#C5A059]/10">
                     <p className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest mb-1">Nota</p>
                     <p className="text-xs opacity-70">Este telefone será usado pelo profissional para realizar o login no sistema.</p>
                  </div>
                )}

                {errorStatus && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-3 rounded-xl text-center">
                    {errorStatus}
                  </div>
                )}

                <button 
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-[#C5A059] text-white py-3.5 rounded-xl font-bold uppercase tracking-widest mt-4 hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#C5A059]/10 disabled:opacity-50"
                >
                  {isLoading ? 'Salvando...' : (editingProfessional ? 'Atualizar Profissional' : 'Cadastrar Profissional')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(deletingPlan || deletingBarbershop || deletingService || deletingProfessional || deletingClient) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setDeletingPlan(null);
                setDeletingBarbershop(null);
                setDeletingService(null);
                setDeletingProfessional(null);
                setDeletingClient(null);
              }}
              className="absolute inset-0 bg-[#000]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative ${theme === 'dark' ? 'bg-[#20201f] border-white/10' : 'bg-white border-black/5'} w-full max-w-sm rounded-2xl p-8 shadow-2xl border transition-colors duration-300`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {deletingClient ? "Tem certeza que deseja excluir o cliente?" : "Tem certeza?"}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} mb-6`}>
                  {deletingClient ? (
                    <>Deseja realmente excluir o cliente <strong>{deletingClient?.name}</strong>? Esta ação não pode ser desfeita.</>
                  ) : (
                    <>Deseja realmente excluir <strong>{deletingPlan?.name || deletingBarbershop?.name || deletingService?.name || deletingProfessional?.name}</strong>? Esta ação não pode ser desfeita.</>
                  )}
                </p>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button 
                    onClick={() => {
                      setDeletingPlan(null);
                      setDeletingBarbershop(null);
                      setDeletingService(null);
                      setDeletingProfessional(null);
                      setDeletingClient(null);
                    }}
                    className={`py-3 rounded-xl font-bold text-sm ${theme === 'dark' ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-black/5 text-black hover:bg-black/10'} transition-all`}
                  >
                    {deletingClient ? "CANCELAR" : "NÃO"}
                  </button>
                  <button 
                    onClick={() => {
                      if (deletingPlan) handleDeletePlan();
                      else if (deletingBarbershop) handleDeleteBarbershop();
                      else if (deletingService) handleDeleteService();
                      else if (deletingProfessional) handleDeleteProfessional();
                      else if (deletingClient) handleDeleteClient();
                    }}
                    className="py-3 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                  >
                    {deletingClient ? "SIM" : "SIM, EXCLUIR"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cancelModalData && cancelModalData.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancelModalData(null)}
              className="absolute inset-0 bg-[#000]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative ${theme === 'dark' ? 'bg-[#20201f] border-white/10' : 'bg-white border-black/5'} w-full max-w-sm rounded-2xl p-8 shadow-2xl border transition-colors duration-300`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Cancelar Agendamento?</h3>
                
                <div className={`text-sm ${theme === 'dark' ? 'text-[#ddc1ae]' : 'text-[#a48c7a]'} mb-6 space-y-2 text-left w-full border-t border-b ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} py-4 mt-2`}>
                  <p className="text-xs text-center font-bold mb-2">Tem certeza que deseja cancelar?</p>
                  <div className="text-xs space-y-1.5 pl-1 font-semibold">
                    <p><strong>Cliente:</strong> {cancelModalData.customerName}</p>
                    <p><strong>Serviço:</strong> {cancelModalData.serviceName}</p>
                    <p><strong>Profissional:</strong> {cancelModalData.professionalName}</p>
                    <p><strong>Data:</strong> {cancelModalData.date.split('-').reverse().join('/')}</p>
                    <p><strong>Horário:</strong> {cancelModalData.time}h</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <button 
                    onClick={() => setCancelModalData(null)}
                    className={`py-3 rounded-xl font-bold text-sm ${theme === 'dark' ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-black/5 text-black hover:bg-black/10'} transition-all`}
                  >
                    NÃO, MANTER
                  </button>
                  <button 
                    onClick={async () => {
                      const { appointmentId, isPortal } = cancelModalData;
                      setCancelModalData(null);
                      if (isPortal) {
                        await handlePortalCancelAppointment(appointmentId);
                      } else {
                        await handleCancelAppointment(appointmentId);
                      }
                    }}
                    className="py-3 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                  >
                    SIM, CANCELAR
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {planToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPlanToDelete(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-sm ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-[32px] p-8 shadow-2xl border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} text-center`}
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              
              <h3 className={`text-xl font-black mb-2 uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                Confirmar Exclusão?
              </h3>
              
              <p className={`text-sm leading-relaxed mb-8 ${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>
                Você está prestes a excluir a assinatura <span className="font-bold text-[#C5A059]">"{planToDelete.name}"</span>. Esta ação não pode ser desfeita.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setPlanToDelete(null)}
                  className={`py-4 rounded-2xl font-bold text-xs uppercase tracking-widest ${theme === 'dark' ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-black/5 text-black hover:bg-black/10'} transition-all`}
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleDeleteSubscriptionPlan}
                  disabled={isLoading}
                  className="py-4 rounded-2xl font-bold text-xs uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                >
                  {isLoading ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLimitAlert && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLimitAlert(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-sm ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-[32px] p-8 shadow-2xl border ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} text-center overflow-hidden`}
            >
              {/* Background gradient glow */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-amber-500 to-red-500" />
              
              <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping opacity-25" />
                <AlertCircle size={40} />
              </div>
              
              <h3 className={`text-2xl font-black mb-3 uppercase tracking-tight leading-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                Limite Atingido!
              </h3>
              
              <p className={`text-sm leading-relaxed mb-8 ${theme === 'dark' ? 'text-white/60' : 'text-black/60'} font-medium`}>
                Você já utilizou todos os <span className="text-[#C5A059] font-bold">{clientPortalUser?.subscription_plan?.limit_count} agendamentos</span> inclusos no seu plano <span className="text-[#C5A059] font-bold">"{clientPortalUser?.subscription_plan?.name}"</span> para este mês.
              </p>

              <div className="space-y-3">
                <button 
                  onClick={() => setShowLimitAlert(false)}
                  className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-gradient-to-r from-[#C5A059] to-[#8B7344] text-white hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#C5A059]/20"
                >
                  Entendido
                </button>
                <button 
                  onClick={() => {
                    setShowLimitAlert(false);
                    document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-white/40 hover:text-white/60' : 'text-black/40 hover:text-black/60'} transition-all`}
                >
                  Ver Outros Planos
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChangePasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsChangePasswordModalOpen(false);
                setChangePasswordError(null);
                setChangePasswordSuccess(null);
              }}
              className="absolute inset-0 bg-[#000]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative ${theme === 'dark' ? 'bg-[#20201f] border-white/10 text-white' : 'bg-white border-black/5 text-black'} w-full max-w-md rounded-2xl p-8 shadow-2xl border transition-colors duration-300 z-10`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold uppercase tracking-tight text-[#C5A059] italic">Alterar Senha de Acesso</h3>
                <button 
                  onClick={() => {
                    setIsChangePasswordModalOpen(false);
                    setChangePasswordError(null);
                    setChangePasswordSuccess(null);
                  }}
                  className={`p-1.5 rounded-lg ${theme === 'dark' ? 'hover:bg-white/5 text-white/50 hover:text-white' : 'hover:bg-black/5 text-black/50 hover:text-black'} transition-colors`}
                >
                  <X size={18} />
                </button>
              </div>

              {changePasswordSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="text-sm font-bold text-green-400">{changePasswordSuccess}</p>
                  <button
                    onClick={() => {
                      setIsChangePasswordModalOpen(false);
                      setChangePasswordError(null);
                      setChangePasswordSuccess(null);
                    }}
                    className="mt-4 px-6 py-2.5 bg-[#C5A059] text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
                  >
                    Fechar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>Senha Atual</label>
                    <input 
                      type="password"
                      required
                      value={changePasswordForm.currentPassword}
                      onChange={e => setChangePasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Sua senha atual"
                      className={`w-full px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-black/20 border-white/10 focus:border-[#C5A059]' : 'bg-white border-black/15 focus:border-[#C5A059]'} focus:outline-none transition-all text-sm`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>Nova Senha</label>
                    <input 
                      type="password"
                      required
                      value={changePasswordForm.newPassword}
                      onChange={e => setChangePasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Crie sua nova senha"
                      className={`w-full px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-black/20 border-white/10 focus:border-[#C5A059]' : 'bg-white border-black/15 focus:border-[#C5A059]'} focus:outline-none transition-all text-sm`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>Confirmar Nova Senha</label>
                    <input 
                      type="password"
                      required
                      value={changePasswordForm.confirmPassword}
                      onChange={e => setChangePasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirme sua nova senha"
                      className={`w-full px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-black/20 border-white/10 focus:border-[#C5A059]' : 'bg-white border-black/15 focus:border-[#C5A059]'} focus:outline-none transition-all text-sm`}
                    />
                  </div>

                  {changePasswordError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-3 rounded-xl text-center">
                      {changePasswordError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => {
                        setIsChangePasswordModalOpen(false);
                        setChangePasswordError(null);
                        setChangePasswordSuccess(null);
                      }}
                      className={`py-3 rounded-xl font-bold text-xs uppercase tracking-wider ${theme === 'dark' ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-black/5 text-black hover:bg-black/10'} transition-all`}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      disabled={isChangingPasswordLoading}
                      className="py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#C5A059] text-white hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#C5A059]/20 disabled:opacity-50"
                    >
                      {isChangingPasswordLoading ? 'Salvando...' : 'Confirmar'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}

        {zoomedImage && (
          <div 
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn"
            onClick={() => setZoomedImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setZoomedImage(null)}
                className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]"
              >
                Fechar <X size={20} />
              </button>
              <img 
                src={zoomedImage} 
                className="max-w-full max-h-[80vh] rounded-3xl shadow-2xl border border-white/10"
                alt="Zoom"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
