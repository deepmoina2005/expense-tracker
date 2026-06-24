import { useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactions } from '../features/transactions/transactionSlice';
import { fetchBudgets } from '../features/budgets/budgetSlice';
import { fetchSavings } from '../features/savings/savingsSlice';
import { fetchNotifications } from '../features/notifications/notificationSlice';
import { ArrowUpCircle, 
  ArrowDownCircle, 
  Wallet, 
  TrendingUp, 
  Plus,
  AlertCircle,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.preferences);
  const isDark = theme === 'dark';
  const { items: transactions, isLoading: txLoading } = useSelector((state) => state.transactions);
  const { items: budgets } = useSelector((state) => state.budgets);
  const { goals: savings } = useSelector((state) => state.savings);
  const { items: notifications } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchBudgets({ month: new Date().getMonth() + 1, year: new Date().getFullYear() }));
    dispatch(fetchSavings());
    dispatch(fetchNotifications());
  }, [dispatch]);

  const summary = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
    const totalSavings = savings.reduce((acc, s) => acc + Number(s.current_amount), 0);
    return { income, expense, balance: income - expense, savings: totalSavings };
  }, [transactions, savings]);

  const categoryBreakdown = useMemo(() => {
    const breakdown = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
       const key = t.category_name || 'Uncategorized';
       breakdown[key] = (breakdown[key] || 0) + Number(t.amount);
    });
    return Object.keys(breakdown).map(name => ({
      name,
      total: breakdown[name],
      color: transactions.find(t => t.category_name === name)?.category_color || '#6366F1'
    })).sort((a, b) => b.total - a.total);
  }, [transactions]);

  const isLoading = txLoading;

  if (isLoading) return <div className="p-8"><div className="animate-pulse space-y-4 shadow-sm p-4 bg-white dark:bg-slate-800 dark:text-slate-300 rounded-2xl">Loading Dashboard...</div></div>;

  const summaryCards = [
    { label: 'Total Balance', value: summary.balance, icon: Wallet, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/15' },
    { label: 'Monthly Income', value: summary.income, icon: ArrowUpCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/15' },
    { label: 'Monthly Expense', value: summary.expense, icon: ArrowDownCircle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/15' },
    { label: 'Total Savings', value: summary.savings, icon: TrendingUp, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/15' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-outfit font-bold text-slate-900 dark:text-slate-100">Finix Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back, {user?.full_name}. Here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, i) => (
          <div key={i} className="card-premium p-6">
            <div className="flex justify-between items-start mb-4 relative">
              <div className={`${card.bg} ${card.color} p-3 rounded-xl`}>
                <card.icon size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {user?.currency || '$'} {card.value.toLocaleString()}
            </h3>
          </div>
        ))}
      </div>

      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart */}
        <div className="lg:col-span-2 card-premium p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Expense Breakdown</h3>
          </div>
          <div className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryBreakdown}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#E2E8F0'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: isDark ? 'rgba(51,65,85,0.5)' : '#F1F5F9'}} 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backgroundColor: isDark ? '#1E293B' : '#FFFFFF', color: isDark ? '#E2E8F0' : '#1E293B'}}
                  labelStyle={{color: isDark ? '#94A3B8' : '#64748B'}}
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={40}>
                   {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown (Donut) */}
        <div className="card-premium p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Spending Distribution</h3>
          <div className="h-[250px] w-full min-h-[250px] relative">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="total"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backgroundColor: isDark ? '#1E293B' : '#FFFFFF', color: isDark ? '#E2E8F0' : '#1E293B'}}
                  labelStyle={{color: isDark ? '#94A3B8' : '#64748B'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Activities & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="card-premium h-fit">
          <div className="p-6 border-b border-slate-50 dark:border-slate-700/50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Transactions</h3>
            <NavLink to="/dashboard/transactions" className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:underline">
              View All <ChevronRight size={16} />
            </NavLink>
          </div>
          <div className="p-0 overflow-hidden">
            {transactions.slice(0, 5).map((tx, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{tx.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{tx.category_name} • {new Date(tx.transaction_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${tx.type === 'expense' ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {tx.type === 'expense' ? '-' : '+'}{user?.currency || '$'}{Number(tx.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts from Notifications */}
        <div className="space-y-6">
           <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 px-2 flex items-center gap-2">
            <Sparkles size={20} className="text-amber-500" /> System Alerts
          </h3>
          {notifications.filter(n => !n.is_read).slice(0, 3).map((n, i) => (
            <div key={i} className={`p-5 rounded-2xl border-l-4 flex gap-4 ${
              n.type === 'warning' ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-500' : 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500'
            }`}>
              <div>
                <AlertCircle className={n.type === 'warning' ? 'text-amber-500' : 'text-indigo-500'} size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{n.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
          {notifications.filter(n => !n.is_read).length === 0 && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
               <p className="text-slate-400 text-sm italic">Add more transactions to trigger system alerts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
