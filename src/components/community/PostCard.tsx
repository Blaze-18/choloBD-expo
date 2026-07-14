import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommunityPost } from '../../types/community';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';
import { useCommunityPostLogic } from '../../hooks/useCommunityPostLogic';
import { TagChip } from './TagChip';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';

interface PostCardProps {
  post: CommunityPost;
  onPress?: () => void;
}

export function PostCard({ post, onPress }: PostCardProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { toggleReact } = useCommunityPostLogic();

  const bg = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const text = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const muted = isDark ? theme.colors['muted-dark'] : theme.colors.muted;

  const firstImage = post.images?.[0];

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor: bg }]}>
      {firstImage ? (
        <Image source={{ uri: firstImage.url }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.imagePlaceholder, { backgroundColor: muted }]}>
          <Ionicons name="image-outline" size={40} color={text} />
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.creator, { color: text }]}>{post.creator?.userName}</Text>
          <Text style={[styles.date, { color: muted }]}>{new Date(post.createdAt).toLocaleString()}</Text>
        </View>

        {post.caption ? <Text style={[styles.caption, { color: text }]}>{post.caption}</Text> : null}

        {post.tags?.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsRow}>
            {post.tags.map((t) => (
              <TagChip key={t.taggedUserId} tag={t} />
            ))}
          </ScrollView>
        ) : null}

        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => toggleReact(post.id)}
            style={styles.actionButton}
            accessibilityLabel="wow-button"
          >
            <Ionicons name={post.userHasReacted ? 'heart' : 'heart-outline'} size={20} color={post.userHasReacted ? theme.colors.error : text} />
            <Text style={[styles.actionText, { color: text }]}>{post.wowCount}</Text>
          </TouchableOpacity>

          <View style={styles.spacer} />

          <Text style={[styles.smallMuted, { color: muted }]}> 
            {post.isActive ? t(TRANSLATION_KEYS.COMMUNITY.ACTIVE) : t(TRANSLATION_KEYS.COMMUNITY.DRAFT)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
    marginHorizontal: 12,
    elevation: 1,
  },
  image: {
    width: '100%',
    height: 200,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  creator: { fontWeight: '600' },
  date: { fontSize: 12 },
  caption: { marginBottom: 8 },
  tagsRow: { marginVertical: 8 },
  actionsRow: { flexDirection: 'row', alignItems: 'center' },
  actionButton: { flexDirection: 'row', alignItems: 'center' },
  actionText: { marginLeft: 6 },
  spacer: { flex: 1 },
  smallMuted: { fontSize: 12 },
});
