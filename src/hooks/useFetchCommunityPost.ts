import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchPostById } from '../store/slices/communitySlice';

export function useFetchCommunityPost(postId?: string) {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((s: RootState) => s.community);

  const refetch = useCallback(async () => {
    if (!postId) return;
    try {
      await dispatch(fetchPostById(postId)).unwrap();
    } catch (e) {
      // handled in slice
    }
  }, [dispatch, postId]);

  useEffect(() => {
    if (postId) refetch();
  }, [postId, refetch]);

  return {
    post: state.currentPost,
    loading: state.currentLoading,
    error: state.currentError,
    refetch,
  };
}
