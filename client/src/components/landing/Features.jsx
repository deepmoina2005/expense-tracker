import {
  Receipt,
  PieChart,
  TrendingUp,
  RefreshCw,
  BarChart3,
  Target,
  Bell,
  Shield,
} from 'lucide-react';

const features = [
  {
    icon: Receipt,
    title: 'Income & Expense Tracking',
    description: 'Log every transaction with categories, payment methods, and notes. Know exactly where your money goes.',
    color: 'from-indigo-500 to-violet-500',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
  },
  {
    icon: PieChart,
    title: 'Budget Management',
    description: 'Set monthly budgets by category and get real-time progress tracking with visual indicators.',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Smart Insights',
    description: 'AI-powered analysis of your spending patterns with actionable recommendations to save more.',
    color: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-50 dark:bg-violet-500/10',
  },
  {
    icon: RefreshCw,
    title: 'Recurring Transactions',
    description: 'Automate repeating income and expenses. Set frequency and let the system handle the rest.',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
  },
  {
    icon: BarChart3,
    title: 'Reports & Analytics',
    description: 'Generate detailed financial reports with charts, trends, and exportable PDF/CSV formats.',
    color: 'from-rose-500 to-pink-500',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
  },
  {
    icon: Target,
    title: 'Savings Goals',
    description: 'Set financial targets with deadlines and track your progress with beautiful visual indicators.',
    color: 'from-cyan-500 to-blue-500',
    bg: 'bg-cyan-50 dark:bg-cyan-500/10',
  },
  {
    icon: Bell,
    title: 'Alerts & Notifications',
    description: 'Get notified when you exceed budgets, reach savings milestones, or have upcoming bills.',
    color: 'from-fuchsia-500 to-pink-500',
    bg: 'bg-fuchsia-50 dark:bg-fuchsia-500/10',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your financial data is encrypted and never shared. Full backup & restore support included.',
    color: 'from-slate-600 to-slate-800',
    bg: 'bg-slate-100 dark:bg-slate-500/10',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 lg:py-32 relative dark-transition overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-4">
            Master your Money
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-outfit font-extrabold text-slate-900 dark:text-white leading-tight">
            Comprehensive tools for <br className="hidden sm:block" />
            <span className="bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">total clarity with Finix</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 max-w-2xl mx-auto">
            Everything you need master your finances. Designed for simplicity, built for power.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-8 bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-all dark-transition animate-in fade-in slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon Container */}
              <div className={`${feature.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon size={26} className={`text-indigo-600 dark:text-indigo-400`} />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                {feature.description}
              </p>
              
              {/* Subtle hover effect for the card corner */}
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500/40 transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;