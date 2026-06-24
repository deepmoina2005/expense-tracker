import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import transactionReducer from '../features/transactions/transactionSlice';
import budgetReducer from '../features/budgets/budgetSlice';
import categoryReducer from '../features/categories/categorySlice';
import savingsReducer from '../features/savings/savingsSlice';
import notificationReducer from '../features/notifications/notificationSlice';
import activityReducer from '../features/activity/activitySlice';
import preferencesReducer from '../features/preferences/preferencesSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        transactions: transactionReducer,
        budgets: budgetReducer,
        categories: categoryReducer,
        savings: savingsReducer,
        notifications: notificationReducer,
        activity: activityReducer,
        preferences: preferencesReducer,
    },
});
