import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const Dashboard = () => {
  return (
    <View style={styles.container}>
      {/* Background Shapes (සන්තතික බව සඳහා) */}
      <View style={styles.topCircle} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. Header & Welcome */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetText}>Hello, Sandaru!</Text>
            <Text style={styles.subGreet}>Keep your pantry fresh.</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn}>
            <Ionicons name="person-circle-outline" size={40} color="#2D3436" />
          </TouchableOpacity>
        </View>

        {/* 2. Summary Card */}
        <LinearGradient colors={['#FF6B6B', '#EE5253']} style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>24</Text>
            <Text style={styles.summaryLabel}>Total Items</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>05</Text>
            <Text style={styles.summaryLabel}>Expiring Soon</Text>
          </View>
        </LinearGradient>

        {/* 3. Expiring Soon Section (Horizontal) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Expiring Soon</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {/* Dummy Expiry Cards */}
          <View style={[styles.expiryCard, { borderColor: '#EE5253' }]}>
            <Ionicons name="warning" size={24} color="#EE5253" />
            <Text style={styles.itemName}>Fresh Milk</Text>
            <Text style={[styles.daysLeft, { color: '#EE5253' }]}>Today</Text>
          </View>
          <View style={[styles.expiryCard, { borderColor: '#FF9F43' }]}>
            <Ionicons name="alert-circle" size={24} color="#FF9F43" />
            <Text style={styles.itemName}>Yogurt</Text>
            <Text style={[styles.daysLeft, { color: '#FF9F43' }]}>In 2 Days</Text>
          </View>
        </ScrollView>

        {/* 4. Categories (Grid) */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoryGrid}>
          {['Food', 'Medicine', 'Dairy', 'Meat'].map((cat) => (
            <TouchableOpacity key={cat} style={styles.categoryBtn}>
               <Text style={styles.categoryText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* 5. Floating Add Button */}
      <TouchableOpacity style={styles.fabShadow}>
        <LinearGradient colors={['#FF6B6B', '#EE5253']} style={styles.fab}>
          <Ionicons name="add" size={32} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  scrollContent: { paddingHorizontal: 25, paddingVertical: 60 },
  topCircle: { position: 'absolute', width: width * 1, height: width * 1, borderRadius: width * 0.5, backgroundColor: '#FF6B6B10', top: -width * 0.4, right: -width * 0.2 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  profileBtn: { padding: 5 }, // <-- දැන් මේක තියෙන නිසා error එක එන්නේ නැහැ
  greetText: { fontSize: 24, fontWeight: 'bold', color: '#2D3436' },
  subGreet: { fontSize: 14, color: '#ADADAD' },

  summaryCard: { borderRadius: 25, padding: 25, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', elevation: 10 },
  summaryItem: { alignItems: 'center' },
  summaryNumber: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  summaryLabel: { fontSize: 12, color: '#fff', opacity: 0.8 },
  divider: { width: 1, height: 40, backgroundColor: '#fff', opacity: 0.3 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3436' },
  seeAll: { color: '#EE5253', fontWeight: 'bold' },

  horizontalScroll: { marginBottom: 20 },
  expiryCard: { width: 130, backgroundColor: '#fff', padding: 15, borderRadius: 20, marginRight: 15, borderWidth: 1, alignItems: 'center', elevation: 3 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#2D3436', marginTop: 10 },
  daysLeft: { fontSize: 13, fontWeight: '600', marginTop: 5 },

  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 },
  categoryBtn: { width: '47%', backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15, alignItems: 'center', elevation: 2 },
  categoryText: { fontWeight: 'bold', color: '#636E72' },

  fabShadow: { position: 'absolute', bottom: 30, right: 30, shadowColor: '#EE5253', shadowOpacity: 0.4, shadowRadius: 10, elevation: 10 },
  fab: { width: 65, height: 65, borderRadius: 33, justifyContent: 'center', alignItems: 'center' }
});

export default Dashboard;