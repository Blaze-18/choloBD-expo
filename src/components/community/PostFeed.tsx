import React from 'react';
import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import { CommunityPost } from '../../types/community';
import { PostCard } from './PostCard';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';

interface PostFeedProps {
  posts: CommunityPost[];
  loading?: boolean;
  emptyMessage?: string;
  onPressPost?: (post: CommunityPost) => void;
  onEndReached?: () => void;
}

export function PostFeed({ posts, loading, emptyMessage = 'No posts yet', onPressPost, onEndReached }: PostFeedProps) {
  const { isDark } = useTheme();
  const text = isDark ? theme.colors['text-dark'] : theme.colors.text;

  if (loading && posts.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!posts.length) {
    return (
      <View style={{ padding: 24, alignItems: 'center' }}>
        <Text style={{ color: text }}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostCard post={item} onPress={() => onPressPost?.(item)} />}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      contentContainerStyle={{ paddingVertical: 8 }}
    />
  );
}
