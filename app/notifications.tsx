import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../services/firebase'; 
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useTheme } from '../constants/ThemeContext'; 
import { Colors } from '../constants/Colors';
import { showMessage } from "react-native-flash-message"; 
import { useRouter } from 'expo-router'; 

const { width, height } = Dimensions.get('window');

export default function Notifications() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "items"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const expiringItems: any[] = [];
      const today = new Date();
      const nextThreeDays = new Date();
      nextThreeDays.setDate(today.getDate() + 3);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (new Date(data.expiryDate) <= nextThreeDays) {
          expiringItems.push({ id: doc.id, ...data });
        }
      });
      expiringItems.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
      setAlerts(expiringItems);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const renderNotiItem = ({ item }: any) => {
    const expDate = new Date(item.expiryDate);
    const diffDays = Math.ceil((expDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return (
      <TouchableOpacity 
        style={[styles.notiCard, { backgroundColor: theme.card }]}
        onPress={() => router.push({ pathname: '/edititem', params: { itemId: item.id } })}
      >
        <View style={styles.iconContainer}>
          {item.imageUri ? <Image source={{ uri: item.imageUri }} style={styles.notiImg} /> : 
          <View style={styles.placeholderIcon}><Ionicons name="notifications" size={24} color="#EE5253" /></View>}
          <View style={styles.badge} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.notiTitle, { color: theme.text }]}>Expiry Alert!</Text>
          <Text style={styles.notiDesc}>Your <Text style={{fontWeight: 'bold', color: theme.text}}>{item.name}</Text> will expire {diffDays <= 0 ? "today!" : `in ${diffDays} days.`}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#DDD" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, {backgroundColor: theme.card}]}>
            <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Notifications</Text>
      </View>
      {loading ? <ActivityIndicator size="large" color="#EE5253" /> : 
      <FlatList data={alerts} renderItem={renderNotiItem} contentContainerStyle={styles.listPadding} ListEmptyComponent={<Text style={{textAlign: 'center', color: '#999', marginTop: 50}}>No new alerts.</Text>} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 65, paddingHorizontal: 25, marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  title: { fontSize: 32, fontWeight: '900', marginLeft: 15 },
  listPadding: { paddingHorizontal: 25 },
  notiCard: { flexDirection: 'row', padding: 15, borderRadius: 22, marginBottom: 15, alignItems: 'center', elevation: 4 },
  iconContainer: { position: 'relative' },
  notiImg: { width: 55, height: 55, borderRadius: 15 },
  placeholderIcon: { width: 55, height: 55, borderRadius: 15, backgroundColor: '#FF6B6B10', justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: -2, right: -2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#EE5253', borderWidth: 2, borderColor: '#fff' },
  textContainer: { flex: 1, marginLeft: 15 },
  notiTitle: { fontSize: 16, fontWeight: 'bold' },
  notiDesc: { fontSize: 13, color: '#ADADAD' }
});