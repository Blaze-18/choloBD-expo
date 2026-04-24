import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tourBuilderReducer from './slices/tourBuilderSlice';
import tripPlannerReducer from './slices/tripPlannerSlice';
import packageBookingReducer from './slices/packageBookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tourBuilder: tourBuilderReducer,
    tripPlanner: tripPlannerReducer,
    packageBooking: packageBookingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
