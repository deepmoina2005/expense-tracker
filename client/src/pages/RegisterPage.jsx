import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, reset } from '../features/auth/authSlice';
import { Wallet, Mail, Lock, User, Loader2, Sparkles } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    currency: 'USD'
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token, isLoading, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token || user) {
      navigate('/dashboard');
    }
    dispatch(reset());
  }, [user, token, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200 mb-4">
            <Wallet className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-outfit font-bold text-slate-900">Create your Finix account</h1>
          <p className="text-slate-500 mt-2 text-center">Join thousand of users managing their finances effectively with Finix.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={onSubmit} className="space-y-5">
            {isError && (
              <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100">
                {message}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={onChange}
                  required
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  required
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                  required
                  placeholder="min. 6 characters"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={onChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium appearance-none cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="INR">INR (₹)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              Create Account
            </button>
          </form>

          <p className="mt-8 text-center text-slate-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
