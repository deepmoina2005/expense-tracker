import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchActivityLogs = createAsyncThunk('activity/fetchAll', async (limit = 50, thunkAPI) => {
    try {
        const response = await api.get('/activity-logs', { params: { limit } });
        return response.data.logs;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.error || 'Failed to fetch activity logs');
    }
});

const activitySlice = createSlice({
    name: 'activity',
    initialState: {
        logs: [],
        isLoading: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchActivityLogs.pending, (state) => { state.isLoading = true; })
            .addCase(fetchActivityLogs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.logs = action.payload;
            });
    }
});

export default activitySlice.reducer;
