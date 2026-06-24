import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Fetch preferences from backend
export const fetchPreferences = createAsyncThunk('preferences/fetch', async (_, thunkAPI) => {
    try {
        const response = await api.get('/preferences');
        return response.data.preferences;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || 'Failed to fetch preferences');
    }
});

// Update preferences
export const updatePreferences = createAsyncThunk('preferences/update', async (data, thunkAPI) => {
    try {
        await api.put('/preferences', data);
        return data; // Return what was sent so UI can update immediately
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || 'Failed to update preferences');
    }
});

const getInitialTheme = () => {
    if (localStorage.getItem('theme')) return localStorage.getItem('theme');
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
};

const getInitialSidebarState = () => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved === 'true';
};

const initialState = {
    theme: getInitialTheme(),
    isSidebarCollapsed: getInitialSidebarState(),
    isMobileSidebarOpen: false,
    email_notifications: true,
    budget_alerts: true,
    reminder_enabled: true,
    isLoading: false,
    isError: false,
    message: ''
};

const preferencesSlice = createSlice({
    name: 'preferences',
    initialState,
    reducers: {
        setThemeUI: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload);
        },
        toggleSidebar: (state) => {
            state.isSidebarCollapsed = !state.isSidebarCollapsed;
            localStorage.setItem('sidebar_collapsed', state.isSidebarCollapsed);
        },
        toggleMobileSidebar: (state) => {
            state.isMobileSidebarOpen = !state.isMobileSidebarOpen;
        },
        closeMobileSidebar: (state) => {
            state.isMobileSidebarOpen = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPreferences.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchPreferences.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    if (action.payload.theme) {
                        state.theme = action.payload.theme;
                        localStorage.setItem('theme', action.payload.theme);
                    }
                    if (action.payload.email_notifications !== undefined) state.email_notifications = action.payload.email_notifications;
                    if (action.payload.budget_alerts !== undefined) state.budget_alerts = action.payload.budget_alerts;
                    if (action.payload.reminder_enabled !== undefined) state.reminder_enabled = action.payload.reminder_enabled;
                }
            })
            .addCase(fetchPreferences.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updatePreferences.fulfilled, (state, action) => {
                if (action.payload.theme) {
                    state.theme = action.payload.theme;
                    localStorage.setItem('theme', action.payload.theme);
                }
                if (action.payload.email_notifications !== undefined) state.email_notifications = action.payload.email_notifications;
                if (action.payload.budget_alerts !== undefined) state.budget_alerts = action.payload.budget_alerts;
                if (action.payload.reminder_enabled !== undefined) state.reminder_enabled = action.payload.reminder_enabled;
            });
    }
});

export const { setThemeUI, toggleSidebar, toggleMobileSidebar, closeMobileSidebar } = preferencesSlice.actions;
export default preferencesSlice.reducer;
