import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, TextInput, Modal, Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

// ── Dummy data ────────────────────────────────────────────────────────────────

const INITIAL_HABITS = [
  { id: '1', name: 'Morning Walk', emoji: '🚶', reward: 2.50, completed: true, streak: 5 },
  { id: '2', name: 'Drink 8 Glasses', emoji: '💧', reward: 1.00, completed: true, streak: 12 },
  { id: '3', name: 'Read 20 mins', emoji: '📖', reward: 1.50, completed: false, streak: 3 },
  { id: '4', name: 'Meditate', emoji: '🧘', reward: 2.00, completed: false, streak: 0 },
];

const INITIAL_TRANSACTIONS = [
  { id: '1', type: 'earn', label: 'Morning Walk', amount: 2.50, date: new Date().toISOString() },
  { id: '2', type: 'earn', label: 'Drink 8 Glasses', amount: 1.00, date: new Date().toISOString() },
  { id: '3', type: 'spend', label: 'Coffee ☕', amount: 6.00, date: new Date(Date.now() - 3600000).toISOString() },
];

const SPEND_PRESETS = [
  { label: 'Coffee ☕', amount: 6 },
  { label: 'Lunch 🍜', amount: 15 },
  { label: 'Movie 🎬', amount: 18 },
  { label: 'Takeaway 🍕', amount: 25 },
];

const EMOJI_OPTIONS = ['💪', '🧘', '🚶', '💧', '📖', '🥗', '😴', '🏃', '🎯', '🧹', '✍️', '🎨', '🌿', '☕'];

// ── Main screen ───────────────────────────────────────────────────────────────

