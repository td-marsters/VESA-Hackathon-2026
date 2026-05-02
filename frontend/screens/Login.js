import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, TextInput, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' | 'signup'

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color="#aaa" />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>💰</Text>
          </View>
          <Text style={styles.logoName}>Vivendi</Text>
          <Text style={styles.logoTagline}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </Text>
        </View>

        {/* Toggle */}
        <View style={styles.toggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'login' && styles.toggleBtnActive]}
            onPress={() => setMode('login')}
          >
            <Text style={[styles.toggleText, mode === 'login' && styles.toggleTextActive]}>
              Log In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'signup' && styles.toggleBtnActive]}
            onPress={() => setMode('signup')}
          >
            <Text style={[styles.toggleText, mode === 'signup' && styles.toggleTextActive]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {mode === 'signup' && (
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>NAME</Text>
              <View style={styles.inputRow}>
                <Feather name="user" size={16} color="#555" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Your name"
                  placeholderTextColor="#929292"
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}

          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>EMAIL</Text>
            <View style={styles.inputRow}>
              <Feather name="mail" size={16} color="#555" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#929292"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <View style={styles.inputRow}>
              <Feather name="lock" size={16} color="#555" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#929292"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          {mode === 'login' && (
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => navigation.replace('Main')}
          activeOpacity={0.85}
        >
          <Text style={styles.submitBtnText}>
            {mode === 'login' ? 'Log In' : 'Create Account'}
          </Text>
          <Feather name="arrow-right" size={18} color="#111" />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0A0A0A" },
  scroll: { paddingHorizontal: 24, paddingTop: 16 },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  logoWrap: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#1A1500',
    borderWidth: 2,
    borderColor: "#F4C542",
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logoEmoji: { fontSize: 32 },
  logoName: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -1, marginBottom: 4 },
  logoTagline: { fontSize: 14, color: '#555', fontWeight: '500' },

  toggle: {
    flexDirection: 'row',
    backgroundColor: '#161616',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#222',
    padding: 4,
    marginBottom: 28,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: "#F4C542" },
  toggleText: { fontSize: 14, fontWeight: '700', color: '#929292' },
  toggleTextActive: { color: '#111' },

  form: { gap: 20, marginBottom: 24 },
  inputWrap: { gap: 8 },
  inputLabel: { fontSize: 10, fontWeight: '700', color: '#444', letterSpacing: 1.5 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#262626',
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#fff', fontSize: 15 },
  eyeBtn: { padding: 4 },
  forgotBtn: { alignSelf: 'flex-end' },
  forgotText: { fontSize: 13, color: "#F4C542", fontWeight: '600' },

  submitBtn: {
    backgroundColor: "#F4C542",
    borderRadius: 16,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 24,
  },
  submitBtnText: { fontSize: 16, fontWeight: '800', color: '#111' }
});
