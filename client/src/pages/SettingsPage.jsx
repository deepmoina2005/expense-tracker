import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/axios';
import { User, Shield, Bell, Palette, Database, Upload, Download, RefreshCw } from 'lucide-react';
import { updateProfile } from '../features/auth/authSlice';
import { updatePreferences as updateReduxPrefs } from '../features/preferences/preferencesSlice';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('profile');
  const [preferences, setPreferences] = useState({
    currency: '$',
    theme: 'light',
    language: 'en',
    email_notifications: true,
    budget_alerts: true
  });
  const [prefLoading, setPrefLoading] = useState(true);

  // Profile Form
  const [profileData, setProfileData] = useState({ full_name: user?.full_name || '', email: user?.email || '' });
  const [passData, setPassData] = useState({ current_password: '', new_password: '' });

  // Backup State
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreFile, setRestoreFile] = useState(null);
  const [restoreMessage, setRestoreMessage] = useState(null);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const res = await api.get('/preferences');
      if (res.data.preferences) {
        setPreferences({
          currency: res.data.preferences.currency || '$',
          theme: res.data.preferences.theme || 'light',
          language: res.data.preferences.language || 'en',
          email_notifications: res.data.preferences.email_notifications,
          budget_alerts: res.data.preferences.budget_alerts
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPrefLoading(false);
    }
  };

  const savePreferences = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(updateReduxPrefs(preferences));
      if (updateReduxPrefs.fulfilled.match(resultAction)) {
         alert('Preferences saved successfully!');
      } else {
         alert(resultAction.payload || 'Failed to save preferences.');
      }
    } catch (error) {
      alert('Failed to save preferences.');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(profileData));
    if (!result.error) alert('Profile updated!');
    else alert(result.payload || 'Update failed');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/change-password', passData);
      setPassData({ current_password: '', new_password: '' });
      alert('Password updated!');
    } catch (err) {
      alert(err.response?.data?.error || 'Password update failed');
    }
  };

  const handleBackup = async () => {
    setBackupLoading(true);
    try {
      const res = await api.get('/reports/backup');
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data.backup, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute('download', `finance_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      alert('Backup failed.');
    } finally {
      setBackupLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!restoreFile) return alert('Please select a JSON backup file first.');
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target.result);
        const res = await api.post('/reports/restore', json);
        setRestoreMessage(`Restore successful: ${res.data.summary.inserted} items inserted, ${res.data.summary.skipped} duplicates skipped.`);
      } catch (error) {
        setRestoreMessage('Restore failed. Invalid file or server error.');
      }
    };
    reader.readAsText(restoreFile);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 fade-in">
      <div>
        <h1 className="text-2xl font-outfit font-bold text-slate-900 dark:text-slate-100">Finix Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your profile, preferences, and data within the Finix ecosystem.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-2">
          {[
            { id: 'profile', icon: User, label: 'Profile Settings' },
            { id: 'security', icon: Shield, label: 'Security' },
            { id: 'preferences', icon: Palette, label: 'Preferences' },
            { id: 'data', icon: Database, label: 'Data & Backup' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </aside>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="card-premium p-8 max-w-2xl">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                <User className="text-indigo-500" /> Personal Information
              </h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                  <input type="text" className="input-field bg-white dark:bg-slate-900/50" value={profileData.full_name} onChange={e => setProfileData({...profileData, full_name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                  <input type="email" className="input-field bg-white dark:bg-slate-900/50" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} />
                </div>
                <button type="submit" className="btn-primary mt-4">Save Changes</button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card-premium p-8 max-w-2xl">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                <Shield className="text-indigo-500" /> Change Password
              </h2>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                  <input type="password" required className="input-field bg-white dark:bg-slate-900/50" value={passData.current_password} onChange={e => setPassData({...passData, current_password: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                  <input type="password" required className="input-field bg-white dark:bg-slate-900/50" value={passData.new_password} onChange={e => setPassData({...passData, new_password: e.target.value})} />
                </div>
                <button type="submit" className="btn-primary mt-4">Update Password</button>
              </form>
            </div>
          )}

          {activeTab === 'preferences' && !prefLoading && (
            <div className="card-premium p-8 max-w-2xl">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                <Palette className="text-indigo-500" /> App Preferences
              </h2>
              <form onSubmit={savePreferences} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Currency Symbol</label>
                    <select className="input-field bg-white dark:bg-slate-900/50" value={preferences.currency} onChange={e => setPreferences({...preferences, currency: e.target.value})}>
                      <option value="$">USD ($)</option>
                      <option value="€">EUR (€)</option>
                      <option value="£">GBP (£)</option>
                      <option value="₹">INR (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Theme</label>
                    <select className="input-field bg-white dark:bg-slate-900/50" value={preferences.theme} onChange={e => setPreferences({...preferences, theme: e.target.value})}>
                      <option value="light">Light Mode</option>
                      <option value="dark">Dark Mode</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Language</label>
                    <select className="input-field bg-white dark:bg-slate-900/50" value={preferences.language} onChange={e => setPreferences({...preferences, language: e.target.value})}>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">Notifications</h3>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={preferences.email_notifications} onChange={e => setPreferences({...preferences, email_notifications: e.target.checked})} className="w-5 h-5 rounded text-indigo-600 border-slate-300 dark:border-slate-700 dark:bg-slate-900" />
                    <span className="text-slate-700 dark:text-slate-300">Email Notifications (Weekly summary)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={preferences.budget_alerts} onChange={e => setPreferences({...preferences, budget_alerts: e.target.checked})} className="w-5 h-5 rounded text-indigo-600 border-slate-300 dark:border-slate-700 dark:bg-slate-900" />
                    <span className="text-slate-700 dark:text-slate-300">Budget Alerts (When above 80%)</span>
                  </label>
                </div>
                
                <button type="submit" className="btn-primary mt-4">Save Preferences</button>
              </form>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6 max-w-2xl">
              <div className="card-premium p-8">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                  <Download className="text-indigo-500" /> Backup Data
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Download a complete JSON backup of all your transactions, budgets, categories, and settings.</p>
                <button onClick={handleBackup} disabled={backupLoading} className="btn-primary flex items-center gap-2">
                  <Download size={18} /> {backupLoading ? 'Generating Backup...' : 'Download Backup'}
                </button>
              </div>

              <div className="card-premium p-8">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                  <Upload className="text-emerald-500" /> Restore Data
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Restore your account from a JSON backup. Existing data with the same identifiers will be merged or skipped, not duplicated.</p>
                
                <div className="flex gap-4 items-center">
                  <input type="file" accept=".json" onChange={e => setRestoreFile(e.target.files[0])} className="text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-500/10 file:text-indigo-700 dark:file:text-indigo-400 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-500/20 cursor-pointer"/>
                  <button onClick={handleRestore} className="btn-secondary flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20">
                    <RefreshCw size={18} /> Restore
                  </button>
                </div>
                {restoreMessage && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {restoreMessage}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
