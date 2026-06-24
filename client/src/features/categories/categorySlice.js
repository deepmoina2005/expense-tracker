import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchCategories = createAsyncThunk('categories/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await api.get('/categories');
        return response.data.categories;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.error || 'Failed to fetch categories');
    }
});

export const addCategory = createAsyncThunk('categories/add', async (data, thunkAPI) => {
    try {
        const response = await api.post('/categories', data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.error || 'Failed to add category');
    }
});

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        items: [],
        isLoading: false,
        isError: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => { state.isLoading = true; })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchCategories.rejected, (state) => { state.isLoading = false; });
    }
});

export default categorySlice.reducer;
