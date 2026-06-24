import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivityLogs } from '../features/activity/activitySlice';
import { 
  History, 
  Clock, 
  Package, 
  Database, 
  Key, 
  Trash2, 
  PlusCircle, 
  RefreshCw,
  Search,
  Filter,
  Shield,
  Settings as SettingsIcon,
  Wallet,
  Target,
  TrendingUp,
  Activity as ActivityIcon,
  Calendar,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { format, isToday, isYesterday, parseISO, formatDistanceToNow } from 'date-fns';

const ActivityPage = () => {
  const dispatch = useDispatch();
  const { logs, isLoading } = useSelector((state) => state.activity);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    dispatch(fetchActivityLogs(100));
  }, [dispatch]);

  // Activity Configuration
  const activityConfig = {
    TRANSACTION: { icon: Wallet, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    BUDGET: { icon: Target, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    SAVINGS: { icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    SECURITY: { icon: Shield, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-500/10' },
    SETTINGS: { icon: SettingsIcon, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
    LOGIN: { icon: Key, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    OTHER: { icon: ActivityIcon, color: 'text-slate-400', bg: 'bg-slate-50 dark:bg-slate-500/10' }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.entity_type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'ALL' || log.entity_type === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [logs, searchTerm, activeFilter]);

  const stats = useMemo(() => {
    const todayCount = logs.filter(l => isToday(parseISO(l.created_at))).length;
    const weeklyCount = logs.filter(l => {
       const d = parseISO(l.created_at);
       const weekAgo = new Date();
       weekAgo.setDate(weekAgo.getDate() - 7);
       return d > weekAgo;
    }).length;
    return {
      total: logs.length,
      today: todayCount,
      weekly: weeklyCount,
      lastAction: logs[0] ? formatDistanceToNow(parseISO(logs[0].created_at)) + ' ago' : 'N/A'
    };
  }, [logs]);

  // Grouping Logic
  const groupedLogs = useMemo(() => {
    const groups = {};
    filteredLogs.forEach(log => {
      const date = parseISO(log.created_at);
      let groupKey = 'Earlier';
      if (isToday(date)) groupKey = 'Today';
      else if (isYesterday(date)) groupKey = 'Yesterday';
      else groupKey = format(date, 'MMMM dd, yyyy');

      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(log);
    });
    return groups;
  }, [filteredLogs]);

  const getEntityIcon = (entity) => {
    const config = activityConfig[entity] || activityConfig.OTHER;
    return <config.icon className={config.color} size={18} />;
  };

  const ActivitySkeleton = () => (
    <div className="animate-pulse space-y-4 p-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex gap-4">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
          <div className="flex-1 space-y-2 py-1">
             <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4"></div>
             <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-outfit font-bold text-slate-900 dark:text-slate-100">Audit Center</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time chronicle of every action within your Finix ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm w-full lg:w-64 dark:text-slate-100"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Events', value: stats.total, icon: History, color: 'text-indigo-600' },
          { label: 'Today\'s Pulse', value: stats.today, icon: ActivityIcon, color: 'text-emerald-600' },
          { label: 'Weekly Momentum', value: stats.weekly, icon: TrendingUp, color: 'text-amber-600' },
          { label: 'Last Update', value: stats.lastAction, icon: Clock, color: 'text-slate-500' },
        ].map((card, i) => (
          <div key={i} className="card-premium p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-900 ${card.color}`}>
              <card.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">{card.label}</p>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-3 space-y-4">
           <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 px-1 flex items-center gap-2">
             <Filter size={16} className="text-indigo-500" /> Filter by Entity
           </h3>
           <div className="flex flex-col gap-1">
             {['ALL', 'TRANSACTION', 'BUDGET', 'SAVINGS', 'SECURITY', 'SETTINGS'].map(filter => (
               <button 
                 key={filter}
                 onClick={() => setActiveFilter(filter)}
                 className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                   activeFilter === filter 
                   ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                   : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-600'
                 }`}
               >
                 <span>{filter.charAt(0) + filter.slice(1).toLowerCase()}</span>
                 {activeFilter === filter && <ActivityIcon size={14} className="animate-pulse" />}
               </button>
             ))}
           </div>
        </div>

        {/* Timeline List */}
        <div className="lg:col-span-9 space-y-12 relative">
          {/* Timeline Vertical Rail */}
          <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-slate-800 hidden md:block"></div>

          {isLoading ? (
            <div className="card-premium p-0"><ActivitySkeleton /></div>
          ) : Object.keys(groupedLogs).length === 0 ? (
            <div className="card-premium p-20 text-center text-slate-400 border-2 border-dashed border-slate-100 dark:border-slate-800">
              <History size={64} className="mx-auto mb-6 opacity-10" />
              <p className="text-xl font-bold font-outfit">No Activity matching your filters</p>
              <p className="text-sm mt-2">Try clearing your search or category filters.</p>
              <button 
                onClick={() => {setSearchTerm(''); setActiveFilter('ALL');}}
                className="mt-6 px-6 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 font-bold rounded-xl text-sm"
              >Clear All Filters</button>
            </div>
          ) : (
            Object.keys(groupedLogs).map((group) => (
              <div key={group} className="space-y-6 relative">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 z-10 flex items-center justify-center shrink-0">
                       <Calendar size={18} className="text-indigo-600" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-outfit">{group}</h2>
                 </div>

                 <div className="space-y-4 md:ml-6 md:pl-8">
                   {groupedLogs[group].map((log) => {
                     const config = activityConfig[log.entity_type] || activityConfig.OTHER;
                     return (
                       <div key={log.id} className="group relative flex flex-col md:flex-row md:items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:shadow-xl hover:shadow-slate-100 dark:hover:shadow-none transition-all duration-300">
                          <div className="flex items-start gap-5">
                             <div className={`p-3 rounded-xl shrink-0 ${config.bg}`}>
                                {getEntityIcon(log.entity_type)}
                             </div>
                             <div>
                                <div className="flex items-center gap-2 mb-1">
                                   <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">{log.description}</p>
                                   <span className={`text-[9px] font-black px-1.5 py-0.5 rounded leading-none uppercase ${config.bg} ${config.color}`}>
                                      {log.entity_type}
                                   </span>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                                   <span className="flex items-center gap-1"><Clock size={12}/> {formatDistanceToNow(parseISO(log.created_at))} ago</span>
                                   <span>•</span>
                                   <span className="flex items-center gap-1 uppercase">ID: {log.id.toString().slice(-4)}</span>
                                </div>
                             </div>
                          </div>
                          <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end gap-6 border-t md:border-0 pt-3 md:pt-0 border-slate-50 dark:border-slate-800">
                             <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{format(parseISO(log.created_at), 'HH:mm:ss')}</p>
                             <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg">
                                   <ChevronRight size={18} />
                                </button>
                             </div>
                          </div>
                       </div>
                     );
                   })}
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
