import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.error || 'Registration failed');
    }
});

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        const response = await api.post('/auth/login', userData);
        if (response.data.token) localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.error || 'Login failed');
    }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
    try {
        const response = await api.get('/auth/me');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.error || 'Session expired');
    }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, thunkAPI) => {
    try {
        const response = await api.put('/auth/update-profile', userData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.error || 'Failed to update profile');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: localStorage.getItem('token'),
        isLoading: false,
        isError: false,
        message: ''
    },
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        },
        logout: (state) => {
            localStorage.removeItem('token');
            state.user = null;
            state.token = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => { state.isLoading = true; })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(login.pending, (state) => { state.isLoading = true; })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.user = action.payload.user;
            })
            .addCase(getMe.rejected, (state) => {
                state.user = null;
                state.token = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload.user;
            });
    }
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;
