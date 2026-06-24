import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, addCategory } from '../features/categories/categorySlice';
import api from '../api/axios';
import { Plus, Tag, Trash2, Layers, AlertCircle } from 'lucide-react';

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { items: categories, isLoading } = useSelector((state) => state.categories);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    color: '#6366F1',
    icon: 'Tag'
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(addCategory(formData));
    if (!result.error) {
      setShowForm(false);
      setFormData({ name: '', type: 'expense', color: '#6366F1', icon: 'Tag' });
      dispatch(fetchCategories());
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This cannot be undone.')) {
      try {
        await api.delete(`/categories/${id}`);
        dispatch(fetchCategories());
      } catch (error) {
        alert(error.response?.data?.error || 'Cannot delete default category');
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-outfit font-bold text-slate-900 dark:text-slate-100">Finix Categories</h1>
          <p className="text-slate-500 dark:text-slate-400">Organize your transactions with labels within Finix.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          {showForm ? 'Cancel' : <><Plus size={20} /> Add Category</>}
        </button>
      </div>

      {showForm && (
        <div className="card-premium p-6 border-2 border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-500/10">
          <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category Name</label>
              <input 
                type="text" 
                required
                className="input-field bg-white dark:bg-slate-900/50"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Type</label>
              <select 
                className="input-field bg-white dark:bg-slate-900/50 min-w-[150px]"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Color</label>
              <div className="flex items-center gap-2">
                 <input 
                  type="color" 
                  className="w-12 h-10 border-none rounded-xl cursor-pointer"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary h-11 px-8">Save</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? <div className="p-10 text-center col-span-full italic">Loading categories...</div> : categories.map(cat => (
          <div key={cat.id} className="card-premium p-6 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                style={{ backgroundColor: cat.color }}
              >
                <Tag size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200">{cat.name}</h3>
                <p className={`text-[10px] font-bold uppercase ${cat.type === 'income' ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}>
                   {cat.type} {cat.is_default && '• DEFAULT'}
                </p>
              </div>
            </div>
            {!cat.is_default && (
              <button 
                onClick={() => handleDelete(cat.id)}
                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-amber-50 dark:bg-amber-500/10 border-l-4 border-amber-400 p-4 flex gap-3 text-amber-700 dark:text-amber-500 rounded-r-xl">
        <AlertCircle size={24} />
        <div>
          <p className="text-sm font-bold">Standard Categories</p>
          <p className="text-sm border-amber-700/10 dark:text-amber-500/80">Default categories cannot be deleted as they are essential for basic tracking.</p>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
