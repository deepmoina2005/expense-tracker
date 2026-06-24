import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchNotifications, 
  markAllAsRead, 
  markAsRead, 
  deleteNotification 
} from '../features/notifications/notificationSlice';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Trash2, 
  MailOpen, 
  Clock, 
  Filter, 
  Shield, 
  Zap, 
  Check,
  MoreVertical,
  X,
  Inbox,
  AlertCircle
} from 'lucide-react';
import { format, formatDistanceToNow, parseISO } from 'date-fns';

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { items, isLoading, unreadCount } = useSelector((state) => state.notifications);
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    dispatch(fetchNotifications(false));
  }, [dispatch]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (activeFilter === 'UNREAD') return !item.is_read;
      if (activeFilter === 'ALERTS') return item.type === 'warning' || item.type === 'error';
      if (activeFilter === 'SYSTEM') return item.type === 'system' || item.type === 'info';
      return true;
    });
  }, [items, activeFilter]);

  const stats = useMemo(() => ({
    unread: unreadCount,
    total: items.length,
    alerts: items.filter(n => n.type === 'warning' || n.type === 'error').length
  }), [items, unreadCount]);

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
      case 'error': return { icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' };
      case 'success': return { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' };
      case 'system':
      case 'info': return { icon: Info, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' };
      default: return { icon: Bell, color: 'text-slate-400', bg: 'bg-slate-50 dark:bg-slate-500/10' };
    }
  };

  const Skeleton = () => (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-24 bg-slate-50 dark:bg-slate-800/50 rounded-2xl"></div>
      ))}
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-outfit font-bold text-slate-900 dark:text-slate-100">Inbox</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your financial alerts and system notifications.</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button 
              onClick={() => dispatch(markAllAsRead())}
              className="btn-primary flex items-center gap-2 h-11 px-5 shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              <MailOpen size={18} /> Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Unread', value: stats.unread, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10' },
          { label: 'Critical Alerts', value: stats.alerts, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-500/10' },
          { label: 'Total Messages', value: stats.total, icon: Inbox, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
        ].map((card, i) => (
          <div key={i} className="card-premium p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{card.value}</p>
            </div>
            <div className={`${card.bg} ${card.color} p-3 rounded-xl`}>
              <card.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-1">
        {[
          { id: 'ALL', label: 'All Messages', icon: Inbox },
          { id: 'UNREAD', label: `Unread (${unreadCount})`, icon: Zap },
          { id: 'ALERTS', label: 'Alerts', icon: AlertTriangle },
          { id: 'SYSTEM', label: 'System', icon: Shield }
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold transition-all relative ${
              activeFilter === filter.id 
              ? 'text-indigo-600' 
              : 'text-slate-500 hover:text-indigo-600'
            }`}
          >
            <filter.icon size={16} />
            {filter.label}
            {activeFilter === filter.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {isLoading ? (
          <Skeleton />
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const config = getIcon(item.type);
            return (
              <div 
                key={item.id} 
                className={`group relative p-6 bg-white dark:bg-slate-900 border rounded-2xl transition-all duration-300 ${
                  !item.is_read 
                  ? 'border-indigo-100 dark:border-indigo-500/20 shadow-lg shadow-indigo-100/20 dark:shadow-none' 
                  : 'border-slate-100 dark:border-slate-800 opacity-80'
                }`}
              >
                <div className="flex gap-5">
                  <div className={`shrink-0 p-3 rounded-xl h-fit ${config.bg} ${config.color}`}>
                    <config.icon size={24} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                         <h3 className={`font-bold ${!item.is_read ? 'text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
                           {item.title}
                         </h3>
                         {!item.is_read && <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse shadow-glow shadow-indigo-500"></div>}
                      </div>
                      <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                        <Clock size={12} /> {formatDistanceToNow(parseISO(item.created_at))} ago
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed md:pr-12">
                      {item.message}
                    </p>
                  </div>
                </div>

                {/* Hover Actions */}
                <div className="absolute top-6 right-6 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!item.is_read && (
                    <button 
                      onClick={() => dispatch(markAsRead(item.id))}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg tooltip-container"
                      title="Mark as Read"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => dispatch(deleteNotification(item.id))}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg"
                    title="Delete Notification"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell size={40} className="text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-xl font-bold font-outfit text-slate-800 dark:text-slate-200">Total Clarity</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              You've cleared your inbox. Any future financial alerts or budget warnings will appear here.
            </p>
            {activeFilter !== 'ALL' && (
              <button 
                onClick={() => setActiveFilter('ALL')}
                className="text-indigo-600 font-bold text-sm hover:underline"
              >
                View all messages
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
