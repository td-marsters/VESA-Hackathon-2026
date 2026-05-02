import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, TextInput, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { apiFetch } from '../config/api';

export default function Login({ navigation, user }) {
  const [uName, setName] = useState('');
  const [mode, setMode] = useState('login'); // 'login' | 'signup'

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* Logo */}
          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>💰</Text>
            </View>
            <Text style={styles.logoName}>Vispendi</Text>
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
            {(
              <View style={styles.inputWrap}>
                <Text style={styles.inputLabel}>NAME</Text>
                <View style={styles.inputRow}>
                  <Feather name="user" size={16} color="#555" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Your name"
                    placeholderTextColor="#3A3A3A"
                    autoCapitalize="words"
                    value={uName}
                    onChangeText={setName}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => {
              if (mode === 'signup') {
                fetch('http://localhost:7071/api/user', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: uName }),
                })
                  .then(res => res.json()
                  .then(data => {
                    console.log('Signed up:', data);
                    navigation.navigate('Main', { userId: data._id, userName: data.name });
                  }))
                  .catch(err => console.error('Signup error:', err));
            
              } else if (mode === 'login') {
                // find existing user by name
                fetch(`http://localhost:7071/api/user/${uName}`)
                  .then(res => res.json()
                  .then(data => {
                    console.log('Logged in:', data);
                    navigation.navigate('Main', { userId: data._id, userName: data.name });
                  }))
                  .catch(err => console.error('Login error:', err));
              }
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.submitBtnText}>
              {mode === 'login' ? 'Log In' : 'Create Account'}
            </Text>
            <Feather name="arrow-right" size={18} color="#111" />
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0A0A' },
  scroll: { paddingHorizontal: 24, paddingTop: 16 },

  logoWrap: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#1A1500',
    borderWidth: 2,
    borderColor: '#F4C542',
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
  toggleBtnActive: { backgroundColor: '#F4C542' },
  toggleText: { fontSize: 14, fontWeight: '700', color: '#555' },
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
  forgotText: { fontSize: 13, color: '#F4C542', fontWeight: '600' },

  submitBtn: {
    backgroundColor: '#F4C542',
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
