import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const HABITS = [
  { id: '1', name: 'Morning Walk', emoji: '🚶', reward: 2.50, completed: true, streak: 5 },
  { id: '2', name: 'Drink 8 Glasses', emoji: '💧', reward: 1.00, completed: true, streak: 12 },
  { id: '3', name: 'Read 20 mins', emoji: '📖', reward: 1.50, completed: false, streak: 3 },
  { id: '4', name: 'Meditate', emoji: '🧘', reward: 2.00, completed: false, streak: 0 },
];

const BALANCE = 3.50;
const TOTAL_EARNED = 18.00;
const TOTAL_SPENT = 14.50;

const RECENT = [
  { id: '1', type: 'earn', label: 'Morning Walk', amount: 2.50 },
  { id: '2', type: 'earn', label: 'Drink 8 Glasses', amount: 1.00 },
  { id: '3', type: 'spend', label: 'Coffee ☕', amount: 6.00 },
];

export default function Home({ navigation }) {
  const completed = HABITS.filter(h => h.completed).length;
  const pct = Math.round((completed / HABITS.length) * 100);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.title}>Vivendi 💰</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 12</Text>
          </View>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>AVAILABLE ALLOWANCE</Text>
          <Text style={styles.balanceAmount}>${BALANCE.toFixed(2)}</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceStat}>
              <Feather name="arrow-up-circle" size={14} color="#4CD964" />
              <Text style={styles.balanceStatText}>+${TOTAL_EARNED.toFixed(2)} earned</Text>
            </View>
            <View style={styles.balanceStat}>
              <Feather name="arrow-down-circle" size={14} color="#FF6B6B" />
              <Text style={styles.balanceStatText}>-${TOTAL_SPENT.toFixed(2)} spent</Text>
            </View>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Today's Habits</Text>
            <Text style={styles.progressSub}>{completed} of {HABITS.length} complete</Text>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
            </View>
            <Text style={styles.progressPct}>{pct}% done</Text>
          </View>
          <View style={styles.progressCircle}>
            <Text style={styles.progressEmoji}>{pct === 100 ? '🏆' : pct >= 50 ? '⚡' : '🌱'}</Text>
            <Text style={styles.progressCircleText}>{pct}%</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickRow}>
          <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('Habits')}>
            <Feather name="check-circle" size={20} color="#F4C542" />
            <Text style={styles.quickBtnText}>Log Habits</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickBtn, styles.quickBtnSpend]} onPress={() => navigation.navigate('Wallet')}>
            <Feather name="shopping-bag" size={20} color="#111" />
            <Text style={[styles.quickBtnText, { color: '#111' }]}>Spend</Text>
          </TouchableOpacity>
        </View>

        {/* Recent */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {RECENT.map(tx => (
            <View key={tx.id} style={styles.txRow}>
              <View style={[styles.txDot, { backgroundColor: tx.type === 'earn' ? '#4CD964' : '#FF6B6B' }]} />
              <Text style={styles.txLabel}>{tx.label}</Text>
              <Text style={[styles.txAmount, { color: tx.type === 'earn' ? '#4CD964' : '#FF6B6B' }]}>
                {tx.type === 'earn' ? '+' : '-'}${tx.amount.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0A0A' },
  scroll: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, marginBottom: 24 },
  greeting: { fontSize: 14, color: '#666', letterSpacing: 0.5 },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  streakBadge: { backgroundColor: '#1A1A1A', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#2A2A2A' },
  streakText: { fontSize: 16, fontWeight: '700' },
  balanceCard: { backgroundColor: '#F4C542', borderRadius: 20, padding: 24, marginBottom: 16 },
  balanceLabel: { fontSize: 11, fontWeight: '700', color: '#8A6F00', letterSpacing: 1.5, marginBottom: 4 },
  balanceAmount: { fontSize: 48, fontWeight: '900', color: '#111', letterSpacing: -2, marginBottom: 12 },
  balanceRow: { flexDirection: 'row', gap: 16 },
  balanceStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  balanceStatText: { fontSize: 13, color: '#333', fontWeight: '600' },
  progressCard: { backgroundColor: '#161616', borderRadius: 20, padding: 20, marginBottom: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  progressInfo: { flex: 1 },
  progressTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 4 },
  progressSub: { fontSize: 13, color: '#666', marginBottom: 12 },
  progressBarTrack: { height: 6, backgroundColor: '#2A2A2A', borderRadius: 3, marginBottom: 8, overflow: 'hidden' },
  progressBarFill: { height: 6, backgroundColor: '#F4C542', borderRadius: 3 },
  progressPct: { fontSize: 12, color: '#F4C542', fontWeight: '700' },
  progressCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#1E1E1E', borderWidth: 2, borderColor: '#2A2A2A', alignItems: 'center', justifyContent: 'center', marginLeft: 16 },
  progressEmoji: { fontSize: 20 },
  progressCircleText: { fontSize: 13, fontWeight: '800', color: '#F4C542' },
  quickRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  quickBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#161616', borderRadius: 16, paddingVertical: 16, borderWidth: 1, borderColor: '#2A2A2A' },
  quickBtnSpend: { backgroundColor: '#F4C542', borderColor: '#F4C542' },
  quickBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 12 },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  txDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  txLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: '#fff' },
  txAmount: { fontSize: 15, fontWeight: '800' },
});
