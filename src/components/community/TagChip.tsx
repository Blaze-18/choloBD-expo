import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CommunityPostTag } from '../../types/community';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';

interface TagChipProps {
  tag: CommunityPostTag;
}

export function TagChip({ tag }: TagChipProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const surface = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const text = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const muted = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const border = isDark ? theme.colors['border-dark'] : theme.colors.border;

  const statusLabel =
    tag.status === 'PENDING'
      ? t(TRANSLATION_KEYS.COMMUNITY.TAG_PENDING)
      : tag.status === 'ACCEPTED'
        ? t(TRANSLATION_KEYS.COMMUNITY.TAG_ACCEPTED)
        : t(TRANSLATION_KEYS.COMMUNITY.TAG_DECLINED);

  return (
    <View style={[styles.container, { backgroundColor: surface, borderColor: border }]}> 
      <Text style={[styles.name, { color: text }]} numberOfLines={1}>
        {tag.taggedUser?.userName || tag.taggedUserId}
      </Text>
      <Text style={[styles.status, { color: muted }]}>{statusLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    maxWidth: 180,
  },
  name: {
    fontSize: 12,
    fontWeight: '500',
  },
  status: {
    fontSize: 10,
    marginTop: 2,
  },
});
