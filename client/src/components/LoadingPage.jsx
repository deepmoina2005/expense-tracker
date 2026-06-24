import FinixLogo from './FinixLogo';

const LoadingPage = () => {
  return (
    <div className="fixed inset-0 min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center z-100 transition-colors duration-500">
      <div className="relative">
        {/* Animated Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-4 border-violet-500/5 border-b-violet-500 animate-spin-slow" />
        
        {/* Logo with Pulse */}
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <FinixLogo iconSize={32} fontSize="text-3xl" />
          <div className="flex gap-1.5 justify-center">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
          </div>
        </div>
      </div>
      
      <p className="mt-12 text-slate-400 dark:text-slate-500 text-sm font-medium tracking-[0.2em] uppercase transition-all duration-300">
        Optimizing your experience
      </p>
    </div>
  );
};

export default LoadingPage;
