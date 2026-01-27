import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, Image,
    TouchableOpacity, Alert, ActivityIndicator, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../config/firebase';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const Inventory = ({ route, navigation }: any) => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

        return (
            <TouchableOpacity
                style={styles.itemCard}
                onPress={() => navigation.navigate('EditItem', { itemId: item.id })}
            >
                <View style={styles.itemImageContainer}>
                    {item.imageUri ? (
                        <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
                    ) : (
                        <View style={styles.placeholderImage}>
                            <Ionicons name="fast-food-outline" size={30} color="#FF6B6B" />
                        </View>
                    )}
                </View>
                <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemCategory}>{item.category}</Text>
                    <Text style={[styles.expiryText, { color: isUrgent ? '#EE5253' : '#636E72' }]}>
                        Exp: {expDate.toLocaleDateString()} ({diffDays <= 0 ? "Expired" : `${diffDays} days left`})
                    </Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash-outline" size={24} color="#EE5253" />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{selectedCategory} Pantry</Text>
                <Text style={styles.subTitle}>{items.length} Items Found</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#EE5253" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="basket-outline" size={80} color="#DDD" />
                            <Text style={styles.emptyText}>Your pantry is empty!</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FB' },
    header: { padding: 25, paddingTop: 60, backgroundColor: '#fff', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 5 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#2D3436' },
    subTitle: { fontSize: 14, color: '#ADADAD', marginTop: 5 },
    listContent: { padding: 20 },
    itemCard: {
        flexDirection: 'row', backgroundColor: '#fff', borderRadius: 20,
        padding: 15, marginBottom: 15, alignItems: 'center', elevation: 3,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10
    },
    itemImageContainer: { marginRight: 15 },
    itemImage: { width: 60, height: 60, borderRadius: 15 },
    placeholderImage: { 
        width: 60, height: 60, borderRadius: 15, 
        backgroundColor: '#FF6B6B10', justifyContent: 'center', alignItems: 'center' 
    },
    itemDetails: { flex: 1 },
    itemName: { fontSize: 18, fontWeight: 'bold', color: '#2D3436' },
    itemCategory: { fontSize: 12, color: '#ADADAD', textTransform: 'uppercase', letterSpacing: 1 },
    expiryText: { fontSize: 13, marginTop: 5, fontWeight: '600' },
    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { color: '#ADADAD', marginTop: 10, fontSize: 16 }
});

export default Inventory;