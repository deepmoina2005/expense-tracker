import React, { useMemo, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  Tag, 
  PieChart, 
  Target, 
  BarChart3, 
  Settings, 
  LogOut,
  Wallet,
  History,
  Bell,
  X
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { closeMobileSidebar } from '../features/preferences/preferencesSlice';
import FinixLogo from './FinixLogo';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { isSidebarCollapsed, isMobileSidebarOpen } = useSelector((state) => state.preferences);

  // Lock background scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileSidebarOpen]);

  const navItems = useMemo(() => [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/dashboard/transactions', icon: Receipt, label: 'Transactions' },
    { to: '/dashboard/categories', icon: Tag, label: 'Categories' },
    { to: '/dashboard/budgets', icon: PieChart, label: 'Budgets' },
    { to: '/dashboard/savings', icon: Target, label: 'Savings Goals' },
    { to: '/dashboard/reports', icon: BarChart3, label: 'Reports' },
    { to: '/dashboard/activity', icon: History, label: 'Activity' },
    { to: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
  ], []);

  const handleLinkClick = () => {
    dispatch(closeMobileSidebar());
  };

  const sidebarClasses = `
    fixed lg:sticky top-0 inset-y-0 left-0 z-50 flex flex-col h-screen 
    bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800 
    transition-all duration-300 ease-in-out
    ${isSidebarCollapsed ? 'w-20' : 'w-64'}
    ${isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => dispatch(closeMobileSidebar())}
          aria-hidden="true"
        />
      )}

      <aside className={sidebarClasses} aria-label="Main Navigation">
        <div className={`p-6 flex items-center h-20 shrink-0 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          <FinixLogo iconSize={24} fontSize="text-2xl" hideText={isSidebarCollapsed} />
          <button 
            onClick={() => dispatch(closeMobileSidebar())}
            aria-label="Close sidebar"
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className={`flex-1 px-3 space-y-1 mt-4 ${isSidebarCollapsed ? '' : 'overflow-y-auto custom-scrollbar'}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end || false}
              onClick={handleLinkClick}
              aria-label={item.label}
              className={({ isActive }) => `
                group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300
                ${isSidebarCollapsed ? 'justify-center mx-1.5' : ''}
                ${isActive 
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'}
              `}
            >
              {/* Active Indicator Bar */}
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-500 rounded-r-full transition-all duration-300 ${isSidebarCollapsed ? 'hidden group-[.active]:block' : 'opacity-0 group-[.active]:opacity-100 group-[.active]:translate-x-0 -translate-x-1'}`} />

              <item.icon size={20} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
              {!isSidebarCollapsed && (
                <span className="truncate transition-all duration-300 transform-gpu">{item.label}</span>
              )}
              
              {/* Tooltip for Collapsed Mode (Desktop Only) */}
              {isSidebarCollapsed && (
                <div 
                  role="tooltip"
                  className="hidden lg:block absolute left-full ml-4 px-3 py-2 bg-slate-800 dark:bg-slate-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-200 delay-150 pointer-events-none whitespace-nowrap z-50 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] border border-slate-700/50 dark:border-slate-600/50"
                >
                  {item.label}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 dark:bg-slate-700 rotate-45" />
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-50 dark:border-slate-800/50 mt-auto space-y-1">
          <NavLink
              to="/dashboard/settings"
              onClick={handleLinkClick}
              aria-label="Settings"
              className={({ isActive }) => `
                group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300
                ${isSidebarCollapsed ? 'justify-center mx-1.5' : ''}
                ${isActive 
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'}
              `}
            >
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-500 rounded-r-full transition-all duration-300 ${isSidebarCollapsed ? 'hidden group-[.active]:block' : 'opacity-0 group-[.active]:opacity-100 group-[.active]:translate-x-0 -translate-x-1'}`} />
            <Settings size={20} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
            {!isSidebarCollapsed && (
              <span className="truncate transition-all duration-300 transform-gpu">Settings</span>
            )}
            {isSidebarCollapsed && (
              <div role="tooltip" className="hidden lg:block absolute left-full ml-4 px-3 py-2 bg-slate-800 dark:bg-slate-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-200 delay-150 pointer-events-none whitespace-nowrap z-50 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] border border-slate-700/50 dark:border-slate-600/50">
                Settings
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 dark:bg-slate-700 rotate-45" />
              </div>
            )}
          </NavLink>
          <button
            onClick={() => { dispatch(logout()); handleLinkClick(); }}
            aria-label="Logout"
            className={`
              group relative flex items-center gap-3 px-3 py-3 w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-300
              ${isSidebarCollapsed ? 'justify-center mx-1.5' : ''}
            `}
          >
            <LogOut size={20} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
            {!isSidebarCollapsed && (
              <span className="truncate transition-all duration-300 transform-gpu">Logout</span>
            )}
            {isSidebarCollapsed && (
              <div role="tooltip" className="hidden lg:block absolute left-full ml-4 px-3 py-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-200 delay-150 pointer-events-none whitespace-nowrap z-50 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)]">
                Logout
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-red-600 rotate-45" />
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default React.memo(Sidebar);
