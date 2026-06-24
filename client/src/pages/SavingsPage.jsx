import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSavings } from '../features/savings/savingsSlice';
import api from '../api/axios';
import { Target, Plus, TrendingUp, Calendar, Trash2, CheckCircle2, Edit } from 'lucide-react';

const SavingsPage = () => {
  const dispatch = useDispatch();
  const { goals, isLoading } = useSelector((state) => state.savings);
  const { user } = useSelector((state) => state.auth);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [entryGoalId, setEntryGoalId] = useState(null);
  const [entryAmount, setEntryAmount] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    target_amount: '',
    current_amount: '',
    deadline: ''
  });

  useEffect(() => {
    dispatch(fetchSavings());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/savings/${editingId}`, {
          ...formData,
          target_amount: parseFloat(formData.target_amount),
          current_amount: parseFloat(formData.current_amount || 0)
        });
        setEditingId(null);
      } else {
        await api.post('/savings', {
          ...formData,
          target_amount: parseFloat(formData.target_amount),
          current_amount: parseFloat(formData.current_amount || 0)
        });
      }
      setShowForm(false);
      dispatch(fetchSavings());
      setFormData({ title: '', target_amount: '', current_amount: '', deadline: '' });
    } catch (error) {
      alert(error.response?.data?.error || (editingId ? 'Failed to update goal' : 'Failed to create goal'));
    }
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!entryAmount) return;
    const goal = goals.find(g => g.id === entryGoalId);
    const newCurrent = Number(goal.current_amount) + Number(entryAmount);
    try {
      await api.put(`/savings/${entryGoalId}`, {
        current_amount: newCurrent
      });
      setEntryGoalId(null);
      setEntryAmount('');
      dispatch(fetchSavings());
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add entry');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this goal?')) {
      await api.delete(`/savings/${id}`);
      dispatch(fetchSavings());
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-outfit font-bold text-slate-900 dark:text-slate-100">Finix Savings</h1>
          <p className="text-slate-500 dark:text-slate-400">Dream big, save smart, and reach your targets with Finix.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          {showForm ? 'Cancel' : <><Plus size={20} /> {editingId ? 'Update Goal' : 'Create New Goal'}</>}
        </button>
      </div>

      {showForm && (
        <div className="card-premium p-6 border-2 border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-500/10">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Goal Title</label>
              <input 
                type="text" 
                required
                className="input-field bg-white dark:bg-slate-900/50"
                placeholder="e.g. New Car, Trip to Paris"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Target Amount</label>
              <input 
                type="number" 
                required
                className="input-field bg-white dark:bg-slate-900/50"
                placeholder="0.00"
                value={formData.target_amount}
                onChange={(e) => setFormData({...formData, target_amount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Current Saved</label>
              <input 
                type="number" 
                className="input-field bg-white dark:bg-slate-900/50"
                placeholder="0.00"
                value={formData.current_amount}
                onChange={(e) => setFormData({...formData, current_amount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Deadline (Optional)</label>
              <input 
                type="date" 
                className="input-field bg-white dark:bg-slate-900/50 text-sm"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              />
            </div>
            <button type="submit" className="md:col-span-4 btn-primary h-12 mt-2">{editingId ? 'Update Goal' : 'Create Goal'}</button>
          </form>
          {entryGoalId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Add Savings Entry</h2>
            <form onSubmit={handleAddEntry} className="space-y-4">
              <input
                type="number"
                required
                placeholder="Amount"
                className="input-field w-full"
                value={entryAmount}
                onChange={(e) => setEntryAmount(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button type="button" className="btn-secondary" onClick={() => { setEntryGoalId(null); setEntryAmount(''); }}>Cancel</button>
                <button type="submit" className="btn-primary">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-slate-800">
        {isLoading ? (
          <div className="col-span-full py-20 text-center italic text-slate-400">Loading your dreams...</div>
        ) : goals.length === 0 ? (
          <div className="col-span-full card-premium p-12 text-center text-slate-400">
            <Target size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-bold">No savings goals yet</p>
            <p>What are you saving for? Start tracking today!</p>
          </div>
        ) : goals.map(goal => {
          const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
          const isCompleted = progress >= 100;

          return (
            <div key={goal.id} className="card-premium p-6 space-y-5 relative overflow-hidden group">
              {isCompleted && (
                <div className="absolute top-0 right-0 p-2">
                   <div className="bg-emerald-500 text-white px-2 py-1 rounded-bl-xl text-[10px] font-bold flex items-center gap-1">
                     <CheckCircle2 size={12} /> COMPLETED
                   </div>
                </div>
              )}

              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
                <div className="flex">
                  <button 
                    onClick={() => { setEditingId(goal.id); setFormData({ title: goal.title, target_amount: goal.target_amount, current_amount: goal.current_amount, deadline: goal.deadline ? goal.deadline.split('T')[0] : '' }); setShowForm(true); }}
                    className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => { setEntryGoalId(goal.id); setEntryAmount(''); }}
                    className="p-2 text-green-500 hover:bg-green-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Plus size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(goal.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{goal.title}</h3>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mt-1">
                  <Calendar size={14} /> 
                  <span>{goal.deadline ? `By ${new Date(goal.deadline).toLocaleDateString()}` : 'No deadline'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-indigo-600 dark:text-indigo-400 font-outfit uppercase tracking-wider text-[10px]">Progress</span>
                  <span className="dark:text-slate-300">{Math.round(progress)}%</span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                   <div 
                    className={`h-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                    style={{ width: `${progress}%` }}
                   ></div>
                </div>
                <div className="flex justify-between items-end pt-1">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Saved</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{user?.currency || '$'}{Number(goal.current_amount).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Target</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{user?.currency || '$'}{Number(goal.target_amount).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              {!isCompleted && (
                <div className="pt-2">
                   <p className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs text-center text-slate-600 dark:text-slate-400 font-medium border border-transparent dark:border-slate-700/50">
                     You need <span className="text-indigo-600 dark:text-indigo-400 font-bold">{user?.currency || '$'}{(goal.target_amount - goal.current_amount).toLocaleString()}</span> more to reach your goal
                   </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavingsPage;
