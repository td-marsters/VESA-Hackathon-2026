import React, { useEffect, useContext, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, TextInput, Modal, Pressable, Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, HABIT_EMOJIS } from '../constants';

// ── Dummy data ────────────────────────────────────────────────────────────────

const INITIAL_GOAL = {name: 'Playstation 6', value: 500, progression: 100};

const EMOJI_OPTIONS = ['💪', '🧘', '🚶', '💧', '📖', '🥗', '😴', '🏃', '🎯', '🧹', '✍️', '🎨', '🌿', '☕'];

// ── Main screen ───────────────────────────────────────────────────────────────

export default function Home( { route } ) {
  
  const USER_NAME = route.params?.userName || "User";
  const userId = route.params?.userId;
  
  console.log(USER_NAME, userId)


  const [habits, setHabits] = useState([]);
  const fetchHabits = () => {
    if (!userId) return;
    fetch(`http://localhost:7071/api/user/${userId}`)
      .then(res => res.json())
      .then(data => setHabits(data.habits))
      .catch(err => console.error(err));
  };
  
  // call on mount
  useEffect(() => {
    fetchHabits();
  }, [userId]);
 
  const [goal, setGoal] = useState(INITIAL_GOAL);
  const [progress, setProgress] = useState(goal.progression); /** */
  const [name, setName] = useState(USER_NAME);
  const [toast, setToast] = useState(null);

  // Habit modal
  const [habitModal, setHabitModal] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habitEmoji, setHabitEmoji] = useState('💪');
  const [habitReward, setHabitReward] = useState('1.00');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Habit actions ───────────────────────────────────────────────────────────


  const toggleHabit = (habit) => {
    if (habit.cooldown) return; // already completed

    fetch(`http://localhost:7071/api/habit/${userId}/${habit._id}/complete`, {
      method: 'PATCH',
    })
      .then(res => res.json())
      .then(data => {
        setHabits(prev => prev.map(h =>
          h._id === habit._id ? { ...h, cooldown: true } : h
        ));
        const reward = parseFloat(habit.payOut) ?? 0;
        setProgress(b => parseFloat((b + reward).toFixed(2)));xx
        showToast(`+$${reward.toFixed(2)} earned from ${habit.title}!`);
      })
      .catch(err => {
        console.error(err);
        showToast('Failed to complete habit', 'error');
      });
  };


  const addHabit = () => {
    const reward = parseFloat(habitReward);
    if (!habitName.trim() || isNaN(reward) || reward <= 0) return;
    setHabits(prev => [...prev,
    fetch('http://localhost:7071/api/habit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userId,
        title: habitName.trim(),
        payOut: habitReward,
        frequency: "daily",
        repeatable: true,
        cooldown: false,
        emoji: habitEmoji,
      }),
    })
      .then(res => res.json())
      .then(data => {
        fetchHabits();       // ← refresh habits from server
        setHabitModal(false);
      })
      .catch(err => console.error('Habit error:', err))
    ]);
  };

  const deleteHabit = (habitId) => {
    fetch(`http://localhost:7071/api/habit/${userId}/${habitId}`, {
      method: 'DELETE',
    })
      .then(() => fetchHabits())  // refresh the list
      .catch(err => console.error(err));
  };

  // ── Derived ─────────────────────────────────────────────────────────────────

  const completedCount = habits.filter(h => h.completed).length;
  const pct = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
  const goalProgPct = progress > 0 ? Math.round((progress / goal.value) * 100) : 0;
  
  return (
    <SafeAreaView style={styles.safe}>

      {/* Toast */}
      {toast && (
        <View style={[styles.toast, toast.type === 'error' ? styles.toastError : styles.toastSuccess]}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      )}

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.titleRow}>
            <Image
                source={require('../assets/logo-inline.png')}
                style={styles.titleLogo}
                resizeMode="contain"  
              />
              <Text style={styles.title}>pendi</Text>
            </View>
            <Text style={styles.greeting}>Welcome back {name},</Text>
          </View>
        </View>

        {/* ── GOAL SECTION ──────────────────────────────────────────────── */}
        <View style={styles.goalCard}>
          <Text style={styles.goalLabel}>{goalIcon}   {goal.name}</Text>
          <View style={styles.goalProgressTrack}>
            <View style={[styles.goalProgressFill, { width: `${goalProgPct}%` }]} />
          </View>
        </View>

        {/* ── HABITS SECTION ──────────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Today's Habits</Text>
            <Text style={styles.sectionSub}>{completedCount} of {habits.length} · {pct}% done</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setHabitModal(true)}>
            <Feather name="plus" size={18} color={COLORS.BACK_GROUND} />
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${pct}%` }]} />
        </View>

        {/* Habit list */}
        {habits.map(habit => (
          <View key={habit._id} style={styles.habitRow}>
            <TouchableOpacity onPress={() => toggleHabit(habit)}>
              <View style={[styles.checkbox, habit.cooldown && styles.checkboxDone]}>
                {habit.cooldown && <Feather name="check" size={12} color="#111" />}
              </View>
            </TouchableOpacity>
            <Text style={styles.habitEmoji}>{habit.emoji}</Text>
            <View style={styles.habitInfo}>
              <Text style={[styles.habitName, habit.cooldown && styles.habitNameDone]}>{habit.title}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteHabit(habit._id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Feather name="trash-2" size={14} color="#2A2A2A" />
            </TouchableOpacity>
          </View>
        ))}

        {habits.length === 0 && (
          <View style={styles.emptyHabits}>
            <Text style={styles.emptyText}>No habits yet — tap + to add one</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── ADD HABIT MODAL ─────────────────────────────────────────────────── */}
      <Modal visible={habitModal} animationType="slide" transparent>
        <Pressable style={styles.modalOverlay} onPress={() => setHabitModal(false)}>
          <Pressable style={styles.modalSheet} onPress={e => e.stopPropagation()}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>New Habit</Text>

            <Text style={styles.inputLabel}>NAME</Text>
            <TextInput style={styles.input} placeholder="e.g. Morning run" placeholderTextColor="#444"
              value={habitName} onChangeText={setHabitName} maxLength={40} />

            <Text style={styles.inputLabel}>EMOJI</Text>
            <View style={styles.emojiGrid}>
              {EMOJI_OPTIONS.map(e => (
                <TouchableOpacity key={e} style={[styles.emojiOption, habitEmoji === e && styles.emojiSelected]} onPress={() => setHabitEmoji(e)}>
                  <Text style={{ fontSize: 20 }}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>DAILY REWARD ($)</Text>
            <TextInput style={styles.input} placeholder="1.00" placeholderTextColor="#444"
              value={habitReward} onChangeText={setHabitReward} keyboardType="decimal-pad" />

            <TouchableOpacity style={styles.modalBtn} onPress={addHabit}>
              <Text style={styles.modalBtnText}>Add Habit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setHabitModal(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}

function timeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.BACK_GROUND },
  scroll: { flex: 1, paddingHorizontal: 20 },

  toast: { position: 'absolute', top: 16, left: 20, right: 20, zIndex: 100, borderRadius: 12, padding: 14, alignItems: 'center' },
  toastSuccess: { backgroundColor: '#1A2E1A', borderWidth: 1, borderColor: '#4CD964' },
  toastError: { backgroundColor: '#2E1A1A', borderWidth: 1, borderColor: '#FF6B6B' },
  toastText: { fontSize: 13, fontWeight: '600', color: '#fff' },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, marginBottom: 10 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.CARD_INACTIVE, letterSpacing: -0.5, marginBottom: 5 },
  greeting: { fontSize: 13, color: COLORS.TEXT_INACTIVE, letterSpacing: 0.5 },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  titleLogo: {
    width: 28,
    height: 28,
    alignSelf: 'center',
    paddingBottom:20
  },

  // Wallet
  goalCard: { backgroundColor: COLORS.CARD_ACTIVE, borderRadius: 20, padding: 20, marginBottom: 12 },
  goalLabel: { fontSize: 15, fontWeight: '700', color: COLORS.BACK_GROUND, marginBottom: 10 },
  goalRow: { flexDirection: 'row', gap: 14 },

  // Habits
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.TEXT_INACTIVE },
  sectionSub: { fontSize: 12, color: '#555', marginTop: 2 },
  addBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.GOAL_PROGRESS, alignItems: 'center', justifyContent: 'center' },

  progressTrack: { height: 4, backgroundColor: COLORS.PROGRESS_TRACK, borderRadius: 2, marginBottom: 14, overflow: 'hidden' },
  progressFill: { height: 4, backgroundColor: COLORS.TEXT_ACTIVE, borderRadius: 2 },

  goalProgressTrack: { height: 4, backgroundColor: COLORS.PROGRESS_TRACK, borderRadius: 2, marginTop: 14, overflow: 'hidden' },
  goalProgressFill: { height: 4, backgroundColor: COLORS.GOAL_PROGRESS, borderRadius: 2 },

  habitRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.CARD_ACTIVE, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#1E1E1E' },
  checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: COLORS.LOGO_BORDER, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  checkboxDone: { backgroundColor: COLORS.GOAL_PROGRESS, borderColor: COLORS.GOAL_PROGRESS },
  habitEmoji: { fontSize: 20, marginRight: 10 },
  habitInfo: { flex: 1 },
  habitName: { fontSize: 14, fontWeight: '600', color: COLORS.BACK_GROUND },
  habitNameDone: { color: COLORS.TEXT_ACTIVE, textDecorationLine: 'line-through' },
  habitMeta: { flexDirection: 'row', gap: 8, marginTop: 2 },
  habitReward: { fontSize: 12, color: COLORS.GOAL_PROGRESS, fontWeight: '700' },

  emptyHabits: { paddingVertical: 24, alignItems: 'center' },
  emptyText: { fontSize: 13, color: '#444' },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: COLORS.BACK_GROUND, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 44 },
  modalHandle: { width: 40, height: 4, backgroundColor: COLORS.TEXT_INACTIVE, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.TEXT_INACTIVE, marginBottom: 4 },
  modalgoal: { fontSize: 13, color: COLORS.TEXT_ACTIVE, fontWeight: '600', marginBottom: 16 },
  inputLabel: { fontSize: 10, fontWeight: '700', color: COLORS.TEXT_INACTIVE, letterSpacing: 1.5, marginBottom: 8 },
  input: { backgroundColor: COLORS.CARD_ACTIVE, borderRadius: 12, placeholderTextColor: COLORS.TEXT_ACTIVE, padding: 14, color: COLORS.TEXT_ACTIVE, fontSize: 15, marginBottom: 16, borderWidth: 1, borderColor: COLORS.BORDER },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  emojiOption: { width: 42, height: 42, borderRadius: 10, backgroundColor: COLORS.CARD_ACTIVE, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  emojiSelected: { borderColor: COLORS.GOAL_PROGRESS },
  modalBtn: { backgroundColor: COLORS.GOAL_PROGRESS, borderRadius: 14, padding: 15, alignItems: 'center', marginBottom: 8 },
  modalBtnText: { fontSize: 15, fontWeight: '800', color: COLORS.TEXT_INACTIVE },
  cancelBtn: { padding: 12, alignItems: 'center' },
  cancelBtnText: { fontSize: 14, color: '#555', fontWeight: '600' },
});
