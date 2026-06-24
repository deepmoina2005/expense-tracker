import { ClipboardList, Target, LineChart } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: ClipboardList,
    title: 'Add Your Transactions',
    description: 'Log your daily income and expenses with categories, amounts, and notes. It takes just seconds.',
    color: 'from-indigo-500 to-violet-500',
  },
  {
    step: '02',
    icon: Target,
    title: 'Set Budgets & Goals',
    description: 'Define monthly budgets for each category and create savings goals with target amounts and deadlines.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    step: '03',
    icon: LineChart,
    title: 'Track & Improve',
    description: 'Monitor your progress with real-time charts, get smart alerts, and continuously improve your habits.',
    color: 'from-purple-500 to-fuchsia-500',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-slate-50/50 dark:bg-slate-900/40 dark-transition relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-4">
            Ease of Use
          </p>
          <h2 className="text-3xl sm:text-4xl font-outfit font-extrabold text-slate-900 dark:text-white">
            Get started in three simple steps
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-6">
            No complex setup. Connect your life and start tracking in under a minute.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 relative">
          {steps.map((item, index) => (
            <div key={item.step} className="relative group animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${index * 150}ms` }}>
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-slate-200/60 dark:bg-slate-800/60 -translate-x-1/2 z-0" />
              )}

              <div className="relative z-10 text-center space-y-6">
                {/* Step number + Icon */}
                <div className="relative inline-flex group-hover:scale-110 transition-transform duration-500">
                  <div className={`w-20 h-20 rounded-4xl bg-linear-to-br ${item.color} flex items-center justify-center shadow-xl shadow-indigo-500/10 dark:shadow-none`}>
                    <item.icon size={32} className="text-white" />
                  </div>
                  <span className="absolute -top-3 -right-3 w-9 h-9 bg-white dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-900 rounded-2xl flex items-center justify-center text-sm font-bold text-slate-900 dark:text-white shadow-lg">
                    {item.step}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
