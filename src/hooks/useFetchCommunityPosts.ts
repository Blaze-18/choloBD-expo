import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchActivePosts } from '../store/slices/communitySlice';

export function useFetchCommunityPosts(initialPage = 1, initialLimit = 10, userTripPlanId?: string) {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((s: RootState) => s.community);

  const refetch = useCallback(async () => {
    try {
      await dispatch(fetchActivePosts({ page: 1, limit: initialLimit, userTripPlanId })).unwrap();
    } catch (e) {
      // handled in slice
    }
  }, [dispatch, initialLimit, userTripPlanId]);

  const loadMore = useCallback(async () => {
    const nextPage = (state.pagination?.page ?? 1) + 1;
    try {
      await dispatch(fetchActivePosts({ page: nextPage, limit: state.pagination?.limit ?? initialLimit, userTripPlanId })).unwrap();
    } catch (e) {
      // handled in slice
    }
  }, [dispatch, initialLimit, state.pagination, userTripPlanId]);

  useEffect(() => {
    // initial load
    refetch();
  }, [refetch]);

  return {
    posts: state.feed,
    loading: state.feedLoading,
    error: state.feedError,
    pagination: state.pagination,
    refetch,
    loadMore,
  };
}
