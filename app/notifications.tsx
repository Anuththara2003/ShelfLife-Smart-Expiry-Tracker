import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, ActivityIndicator, 
  TouchableOpacity, Image, Dimensions 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useTheme } from '../constants/ThemeContext';
import { Colors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

const Notifications = ({ navigation }: any) => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Live දත්ත කියවීම (Real-time update)
    const q = query(collection(db, "items"), where("userId", "==", user.uid));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const expiringItems: any[] = [];
      const today = new Date();
      const nextThreeDays = new Date();
      nextThreeDays.setDate(today.getDate() + 3);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const expDate = new Date(data.expiryDate);
        
        // දින 3කට වඩා අඩු අයිතම පමණක් තෝරා ගැනීම
        if (expDate <= nextThreeDays) {
          expiringItems.push({ id: doc.id, ...data });
        }
      });
      
      // දින ආසන්නතම ඒවා මුලට එනසේ සකස් කිරීම
      expiringItems.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
      
      setAlerts(expiringItems);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderNotiItem = ({ item }: any) => {
    const expDate = new Date(item.expiryDate);
    const today = new Date();
    const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return (
      <TouchableOpacity 
        style={[styles.notiCard, { backgroundColor: theme.card }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('EditItem', { itemId: item.id })} // ක්ලික් කළ විට EditItem වෙත යයි
      >
        <View style={styles.iconContainer}>
          {item.imageUri ? (
            <Image source={{ uri: item.imageUri }} style={styles.notiImg} />
          ) : (
            <View style={styles.placeholderIcon}>
              <Ionicons name="notifications" size={24} color="#EE5253" />
            </View>
          )}
          <View style={styles.badge} />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.notiTitle, { color: theme.text }]}>Expiry Alert!</Text>
          <Text style={styles.notiDesc} numberOfLines={2}>
            Your <Text style={{fontWeight: 'bold', color: theme.text}}>{item.name}</Text> will expire {diffDays <= 0 ? "today!" : `in ${diffDays} days.`}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={18} color="#DDD" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      {/* Background Decor */}
      <View style={[styles.topCircle, { backgroundColor: isDarkMode ? '#FF6B6B08' : '#FF6B6B12' }]} />
      <View style={[styles.bottomCircle, { backgroundColor: isDarkMode ? '#FF6B6B05' : '#FF6B6B08' }]} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, {backgroundColor: theme.card}]}>
            <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Notifi<Text style={{color: '#EE5253'}}>cations</Text></Text>
      </View>
      
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#EE5253" />
        </View>
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id}
          renderItem={renderNotiItem}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={80} color={isDarkMode ? "#333" : "#DDD"} />
              <Text style={styles.emptyText}>No alerts at the moment.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Background Circles
  topCircle: { position: 'absolute', width: width * 1.3, height: width * 1.3, borderRadius: width * 0.65, top: -height * 0.25, right: -width * 0.3 },
  bottomCircle: { position: 'absolute', width: width * 1.1, height: width * 1.1, borderRadius: width * 0.55, bottom: -height * 0.15, left: -width * 0.4 },

  header: { paddingTop: 65, paddingHorizontal: 25, marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowOpacity: 0.1 },
  title: { fontSize: 32, fontWeight: '900', marginLeft: 15 },

  listPadding: { paddingHorizontal: 25, paddingBottom: 50 },
  notiCard: { flexDirection: 'row', padding: 15, borderRadius: 22, marginBottom: 15, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  
  iconContainer: { position: 'relative' },
  notiImg: { width: 55, height: 55, borderRadius: 15 },
  placeholderIcon: { width: 55, height: 55, borderRadius: 15, backgroundColor: '#FF6B6B10', justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: -2, right: -2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#EE5253', borderWidth: 2, borderColor: '#fff' },

  textContainer: { flex: 1, marginLeft: 15, marginRight: 10 },
  notiTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  notiDesc: { fontSize: 13, color: '#ADADAD', lineHeight: 18 },

  emptyContainer: { alignItems: 'center', marginTop: height * 0.2 },
  emptyText: { color: '#ADADAD', marginTop: 15, fontSize: 16, fontWeight: '500' }
});

export default Notifications;