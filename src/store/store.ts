import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tourBuilderReducer from './slices/tourBuilderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tourBuilder: tourBuilderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
