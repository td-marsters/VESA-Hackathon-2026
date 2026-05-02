import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, TextInput, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator, Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { apiFetch } from '../config/api';
import { COLORS } from '../constants';

export default function Login({ navigation }) {
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
              <Image
                source={require('../assets/logo.png')}
                style={styles.logoImage}
                width={5}
                height={5}
              />
            </View>
            <Text style={styles.logoName}>Vi$pendi</Text>
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
                  <Feather name="user" size={16} color={COLORS.TEXT_ACTIVE} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Your name"
                    placeholderTextColor={COLORS.TEXT_ACTIVE}
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
            <Feather name="arrow-right" size={18} color={COLORS.TEXT_ACTIVE} />
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.BACK_GROUND },
  scroll: { paddingHorizontal: 24, paddingTop: 16 },

  logoWrap: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 108,
    height: 108,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    marginTop: 5
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoName: { fontSize: 32, fontWeight: '900', color: COLORS.TEXT_INACTIVE, letterSpacing: -1, marginBottom: 4 },
  
  toggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 4,
    marginBottom: 28,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: COLORS.CARD_ACTIVE },
  toggleText: { fontSize: 14, fontWeight: '700', color: COLORS.TEXT_INACTIVE },
  toggleTextActive: { color: COLORS.TEXT_ACTIVE },

  form: { gap: 20, marginBottom: 15 },
  inputWrap: { gap: 8 },
  inputLabel: { fontSize: 10, fontWeight: '700', color: COLORS.TEXT_INACTIVE, letterSpacing: 1.5 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_ACTIVE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: COLORS.TEXT_ACTIVE, fontSize: 15 },

  submitBtn: {
    backgroundColor: COLORS.CARD_ACTIVE,
    borderRadius: 16,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 24,
  },
  submitBtnText: { fontSize: 16, fontWeight: '800', color: COLORS.TEXT_ACTIVE }
});
