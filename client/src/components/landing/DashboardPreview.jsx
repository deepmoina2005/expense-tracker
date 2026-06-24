const DashboardPreview = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden dark-transition">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-linear-to-r from-indigo-500/10 via-violet-500/5 to-purple-500/10 dark:from-indigo-500/5 dark:via-violet-500/2 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-4">
            Dashboard Insight
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-outfit font-extrabold text-slate-900 dark:text-white leading-tight">
            A beautiful workspace built for clarity
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-6">
            Every metric, every transaction, every goal — visible at a glance. No clutter, just insights.
          </p>
        </div>

        {/* Full Dashboard Mock */}
        <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-200/60 dark:border-slate-800/60 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-1000">
          <div className="bg-slate-50 dark:bg-slate-900 p-1.5 dark-transition">
            {/* Window bar */}
            <div className="flex items-center gap-2 px-6 py-4 bg-white dark:bg-slate-950 rounded-t-[2.2rem] border-b border-slate-100 dark:border-slate-800 dark-transition">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="flex-1 max-w-md mx-auto">
                <div className="h-8 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-800 px-4">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none">app.antigravity.finance</span>
                </div>
              </div>
              <div className="w-12 h-3" /> {/* Spacer */}
            </div>

            {/* Dashboard content */}
            <div className="bg-white dark:bg-slate-950 rounded-b-[2.2rem] dark-transition overflow-hidden">
              <div className="flex">
                {/* Sidebar mock */}
                <div className="hidden sm:block w-52 border-r border-slate-50 dark:border-slate-900 p-6 space-y-2 dark-transition">
                  {['Dashboard', 'Transactions', 'Categories', 'Budgets', 'Savings', 'Reports'].map((item, i) => (
                    <div
                      key={item}
                      className={`px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all ${
                        i === 0
                          ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                  
                  <div className="pt-8 px-4">
                    <div className="h-24 rounded-2xl bg-linear-to-br from-indigo-500/5 to-violet-500/5 border border-indigo-500/10 flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 mb-2" />
                      <div className="h-1.5 w-16 bg-indigo-500/20 rounded-full mb-1" />
                      <div className="h-1.5 w-10 bg-indigo-500/10 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <div className="flex-1 p-8 space-y-8">
                  {/* Stat row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Current Balance', value: '₹49,000', gradient: 'from-indigo-500 to-violet-500' },
                      { label: 'Avg Income', value: '₹56,000', gradient: 'from-emerald-500 to-teal-500' },
                      { label: 'Avg Expense', value: '₹7,000', gradient: 'from-rose-500 to-pink-500' },
                      { label: 'Savings Rate', value: '88%', gradient: 'from-amber-500 to-orange-500' },
                    ].map((card) => (
                      <div key={card.label} className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/50 dark-transition group hover:border-indigo-500/20 transition-all">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">{card.label}</p>
                        <p className={`text-xl font-outfit font-extrabold bg-linear-to-r ${card.gradient} bg-clip-text text-transparent`}>
                          {card.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Charts row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Bar chart */}
                    <div className="lg:col-span-2 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/50 dark-transition">
                      <div className="flex items-center justify-between mb-8">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Monthly Outlook</p>
                        <div className="flex gap-2">
                          <div className="h-2 w-16 bg-indigo-500/20 rounded-full" />
                        </div>
                      </div>
                      <div className="flex items-end gap-4 justify-around h-36">
                        {[
                          { h: 70, label: 'Jan' },
                          { h: 45, label: 'Feb' },
                          { h: 90, label: 'Mar' },
                          { h: 30, label: 'Apr' },
                          { h: 55, label: 'May' },
                          { h: 40, label: 'Jun' },
                        ].map((bar) => (
                          <div key={bar.label} className="flex flex-col items-center gap-2 flex-1 max-w-[40px]">
                            <div
                              className="w-full rounded-t-xl bg-linear-to-t from-indigo-600/80 to-violet-400 group-hover:from-indigo-500 transition-all"
                              style={{ height: `${bar.h}%` }}
                            />
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{bar.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Donut chart mock */}
                    <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/50 dark-transition flex flex-col items-center justify-between">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest self-start">Wealth Split</p>
                      <div className="relative w-32 h-32 my-4">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="4" />
                          <circle cx="18" cy="18" r="15" fill="none" stroke="#6366F1" strokeWidth="4" strokeDasharray="60 40" strokeLinecap="round" />
                          <circle cx="18" cy="18" r="15" fill="none" stroke="#F43F5E" strokeWidth="4" strokeDasharray="20 80" strokeDashoffset="-60" strokeLinecap="round" />
                          <circle cx="18" cy="18" r="15" fill="none" stroke="#F59E0B" strokeWidth="4" strokeDasharray="10 90" strokeDashoffset="-80" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-lg font-outfit font-extrabold text-slate-900 dark:text-white">88%</span>
                          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Saved</span>
                        </div>
                      </div>
                      <div className="h-2 w-24 bg-slate-200/50 dark:bg-slate-800 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
