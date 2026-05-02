import React from 'react';
import { Feather } from '@expo/vector-icons';

export default function TabBarIcon({ name, color }) {
  return <Feather name={name} size={22} color={color} />;
}
