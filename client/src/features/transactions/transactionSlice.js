import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchTransactions = createAsyncThunk('transactions/fetchAll', async (filters, thunkAPI) => {
    try {
        const response = await api.get('/transactions', { params: filters });
        return response.data.transactions;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.error || 'Failed to fetch transactions');
    }
});

export const addTransaction = createAsyncThunk('transactions/add', async (data, thunkAPI) => {
    try {
        const response = await api.post('/transactions', data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.error || 'Failed to add transaction');
    }
});

export const deleteTransaction = createAsyncThunk('transactions/delete', async (id, thunkAPI) => {
    try {
        await api.delete(`/transactions/${id}`);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.error || 'Failed to delete transaction');
    }
});

const transactionSlice = createSlice({
    name: 'transactions',
    initialState: {
        items: [],
        isLoading: false,
        isError: false,
        message: ''
    },
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => { state.isLoading = true; })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(addTransaction.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.items = state.items.filter(i => i.id !== action.payload);
            });
    }
});

export const { reset } = transactionSlice.actions;
export default transactionSlice.reducer;
