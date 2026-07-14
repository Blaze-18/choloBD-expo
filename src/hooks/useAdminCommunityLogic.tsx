import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchPendingPosts, activatePost } from '../store/slices/communitySlice';
import { useAuthWithAdminCheck } from './useAuthWithAdminCheck';

export function useAdminCommunityLogic() {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((s: RootState) => s.community);
  const { isMasterAdmin } = useAuthWithAdminCheck();

  const fetchPending = useCallback(async (page = 1, limit = 10) => {
    if (!isMasterAdmin) return null;
    try {
      const res = await dispatch(fetchPendingPosts({ page, limit })).unwrap();
      return res;
    } catch (e) {
      return null;
    }
  }, [dispatch, isMasterAdmin]);

  const doActivate = useCallback(async (postId: string) => {
    if (!isMasterAdmin) return null;
    try {
      const res = await dispatch(activatePost(postId)).unwrap();
      return res;
    } catch (e) {
      return null;
    }
  }, [dispatch, isMasterAdmin]);

  return {
    pendingPosts: state.pendingPosts,
    pendingLoading: state.pendingLoading,
    pendingError: state.pendingError,
    fetchPending,
    doActivate,
    canAdmin: isMasterAdmin,
  };
}
