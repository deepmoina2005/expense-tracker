import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactions } from '../features/transactions/transactionSlice';
import { 
  FileText, 
  Download, 
  Calendar as CalIcon, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Hash, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart as PieIcon,
  BarChart3,
  LineChart as LineIcon,
  Sparkles,
  Search,
  ChevronRight
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

const ReportsPage = () => {
  const dispatch = useDispatch();
  const { items: transactions, isLoading } = useSelector((state) => state.transactions);
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.preferences);
  const isDark = theme === 'dark';
  
  const [filterType, setFilterType] = useState('all');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [useCustomRange, setUseCustomRange] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    end: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Combined Filtering Logic
  const filteredData = useMemo(() => {
    return transactions.filter(t => {
      const d = parseISO(t.transaction_date);
      const typeMatch = filterType === 'all' || t.type === filterType;
      
      let dateMatch = false;
      if (useCustomRange) {
        dateMatch = isWithinInterval(d, { 
          start: new Date(dateRange.start), 
          end: new Date(dateRange.end) 
        });
      } else {
        dateMatch = d.getMonth() + 1 === month && d.getFullYear() === year;
      }
      
      return typeMatch && dateMatch;
    });
  }, [transactions, filterType, month, year, useCustomRange, dateRange]);

  // Trend Data for Last 6 Months
  const trendData = useMemo(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const targetDate = subMonths(new Date(), i);
      const m = targetDate.getMonth() + 1;
      const y = targetDate.getFullYear();
      const monthLabel = format(targetDate, 'MMM');
      
      const monthTxs = transactions.filter(t => {
        const d = parseISO(t.transaction_date);
        return d.getMonth() + 1 === m && d.getFullYear() === y;
      });

      const income = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
      const expense = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
      
      data.push({ name: monthLabel, income, expense, balance: income - expense });
    }
    return data;
  }, [transactions]);

  // Category Breakdown Data
  const categoryData = useMemo(() => {
    const breakdown = {};
    filteredData.filter(t => t.type === 'expense').forEach(t => {
      const key = t.category_name || 'Uncategorized';
      breakdown[key] = (breakdown[key] || 0) + Number(t.amount);
    });
    return Object.keys(breakdown).map(name => ({
      name,
      value: breakdown[name],
      color: transactions.find(t => t.category_name === name)?.category_color || '#6366F1'
    })).sort((a, b) => b.value - a.value);
  }, [filteredData, transactions]);

  const summary = useMemo(() => {
    const income = filteredData.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const expense = filteredData.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    return {
      income,
      expense,
      savings: income - expense,
      count: filteredData.length
    };
  }, [filteredData]);

  const insights = useMemo(() => {
    const topCategory = categoryData[0]?.name || 'N/A';
    const expenseRatio = summary.income > 0 ? (summary.expense / summary.income) * 100 : 0;
    
    // MoM Calculation
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const currentExpense = transactions.filter(t => {
      const d = parseISO(t.transaction_date);
      return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear && t.type === 'expense';
    }).reduce((s, t) => s + Number(t.amount), 0);

    const prevExpense = transactions.filter(t => {
      const d = parseISO(t.transaction_date);
      return d.getMonth() + 1 === lastMonth && d.getFullYear() === lastYear && t.type === 'expense';
    }).reduce((s, t) => s + Number(t.amount), 0);

    const growth = prevExpense > 0 ? ((currentExpense - prevExpense) / prevExpense) * 100 : 0;

    return { topCategory, expenseRatio, growth };
  }, [categoryData, summary.income, summary.expense, transactions]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(99, 102, 241); // Finix Indigo
    doc.text('Finix Financial Report', 14, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 32);
    doc.text(`Period: ${useCustomRange ? `${dateRange.start} to ${dateRange.end}` : `${month}/${year}`}`, 14, 37);

    // Summary Section
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 45, 182, 30, 3, 3, 'F');
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text('REVENUE', 20, 55);
    doc.text('EXPENSES', 80, 55);
    doc.text('NET SAVINGS', 140, 55);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${user?.currency || '$'}${summary.income.toLocaleString()}`, 20, 65);
    doc.text(`${user?.currency || '$'}${summary.expense.toLocaleString()}`, 80, 65);
    doc.text(`${user?.currency || '$'}${summary.savings.toLocaleString()}`, 140, 65);

    let y = 90;
    doc.setFontSize(12);
    doc.setTextColor(50);
    doc.text('Transaction Details', 14, y);
    y += 10;
    
    // Header Table
    doc.setFillColor(99, 102, 241);
    doc.rect(14, y, 182, 8, 'F');
    doc.setTextColor(255);
    doc.setFontSize(9);
    doc.text('Date', 18, y + 5);
    doc.text('Description', 45, y + 5);
    doc.text('Category', 110, y + 5);
    doc.text('Amount', 170, y + 5);
    
    y += 12;
    doc.setTextColor(60);
    doc.setFont('helvetica', 'normal');

    filteredData.forEach(t => {
      if (y > 275) { doc.addPage(); y = 20; }
      doc.text(format(parseISO(t.transaction_date), 'MM/dd/yy'), 18, y);
      doc.text(t.title.substring(0, 35), 45, y);
      doc.text(t.category_name || 'N/A', 110, y);
      doc.text(`${t.type === 'expense' ? '-' : '+'}${user?.currency || '$'}${Number(t.amount).toLocaleString()}`, 170, y);
      y += 8;
    });

    doc.save(`finix_report_${format(new Date(), 'yyyyMMdd')}.pdf`);
  };

  const generateCSV = () => {
    if (filteredData.length === 0) return alert('No data to export');
    try {
      const csv = [
        ['Date', 'Title', 'Category', 'Type', 'Amount', 'Payment Method', 'Note'],
        ...filteredData.map(t => [
          t.transaction_date, t.title, t.category_name, t.type, t.amount, t.payment_method, t.note
        ])
      ].map(r => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `finix_export_${format(new Date(), 'yyyyMMdd')}.csv`;
      link.click();
    } catch (err) { alert('Export failed'); }
  };

  const colors = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 fade-in pb-20">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
               <BarChart3 size={20} />
             </div>
             <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Analytics Dashboard</span>
          </div>
          <h1 className="text-3xl font-outfit font-bold text-slate-900 dark:text-slate-100">Financial Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Deep insights into your spending patterns and capital growth.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
           <button onClick={generatePDF} className="btn-secondary group flex items-center gap-2 h-11 px-5 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
             <FileText size={18} className="text-rose-500" /> 
             <span className="font-bold text-sm">PDF Report</span>
           </button>
           <button onClick={generateCSV} className="btn-secondary group flex items-center gap-2 h-11 px-5 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
             <Download size={18} className="text-emerald-500" />
             <span className="font-bold text-sm">Spreadsheet</span>
           </button>
        </div>
      </div>

      {/* Filter Architecture */}
      <div className="card-premium p-6 border-slate-200/60 dark:border-slate-800 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
              <button 
                onClick={() => setUseCustomRange(false)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${!useCustomRange ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
              >Standard</button>
              <button 
                onClick={() => setUseCustomRange(true)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${useCustomRange ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
              >Custom Range</button>
           </div>

           <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

           <div className="flex items-center gap-2">
             <Filter size={16} className="text-slate-400" />
             <select 
               className="bg-transparent text-sm font-bold outline-none dark:text-slate-300"
               value={filterType}
               onChange={e => setFilterType(e.target.value)}
             >
               <option value="all">Everything</option>
               <option value="income">Credits Only</option>
               <option value="expense">Debits Only</option>
             </select>
           </div>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          {useCustomRange ? (
            <div className="flex items-center gap-2 w-full">
              <input 
                type="date" 
                className="input-field py-2 text-xs w-full lg:w-auto"
                value={dateRange.start}
                onChange={e => setDateRange({...dateRange, start: e.target.value})}
              />
              <span className="text-slate-400 text-sm">to</span>
              <input 
                type="date" 
                className="input-field py-2 text-xs w-full lg:w-auto"
                value={dateRange.end}
                onChange={e => setDateRange({...dateRange, end: e.target.value})}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <select className="input-field py-2 text-xs font-bold w-full" value={month} onChange={e => setMonth(Number(e.target.value))}>
                {[...Array(12)].map((_, i) => (
                  <option key={i+1} value={i+1}>{new Date(2000, i).toLocaleString('default', { month: 'long' })}</option>
                ))}
              </select>
              <select className="input-field py-2 text-xs font-bold w-full" value={year} onChange={e => setYear(Number(e.target.value))}>
                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Earnings', value: summary.income, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { label: 'Expenditure', value: summary.expense, icon: TrendingDown, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-500/10' },
          { label: 'Net Surplus', value: summary.savings, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
          { label: 'Transact Volume', value: summary.count, icon: Hash, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10', isRaw: true },
        ].map((card, i) => (
          <div key={i} className="card-premium p-6 flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.label}</span>
               <div className={`${card.bg} ${card.color} p-2 rounded-lg`}>
                 <card.icon size={16} />
               </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {card.isRaw ? card.value : `${user?.currency || '$'}${card.value.toLocaleString()}`}
            </h3>
          </div>
        ))}
      </div>

      {/* Analytics Power Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Trend Chart */}
         <div className="lg:col-span-2 card-premium p-8">
            <div className="flex items-center justify-between mb-8">
               <div>
                 <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Growth Analysis</h3>
                 <p className="text-xs text-slate-500 mt-1">Cash flow trends over the last 6 months</p>
               </div>
               <div className="flex items-center gap-4 text-xs font-bold">
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div> Credits</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div> Debits</div>
               </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#E2E8F0'} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', backgroundColor: isDark ? '#0F172A' : '#FFFFFF'}}
                  />
                  <Area type="monotone" dataKey="income" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={3} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Distribution & Insights */}
         <div className="space-y-8">
            <div className="card-premium p-8 h-fit">
               <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Spending Hub</h3>
               <div className="h-[220px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                        data={categoryData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
               <div className="mt-4 space-y-2">
                 {categoryData.slice(0, 3).map((item, i) => (
                   <div key={i} className="flex items-center justify-between text-xs">
                     <span className="flex items-center gap-2 text-slate-500 font-medium">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                        {item.name}
                     </span>
                     <span className="font-bold text-slate-900 dark:text-slate-200">{user?.currency || '$'}{item.value.toLocaleString()}</span>
                   </div>
                 ))}
               </div>
            </div>

            <div className="card-premium p-8 bg-indigo-600 dark:bg-indigo-600 shadow-indigo-500/20 text-white border-0">
               <div className="flex items-center gap-2 mb-4">
                 <Sparkles size={18} className="text-indigo-200" />
                 <h3 className="font-bold">Finix Insights</h3>
               </div>
               <div className="space-y-4">
                  <div className="p-4 bg-white/10 rounded-2xl">
                     <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Top Category</p>
                     <p className="text-lg font-bold">{insights.topCategory}</p>
                  </div>
                  <div className="flex items-center justify-between px-1">
                     <div className="flex items-center gap-2">
                       {insights.growth >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                       <span className="text-sm font-medium">Expense Growth</span>
                     </div>
                     <span className="font-bold text-lg">{Math.abs(Math.round(insights.growth))}%</span>
                  </div>
                  <p className="text-xs opacity-80 leading-relaxed italic">
                    "Your spending on {insights.topCategory} represents your largest debit volume this period."
                  </p>
               </div>
            </div>
         </div>
      </div>

      {/* Detailed Ledger Recap */}
      <div className="card-premium overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
           <h3 className="font-bold text-slate-900 dark:text-slate-100">Detailed Ledger Table</h3>
           <span className="text-xs font-bold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full">{filteredData.length} Records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold">
               <tr>
                 <th className="px-6 py-4">Status</th>
                 <th className="px-6 py-4">Transaction Details</th>
                 <th className="px-6 py-4">Category</th>
                 <th className="px-6 py-4 text-right">Volume</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
               {filteredData.slice(0, 10).map((t, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                       <div className={`w-2 h-2 rounded-full ${t.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                    </td>
                    <td className="px-6 py-4">
                       <p className="font-bold text-slate-800 dark:text-slate-200">{t.title}</p>
                       <p className="text-[10px] text-slate-500">{format(parseISO(t.transaction_date), 'MMM dd, yyyy')}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{t.category_name}</td>
                    <td className={`px-6 py-4 text-right font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-slate-800 dark:text-slate-200'}`}>
                      {t.type === 'income' ? '+' : '-'}{user?.currency || '$'}{Number(t.amount).toLocaleString()}
                    </td>
                 </tr>
               ))}
             </tbody>
          </table>
          {filteredData.length > 10 && (
            <div className="p-4 text-center border-t border-slate-100 dark:border-slate-800">
               <span className="text-xs text-slate-400 italic">...and {filteredData.length - 10} additional records</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
