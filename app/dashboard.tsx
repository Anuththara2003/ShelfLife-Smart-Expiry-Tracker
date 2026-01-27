import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { db, auth } from '../config/firebase';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const Dashboard = ({ navigation }: any) => {
    const [userName, setUserName] = useState('User');
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expiringSoonCount, setExpiringSoonCount] = useState(0);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        // 1. User ගේ නම ලබා ගැනීම
        const fetchUserName = async () => {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) setUserName(userDoc.data().fullName);
        };
        fetchUserName();

        // 2. අයිතම Live කියවීම
        const q = query(collection(db, "items"), where("userId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const itemsArray: any[] = [];
            let expiringCount = 0;
            const today = new Date();
            const nextThreeDays = new Date();
            nextThreeDays.setDate(today.getDate() + 3);

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                itemsArray.push({ id: doc.id, ...data });
                const expDate = new Date(data.expiryDate);
                if (expDate <= nextThreeDays) expiringCount++;
            });

            setItems(itemsArray);
            setExpiringSoonCount(expiringCount);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <View style={styles.loaderContainer}><ActivityIndicator size="large" color="#EE5253" /></View>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.topCircle} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greetText}>Hello, {userName}!</Text>
                        <Text style={styles.subGreet}>Keep your pantry fresh.</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Ionicons name="person-circle-outline" size={45} color="#2D3436" />
                    </TouchableOpacity>
                </View>

                {/* Summary Card */}
                <LinearGradient colors={['#FF6B6B', '#EE5253']} style={styles.summaryCard}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryNumber}>{items.length}</Text>
                        <Text style={styles.summaryLabel}>Total Items</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryNumber}>{expiringSoonCount}</Text>
                        <Text style={styles.summaryLabel}>Expiring Soon</Text>
                    </View>
                </LinearGradient>

                {/* Expiring Soon Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Expiring Soon</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Inventory', { category: 'All' })}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                    {items.length === 0 ? (
                        <Text style={styles.emptyText}>No items added yet.</Text>
                    ) : (
                        items.map((item) => {
                            const expDate = new Date(item.expiryDate);
                            const diffDays = Math.ceil((expDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                            const cardColor = diffDays <= 3 ? '#EE5253' : '#FF9F43';

                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate('EditItem', { itemId: item.id })}
                                >
                                    <View style={[styles.expiryCard, { borderColor: cardColor }]}>
                                        {item.imageUri ? (
                                            <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
                                        ) : (
                                            <View style={styles.imagePlaceholder}>
                                                <Ionicons name="fast-food-outline" size={25} color={cardColor} />
                                            </View>
                                        )}
                                        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                        <Text style={[styles.daysLeft, { color: cardColor }]}>
                                            {diffDays <= 0 ? "Expired" : `In ${diffDays} Days`}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    )}
                </ScrollView>

                {/* Categories Section */}
                <Text style={styles.sectionTitle}>Categories</Text>
                <View style={styles.categoryGrid}>
                    {['Food', 'Medicine', 'Dairy', 'Other'].map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={styles.categoryBtn}
                            onPress={() => navigation.navigate('Inventory', { category: cat })}
                        >
                            <Text style={styles.categoryText}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>

            {/* Floating Action Button (Add Item) */}
            <TouchableOpacity style={styles.fabShadow} onPress={() => navigation.navigate('Add')}>
                <LinearGradient colors={['#FF6B6B', '#EE5253']} style={styles.fab}>
                    <Ionicons name="add" size={32} color="#fff" />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FB' },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { paddingHorizontal: 25, paddingVertical: 60 },
    topCircle: { position: 'absolute', width: width * 1, height: width * 1, borderRadius: width * 0.5, backgroundColor: '#FF6B6B10', top: -width * 0.4, right: -width * 0.2 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    greetText: { fontSize: 24, fontWeight: 'bold', color: '#2D3436' },
    subGreet: { fontSize: 14, color: '#ADADAD' },
    summaryCard: { borderRadius: 25, padding: 25, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', elevation: 10, shadowColor: '#EE5253', shadowOpacity: 0.2, shadowRadius: 10 },
    summaryItem: { alignItems: 'center' },
    summaryNumber: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
    summaryLabel: { fontSize: 12, color: '#fff', opacity: 0.8 },
    divider: { width: 1, height: 40, backgroundColor: '#fff', opacity: 0.3 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3436' },
    seeAll: { color: '#EE5253', fontWeight: 'bold' },
    horizontalScroll: { marginBottom: 20 },
    expiryCard: { width: 135, backgroundColor: '#fff', padding: 15, borderRadius: 20, marginRight: 15, borderWidth: 1, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    itemImage: { width: 55, height: 55, borderRadius: 12, marginBottom: 8 },
    imagePlaceholder: { width: 55, height: 55, borderRadius: 12, backgroundColor: '#F1F3F6', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    itemName: { fontSize: 15, fontWeight: 'bold', color: '#2D3436', textAlign: 'center' },
    daysLeft: { fontSize: 12, fontWeight: '700', marginTop: 3 },
    emptyText: { color: '#ADADAD', fontStyle: 'italic', marginLeft: 5 },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 },
    categoryBtn: { width: '47%', backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    categoryText: { fontWeight: 'bold', color: '#636E72' },
    fabShadow: { position: 'absolute', bottom: 30, right: 30, elevation: 10, shadowColor: '#EE5253', shadowOpacity: 0.4, shadowRadius: 15 },
    fab: { width: 65, height: 65, borderRadius: 33, justifyContent: 'center', alignItems: 'center' }
});

export default Dashboard;