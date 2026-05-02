import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, TextInput, Modal, Pressable, Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const SPEND_PRESETS = [
  { label: 'Coffee ☕', amount: 6 },
  { label: 'Lunch 🍜', amount: 15 },
  { label: 'Movie 🎬', amount: 18 },
  { label: 'Takeaway 🍕', amount: 25 },
];

const DUMMY_TRANSACTIONS = [
  { id: '1', type: 'earn', label: 'Morning Walk', amount: 2.50, date: new Date().toISOString() },
  { id: '2', type: 'earn', label: 'Drink 8 Glasses', amount: 1.00, date: new Date().toISOString() },
  { id: '3', type: 'spend', label: 'Coffee ☕', amount: 6.00, date: new Date(Date.now() - 3600000).toISOString() },
  { id: '4', type: 'earn', label: 'Read 20 mins', amount: 1.50, date: new Date(Date.now() - 86400000).toISOString() },
  { id: '5', type: 'spend', label: 'Lunch 🍜', amount: 15.00, date: new Date(Date.now() - 86400000).toISOString() },
];

export default function Wallet() {
  const [balance, setBalance] = useState(3.50);
  const [totalEarned] = useState(18.00);
  const [totalSpent, setTotalSpent] = useState(14.50);
  const [transactions, setTransactions] = useState(DUMMY_TRANSACTIONS);
  const [modalVisible, setModalVisible] = useState(false);
  const [spendLabel, setSpendLabel] = useState('');
  const [spendAmount, setSpendAmount] = useState('');
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSpend = () => {
    const amount = parseFloat(spendAmount);
    if (!spendLabel.trim() || isNaN(amount) || amount <= 0) {
      showToast('Enter a valid item and amount.', 'error');
      return;
    }
    if (amount > balance) {
      showToast(`Only $${balance.toFixed(2)} available.`, 'error');
      return;
    }
    setBalance(b => parseFloat((b - amount).toFixed(2)));
    setTotalSpent(t => parseFloat((t + amount).toFixed(2)));
    setTransactions(tx => [
      { id: Date.now().toString(), type: 'spend', label: spendLabel.trim(), amount, date: new Date().toISOString() },
      ...tx,
    ]);
    showToast(`$${amount.toFixed(2)} spent on ${spendLabel} 🎉`);
    setSpendLabel('');
    setSpendAmount('');
    setModalVisible(false);
  };

  const handlePreset = (preset) => {
    if (preset.amount > balance) {
      showToast(`Only $${balance.toFixed(2)} available.`, 'error');
      return;
    }
    setSpendLabel(preset.label);
    setSpendAmount(preset.amount.toFixed(2));
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* Toast */}
      {toast && (
        <View style={[styles.toast, toast.type === 'error' ? styles.toastError : styles.toastSuccess]}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      )}

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Wallet</Text>
          <Text style={styles.subtitle}>Your earned allowance</Text>
        </View>

        {/* Balance */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>GUILT-FREE BALANCE</Text>
          <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
          <Text style={styles.motiveText}>
            {balance <= 0
              ? "Complete today's habits to build your balance! 💪"
              : "You've earned this — spend without guilt 🎉"}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>${totalEarned.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
            <View style={[styles.statDot, { backgroundColor: '#4CD964' }]} />
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#FF6B6B' }]}>${totalSpent.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
            <View style={[styles.statDot, { backgroundColor: '#FF6B6B' }]} />
          </View>
        </View>

        {/* Spend button */}
        <TouchableOpacity
          style={[styles.spendBtn, balance <= 0 && styles.spendBtnDisabled]}
          onPress={() => balance > 0 && setModalVisible(true)}
          activeOpacity={balance > 0 ? 0.8 : 1}
        >
          <Feather name="shopping-bag" size={22} color={balance > 0 ? '#111' : '#555'} />
          <Text style={[styles.spendBtnText, balance <= 0 && { color: '#555' }]}>
            {balance > 0 ? 'Spend My Allowance' : 'Complete habits to earn!'}
          </Text>
        </TouchableOpacity>

        {/* Presets */}
        {balance > 0 && (
          <>
            <Text style={styles.sectionTitle}>Quick Spend</Text>
            <View style={styles.presetsGrid}>
              {SPEND_PRESETS.map(p => (
                <TouchableOpacity
                  key={p.label}
                  style={[styles.preset, p.amount > balance && styles.presetDisabled]}
                  onPress={() => handlePreset(p)}
                >
                  <Text style={styles.presetLabel}>{p.label}</Text>
                  <Text style={styles.presetAmount}>${p.amount.toFixed(2)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* History */}
        {transactions.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>History</Text>
            {transactions.map(tx => (
              <View key={tx.id} style={styles.txRow}>
                <View style={[styles.txIcon, { backgroundColor: tx.type === 'earn' ? '#1A2E1A' : '#2E1A1A' }]}>
                  <Feather
                    name={tx.type === 'earn' ? 'check' : 'shopping-bag'}
                    size={14}
                    color={tx.type === 'earn' ? '#4CD964' : '#FF6B6B'}
                  />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txLabel}>{tx.label}</Text>
                  <Text style={styles.txDate}>{formatDate(tx.date)}</Text>
                </View>
                <Text style={[styles.txAmount, { color: tx.type === 'earn' ? '#4CD964' : '#FF6B6B' }]}>
                  {tx.type === 'earn' ? '+' : '-'}${tx.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Spend Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={e => e.stopPropagation()}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Spend Allowance</Text>
            <Text style={styles.modalBalance}>Available: ${balance.toFixed(2)}</Text>

            <Text style={styles.inputLabel}>WHAT'S IT FOR?</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Coffee, movie, treat..."
              placeholderTextColor="#444"
              value={spendLabel}
              onChangeText={setSpendLabel}
              maxLength={50}
            />

            <Text style={styles.inputLabel}>AMOUNT ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#444"
              value={spendAmount}
              onChangeText={setSpendAmount}
              keyboardType="decimal-pad"
            />

            <TouchableOpacity style={styles.confirmBtn} onPress={handleSpend}>
              <Text style={styles.confirmBtnText}>Spend it — I earned this! 🎉</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Maybe later</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-NZ', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0A0A' },
  scroll: { flex: 1, paddingHorizontal: 20 },

  toast: {
    position: 'absolute', top: 16, left: 20, right: 20, zIndex: 100,
    borderRadius: 12, padding: 14, alignItems: 'center',
  },
  toastSuccess: { backgroundColor: '#1A2E1A', borderWidth: 1, borderColor: '#4CD964' },
  toastError: { backgroundColor: '#2E1A1A', borderWidth: 1, borderColor: '#FF6B6B' },
  toastText: { fontSize: 14, fontWeight: '600', color: '#fff' },

  header: { paddingTop: 20, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: '#555', marginTop: 2 },

  balanceCard: { backgroundColor: '#111', borderRadius: 24, padding: 28, marginBottom: 16, borderWidth: 1, borderColor: '#F4C542', alignItems: 'center' },
  balanceLabel: { fontSize: 11, fontWeight: '700', color: '#F4C542', letterSpacing: 1.5, marginBottom: 8 },
  balanceAmount: { fontSize: 56, fontWeight: '900', color: '#F4C542', letterSpacing: -2, marginBottom: 12 },
  motiveText: { fontSize: 13, color: '#666', textAlign: 'center', lineHeight: 18 },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#161616', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#222', position: 'relative', overflow: 'hidden' },
  statValue: { fontSize: 22, fontWeight: '800', color: '#4CD964', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#555', fontWeight: '600' },
  statDot: { position: 'absolute', top: 16, right: 16, width: 8, height: 8, borderRadius: 4 },

  spendBtn: { backgroundColor: '#F4C542', borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 24 },
  spendBtnDisabled: { backgroundColor: '#1A1A1A', borderWidth: 1, borderColor: '#222' },
  spendBtnText: { fontSize: 16, fontWeight: '800', color: '#111' },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 12 },
  presetsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  preset: { flex: 1, minWidth: '45%', backgroundColor: '#161616', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#2A2A2A' },
  presetDisabled: { opacity: 0.4 },
  presetLabel: { fontSize: 14, color: '#fff', fontWeight: '600', marginBottom: 4 },
  presetAmount: { fontSize: 18, color: '#F4C542', fontWeight: '800' },

  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#161616' },
  txIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txInfo: { flex: 1 },
  txLabel: { fontSize: 14, fontWeight: '600', color: '#fff' },
  txDate: { fontSize: 12, color: '#444', marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: '800' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#161616', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 44 },
  modalHandle: { width: 40, height: 4, backgroundColor: '#333', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  modalBalance: { fontSize: 14, color: '#F4C542', fontWeight: '600', marginBottom: 20 },
  inputLabel: { fontSize: 10, fontWeight: '700', color: '#555', letterSpacing: 1.5, marginBottom: 8 },
  input: { backgroundColor: '#1E1E1E', borderRadius: 12, padding: 14, color: '#fff', fontSize: 15, marginBottom: 16, borderWidth: 1, borderColor: '#2A2A2A' },
  confirmBtn: { backgroundColor: '#F4C542', borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 10 },
  confirmBtnText: { fontSize: 16, fontWeight: '800', color: '#111' },
  cancelBtn: { padding: 12, alignItems: 'center' },
  cancelBtnText: { fontSize: 15, color: '#555', fontWeight: '600' },
});
