import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBudgets, setBudget } from '../features/budgets/budgetSlice';
import { fetchCategories } from '../features/categories/categorySlice';
import api from '../api/axios';
import { Plus, PieChart, TrendingDown, Target, Trash2, Calendar } from 'lucide-react';

const BudgetsPage = () => {
  const dispatch = useDispatch();
  const { items: budgets, isLoading } = useSelector((state) => state.budgets);
  const { items: categories } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.auth);

  const [showForm, setShowForm] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    dispatch(fetchBudgets({ month, year }));
    dispatch(fetchCategories());
  }, [dispatch, month, year]);

  const handleSetBudget = async (e) => {
    e.preventDefault();
    const result = await dispatch(setBudget({
        ...formData,
        category_id: formData.category_id === '' ? null : parseInt(formData.category_id),
        amount: parseFloat(formData.amount),
        month,
        year
    }));

    if (!result.error) {
        setShowForm(false);
        dispatch(fetchBudgets({ month, year }));
    }
  };

  const handleDelete = async (id) => {
     if (window.confirm('Remove this budget limit?')) {
        await api.delete(`/budgets/${id}`);
        dispatch(fetchBudgets({ month, year }));
     }
  };

  const totalBudget = budgets.reduce((acc, b) => acc + Number(b.amount), 0);
  const totalSpent = budgets.reduce((acc, b) => acc + Number(b.spent), 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-outfit font-bold text-slate-900 dark:text-slate-100">Finix Budgets</h1>
          <p className="text-slate-500 dark:text-slate-400">Plan your spending and stay on track with Finix.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-white dark:bg-slate-800 py-1 px-1 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <select 
              value={month} 
              onChange={(e) => setMonth(Number(e.target.value))}
              className="text-sm font-bold px-3 py-2 outline-none border-none bg-transparent dark:text-slate-100"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={i+1}>{new Date(2000, i).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
            <select 
              value={year} 
              onChange={(e) => setYear(Number(e.target.value))}
              className="text-sm font-bold px-3 py-2 outline-none border-none bg-transparent dark:text-slate-100"
            >
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            {showForm ? 'Cancel' : <><Plus size={20} /> Set Budget</>}
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-premium p-6">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Monthly Budget</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{user?.currency || '$'}{totalBudget.toLocaleString()}</h3>
        </div>
        <div className="card-premium p-6">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Spent</p>
          <h3 className="text-2xl font-bold text-rose-500 mt-1">{user?.currency || '$'}{totalSpent.toLocaleString()}</h3>
        </div>
        <div className="card-premium p-6">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Remaining</p>
          <h3 className="text-2xl font-bold text-emerald-500 mt-1">{user?.currency || '$'}{(totalBudget - totalSpent).toLocaleString()}</h3>
        </div>
      </div>

      {showForm && (
        <div className="card-premium p-6 bg-indigo-50/30 dark:bg-indigo-500/10 border-2 border-indigo-100 dark:border-indigo-500/20">
           <form onSubmit={handleSetBudget} className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category (Optional for Global)</label>
              <select 
                className="input-field bg-white dark:bg-slate-900/50"
                value={formData.category_id}
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              >
                <option value="">Month-wide (Total Spending)</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Budget Amount</label>
              <input 
                type="number" 
                required
                className="input-field bg-white dark:bg-slate-900/50"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>
            <button type="submit" className="btn-primary h-11 px-8 shadow-md shadow-indigo-100">Apply Budget</button>
          </form>
        </div>
      )}

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center italic text-slate-400">Loading your budget plans...</div>
        ) : budgets.length === 0 ? (
          <div className="col-span-full card-premium p-12 text-center text-slate-400">
            <PieChart size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-bold">No budgets set for this month</p>
            <p>Setting budgets helps you save more and control spending.</p>
          </div>
        ) : budgets.map(budget => (
          <div key={budget.id} className="card-premium p-6 space-y-4 group">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <Target size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">{budget.category_name || 'Total Spending'}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Limit: {user?.currency || '$'}{Number(budget.amount).toLocaleString()}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(budget.id)}
                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-600 dark:text-slate-400">Usage: {Math.round(budget.usage_percentage)}%</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{user?.currency || '$'}{Number(budget.spent).toLocaleString()}</span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    budget.usage_percentage > 90 ? 'bg-rose-500' : budget.usage_percentage > 70 ? 'bg-amber-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${budget.usage_percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-50 dark:border-slate-700/50 flex justify-between items-center text-xs">
               <span className="text-slate-400 flex items-center gap-1">
                 <Calendar size={12} /> {new Date(year, month - 1).toLocaleString('default', { month: 'short' })} {year}
               </span>
               <span className={`font-bold ${budget.remaining < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                 {budget.remaining < 0 ? 'Over' : 'Left'}: {user?.currency || '$'}{Math.abs(budget.remaining).toLocaleString()}
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetsPage;
