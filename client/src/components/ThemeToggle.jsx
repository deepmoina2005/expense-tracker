import { useSelector, useDispatch } from 'react-redux';
import { updatePreferences, setThemeUI } from '../features/preferences/preferencesSlice';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.preferences);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    // Instantly update UI locally
    dispatch(setThemeUI(newTheme));
    // Persist to backend without waiting for response to keep UI snappy
    dispatch(updatePreferences({ theme: newTheme }));
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center text-slate-500 dark:text-slate-400"
      aria-label="Toggle Theme"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;
