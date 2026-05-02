/**
 * shared/constants.js
 * Shared types, constants and helpers used across frontend and backend.
 */

// ── Habit frequencies ────────────────────────────────────────────────────────
export const FREQUENCIES = [
  'Daily',
  'Weekdays',
  'Weekends',
  '3x per week',
  '2x per week',
  'Weekly',
];

// ── Default emoji options for habits ────────────────────────────────────────
export const HABIT_EMOJIS = [
  '💪', '🧘', '🚶', '💧', '📖', '🥗',
  '😴', '🏃', '🎯', '🧹', '✍️', '🎨',
  '🎸', '🌿', '☕', '🧠', '🏋️', '🚴',
];

// ── Transaction types ────────────────────────────────────────────────────────
export const TX_TYPES = {
  EARN: 'earn',
  SPEND: 'spend',
};

// ── Quick spend presets ──────────────────────────────────────────────────────
export const SPEND_PRESETS = [
  { label: 'Coffee ☕', amount: 6 },
  { label: 'Lunch 🍜', amount: 15 },
  { label: 'Movie 🎬', amount: 18 },
  { label: 'Takeaway 🍕', amount: 25 },
];

// ── App theme colours (mirror CSS vars for web) ──────────────────────────────
export const COLORS = {
  gold: '#F4C542',
  goldDim: '#8A6F00',
  bg: '#0A0A0A',
  surface: '#141414',
  surface2: '#1C1C1C',
  border: '#262626',
  text: '#F0F0F0',
  muted: '#555555',
  green: '#4CD964',
  red: '#FF6B6B',
};
