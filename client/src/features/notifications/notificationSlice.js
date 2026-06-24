import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchNotifications = createAsyncThunk('notifications/fetchAll', async (onlyUnread, thunkAPI) => {
    try {
        const response = await api.get('/notifications', { params: { unread: onlyUnread } });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.error || 'Failed to fetch notifications');
    }
});

export const markAllAsRead = createAsyncThunk('notifications/markAllReady', async (_, thunkAPI) => {
    try {
        await api.put('/notifications/mark-all-read');
        return true;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.error || 'Failed to update notifications');
    }
});

export const markAsRead = createAsyncThunk('notifications/markRead', async (id, thunkAPI) => {
    try {
        await api.put(`/notifications/${id}/read`);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.error || 'Failed to update notification');
    }
});

export const deleteNotification = createAsyncThunk('notifications/delete', async (id, thunkAPI) => {
    try {
        await api.delete(`/notifications/${id}`);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.error || 'Failed to delete notification');
    }
});

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: [],
        unreadCount: 0,
        isLoading: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => { state.isLoading = true; })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.notifications;
                state.unreadCount = action.payload.unreadCount;
            })
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.unreadCount = 0;
                state.items = state.items.map(n => ({ ...n, is_read: 1 }));
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const item = state.items.find(n => n.id === action.payload);
                if (item && !item.is_read) {
                    item.is_read = 1;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                const item = state.items.find(n => n.id === action.payload);
                if (item && !item.is_read) {
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
                state.items = state.items.filter(n => n.id !== action.payload);
            });
    }
});

export default notificationSlice.reducer;
