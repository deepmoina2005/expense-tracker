import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Bell, ChevronDown, PanelLeft } from "lucide-react";
import { NavLink } from "react-router-dom";
import { fetchNotifications } from "../features/notifications/notificationSlice";
import { toggleSidebar, toggleMobileSidebar } from "../features/preferences/preferencesSlice";
import ThemeToggle from "./ThemeToggle";

const Topbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications(true));
    }
  }, [user, dispatch]);

  const handleToggle = () => {
    if (window.innerWidth < 1024) {
      dispatch(toggleMobileSidebar());
    } else {
      dispatch(toggleSidebar());
    }
  };

  return (
    <header className="sticky top-0 z-30 h-20 border-b border-slate-200/70 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl supports-backdrop-filter:bg-white/60 supports-backdrop-filter:dark:bg-slate-950/60 transition-all duration-300">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Sidebar Toggle */}
        <button
          onClick={handleToggle}
          aria-label="Toggle Sidebar"
          title="Toggle Sidebar"
          className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm transition-all duration-300 hover:shadow-md group"
        >
          <PanelLeft size={20} className="transition-transform duration-300 group-hover:scale-110" />
        </button>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Actions */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 shadow-sm px-1.5 py-1 backdrop-blur-md">
            <ThemeToggle />
          </div>

          <NavLink
            to="/dashboard/notifications"
            className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-300"
          >
            <Bell
              size={20}
              className="transition-transform duration-300 group-hover:scale-110"
            />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-950 shadow">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </NavLink>

          <div className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-slate-800"></div>

          {/* Profile */}
          <div className="group flex items-center gap-3 cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 px-3 py-2 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-300">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 via-violet-500 to-purple-500 text-white font-bold text-base shadow-lg shadow-indigo-500/20">
              {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-950 bg-emerald-500"></span>
            </div>

            <div className="hidden md:block min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                {user?.full_name || "User"}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {user?.email || "No email"}
              </p>
            </div>

            <ChevronDown
              size={16}
              className="text-slate-400 dark:text-slate-500 transition-transform duration-300 group-hover:translate-y-0.5"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;