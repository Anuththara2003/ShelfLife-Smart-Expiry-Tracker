import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ScrollView, Image, Alert, ActivityIndicator, Dimensions 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

// Firebase Imports
import { db, auth } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const AddItem = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Food');
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. පින්තූරයක් තෝරාගැනීම
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 2. Date Picker පාලනය
  const handleConfirmDate = (date: Date) => {
    setExpiryDate(date);
    setDatePickerVisibility(false);
  };

  // 3. දත්ත Database එකට Save කිරීම
  const handleSave = async () => {
    if (!name || !expiryDate) {
      Alert.alert("Error", "Please enter item name and expiry date");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "items"), {
        userId: auth.currentUser?.uid,
        name: name,
        category: category,
        expiryDate: expiryDate.toISOString(),
        imageUri: image, // පින්තූරය පෝන් එකේ තියෙන පාර (URI)
        createdAt: new Date().toISOString()
      });

      Alert.alert("Success", "Item added successfully!", [
        { text: "OK", onPress: () => {
          // Form එක Reset කිරීම
          setName('');
          setExpiryDate(null);
          setImage(null);
          navigation.navigate('Home'); 
        }}
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* ලස්සන Header එකක් */}
      <LinearGradient colors={['#FF6B6B', '#EE5253']} style={styles.header}>
        <Text style={styles.headerTitle}>Add New Item</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* පින්තූරය තෝරන තැන */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.selectedImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={45} color="#FF6B6B" />
              <Text style={styles.imageText}>Add Product Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Item Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Item Name</Text>
          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Fresh Milk, Panadol" 
              placeholderTextColor="#999"
              value={name} 
              onChangeText={setName} 
            />
          </View>
        </View>

        {/* Expiry Date Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Expiry Date</Text>
          <TouchableOpacity style={styles.inputWrapper} onPress={() => setDatePickerVisibility(true)}>
            <Text style={{ color: expiryDate ? '#2D3436' : '#999', flex: 1 }}>
              {expiryDate ? expiryDate.toDateString() : "Select Expiry Date"}
            </Text>
            <Ionicons name="calendar-outline" size={22} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        {/* Category selection */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryContainer}>
          {['Food', 'Medicine', 'Dairy', 'Other'].map((cat) => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.catBtn, category === cat && styles.catBtnActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.catText, category === cat && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={styles.submitBtnShadow} 
          onPress={handleSave} 
          disabled={loading}
        >
          <LinearGradient colors={['#FF6B6B', '#EE5253']} style={styles.submitBtn}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Save to Pantry</Text>}
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisibility(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { height: 110, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 25 },
  scrollContent: { padding: 25 },
  
  imagePicker: { width: '100%', height: 180, backgroundColor: '#fff', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 25, borderStyle: 'dashed', borderWidth: 2, borderColor: '#FF6B6B30', elevation: 2 },
  selectedImage: { width: '100%', height: '100%', borderRadius: 25 },
  imagePlaceholder: { alignItems: 'center' },
  imageText: { color: '#FF6B6B', marginTop: 10, fontWeight: '600' },

  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#2D3436', marginBottom: 8, marginLeft: 5 },
  inputWrapper: { height: 55, backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  input: { flex: 1, color: '#2D3436', fontSize: 15 },

  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 30 },
  catBtn: { paddingVertical: 12, paddingHorizontal: 5, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#EEE', marginBottom: 10, width: '23%', alignItems: 'center' },
  catBtnActive: { backgroundColor: '#FF6B6B', borderColor: '#FF6B6B' },
  catText: { color: '#636E72', fontWeight: 'bold', fontSize: 12 },
  catTextActive: { color: '#fff' },

  submitBtnShadow: { marginTop: 10, shadowColor: '#EE5253', shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 },
  submitBtn: { height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default AddItem;