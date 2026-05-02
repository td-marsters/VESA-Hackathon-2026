import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

/**
 * HabitCard
 *
 * Props:
 *   habit: {
 *     id: string
 *     name: string
 *     icon: string          — displayed as the icon (e.g. '💪')
 *     reward: number         — goal $ amount earned on completion
 *     completed: boolean     — whether completed today
 *   }
 *   onToggle: (id) => void
 *   onDelete?: (id) => void
 */
export default function HabitCard({ habit, onToggle, onDelete }) {
  const [pressed, setPressed] = useState(false);

  const {
    id,
    name,
    icon,
    reward,
    completed = false,
  } = habit;

  const lastCompletedText = formatLastCompleted(lastCompleted);

  return (
    <Pressable>
      {/* Completion glow bar */}
      {completed && <View style={styles.glowBar} />}

      <View style={styles.inner}>
        {/* Icon */}
        <View style={[styles.iconWrap, completed && styles.iconWrapDone]}>
          <Text style={styles.iconicon}>{icon}</Text>
          {completed && (
            <View style={styles.iconCheck}>
              <Feather name="check" size={10} color="#111" />
            </View>
          )}
        </View>

        {/* Main content */}
        <View style={styles.content}>
          {/* Top row: name + delete */}
          <View style={styles.topRow}>
            <Text style={[styles.name, completed && styles.nameDone]} numberOfLines={1}>
              {name}
            </Text>
            {onDelete && (
              <TouchableOpacity
                onPress={() => onDelete(id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.deleteBtn}
              >
                <Feather name="trash-2" size={14} color="#383838" />
              </TouchableOpacity>
            )}
          </View>

          {/* Bottom row: reward + complete button */}
          <View style={styles.bottomRow}>
            <View style={styles.rewardWrap}>
              <Text style={styles.rewardLabel}>REWARD</Text>
              <Text style={[styles.rewardAmount, completed && styles.rewardAmountDone]}>
                ${reward.toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.completeBtn, completed && styles.completeBtnDone]}
              onPress={() => onToggle(id)}
              activeOpacity={0.75}
            >
              {completed ? (
                <>
                  <Feather name="check" size={14} color="#111" />
                  <Text style={[styles.completeBtnText, { color: '#111' }]}>Done</Text>
                </>
              ) : (
                <>
                  <Feather name="circle" size={14} color="#F4C542" />
                  <Text style={styles.completeBtnText}>Complete</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#141414',
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
    overflow: 'hidden',
  },
  cardDone: {
    borderColor: '#2A2500',
    backgroundColor: '#111000',
  },
  cardPressed: {
    opacity: 0.85,
  },
  glowBar: {
    height: 2,
    backgroundColor: '#F4C542',
    opacity: 0.6,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 14,
  },

  // Icon
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    position: 'relative',
    flexShrink: 0,
  },
  iconWrapDone: {
    backgroundColor: '#1E1900',
    borderColor: '#3A3000',
  },
  iconicon: {
    fontSize: 26,
  },
  iconCheck: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F4C542',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#111000',
  },

  // Content
  content: {
    flex: 1,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F0F0F0',
    flex: 1,
    letterSpacing: -0.2,
  },
  nameDone: {
    color: '#666',
  },
  deleteBtn: {
    marginLeft: 8,
    padding: 2,
  },

  // Bottom
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  rewardWrap: {
    gap: 1,
  },
  rewardLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#444',
    letterSpacing: 1.2,
  },
  rewardAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F4C542',
    letterSpacing: -0.5,
  },
  rewardAmountDone: {
    color: '#5A4800',
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  completeBtnDone: {
    backgroundColor: '#F4C542',
    borderColor: '#F4C542',
  },
  completeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F4C542',
  },
});
