import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Users, 
  UserCircle, 
  BarChart3, 
  Filter, 
  ArrowUpRight, 
  Download,
  Percent,
  Search,
  User,
  Clock,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { Appointment, Service, Professional } from '../types';

interface FinancialERPProps {
  appointments: Appointment[];
  services: Service[];
  professionals: Professional[];
  theme: 'dark' | 'light';
  userRole?: 'master' | 'barber' | 'professional';
  userId?: string;
}

type PeriodPreset = 'today' | '7days' | 'this_month' | 'last_month' | 'custom';

export function FinancialERP({ appointments, services, professionals, theme, userRole, userId }: FinancialERPProps) {
  const loggedInProfessional = useMemo(() => {
    if (userRole !== 'professional' || !userId) return null;
    return professionals.find(p => p.id === userId) || null;
  }, [professionals, userRole, userId]);

  const commissionPercentage = useMemo(() => {
    if (!loggedInProfessional) return 40;
    return loggedInProfessional.commission_percentage !== undefined 
      ? loggedInProfessional.commission_percentage 
      : 40;
  }, [loggedInProfessional]);

  // Helper to extract the price for a service, applying commission if logged in as professional
  const getDisplayPrice = (appt: Appointment) => {
    const fullPrice = appt.service?.price || 0;
    if (userRole === 'professional') {
      const pId = appt.professional_id;
      const pObj = professionals.find(p => p.id === pId) || loggedInProfessional;
      const pct = pObj && pObj.commission_percentage !== undefined ? pObj.commission_percentage : 40;
      return (fullPrice * pct) / 100;
    }
    return fullPrice;
  };

  // Filters State
  const [period, setPeriod] = useState<PeriodPreset>('this_month');
  const [startDateStr, setStartDateStr] = useState<string>(() => {
    const d = new Date();
    // Default to start of current month (relative to current date 2026-06-03)
    const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
    return firstDay.toISOString().split('T')[0];
  });
  const [endDateStr, setEndDateStr] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  
  // Search state in period list
  const [searchQuery, setSearchQuery] = useState('');
  
  // Metric Mode (Faturamento vs. Volume) Group Tabs
  const [chartMode, setChartMode] = useState<'revenue' | 'volume'>('revenue');

  // Computed Date Range boundary matching selection
  const filterDateRange = useMemo(() => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    if (period === 'today') {
      start = new Date(today);
      end = new Date(today);
    } else if (period === '7days') {
      start = new Date(today);
      start.setDate(today.getDate() - 6);
      end = new Date(today);
    } else if (period === 'this_month') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else if (period === 'last_month') {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
    } else if (period === 'custom') {
      return {
        start: new Date(startDateStr + 'T00:00:00'),
        end: new Date(endDateStr + 'T23:59:59')
      };
    }

    // Set times to full boundaries
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }, [period, startDateStr, endDateStr]);

  // Handle setting fast preset dates for state feedback
  const handlePeriodChange = (val: PeriodPreset) => {
    setPeriod(val);
    const today = new Date();
    if (val === 'today') {
      const todayStr = today.toISOString().split('T')[0];
      setStartDateStr(todayStr);
      setEndDateStr(todayStr);
    } else if (val === '7days') {
      const start = new Date(today);
      start.setDate(today.getDate() - 6);
      setStartDateStr(start.toISOString().split('T')[0]);
      setEndDateStr(today.toISOString().split('T')[0]);
    } else if (val === 'this_month') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      setStartDateStr(start.toISOString().split('T')[0]);
      setEndDateStr(end.toISOString().split('T')[0]);
    } else if (val === 'last_month') {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      setStartDateStr(start.toISOString().split('T')[0]);
      setEndDateStr(end.toISOString().split('T')[0]);
    }
  };

  // Filtered appointments lists
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appt => {
      if (!appt.date) return false;
      const apptDate = new Date(appt.date + 'T12:00:00'); // Prevent timezone offset shift
      return apptDate >= filterDateRange.start && apptDate <= filterDateRange.end;
    });
  }, [appointments, filterDateRange]);

  // Non-cancelled appointments for revenue metrics
  const activeAppointments = useMemo(() => {
    return filteredAppointments.filter(a => a.status !== 'cancelled');
  }, [filteredAppointments]);

  // ERP Metrics Calculations
  const metrics = useMemo(() => {
    // 1. Receita Realizada (Status = 'completed')
    const completedRevenue = activeAppointments
      .filter(a => a.status === 'completed')
      .reduce((sum, a) => sum + getDisplayPrice(a), 0);

    // 2. Receita Prevista / Agendada (Status = 'pending' or 'confirmed')
    const scheduledRevenue = activeAppointments
      .filter(a => a.status === 'pending' || a.status === 'confirmed')
      .reduce((sum, a) => sum + getDisplayPrice(a), 0);

    // 3. Receita Total (Soma de tudo não cancelado)
    const totalRevenue = activeAppointments.reduce((sum, a) => sum + getDisplayPrice(a), 0);

    // 4. Número total de atendimento ativo
    const totalCount = activeAppointments.length;

    // 5. Ticket Médio
    const ticketMedio = totalCount > 0 ? (totalRevenue / totalCount) : 0;

    // 6. Taxa de Cancelamento
    const totalIncludingCancelled = filteredAppointments.length;
    const cancelledCount = filteredAppointments.filter(a => a.status === 'cancelled').length;
    const cancellationRate = totalIncludingCancelled > 0 ? (cancelledCount / totalIncludingCancelled) * 100 : 0;

    // 7. Busiest Day of the period
    const dayMap = new Map<string, number>();
    activeAppointments.forEach(a => {
      const d = a.date;
      dayMap.set(d, (dayMap.get(d) || 0) + 1);
    });
    let peakDay = '-';
    let maxDayCount = 0;
    dayMap.forEach((count, d) => {
      if (count > maxDayCount) {
        maxDayCount = count;
        peakDay = d;
      }
    });

    let peakDayFormatted = '-';
    if (peakDay !== '-') {
      const parts = peakDay.split('-');
      peakDayFormatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    // 8. Busiest Professional
    const profMap = new Map<string, { name: string; count: number; earnings: number }>();
    activeAppointments.forEach(a => {
      const profId = a.professional_id;
      const profName = a.professional?.name || 'Profissional';
      const prev = profMap.get(profId) || { name: profName, count: 0, earnings: 0 };
      profMap.set(profId, {
        name: profName,
        count: prev.count + 1,
        earnings: prev.earnings + getDisplayPrice(a)
      });
    });

    let topProfName = '-';
    let maxProfCount = 0;
    profMap.forEach((data) => {
      if (data.count > maxProfCount) {
        maxProfCount = data.count;
        topProfName = data.name;
      }
    });

    // 9. Busiest Services Rank
    const serviceMap = new Map<string, { name: string; count: number; earnings: number }>();
    activeAppointments.forEach(a => {
      const sId = a.service_id;
      const sName = a.service?.name || 'Serviço';
      const prev = serviceMap.get(sId) || { name: sName, count: 0, earnings: 0 };
      serviceMap.set(sId, {
        name: sName,
        count: prev.count + 1,
        earnings: prev.earnings + getDisplayPrice(a)
      });
    });

    const servicesRanked = Array.from(serviceMap.values())
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 3);

    const professionalsRanked = Array.from(profMap.values())
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 3);

    return {
      completedRevenue,
      scheduledRevenue,
      totalRevenue,
      totalCount,
      ticketMedio,
      cancellationRate,
      peakDay: peakDayFormatted,
      peakDayCount: maxDayCount,
      topProfName,
      topProfCount: maxProfCount,
      servicesRanked,
      professionalsRanked
    };
  }, [filteredAppointments, activeAppointments, getDisplayPrice]);

  // Chart data building: Group by single days within filtered interval
  const chartData = useMemo(() => {
    // Collect all unique day ticks
    const days: string[] = [];
    const dateCursor = new Date(filterDateRange.start);
    // Limit safety (max 35 days in layout representation to keep it crisp)
    let iterLimit = 0;
    while (dateCursor <= filterDateRange.end && iterLimit < 35) {
      days.push(dateCursor.toISOString().split('T')[0]);
      dateCursor.setDate(dateCursor.getDate() + 1);
      iterLimit++;
    }

    // Map metrics for each day
    return days.map(dayStr => {
      const dayAppts = activeAppointments.filter(a => a.date === dayStr);
      const totalRev = dayAppts.reduce((sum, a) => sum + getDisplayPrice(a), 0);
      const parts = dayStr.split('-');
      const label = `${parts[2]}/${parts[1]}`; // e.g. "03/06"

      return {
        dateStr: dayStr,
        label,
        revenue: totalRev,
        volume: dayAppts.length
      };
    });
  }, [activeAppointments, filterDateRange, getDisplayPrice]);

  // Find max value in chart data to scale the SVG bars properly
  const chartMax = useMemo(() => {
    const key = chartMode;
    const maxVal = Math.max(...chartData.map(d => d[key]), 0);
    return maxVal === 0 ? 100 : maxVal;
  }, [chartData, chartMode]);

  // Search filter in table listing
  const searchedAppointments = useMemo(() => {
    if (!searchQuery.trim()) return filteredAppointments;
    const query = searchQuery.toLowerCase();
    return filteredAppointments.filter(appt => {
      return (
        appt.customer_name.toLowerCase().includes(query) ||
        appt.customer_phone.includes(query) ||
        (appt.service?.name || '').toLowerCase().includes(query) ||
        (appt.professional?.name || '').toLowerCase().includes(query)
      );
    });
  }, [filteredAppointments, searchQuery]);

  // Format currencies beautifully
  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-[#1c1b1b] border-white/5' : 'bg-white border-[#C5A059]/10 shadow-md'} rounded-3xl p-6 border flex flex-col h-full gap-6`}>
      
      {/* HEADER WITH FILTERS AND ACTIONS */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#C5A059]/10">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-[#C5A059]" />
            <h3 className="font-black text-lg uppercase tracking-tight text-[#C5A059] italic">
              {userRole === 'professional' ? 'Controle de Comissões' : 'Painel de Gestão Financeira'}
            </h3>
          </div>
          <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest bg-[#C5A059]/5 px-2 py-0.5 rounded text-[#8B7344]">
            {userRole === 'professional' ? `Sua comissão: ${commissionPercentage}%` : 'Faturamento Unificado'}
          </p>
        </div>

        {/* Filters Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Quick Preset Selector */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">Periodo</span>
            <div className="relative">
              <select 
                value={period} 
                onChange={(e) => handlePeriodChange(e.target.value as PeriodPreset)}
                className={`w-full appearance-none px-4 py-2 text-xs font-bold rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-[#121212] border-white/10 text-white' 
                    : 'bg-black/5 border-black/5 text-black'
                } pr-10 focus:outline-none focus:border-[#C5A059]`}
              >
                <option value="today">Hoje</option>
                <option value="7days">Últimos 7 dias</option>
                <option value="this_month">Este Mês</option>
                <option value="last_month">Mês Passado</option>
                <option value="custom">Período Customizado</option>
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none opacity-55">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
 
          {/* Custom Date Picker Inputs */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">Intervalo Customizado</span>
            <div className="flex gap-2">
              <input 
                type="date" 
                value={startDateStr}
                disabled={period !== 'custom'}
                onChange={(e) => setStartDateStr(e.target.value)}
                className={`w-1/2 px-3 py-2 text-xs font-mono font-bold rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-[#121212] border-white/10 text-white' 
                    : 'bg-black/5 border-black/5 text-black'
                } focus:outline-none focus:border-[#C5A059] disabled:opacity-40`}
              />
              <input 
                type="date" 
                value={endDateStr}
                disabled={period !== 'custom'}
                onChange={(e) => setEndDateStr(e.target.value)}
                className={`w-1/2 px-3 py-2 text-xs font-mono font-bold rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-[#121212] border-white/10 text-white' 
                    : 'bg-black/5 border-black/5 text-black'
                } focus:outline-none focus:border-[#C5A059] disabled:opacity-40`}
              />
            </div>
          </div>
        </div>
      </div>
 
      {/* CORE FINANCIAL INDICATOR TILES */}
      <div className="grid grid-cols-2 gap-3">
        {/* Receita TOTAL Card */}
        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#121212] border-white/5' : 'bg-[#fafafa] border-black/5'}`}>
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-bold uppercase tracking-widest opacity-50">
              {userRole === 'professional' ? 'Comissão Total' : 'Receita Total'}
            </span>
            <DollarSign size={14} className="text-green-500" />
          </div>
          <h4 className="text-xl font-mono font-black text-green-500 mt-2 truncate">
            {formatBRL(metrics.totalRevenue)}
          </h4>
          
          <div className="mt-2 text-[8px] font-bold uppercase tracking-wider space-y-1 opacity-70">
            <div className="flex justify-between">
              <span>{userRole === 'professional' ? 'Recebido/Concluido:' : 'Realizado:'}</span>
              <span className="text-[#8B7344] font-mono">{formatBRL(metrics.completedRevenue)}</span>
            </div>
            <div className="flex justify-between text-[#C5A059]">
              <span>{userRole === 'professional' ? 'A Receber/Agendado:' : 'Agendado:'}</span>
              <span className="font-mono">{formatBRL(metrics.scheduledRevenue)}</span>
            </div>
          </div>
        </div>
 
        {/* Quantidade Consultas Card */}
        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#121212] border-white/5' : 'bg-[#fafafa] border-black/5'}`}>
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-bold uppercase tracking-widest opacity-50">Total Serviços</span>
            <Sparkles size={14} className="text-[#C5A059]" />
          </div>
          <h4 className="text-xl font-mono font-black text-[#C5A059] mt-2">
            {metrics.totalCount} <span className="text-xs font-normal opacity-50">atend.</span>
          </h4>
          
          <div className="mt-2 text-[8px] font-bold uppercase tracking-wider space-y-1 opacity-70">
            <div className="flex justify-between">
              <span>{userRole === 'professional' ? 'Média p/ Atend.:' : 'Ticket Médio:'}</span>
              <span className="text-[#8B7344] font-mono">{formatBRL(metrics.ticketMedio)}</span>
            </div>
            <div className="flex justify-between text-red-500">
              <span>Cancelamento:</span>
              <span className="font-mono">{metrics.cancellationRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
 
      {/* QUICK BUSINESS RATINGS & PEAK METRICS */}
      <div className={`grid grid-cols-2 gap-4 p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}>
        <div className="space-y-1">
          <p className="text-[8px] font-bold uppercase tracking-widest opacity-55">Dia de Pico</p>
          <p className="text-xs font-black truncate text-[#C5A059]">{metrics.peakDay}</p>
          <p className="text-[9px] font-mono opacity-50 uppercase">{metrics.peakDayCount} Atendimentos</p>
        </div>
        <div className="space-y-1 border-l border-white/10 pl-3">
          <p className="text-[8px] font-bold uppercase tracking-widest opacity-55">Líder da Equipe</p>
          <p className="text-xs font-black truncate text-[#C5A059]">{metrics.topProfName}</p>
          <p className="text-[9px] font-mono opacity-50 uppercase">{metrics.topProfCount} Serviços</p>
        </div>
      </div>
 
      {/* HISTOGRAM BAR CHART (HIGH FIDELITY CUSTOM IMPLEMENTATION) */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-black uppercase tracking-tight flex items-center gap-1.5">
            <BarChart3 size={12} className="text-[#C5A059]" />
            Relatório de Performance
          </h4>
          
          {/* Chart Mode Toggle Buttons */}
          <div className="flex bg-white/5 p-0.5 rounded-lg border border-[#C5A059]/10 text-[9px]">
            <button 
              onClick={() => setChartMode('revenue')}
              className={`px-2 py-1 rounded-md font-bold uppercase tracking-wider ${chartMode === 'revenue' ? 'bg-[#C5A059] text-white' : 'opacity-60 hover:opacity-100'}`}
            >
              {userRole === 'professional' ? 'Minha Comissão' : 'Faturamento'}
            </button>
            <button 
              onClick={() => setChartMode('volume')}
              className={`px-2 py-1 rounded-md font-bold uppercase tracking-wider ${chartMode === 'volume' ? 'bg-[#C5A059] text-white' : 'opacity-60 hover:opacity-100'}`}
            >
              Atendimentos
            </button>
          </div>
        </div>

        {/* SVG/Tailwind Custom Responsive Interactive Bar Chart */}
        <div className={`h-40 ${theme === 'dark' ? 'bg-[#121212]' : 'bg-[#fafafa]'} p-4 rounded-xl border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} flex flex-col justify-end relative shadow-inner`}>
          {chartData.length === 0 ? (
            <p className="text-center py-10 text-xs opacity-40 italic">Nenhum dado financeiro para este período.</p>
          ) : (
            <div className="flex items-end h-full gap-1.5 overflow-x-auto overflow-y-hidden pb-1 pt-4 scrollbar-thin scrollbar-thumb-white/10">
              {chartData.map((dataDay, idx) => {
                const currentVal = dataDay[chartMode];
                const pct = currentVal > 0 ? (currentVal / chartMax) * 100 : 0;
                
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center min-w-[24px] h-full group relative justify-end">
                    
                    {/* CUSTOM HOVER TOOLTIP ELEMENT */}
                    <div className="absolute bottom-full mb-1 bg-[#1c1b1b] border border-[#C5A059]/30 text-white p-2 rounded-lg text-[9px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-xl flex flex-col gap-0.5">
                      <span className="font-bold opacity-60">{dataDay.dateStr.split('-').reverse().join('/')}</span>
                      <span className="text-[#C5A059] font-bold">
                        {userRole === 'professional' ? 'Comissão: ' : 'Faturamento: '}
                        {formatBRL(dataDay.revenue)}
                      </span>
                      <span className="text-green-500 font-bold">Atendimentos: {dataDay.volume}</span>
                    </div>

                    {/* Interactive Bar */}
                    <div 
                      className={`w-full rounded-t-sm transition-all duration-500 hover:brightness-125 ${
                        chartMode === 'revenue' 
                          ? 'bg-gradient-to-t from-green-600 to-[#C5A059]' 
                          : 'bg-gradient-to-t from-[#8B7344] to-[#C5A059]'
                      }`}
                      style={{ height: `${Math.max(pct, currentVal > 0 ? 6 : 0)}%` }}
                    ></div>
                    
                    {/* Horizontal Date Stamp Labels (Only show some if there are too many) */}
                    <span className="text-[8px] font-mono mt-2 opacity-50 scale-90 select-none group-hover:opacity-100 group-hover:text-[#C5A059] group-hover:font-bold">
                      {chartData.length > 15 && idx % 3 !== 0 ? '' : dataDay.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* DETAILED STATISTICS PROGRESS BARS RANKINGS */}
      <div className="grid grid-cols-2 gap-4">
        {/* Top 3 Services */}
        <div className="space-y-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#C5A059] block">Top Serviços</span>
          <div className="space-y-1.5">
            {metrics.servicesRanked.map((s, index) => {
              const maxEarnings = metrics.servicesRanked[0]?.earnings || 100;
              const percent = (s.earnings / maxEarnings) * 100;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="truncate max-w-[80px]">{s.name}</span>
                    <span className="font-mono">{formatBRL(s.earnings)}</span>
                  </div>
                  <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#C5A059] to-[#D4AF37] rounded-full" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
            {metrics.servicesRanked.length === 0 && (
              <span className="text-[9px] opacity-40 italic">Sem registros</span>
            )}
          </div>
        </div>

        {/* Top 3 Professionals */}
        <div className="space-y-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#C5A059] block">Top Equipe</span>
          <div className="space-y-1.5">
            {metrics.professionalsRanked.map((p, index) => {
              const maxEarnings = metrics.professionalsRanked[0]?.earnings || 100;
              const percent = (p.earnings / maxEarnings) * 100;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="truncate max-w-[80px]">{p.name}</span>
                    <span className="font-mono">{formatBRL(p.earnings)}</span>
                  </div>
                  <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-[#C5A059] rounded-full" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
            {metrics.professionalsRanked.length === 0 && (
              <span className="text-[9px] opacity-40 italic">Sem registros</span>
            )}
          </div>
        </div>
      </div>

      {/* APPOINTMENT DRILLDOWN (CLIENT SEARCH LIST) */}
      <div className="space-y-3 pt-2 border-t border-[#C5A059]/10 flex-1 flex flex-col min-h-[250px]">
        <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">
            Atendimentos no Período ({searchedAppointments.length})
          </span>
          {/* Quick Search */}
          <div className="relative w-full sm:w-44">
            <span className="absolute left-2.5 top-2 opacity-40 text-gray-500">
              <Search size={12} />
            </span>
            <input 
              type="text"
              placeholder="Buscar cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-[10px] pl-7 pr-3 py-1 rounded-lg border focus:outline-none ${
                theme === 'dark' 
                  ? 'bg-[#121212] border-white/10 text-white focus:border-[#C5A059]' 
                  : 'bg-black/5 border-[#C5A059]/10 text-black focus:border-[#C5A059]'
              }`}
            />
          </div>
        </div>

        {/* Vertical list of matching records */}
        <div className="flex-1 overflow-y-auto max-h-60 pr-1 space-y-2 mt-1">
          {searchedAppointments.map((appt) => {
            const formattedDate = appt.date ? appt.date.split('-').reverse().join('/') : '-';
            
            const badges: Record<string, string> = {
              pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
              confirmed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
              completed: 'bg-green-500/10 text-green-600 border-green-500/20',
              cancelled: 'bg-red-500/10 text-red-600 border-red-500/20'
            };

            const labels: Record<string, string> = {
              pending: 'PENDENTE',
              confirmed: 'CONFIRMADO',
              completed: 'CONCLUÍDO',
              cancelled: 'CANCELADO'
            };

            return (
              <div 
                key={appt.id} 
                className={`p-3 rounded-xl border text-xs flex justify-between items-center gap-3 transition-colors ${
                  theme === 'dark' ? 'bg-[#121212] border-white/5 hover:bg-white/5' : 'bg-white border-[#C5A059]/10 hover:bg-[#C5A059]/5'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg bg-[#C5A059]/5 shrink-0">
                    <User size={12} className="text-[#C5A059]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold truncate">{appt.customer_name}</p>
                    <p className="text-[10px] opacity-60 truncate flex items-center gap-1">
                      <span>{appt.service?.name}</span>
                      <span>•</span>
                      <span>{appt.professional?.name}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-bold text-green-600 font-mono">
                    {formatBRL(getDisplayPrice(appt))}
                    {userRole === 'professional' && appt.service?.price && (
                      <span className="block text-[9px] opacity-40 font-normal line-through">
                        {formatBRL(appt.service.price)}
                      </span>
                    )}
                  </p>
                  <p className="text-[9px] opacity-50 font-mono mt-0.5 whitespace-nowrap flex items-center justify-end gap-1">
                    <Calendar size={8} /> {formattedDate} - {appt.time.slice(0, 5)}
                  </p>
                  {/* Status Badge */}
                  <span className={`inline-block px-1.5 py-0.5 rounded-md text-[8px] font-bold border mt-1 ${badges[appt.status] || ''}`}>
                    {labels[appt.status] || appt.status.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}

          {searchedAppointments.length === 0 && (
            <p className="text-center py-6 text-xs opacity-40 italic">Sem correspondências.</p>
          )}
        </div>
      </div>
      
    </div>
  );
}
