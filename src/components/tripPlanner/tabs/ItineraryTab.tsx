/**
 * Itinerary Tab Component
 * Trip-level notes list for packing lists, reminders, and travel notes
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../constants/theme';
import { TripPlan } from '../../../types/trips';
import { updateTripAsync } from '../../../store/slices/tripPlannerSlice';
import type { AppDispatch } from '../../../store/store';

interface ItineraryTabProps {
  trip: TripPlan;
  onTripUpdate?: (updatedTrip: TripPlan) => void;
}

const MAX_CHARS = 5000;
const CHAR_THRESHOLD = 4000; // 80% of max

export function ItineraryTab({ trip, onTripUpdate }: ItineraryTabProps) {
  const { isDark } = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  // Build color palette based on theme
  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const surfaceColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;
  const backgroundColor = isDark ? theme.colors['background-dark'] : theme.colors.background;

  const [notesList, setNotesList] = useState<string[]>(trip.generalNotes || []);
  const [newNote, setNewNote] = useState('');
  const [isEditing, setIsEditing] = useState((trip.generalNotes?.length || 0) === 0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate total character count
  const totalCharCount = notesList.reduce((sum, note) => sum + note.length, 0);
  const hasUnsavedChanges = JSON.stringify(notesList) !== JSON.stringify(trip.generalNotes || []);

  const addNote = () => {
    const trimmedNote = newNote.trim();
    
    if (!trimmedNote) {
      setError('Note cannot be empty');
      return;
    }

    if (trimmedNote.length > 500) {
      setError('Individual note cannot exceed 500 characters');
      return;
    }

    const newTotal = totalCharCount + trimmedNote.length;
    if (newTotal > MAX_CHARS) {
      setError(`Adding this note would exceed 5000 character limit (current: ${totalCharCount}, new total would be: ${newTotal})`);
      return;
    }

    setNotesList([...notesList, trimmedNote]);
    setNewNote('');
    setError(null);
  };

  const deleteNote = (index: number) => {
    setNotesList(notesList.filter((_, i) => i !== index));
    setError(null);
  };

  const validateNotes = (): boolean => {
    if (totalCharCount > MAX_CHARS) {
      setError(`Total notes exceed maximum length (${totalCharCount}/${MAX_CHARS})`);
      return false;
    }
    
    if (notesList.some(note => !note || note.trim().length === 0)) {
      setError('Notes cannot be empty');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateNotes()) return;

    setIsSaving(true);
    setError(null);

    try {
      const result = await dispatch(
        updateTripAsync({
          id: trip.id,
          payload: { generalNotes: notesList.length > 0 ? notesList : undefined },
        })
      );

      if (result.payload) {
        const updatedTrip = result.payload as TripPlan;
        setIsEditing(false);
        
        if (onTripUpdate) {
          onTripUpdate(updatedTrip);
        }

        Alert.alert('Success', `${notesList.length} note(s) saved successfully`);
      } else {
        throw new Error('Failed to save notes');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save notes';
      if (__DEV__) console.error('[ItineraryTab] Error saving notes:', err);
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    Alert.alert(
      'Clear All Notes',
      'Are you sure you want to delete all notes? This cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Clear All',
          onPress: () => {
            setNotesList([]);
            setNewNote('');
            setError(null);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'Discard Changes',
        'You have unsaved changes. Do you want to discard them?',
        [
          { text: 'Keep Editing', onPress: () => {} },
          {
            text: 'Discard',
            onPress: () => {
              console.log('[ItineraryTab] Discarding changes');
              setNotesList(trip.generalNotes || []);
              setNewNote('');
              setError(null);
              setIsEditing(false);
            },
            style: 'destructive',
          },
        ]
      );
    } else {
      setIsEditing(false);
    }
  };

  // Empty state
  if (!isEditing && (!notesList || notesList.length === 0)) {
    return (
      <View className="items-center justify-center flex-1 px-4 py-12">
        <Feather name="edit-3" size={48} color={mutedColor} />
        <Text className="mt-4 text-lg font-bold text-text dark:text-text-dark">
          No Trip Notes Yet
        </Text>
        <Text className="mt-2 mb-6 text-sm text-center text-muted dark:text-muted-dark">
          Add packing lists, reminders, and travel notes for your trip
        </Text>
        <TouchableOpacity
          onPress={() => {
            setIsEditing(true);
          }}
          className="flex-row items-center px-6 py-3 rounded-lg bg-primary"
        >
          <Feather name="plus" size={18} color="white" />
          <Text className="ml-2 font-semibold text-white">Add Notes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Edit mode
  if (isEditing) {
    const charPercentage = (totalCharCount / MAX_CHARS) * 100;
    const isNearLimit = totalCharCount > CHAR_THRESHOLD;
    const progressColor = isNearLimit ? '#EF4444' : '#10B981';

    return (
      <View className="flex-1 px-4 py-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-text dark:text-text-dark">
            Trip Notes ({notesList.length})
          </Text>
          <TouchableOpacity onPress={handleCancel} disabled={isSaving}>
            <Feather name="x" size={24} color={textColor} />
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error && (
          <View className="p-3 mb-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900 dark:border-red-800">
            <Text className="text-sm text-red-600 dark:text-red-200">{error}</Text>
          </View>
        )}

        {/* Add Note Input */}
        <View className="flex-row gap-2 mb-4">
          <TextInput
            value={newNote}
            onChangeText={setNewNote}
            placeholder="Type a note and press Add..."
            placeholderTextColor={mutedColor}
            maxLength={500}
            className="flex-1 px-3 py-2 border rounded-lg bg-surface dark:bg-surface-dark border-border dark:border-border-dark text-text dark:text-text-dark"
            style={{
              color: textColor,
            }}
            editable={!isSaving}
          />
          <TouchableOpacity
            onPress={addNote}
            disabled={isSaving || !newNote.trim()}
            className={`px-4 py-2 rounded-lg ${isSaving || !newNote.trim() ? 'bg-gray-300 dark:bg-gray-600' : 'bg-primary'}`}
          >
            <Feather name="plus" size={20} color={isSaving || !newNote.trim() ? mutedColor : 'white'} />
          </TouchableOpacity>
        </View>

        {/* Notes List */}
        <View className="flex-1 mb-4 border rounded-lg bg-surface dark:bg-surface-dark border-border dark:border-border-dark p-3">
          {notesList.length === 0 ? (
            <Text className="text-sm text-center text-muted dark:text-muted-dark py-8">
              No notes yet. Add one to get started.
            </Text>
          ) : (
            <FlatList
              data={notesList}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View className="flex-row items-center gap-3 mb-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <View className="flex-1">
                    <Text className="text-sm text-text dark:text-text-dark">{item}</Text>
                    <Text className="text-xs text-muted dark:text-muted-dark mt-1">
                      {item.length} characters
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => deleteNote(index)}
                    disabled={isSaving}
                  >
                    <Feather name="trash-2" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              )}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* Character Counter */}
        <View className="mb-4">
          {/* Progress Bar */}
          <View className="h-2 mb-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
            <View
              style={{
                width: `${Math.min(charPercentage, 100)}%`,
                height: '100%',
                backgroundColor: progressColor,
              }}
            />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className={`text-xs font-semibold ${isNearLimit ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {totalCharCount} / {MAX_CHARS}
            </Text>
            {isNearLimit && (
              <Text className="text-xs text-red-600 dark:text-red-400">
                {MAX_CHARS - totalCharCount} characters remaining
              </Text>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={handleCancel}
            disabled={isSaving}
            className="items-center flex-1 py-3 bg-gray-200 rounded-lg dark:bg-gray-700"
          >
            <Text className="font-semibold text-text dark:text-text-dark">
              {hasUnsavedChanges ? 'Cancel' : 'Done'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleClear}
            disabled={isSaving || notesList.length === 0}
            className={`flex-1 rounded-lg py-3 items-center ${
              isSaving || notesList.length === 0 ? 'bg-gray-200 dark:bg-gray-700' : 'bg-red-100 dark:bg-red-900'
            }`}
          >
            <Text className={`font-semibold ${isSaving || notesList.length === 0 ? 'text-muted dark:text-muted-dark' : 'text-red-600 dark:text-red-400'}`}>
              Clear All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className={`flex-1 rounded-lg py-3 items-center flex-row justify-center ${
              isSaving || !hasUnsavedChanges
                ? 'bg-gray-300 dark:bg-gray-600'
                : 'bg-primary'
            }`}
          >
            {isSaving && <Feather name="loader" size={16} color="white" />}
            <Text className={`font-semibold ${isSaving || !hasUnsavedChanges ? 'text-muted dark:text-muted-dark' : 'text-white'}`}>
              {isSaving ? ' Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Display mode
  return (
    <View className="flex-1 px-4 py-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold text-text dark:text-text-dark">
          Trip Notes ({notesList.length})
        </Text>
        <TouchableOpacity
          onPress={() => {
            setIsEditing(true);
          }}
        >
          <Feather name="edit" size={20} color={primaryColor} />
        </TouchableOpacity>
      </View>

      {/* Notes List */}
      <FlatList
        data={notesList}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View className="flex-row items-start gap-3 mb-3 p-3 rounded-lg bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
            <View className="w-6 h-6 rounded-full bg-primary items-center justify-center mt-0.5">
              <Text className="text-xs font-bold text-white">{index + 1}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm text-text dark:text-text-dark leading-5">{item}</Text>
              <Text className="text-xs text-muted dark:text-muted-dark mt-1">
                {item.length} characters
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-sm text-center text-muted dark:text-muted-dark py-8">
            No notes yet
          </Text>
        }
        scrollEnabled={false}
      />

      {/* Info Footer */}
      <View className="p-3 mt-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900 dark:border-blue-800">
        <View className="flex-row items-flex-start">
          <Feather name="info" size={16} color={isDark ? '#60A5FA' : '#3B82F6'} />
          <Text className="flex-1 ml-2 text-xs text-blue-700 dark:text-blue-200">
            {totalCharCount} characters used ({MAX_CHARS - totalCharCount} remaining)
          </Text>
        </View>
      </View>
    </View>
  );
}
