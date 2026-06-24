import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchSavings = createAsyncThunk('savings/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await api.get('/savings');
        return response.data.goals;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.error || 'Failed to fetch savings goals');
    }
});

const savingsSlice = createSlice({
    name: 'savings',
    initialState: {
        goals: [],
        isLoading: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSavings.pending, (state) => { state.isLoading = true; })
            .addCase(fetchSavings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.goals = action.payload;
            })
            .addCase(fetchSavings.rejected, (state, action) => {
                state.isLoading = false;
                // Optional: store error message for UI debugging
                state.error = action.error.message || 'Failed to load savings';
            });
    }
});

export default savingsSlice.reducer;
