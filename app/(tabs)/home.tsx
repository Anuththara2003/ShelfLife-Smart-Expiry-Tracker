import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { db, auth } from '../../services/firebase'; 
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { Colors } from '../../constants/Colors'; 
import { useTheme } from '../../constants/ThemeContext'; 
import { useRouter } from 'expo-router'; 

const { width } = Dimensions.get('window');

export default function Dashboard() {
    const [userName, setUserName] = useState('User');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expiringSoonCount, setExpiringSoonCount] = useState(0);
    const router = useRouter();
    const { isDarkMode, toggleTheme } = useTheme(); 
    const theme = isDarkMode ? Colors.dark : Colors.light;

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;
        const userDocRef = doc(db, "users", user.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setUserName(docSnap.data().fullName);
                setProfileImage(docSnap.data().profileImageUri || null);
            }
        });
        const q = query(collection(db, "items"), where("userId", "==", user.uid));
        const unsubscribeItems = onSnapshot(q, (querySnapshot) => {
            const itemsArray: any[] = [];
            let expiringCount = 0;
            const nextThreeDays = new Date();
            nextThreeDays.setDate(new Date().getDate() + 3);
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                itemsArray.push({ id: doc.id, ...data });
                if (new Date(data.expiryDate) <= nextThreeDays) expiringCount++;
            });
            setItems(itemsArray);
            setExpiringSoonCount(expiringCount);
            setLoading(false);
        });
        return () => { unsubscribeUser(); unsubscribeItems(); };
    }, []);

    if (loading) return <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor: theme.background}}><ActivityIndicator size="large" color="#EE5253" /></View>;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.greetText, { color: theme.text }]}>Hello, {userName}!</Text>
                    </View>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.iconBtn}>
                            <Ionicons name="notifications-outline" size={22} color={theme.text} />
                            {expiringSoonCount > 0 && <View style={styles.notiBadge} />}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleTheme} style={styles.iconBtn}>
                            <Ionicons name={isDarkMode ? "sunny" : "moon"} size={22} color={isDarkMode ? "#FFCC00" : "#2D3436"} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/profile')}>
                            {profileImage ? <Image source={{ uri: profileImage }} style={styles.headerProfileImg} /> : 
                            <Ionicons name="person-circle-outline" size={48} color={theme.text} />}
                        </TouchableOpacity>
                    </View>
                </View>

                <LinearGradient colors={['#FF6B6B', '#EE5253']} style={styles.summaryCard}>
                    <View style={styles.summaryItem}><Text style={styles.summaryNumber}>{items.length}</Text><Text style={styles.summaryLabel}>Total Items</Text></View>
                    <View style={styles.divider} /><View style={styles.summaryItem}><Text style={styles.summaryNumber}>{expiringSoonCount}</Text><Text style={styles.summaryLabel}>Expiring Soon</Text></View>
                </LinearGradient>

                <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 20 }]}>Expiring Soon</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {items.map((item) => (
                        <TouchableOpacity key={item.id} onPress={() => router.push({ pathname: '/edititem', params: { itemId: item.id } })}>
                            <View style={[styles.expiryCard, { backgroundColor: theme.card, borderColor: '#EE5253' }]}>
                                {item.imageUri ? <Image source={{ uri: item.imageUri }} style={styles.itemImage} /> : <Ionicons name="fast-food-outline" size={25} color="#EE5253" />}
                                <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 20 }]}>Categories</Text>
                <View style={styles.categoryGrid}>
                    {['Food', 'Medicine', 'Dairy', 'Other'].map((cat) => (
                        <TouchableOpacity key={cat} style={[styles.categoryBtn, { backgroundColor: theme.card }]} onPress={() => router.push({ pathname: '/inventory', params: { category: cat } })}>
                            <Text style={[styles.categoryText, { color: theme.text }]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingHorizontal: 25, paddingVertical: 60 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
    headerIcons: { flexDirection: 'row', alignItems: 'center' },
    iconBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 10, elevation: 2 },
    notiBadge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EE5253' },
    headerProfileImg: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#fff' },
    greetText: { fontSize: 22, fontWeight: 'bold' },
    
    summaryCard: { borderRadius: 25, padding: 25, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', elevation: 5 },
    summaryItem: { alignItems: 'center' }, // මෙන්න මේකයි අඩුව තිබුණේ
    summaryNumber: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
    summaryLabel: { fontSize: 12, color: '#fff', opacity: 0.8 },
    divider: { width: 1, height: 40, backgroundColor: '#fff', opacity: 0.3 },
    
    sectionTitle: { fontSize: 18, fontWeight: 'bold' },
    expiryCard: { width: 135, padding: 15, borderRadius: 20, marginRight: 15, borderWidth: 1, alignItems: 'center', elevation: 3 },
    itemImage: { width: 55, height: 55, borderRadius: 12, marginBottom: 8 },
    itemName: { fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
    
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 15 },
    categoryBtn: { width: '47%', padding: 20, borderRadius: 15, marginBottom: 15, alignItems: 'center', elevation: 2 },
    categoryText: { fontWeight: 'bold' },
    
    fabShadow: { position: 'absolute', bottom: 30, right: 30, elevation: 10, shadowColor: '#EE5253', shadowOpacity: 0.4, shadowRadius: 15 },
    fab: { width: 65, height: 65, borderRadius: 33, justifyContent: 'center', alignItems: 'center' }
});