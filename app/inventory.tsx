import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, Image,
    TouchableOpacity, Alert, ActivityIndicator, Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { db, auth } from '../config/firebase';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

// Theme සහ Colors Import කිරීම
import { useTheme } from '../constants/ThemeContext';
import { Colors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

const Inventory = ({ route, navigation }: any) => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Global Theme එක ලබා ගැනීම
    const { isDarkMode } = useTheme();
    const theme = isDarkMode ? Colors.dark : Colors.light;

    const selectedCategory = route.params?.category || 'All';

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        let q = query(collection(db, "items"), where("userId", "==", user.uid));

        if (selectedCategory !== 'All') {
            q = query(collection(db, "items"),
                where("userId", "==", user.uid),
                where("category", "==", selectedCategory));
        }

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const itemsArray: any[] = [];
            querySnapshot.forEach((doc) => {
                itemsArray.push({ id: doc.id, ...doc.data() });
            });
            setItems(itemsArray);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [selectedCategory]);

    const handleDelete = (id: string) => {
        Alert.alert("Delete Item", "Are you sure you want to remove this item?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete", style: "destructive", onPress: async () => {
                    await deleteDoc(doc(db, "items", id));
                }
            }
        ]);
    };

    const renderItem = ({ item }: any) => {
        const expDate = new Date(item.expiryDate);
        const today = new Date();
        const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const isUrgent = diffDays <= 3;
        const statusColor = isUrgent ? '#EE5253' : '#FF9F43';

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.itemCard, { backgroundColor: theme.card, borderColor: isDarkMode ? '#333' : '#fff' }]}
                onPress={() => navigation.navigate('EditItem', { itemId: item.id })}
            >
                <View style={styles.itemImageContainer}>
                    {item.imageUri ? (
                        <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
                    ) : (
                        <View style={[styles.placeholderImage, { backgroundColor: isDarkMode ? '#1D1F21' : '#F1F3F6' }]}>
                            <Ionicons name="fast-food-outline" size={30} color="#FF6B6B" />
                        </View>
                    )}
                </View>
                
                <View style={styles.itemDetails}>
                    <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
                    <View style={[styles.badge, { backgroundColor: isDarkMode ? '#333' : '#F1F3F6' }]}>
                        <Text style={[styles.itemCategory, { color: isDarkMode ? '#ADADAD' : '#636E72' }]}>{item.category}</Text>
                    </View>
                    <Text style={[styles.expiryText, { color: statusColor }]}>
                        <Ionicons name="time-outline" size={12} color={statusColor} /> 
                        {diffDays <= 0 ? " Expired" : ` ${diffDays} days left`}
                    </Text>
                </View>

                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash-outline" size={22} color="#EE5253" />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar style={isDarkMode ? "light" : "dark"} />
            
            {/* Background Decor */}
            <View style={[styles.topCircle, { backgroundColor: isDarkMode ? '#FF6B6B05' : '#FF6B6B15' }]} />
            <View style={[styles.bottomCircle, { backgroundColor: isDarkMode ? '#FF6B6B03' : '#FF6B6B10' }]} />

            {/* Header Section */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.title, { color: theme.text }]}>{selectedCategory} <Text style={{color: '#EE5253'}}>Pantry</Text></Text>
                    <Text style={styles.subTitle}>{items.length} Items discovered</Text>
                </View>
                <View style={styles.headerIconContainer}>
                    <LinearGradient colors={['#FF6B6B', '#EE5253']} style={styles.headerBadge}>
                        <Ionicons name="cart-outline" size={20} color="#fff" />
                    </LinearGradient>
                </View>
            </View>

            {loading ? (
                <View style={styles.centerLoader}>
                    <ActivityIndicator size="large" color="#EE5253" />
                </View>
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="basket-outline" size={100} color={isDarkMode ? "#333" : "#DDD"} />
                            <Text style={styles.emptyText}>Your pantry is empty!</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Add')} style={styles.addNowBtn}>
                                <Text style={styles.addNowText}>Add Item Now</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    centerLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    
    topCircle: { position: 'absolute', width: width * 1.3, height: width * 1.3, borderRadius: width * 0.65, top: -height * 0.25, right: -width * 0.3 },
    bottomCircle: { position: 'absolute', width: width * 1.1, height: width * 1.1, borderRadius: width * 0.55, bottom: -height * 0.15, left: -width * 0.4 },

    header: { paddingHorizontal: 25, paddingTop: 65, paddingBottom: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 30, fontWeight: '900' },
    subTitle: { fontSize: 14, color: '#ADADAD', marginTop: 3, fontWeight: '500' },
    headerIconContainer: { elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
    headerBadge: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },

    listContent: { paddingHorizontal: 25, paddingBottom: 100 },
    
    itemCard: {
        flexDirection: 'row', 
        borderRadius: 25,
        padding: 15, 
        marginBottom: 18, 
        alignItems: 'center', 
        elevation: 8,
        shadowColor: '#000', 
        shadowOpacity: 0.1, 
        shadowRadius: 15,
        borderWidth: 1,
    },
    itemImageContainer: { marginRight: 15 },
    itemImage: { width: 70, height: 70, borderRadius: 20 },
    placeholderImage: { width: 70, height: 70, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    itemDetails: { flex: 1 },
    itemName: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
    badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, marginBottom: 5 },
    itemCategory: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
    expiryText: { fontSize: 13, fontWeight: '700' },
    deleteBtn: { padding: 10 },

    emptyContainer: { alignItems: 'center', marginTop: height * 0.15 },
    emptyText: { color: '#ADADAD', marginTop: 15, fontSize: 18, fontWeight: '600' },
    addNowBtn: { marginTop: 20 },
    addNowText: { color: '#EE5253', fontWeight: 'bold', fontSize: 16 }
});

export default Inventory;