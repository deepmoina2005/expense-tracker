import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, addTransaction, deleteTransaction } from '../features/transactions/transactionSlice';
import { fetchCategories } from '../features/categories/categorySlice';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Calendar,
  MoreVertical,
  ArrowUpRight,
  ArrowDownLeft,
  X
} from 'lucide-react';
import { format } from 'date-fns';

const TransactionsPage = () => {
  const dispatch = useDispatch();
  const { items: transactions, isLoading } = useSelector((state) => state.transactions);
  const { items: categories } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.auth);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    search: '',
    category_id: ''
  });

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category_id: '',
    transaction_date: format(new Date(), 'yyyy-MM-dd'),
    note: '',
    payment_method: 'Cash',
    is_recurring: false,
    recurring_type: 'monthly'
  });

  useEffect(() => {
    dispatch(fetchTransactions(filters));
    dispatch(fetchCategories());
  }, [dispatch, filters]);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    const result = await dispatch(addTransaction({
      ...formData,
      amount: parseFloat(formData.amount),
      category_id: parseInt(formData.category_id)
    }));

    if (!result.error) {
      setIsModalOpen(false);
      setFormData({
         title: '', amount: '', type: 'expense', category_id: '', 
         transaction_date: format(new Date(), 'yyyy-MM-dd'), note: '', payment_method: 'Cash',
         is_recurring: false, recurring_type: 'monthly'
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(deleteTransaction(id));
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-outfit font-bold text-slate-900 dark:text-slate-100">Finix Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400">View and manage all your financial records within the Finix ecosystem.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> Add New
        </button>
      </div>

      {/* Filters Bar */}
      <div className="card-premium p-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none border-none focus:ring-2 focus:ring-indigo-500/10 text-sm dark:text-slate-100"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
        <select 
          className="bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2 text-sm border-none outline-none focus:ring-2 focus:ring-indigo-500/10 dark:text-slate-100"
          value={filters.type}
          onChange={(e) => setFilters({...filters, type: e.target.value})}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select 
          className="bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2 text-sm border-none outline-none focus:ring-2 focus:ring-indigo-500/10 dark:text-slate-100"
          value={filters.category_id}
          onChange={(e) => setFilters({...filters, category_id: e.target.value})}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Transactions Table */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title & Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {isLoading ? (
                <tr><td colSpan="5" className="p-10 text-center text-slate-400 italic">Finding records...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan="5" className="p-10 text-center text-slate-400 italic">No transactions found matching your criteria.</td></tr>
              ) : transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                       <Calendar size={14} className="text-slate-400" />
                       {tx.transaction_date && !isNaN(new Date(tx.transaction_date).getTime()) ? format(new Date(tx.transaction_date), 'MMM dd, yyyy') : 'No Date'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-500">
                         {tx.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{tx.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full" style={{backgroundColor: tx.category_color}}></span>
                          {tx.category_name} 
                          {tx.is_recurring && <span className="bg-amber-100 text-amber-700 px-1 rounded text-[10px]">RECURRING</span>}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                      tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold text-right ${
                    tx.type === 'income' ? 'text-emerald-500' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {tx.type === 'expense' ? '-' : '+'}{user?.currency || '$'} {Number(tx.amount || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleDelete(tx.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl fade-in overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0">
              <h2 className="text-xl font-bold font-outfit dark:text-slate-100">Add New Transaction</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 dark:hover:text-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddTransaction} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Monthly Rent"
                  className="input-field"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Amount</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="input-field"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Type</label>
                  <select 
                    className="input-field"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                <select 
                  required
                  className="input-field"
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {categories.filter(c => c.type === formData.type).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Date</label>
                  <input 
                    type="date" 
                    required
                    className="input-field"
                    value={formData.transaction_date}
                    onChange={(e) => setFormData({...formData, transaction_date: e.target.value})}
                  />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Payment Method</label>
                   <input 
                    type="text" 
                    placeholder="Cash, Bank, card"
                    className="input-field"
                    value={formData.payment_method}
                    onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-2">
                <input 
                  type="checkbox" 
                  id="recurring"
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  checked={formData.is_recurring}
                  onChange={(e) => setFormData({...formData, is_recurring: e.target.checked})}
                />
                <label htmlFor="recurring" className="text-sm font-bold text-slate-700 dark:text-slate-300">Recurring Transaction?</label>
              </div>

              {formData.is_recurring && (
                <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-xl space-y-3 border border-transparent dark:border-indigo-500/20">
                   <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300">Repeat Every</label>
                   <select 
                    className="w-full bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-700 rounded-lg p-2 text-sm outline-none dark:text-slate-100"
                    value={formData.recurring_type}
                    onChange={(e) => setFormData({...formData, recurring_type: e.target.value})}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}

              <footer className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Save Transaction
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
