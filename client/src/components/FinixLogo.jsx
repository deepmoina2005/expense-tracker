import { Wallet } from 'lucide-react';

const FinixLogo = ({ className = "flex items-center gap-3", iconSize = 20, fontSize = "text-xl", hideText = false }) => {
  return (
    <div className={className}>
      <div className="shrink-0 w-10 h-10 bg-linear-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
        <Wallet className="text-white" size={iconSize} />
      </div>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${hideText ? 'w-0 opacity-0 scale-95' : 'w-24 opacity-100 scale-100'}`}>
        <span className={`${fontSize} font-outfit font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap ml-3`}>
          Finix
        </span>
      </div>
    </div>
  );
};

export default FinixLogo;
