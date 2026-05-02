import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, TextInput, Modal, Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const EMOJI_OPTIONS = ['💪', '🧘', '🚶', '💧', '📖', '🥗', '😴', '🏃', '🎯', '🧹', '✍️', '🎨', '🎸', '🌿', '☕'];

const DUMMY_HABITS = [
  { id: '1', name: 'Morning Walk', emoji: '🚶', reward: 2.50, frequency: 'Daily', completed: true, streak: 5, lastCompleted: new Date().toISOString() },
  { id: '2', name: 'Drink 8 Glasses', emoji: '💧', reward: 1.00, frequency: 'Daily', completed: true, streak: 12, lastCompleted: new Date().toISOString() },
  { id: '3', name: 'Read 20 mins', emoji: '📖', reward: 1.50, frequency: 'Daily', completed: false, streak: 3, lastCompleted: null },
  { id: '4', name: 'Meditate', emoji: '🧘', reward: 2.00, frequency: 'Daily', completed: false, streak: 0, lastCompleted: null },
];

export default function HabitEntry() {
  const [habits, setHabits] = useState(DUMMY_HABITS);
  const [modalVisible, setModalVisible] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habitEmoji, setHabitEmoji] = useState('💪');
  const [habitReward, setHabitReward] = useState('1.00');

  const toggleHabit = (id) => {
    setHabits(prev => prev.map(h =>
      h.id === id
        ? { ...h, completed: !h.completed, lastCompleted: !h.completed ? new Date().toISOString() : h.lastCompleted }
        : h
    ));
  };

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const addHabit = () => {
    if (!habitName.trim()) return;
    const reward = parseFloat(habitReward);
    if (isNaN(reward) || reward <= 0) return;
    setHabits(prev => [...prev, {
      id: Date.now().toString(),
      name: habitName.trim(),
      emoji: habitEmoji,
      reward,
      frequency: 'Daily',
      completed: false,
      streak: 0,
      lastCompleted: null,
    }]);
    setHabitName('');
    setHabitEmoji('💪');
    setHabitReward('1.00');
    setModalVisible(false);
  };

  const completed = habits.filter(h => h.completed);
  const pending = habits.filter(h => !h.completed);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Habits</Text>
            <Text style={styles.subtitle}>{completed.length} of {habits.length} done today</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
            <Feather name="plus" size={20} color="#111" />
          </TouchableOpacity>
        </View>

        {pending.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>TO DO</Text>
            {pending.map(habit => (
              <HabitRow key={habit.id} habit={habit} onToggle={toggleHabit} onDelete={deleteHabit} />
            ))}
          </>
        )}

        {completed.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>COMPLETED</Text>
            {completed.map(habit => (
              <HabitRow key={habit.id} habit={habit} onToggle={toggleHabit} onDelete={deleteHabit} />
            ))}
          </>
        )}

        {habits.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌱</Text>
            <Text style={styles.emptyText}>No habits yet</Text>
            <Text style={styles.emptySub}>Tap + to add your first habit</Text>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={e => e.stopPropagation()}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>New Habit</Text>

            <Text style={styles.inputLabel}>HABIT NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Morning run"
              placeholderTextColor="#444"
              value={habitName}
              onChangeText={setHabitName}
              maxLength={40}
            />

            <Text style={styles.inputLabel}>EMOJI</Text>
            <View style={styles.emojiGrid}>
              {EMOJI_OPTIONS.map(e => (
                <TouchableOpacity
                  key={e}
                  style={[styles.emojiOption, habitEmoji === e && styles.emojiSelected]}
                  onPress={() => setHabitEmoji(e)}
                >
                  <Text style={styles.emojiText}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>DAILY REWARD ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="1.00"
              placeholderTextColor="#444"
              value={habitReward}
              onChangeText={setHabitReward}
              keyboardType="decimal-pad"
            />

            <TouchableOpacity style={styles.saveBtn} onPress={addHabit}>
              <Text style={styles.saveBtnText}>Add Habit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function HabitRow({ habit, onToggle, onDelete }) {
  return (
    <View style={styles.habitRow}>
      <TouchableOpacity onPress={() => onToggle(habit.id)}>
        <View style={[styles.checkbox, habit.completed && styles.checkboxDone]}>
          {habit.completed && <Feather name="check" size={14} color="#111" />}
        </View>
      </TouchableOpacity>
      <Text style={styles.habitEmoji}>{habit.emoji}</Text>
      <View style={styles.habitInfo}>
        <Text style={[styles.habitName, habit.completed && styles.habitNameDone]}>{habit.name}</Text>
        <View style={styles.habitMeta}>
          <Text style={styles.habitReward}>+${habit.reward.toFixed(2)}</Text>
          <Text style={styles.habitFreq}>{habit.frequency}</Text>
          {habit.streak > 0 && <Text style={styles.habitStreak}>🔥 {habit.streak}</Text>}
        </View>
      </View>
      <TouchableOpacity onPress={() => onDelete(habit.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Feather name="trash-2" size={16} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0A0A' },
  scroll: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: '#555', marginTop: 2 },
  addBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F4C542', alignItems: 'center', justifyContent: 'center' },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#444', letterSpacing: 1.5, marginBottom: 10 },
  habitRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161616', borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#222' },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#444', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  checkboxDone: { backgroundColor: '#F4C542', borderColor: '#F4C542' },
  habitEmoji: { fontSize: 24, marginRight: 12 },
  habitInfo: { flex: 1 },
  habitName: { fontSize: 15, fontWeight: '600', color: '#fff' },
  habitNameDone: { color: '#444', textDecorationLine: 'line-through' },
  habitMeta: { flexDirection: 'row', gap: 10, marginTop: 4, alignItems: 'center' },
  habitReward: { fontSize: 13, color: '#F4C542', fontWeight: '700' },
  habitFreq: { fontSize: 12, color: '#555' },
  habitStreak: { fontSize: 13, color: '#666' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#555', textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#161616', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  modalHandle: { width: 40, height: 4, backgroundColor: '#333', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 20 },
  inputLabel: { fontSize: 10, fontWeight: '700', color: '#555', letterSpacing: 1.5, marginBottom: 8 },
  input: { backgroundColor: '#1E1E1E', borderRadius: 12, padding: 14, color: '#fff', fontSize: 15, marginBottom: 20, borderWidth: 1, borderColor: '#2A2A2A' },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  emojiOption: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#1E1E1E', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  emojiSelected: { borderColor: '#F4C542' },
  emojiText: { fontSize: 22 },
  saveBtn: { backgroundColor: '#F4C542', borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 10 },
  saveBtnText: { fontSize: 16, fontWeight: '800', color: '#111' },
  cancelBtn: { padding: 12, alignItems: 'center' },
  cancelBtnText: { fontSize: 15, color: '#555', fontWeight: '600' },
});
