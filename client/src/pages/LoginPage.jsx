import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, reset } from '../features/auth/authSlice';
import { Wallet, Mail, Lock, Loader2, Rocket } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200 mb-4">
            <Wallet className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-outfit font-bold text-slate-900">Welcome back to Finix</h1>
          <p className="text-slate-500 mt-2 text-center">Manage your finances smarter and achieve your goals faster with our advanced tracker.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={onSubmit} className="space-y-6">
            {isError && (
              <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100">
                {message}
              </div>
            )}

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
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Rocket size={20} />}
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-slate-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-bold hover:underline">Create Account</Link>
          </p>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-slate-400 text-xs uppercase tracking-widest font-bold">
          Secure • Encrypted • Private
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
