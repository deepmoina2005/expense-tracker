import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchBudgets = createAsyncThunk('budgets/fetchAll', async ({ month, year }, thunkAPI) => {
    try {
        const response = await api.get('/budgets', { params: { month, year } });
        return response.data.budgets;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.error || 'Failed to fetch budgets');
    }
});

export const setBudget = createAsyncThunk('budgets/set', async (data, thunkAPI) => {
    try {
        const response = await api.post('/budgets', data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.error || 'Failed to set budget');
    }
});

const budgetSlice = createSlice({
    name: 'budgets',
    initialState: {
        items: [],
        isLoading: false,
        isError: false,
        message: ''
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBudgets.pending, (state) => { state.isLoading = true; })
            .addCase(fetchBudgets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchBudgets.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export default budgetSlice.reducer;
