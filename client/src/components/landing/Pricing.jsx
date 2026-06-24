import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Perfect for getting started with personal finance tracking.',
    features: [
      'Up to 100 transactions/month',
      'Basic categories',
      'Monthly reports',
      'Single savings goal',
      'Light & Dark mode',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '₹199',
    period: '/month',
    description: 'For serious finance trackers who want full control.',
    features: [
      'Unlimited transactions',
      'Custom categories & colors',
      'Advanced analytics & charts',
      'Unlimited savings goals',
      'Recurring transactions',
      'Budget alerts & notifications',
      'Export PDF/CSV reports',
      'Backup & restore',
      'Priority support',
    ],
    cta: 'Get Pro',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Team',
    price: '₹499',
    period: '/month',
    description: 'For families and small teams managing shared finances.',
    features: [
      'Everything in Pro',
      'Up to 5 users',
      'Shared budgets & goals',
      'Team activity log',
      'Admin controls',
      'API access',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 lg:py-32 bg-slate-50/50 dark:bg-slate-900/40 dark-transition relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 blur-3xl rounded-full" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-4">
            Pricing Plans
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-outfit font-extrabold text-slate-900 dark:text-white leading-tight">
            Predictable pricing for <br className="hidden sm:block" />
            <span className="text-indigo-600 dark:text-indigo-400">every financial Stage</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 max-w-2xl mx-auto">
            Choose the plan that suits your tracking needs. No hidden fees. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-[2.5rem] p-10 transition-all duration-500 dark-transition animate-in fade-in slide-in-from-bottom-8 h-full flex flex-col ${
                plan.highlighted
                  ? 'bg-linear-to-b from-indigo-600 to-violet-700 text-white shadow-2xl shadow-indigo-500/30 scale-105 z-10 border-0'
                  : 'bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]'
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
                  {plan.badge}
                </div>
              )}

              {/* Plan info */}
              <div className="mb-10">
                <h3 className={`text-base font-black uppercase tracking-widest ${plan.highlighted ? 'text-indigo-100' : 'text-indigo-600 dark:text-indigo-400'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1.5 mt-4">
                  <span className={`text-5xl font-outfit font-extrabold ${plan.highlighted ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm font-bold opacity-70 ${plan.highlighted ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`text-sm mt-5 leading-relaxed font-medium ${plan.highlighted ? 'text-indigo-50' : 'text-slate-500 dark:text-slate-400'}`}>
                  {plan.description}
                </p>
              </div>

              {/* Features list */}
              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3.5 group/item">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      plan.highlighted ? 'bg-white/20' : 'bg-indigo-50 dark:bg-indigo-500/10'
                    }`}>
                      <Check size={12} strokeWidth={4} className={plan.highlighted ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'} />
                    </div>
                    <span className={`text-sm font-medium ${plan.highlighted ? 'text-indigo-50' : 'text-slate-600 dark:text-slate-300'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                to="/register"
                className={`block text-center py-4.5 px-8 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] ${
                  plan.highlighted
                    ? 'bg-white text-indigo-700 hover:bg-indigo-50 shadow-xl'
                    : 'bg-slate-900 dark:bg-indigo-600 text-white hover:bg-slate-800 dark:hover:bg-indigo-500 shadow-lg shadow-indigo-500/10'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        
        {/* Footnote */}
        <p className="text-center text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest mt-16">
          Prices in INR. Cancel or change plans anytime.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
