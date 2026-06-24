import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden dark-transition">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-linear-to-br from-indigo-500/20 via-violet-500/10 to-transparent dark:from-indigo-500/10 dark:via-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-linear-to-tl from-violet-500/10 to-transparent dark:from-violet-500/5 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-full text-sm font-semibold text-indigo-700 dark:text-indigo-300 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <Sparkles size={14} className="text-indigo-500" />
              Smart Finance. Smarter Decisions.
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-outfit font-extrabold text-slate-900 dark:text-white leading-[1.05] tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Manage Your Money{' '}
              <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                Smarter with Finix
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Track income, expenses, budgets, and savings in one powerful platform. 
              Gain total financial clarity and reach your goals faster.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all active:scale-[0.98]"
              >
                Get Started with Finix
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                Sign In
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-8 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              <div>
                <p className="text-2xl font-outfit font-bold text-slate-900 dark:text-white">10K+</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">Tracks</p>
              </div>
              <div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />
              <div>
                <p className="text-2xl font-outfit font-bold text-slate-900 dark:text-white">500+</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">Users</p>
              </div>
              <div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />
              <div>
                <p className="text-2xl font-outfit font-bold text-slate-900 dark:text-white">₹2Cr+</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">Managed</p>
              </div>
            </div>
          </div>

          {/* Right - Dashboard Preview */}
          <div className="relative hidden lg:block animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-700/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
              {/* Mock Dashboard */}
              <div className="bg-slate-50 dark:bg-slate-900 p-1 dark-transition">
                {/* Title bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-950 rounded-t-2xl border-b border-slate-100 dark:border-slate-800 dark-transition">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="flex-1 mx-8 text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">app.finix.finance</span>
                  </div>
                </div>

                {/* Dashboard content mock */}
                <div className="bg-white dark:bg-slate-950 p-6 space-y-5 rounded-b-2xl dark-transition">
                  {/* Stat cards row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Balance', value: '₹49,000', color: 'from-indigo-500 to-violet-500' },
                      { label: 'Income', value: '₹56,000', color: 'from-emerald-500 to-teal-500' },
                      { label: 'Expense', value: '₹7,000', color: 'from-rose-500 to-pink-500' },
                    ].map((card) => (
                      <div key={card.label} className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/50 dark-transition">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{card.label}</p>
                        <p className={`text-lg font-bold bg-linear-to-r ${card.color} bg-clip-text text-transparent`}>{card.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chart mock */}
                  <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/50 dark-transition">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Spending Trends</p>
                      <div className="flex gap-2">
                        <div className="w-8 h-3 bg-indigo-500/20 rounded-full" />
                        <div className="w-8 h-3 bg-violet-500/20 rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-end gap-2.5 justify-center h-28">
                      {[60, 45, 80, 35, 55, 70, 40].map((h, i) => (
                        <div
                          key={i}
                          className="w-full max-w-[24px] rounded-t-lg bg-linear-to-t from-indigo-500/80 to-violet-400/80 dark:from-indigo-600/60 dark:to-violet-500/60"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Transaction rows mock */}
                  <div className="space-y-2">
                    {[
                      { name: 'Groceries', amount: '-₹1,200', type: 'expense', time: 'Today' },
                      { name: 'Salary Credit', amount: '+₹56,000', type: 'income', time: 'Yesterday' },
                    ].map((tx) => (
                      <div key={tx.name} className="flex items-center justify-between px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/50 dark-transition">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-100/50 dark:bg-emerald-500/10' : 'bg-rose-100/50 dark:bg-rose-500/10'}`}>
                            <div className={`w-2 h-2 rounded-full ${tx.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{tx.name}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide">{tx.time}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                          {tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating accent elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-linear-to-br from-violet-500 to-indigo-500 rounded-2xl blur-2xl opacity-40 dark:opacity-20 animate-pulse" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-30 dark:opacity-10" />
            
            {/* Trust badge floating */}
            <div className="absolute top-1/2 -right-8 -translate-y-1/2 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 hidden xl:block animate-bounce [animation-duration:3s]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Sparkles className="text-emerald-600 dark:text-emerald-400" size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Secure Data</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">256-bit AES Encryption</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
