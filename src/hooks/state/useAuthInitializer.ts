import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { initializeAuth, logoutUser, configureApi } from '../../store/slices/authSlice';
import { setLogoutCallback } from '../../services/api/axiosClient';

export function useAuthInitializer(baseURL: string) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log('[useAuthInitializer] Initializing auth with baseURL:', baseURL);
    
    // configure api client base url
    configureApi(baseURL);
    console.log('[useAuthInitializer] API client configured');

    // register logout callback so axios can notify store
    setLogoutCallback(() => {
      console.log('[useAuthInitializer] Logout callback triggered');
      void dispatch(logoutUser());
    });

    // initialize auth state from SecureStore
    void dispatch(initializeAuth()).then(() => {
      console.log('[useAuthInitializer] Auth initialization complete');
    });
  }, [dispatch, baseURL]);
}
