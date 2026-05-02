import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function Landing({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>💰</Text>
          </View>
          <Text style={styles.logoName}>Vivendi</Text>
          <Text style={styles.logoTagline}>Live well. Earn your spend.</Text>
        </View>

        <View style={styles.features}>
          <FeatureRow icon="check-circle" text="Build habits that pay you back" />
          <FeatureRow icon="dollar-sign" text="Earn a guilt-free spending allowance" />
          <FeatureRow icon="zap" text="AI-powered spending enablement" />
          <FeatureRow icon="trending-up" text="Track streaks and stay motivated" />
        </View>

        <View style={styles.cta}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryBtnText}>Get Started</Text>
            <Feather name="arrow-right" size={18} color="#111" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryBtnText}>I already have an account</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

function FeatureRow({ icon, text }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIcon}>
        <Feather name={icon} size={16} color="#F4C542" />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0A0A' },
  container: { flex: 1, paddingHorizontal: 28, justifyContent: 'space-between', paddingVertical: 40 },
  logoWrap: { alignItems: 'center', paddingTop: 20 },
  logoCircle: {
    width: 96, height: 96, borderRadius: 32,
    backgroundColor: '#1A1500', borderWidth: 2, borderColor: '#F4C542',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  logoEmoji: { fontSize: 44 },
  logoName: { fontSize: 42, fontWeight: '900', color: '#fff', letterSpacing: -1.5, marginBottom: 8 },
  logoTagline: { fontSize: 16, color: '#555', fontWeight: '500' },
  features: { gap: 16 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  featureIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#1A1500', alignItems: 'center', justifyContent: 'center' },
  featureText: { fontSize: 15, color: '#ccc', fontWeight: '500', flex: 1 },
  cta: { gap: 12 },
  primaryBtn: {
    backgroundColor: '#F4C542', borderRadius: 18, paddingVertical: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  primaryBtnText: { fontSize: 17, fontWeight: '800', color: '#111' },
  secondaryBtn: {
    borderRadius: 18, paddingVertical: 16,
    alignItems: 'center', borderWidth: 1, borderColor: '#2A2A2A',
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '600', color: '#888' },
});
