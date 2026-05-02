import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function Landing({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Temp Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>💰</Text>
          </View>
          <Text style={styles.logoName}>Vivendi</Text>
        </View>

        {/* Continue To App */}
        <View style={styles.cta}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.replace('Login')}
          >
            <Text style={styles.primaryBtnText}>Get Started</Text>
            <Feather name="arrow-right" size={18} color="#111" />
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0A0A' },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
    paddingVertical: 40,
  },

  logoWrap: { alignItems: 'center', paddingTop: 20 },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 32,
    backgroundColor: '#1A1500',
    borderWidth: 2,
    borderColor: '#F4C542',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoIcon: { fontSize: 44 },
  logoName: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1.5,
    marginBottom: 8,
  },

  cta: { gap: 14 },
  primaryBtn: {
    backgroundColor: '#F4C542',
    borderRadius: 18,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryBtnText: { fontSize: 17, fontWeight: '800', color: '#111' },
});