export default function Home() {
  const [habits, setHabits] = useState(INITIAL_HABITS /**get from server */);
  const [balance, setBalance] = useState(3.50); /** */
  const [totalEarned, setTotalEarned] = useState(18.00);
  const [totalSpent, setTotalSpent] = useState(14.50);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [toast, setToast] = useState(null);

  // Habit modal
  const [habitModal, setHabitModal] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habitEmoji, setHabitEmoji] = useState('💪');
  const [habitReward, setHabitReward] = useState('1.00');

  // Spend modal
  const [spendModal, setSpendModal] = useState(false);
  const [spendLabel, setSpendLabel] = useState('');
  const [spendAmount, setSpendAmount] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Habit actions ───────────────────────────────────────────────────────────

  const toggleHabit = (id) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      const completing = !h.completed;
      if (completing) {
        setBalance(b => parseFloat((b + h.reward).toFixed(2)));
        setTotalEarned(t => parseFloat((t + h.reward).toFixed(2)));
        setTransactions(tx => [
          { id: Date.now().toString(), type: 'earn', label: h.name, amount: h.reward, date: new Date().toISOString() },
          ...tx,
        ]);
        showToast(`+$${h.reward.toFixed(2)} earned from ${h.name}!`);
      } else {
        setBalance(b => parseFloat(Math.max(0, b - h.reward).toFixed(2)));
        setTotalEarned(t => parseFloat(Math.max(0, t - h.reward).toFixed(2)));
      }
      return { ...h, completed: completing, streak: completing ? h.streak + 1 : Math.max(0, h.streak - 1) };
    }));
  };

  const addHabit = () => {
    const reward = parseFloat(habitReward);
    if (!habitName.trim() || isNaN(reward) || reward <= 0) return;
    setHabits(prev => [...prev, {
      id: Date.now().toString(),
      name: habitName.trim(),
      emoji: habitEmoji,
      reward,
      completed: false,
      streak: 0,
    }]);
    setHabitName('');
    setHabitEmoji('💪');
    setHabitReward('1.00');
    setHabitModal(false);
  };

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  // ── Spend actions ───────────────────────────────────────────────────────────

  const handleSpend = () => {
    const amount = parseFloat(spendAmount);
    if (!spendLabel.trim() || isNaN(amount) || amount <= 0) {
      showToast('Enter a valid item and amount.', 'error'); return;
    }
    if (amount > balance) {
      showToast(`Only $${balance.toFixed(2)} available.`, 'error'); return;
    }
    setBalance(b => parseFloat((b - amount).toFixed(2)));
    setTotalSpent(t => parseFloat((t + amount).toFixed(2)));
    setTransactions(tx => [
      { id: Date.now().toString(), type: 'spend', label: spendLabel.trim(), amount, date: new Date().toISOString() },
      ...tx,
    ]);
    showToast(`$${amount.toFixed(2)} spent — you earned it! 🎉`);
    setSpendLabel('');
    setSpendAmount('');
    setSpendModal(false);
  };

  // ── Derived ─────────────────────────────────────────────────────────────────

  const completedCount = habits.filter(h => h.completed).length;
  const pct = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
  const topStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

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
            <Text style={styles.greeting}>Good {timeOfDay()},</Text>
            <Text style={styles.title}>Vi$pendi 💰</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 {topStreak}</Text>
          </View>
        </View>

        {/* ── WALLET SECTION ──────────────────────────────────────────────── */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>GUILT-FREE BALANCE</Text>
          <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceStat}>
              <Feather name="arrow-up-circle" size={13} color="#4CD964" />
              <Text style={styles.balanceStatText}>+${totalEarned.toFixed(2)}</Text>
            </View>
            <View style={styles.balanceStat}>
              <Feather name="arrow-down-circle" size={13} color="#8A6F00" />
              <Text style={styles.balanceStatText}>-${totalSpent.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Spend row */}
        <TouchableOpacity
          style={[styles.spendBtn, balance <= 0 && styles.spendBtnDisabled]}
          onPress={() => balance > 0 && setSpendModal(true)}
          activeOpacity={0.85}
        >
          <Feather name="shopping-bag" size={18} color={balance > 0 ? '#111' : '#555'} />
          <Text style={[styles.spendBtnText, balance <= 0 && { color: '#555' }]}>
            {balance > 0 ? 'Spend My Allowance' : 'Complete habits to earn!'}
          </Text>
        </TouchableOpacity>

        {/* ── HABITS SECTION ──────────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Today's Habits</Text>
            <Text style={styles.sectionSub}>{completedCount} of {habits.length} · {pct}% done</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setHabitModal(true)}>
            <Feather name="plus" size={18} color="#111" />
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${pct}%` }]} />
        </View>

        {/* Habit list */}
        {habits.map(habit => (
          <View key={habit.id} style={styles.habitRow}>
            <TouchableOpacity onPress={() => toggleHabit(habit.id)}>
              <View style={[styles.checkbox, habit.completed && styles.checkboxDone]}>
                {habit.completed && <Feather name="check" size={12} color="#111" />}
              </View>
            </TouchableOpacity>
            <Text style={styles.habitEmoji}>{habit.emoji}</Text>
            <View style={styles.habitInfo}>
              <Text style={[styles.habitName, habit.completed && styles.habitNameDone]}>{habit.name}</Text>
              <View style={styles.habitMeta}>
                <Text style={styles.habitReward}>+${habit.reward.toFixed(2)}</Text>
                {habit.streak > 0 && <Text style={styles.habitStreak}>🔥 {habit.streak}</Text>}
              </View>
            </View>
            <TouchableOpacity onPress={() => deleteHabit(habit.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Feather name="trash-2" size={14} color="#2A2A2A" />
            </TouchableOpacity>
          </View>
        ))}

        {habits.length === 0 && (
          <View style={styles.emptyHabits}>
            <Text style={styles.emptyText}>No habits yet — tap + to add one</Text>
          </View>
        )}

        {/* ── RECENT ACTIVITY ─────────────────────────────────────────────── */}
        {transactions.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>Recent Activity</Text>
            {transactions.slice(0, 5).map(tx => (
              <View key={tx.id} style={styles.txRow}>
                <View style={[styles.txIcon, { backgroundColor: tx.type === 'earn' ? '#1A2E1A' : '#2E1A1A' }]}>
                  <Feather name={tx.type === 'earn' ? 'check' : 'shopping-bag'} size={12} color={tx.type === 'earn' ? '#4CD964' : '#FF6B6B'} />
                </View>
                <Text style={styles.txLabel}>{tx.label}</Text>
                <Text style={[styles.txAmount, { color: tx.type === 'earn' ? '#4CD964' : '#FF6B6B' }]}>
                  {tx.type === 'earn' ? '+' : '-'}${tx.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </>
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

      {/* ── SPEND MODAL ─────────────────────────────────────────────────────── */}
      <Modal visible={spendModal} animationType="slide" transparent>
        <Pressable style={styles.modalOverlay} onPress={() => setSpendModal(false)}>
          <Pressable style={styles.modalSheet} onPress={e => e.stopPropagation()}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Spend Allowance</Text>
            <Text style={styles.modalBalance}>Available: ${balance.toFixed(2)}</Text>

            <Text style={styles.inputLabel}>WHAT'S IT FOR?</Text>
            <TextInput style={styles.input} placeholder="e.g. Coffee, movie..." placeholderTextColor="#444"
              value={spendLabel} onChangeText={setSpendLabel} maxLength={50} />

            <Text style={styles.inputLabel}>AMOUNT ($)</Text>
            <TextInput style={styles.input} placeholder="0.00" placeholderTextColor="#444"
              value={spendAmount} onChangeText={setSpendAmount} keyboardType="decimal-pad" />

            <TouchableOpacity style={styles.modalBtn} onPress={handleSpend}>
              <Text style={styles.modalBtnText}>Spend it — I earned this! 🎉</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setSpendModal(false)}>
              <Text style={styles.cancelBtnText}>Maybe later</Text>
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
  safe: { flex: 1, backgroundColor: '#0A0A0A' },
  scroll: { flex: 1, paddingHorizontal: 20 },

  toast: { position: 'absolute', top: 16, left: 20, right: 20, zIndex: 100, borderRadius: 12, padding: 14, alignItems: 'center' },
  toastSuccess: { backgroundColor: '#1A2E1A', borderWidth: 1, borderColor: '#4CD964' },
  toastError: { backgroundColor: '#2E1A1A', borderWidth: 1, borderColor: '#FF6B6B' },
  toastText: { fontSize: 13, fontWeight: '600', color: '#fff' },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, marginBottom: 20 },
  greeting: { fontSize: 13, color: '#555', letterSpacing: 0.5 },
  title: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  streakBadge: { backgroundColor: '#1A1A1A', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#2A2A2A' },
  streakText: { fontSize: 14, fontWeight: '700' },

  // Wallet
  balanceCard: { backgroundColor: '#F4C542', borderRadius: 20, padding: 20, marginBottom: 12 },
  balanceLabel: { fontSize: 10, fontWeight: '700', color: '#8A6F00', letterSpacing: 1.5, marginBottom: 2 },
  balanceAmount: { fontSize: 44, fontWeight: '900', color: '#111', letterSpacing: -2, marginBottom: 10 },
  balanceRow: { flexDirection: 'row', gap: 14 },
  balanceStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  balanceStatText: { fontSize: 12, color: '#333', fontWeight: '600' },

  spendBtn: { backgroundColor: '#F4C542', borderRadius: 14, padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 },
  spendBtnDisabled: { backgroundColor: '#161616', borderWidth: 1, borderColor: '#222' },
  spendBtnText: { fontSize: 15, fontWeight: '800', color: '#111' },

  // Habits
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  sectionSub: { fontSize: 12, color: '#555', marginTop: 2 },
  addBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F4C542', alignItems: 'center', justifyContent: 'center' },

  progressTrack: { height: 4, backgroundColor: '#1E1E1E', borderRadius: 2, marginBottom: 14, overflow: 'hidden' },
  progressFill: { height: 4, backgroundColor: '#F4C542', borderRadius: 2 },

  habitRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#141414', borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#1E1E1E' },
  checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#333', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  checkboxDone: { backgroundColor: '#F4C542', borderColor: '#F4C542' },
  habitEmoji: { fontSize: 20, marginRight: 10 },
  habitInfo: { flex: 1 },
  habitName: { fontSize: 14, fontWeight: '600', color: '#fff' },
  habitNameDone: { color: '#444', textDecorationLine: 'line-through' },
  habitMeta: { flexDirection: 'row', gap: 8, marginTop: 2 },
  habitReward: { fontSize: 12, color: '#F4C542', fontWeight: '700' },
  habitStreak: { fontSize: 12, color: '#555' },

  emptyHabits: { paddingVertical: 24, alignItems: 'center' },
  emptyText: { fontSize: 13, color: '#444' },

  // Transactions
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#141414' },
  txIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  txLabel: { flex: 1, fontSize: 13, fontWeight: '600', color: '#ccc' },
  txAmount: { fontSize: 14, fontWeight: '800' },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#161616', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 44 },
  modalHandle: { width: 40, height: 4, backgroundColor: '#2A2A2A', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 4 },
  modalBalance: { fontSize: 13, color: '#F4C542', fontWeight: '600', marginBottom: 16 },
  inputLabel: { fontSize: 10, fontWeight: '700', color: '#555', letterSpacing: 1.5, marginBottom: 8 },
  input: { backgroundColor: '#1E1E1E', borderRadius: 12, padding: 14, color: '#fff', fontSize: 15, marginBottom: 16, borderWidth: 1, borderColor: '#262626' },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  emojiOption: { width: 42, height: 42, borderRadius: 10, backgroundColor: '#1E1E1E', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  emojiSelected: { borderColor: '#F4C542' },
  modalBtn: { backgroundColor: '#F4C542', borderRadius: 14, padding: 15, alignItems: 'center', marginBottom: 8 },
  modalBtnText: { fontSize: 15, fontWeight: '800', color: '#111' },
  cancelBtn: { padding: 12, alignItems: 'center' },
  cancelBtnText: { fontSize: 14, color: '#555', fontWeight: '600' },
});
