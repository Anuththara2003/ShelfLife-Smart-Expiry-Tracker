import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ScrollView, Image, ActivityIndicator, Dimensions, KeyboardAvoidingView, Platform 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { showMessage } from "react-native-flash-message"; // Flash message import කළා

// Firebase සහ Theme Imports
import { db, auth } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useTheme } from '../constants/ThemeContext';
import { Colors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

const AddItem = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Food');
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);

  // Global Theme එක ලබා ගැනීම
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleConfirmDate = (date: Date) => {
    setExpiryDate(date);
    setDatePickerVisibility(false);
  };

  const handleSave = async () => {
    // 1. දත්ත ඇතුළත් කර ඇත්දැයි බැලීම
    if (!name || !expiryDate) {
      showMessage({
        message: "Missing Details",
        description: "Please enter the item name and select an expiry date.",
        type: "danger",
        backgroundColor: "#EE5253", // ඔයාගේ රතු පාට
        icon: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "items"), {
        userId: auth.currentUser?.uid,
        name: name,
        category: category,
        expiryDate: expiryDate.toISOString(),
        imageUri: image,
        createdAt: new Date().toISOString()
      });

      // 2. සාර්ථක පණිවිඩය (Success Message)
      showMessage({
        message: "Success!",
        description: `${name} has been added to your pantry.`,
        type: "success",
        backgroundColor: "#4CAF50", // කොළ පාට
        icon: "success",
      });

      // විස්තර Clear කර Home එකට යැවීම
      setTimeout(() => {
        setName('');
        setExpiryDate(null);
        setImage(null);
        navigation.navigate('Home'); 
      }, 1500); // තත්පර 1.5 කට පසු navigate වේ

    } catch (error: any) {
      // 3. Error පණිවිඩය
      showMessage({
        message: "Error",
        description: error.message,
        type: "danger",
        backgroundColor: "#EE5253",
        icon: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      {/* Background Decor */}
      <View style={[styles.topCircle, { backgroundColor: isDarkMode ? '#FF6B6B08' : '#FF6B6B15' }]} />
      <View style={[styles.bottomCircle, { backgroundColor: isDarkMode ? '#FF6B6B05' : '#FF6B6B10' }]} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.customHeader}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Add New <Text style={{color: '#EE5253'}}>Item</Text></Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.card }]}>
            
            {/* Image Picker */}
            <TouchableOpacity 
                style={[styles.imagePicker, { backgroundColor: isDarkMode ? '#1D1F21' : '#F1F3F6', borderColor: isDarkMode ? '#333' : '#FF6B6B30' }]} 
                onPress={pickImage}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.selectedImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera-outline" size={40} color="#FF6B6B" />
                  <Text style={styles.imageText}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Item Name */}
            <Text style={[styles.label, { color: theme.text }]}>Item Name</Text>
            <View style={[styles.inputWrapper, { backgroundColor: isDarkMode ? '#1D1F21' : '#F1F3F6' }]}>
              <Ionicons name="pencil-outline" size={20} color="#999" />
              <TextInput 
                style={[styles.input, { color: theme.text }]} 
                placeholder="e.g. Fresh Milk" 
                placeholderTextColor="#999"
                value={name} 
                onChangeText={setName} 
              />
            </View>

            {/* Expiry Date */}
            <Text style={[styles.label, { color: theme.text }]}>Expiry Date</Text>
            <TouchableOpacity 
                style={[styles.inputWrapper, { backgroundColor: isDarkMode ? '#1D1F21' : '#F1F3F6' }]} 
                onPress={() => setDatePickerVisibility(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#999" />
              <Text style={{ color: expiryDate ? theme.text : '#999', marginLeft: 10, flex: 1 }}>
                {expiryDate ? expiryDate.toDateString() : "Select Date"}
              </Text>
            </TouchableOpacity>

            {/* Category */}
            <Text style={[styles.label, { color: theme.text }]}>Category</Text>
            <View style={styles.categoryContainer}>
              {['Food', 'Medicine', 'Dairy', 'Other'].map((cat) => (
                <TouchableOpacity 
                  key={cat} 
                  style={[styles.catBtn, { backgroundColor: isDarkMode ? '#1D1F21' : '#F1F3F6' }, category === cat && styles.catBtnActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.catText, { color: isDarkMode ? '#ADADAD' : '#636E72' }, category === cat && styles.catTextActive]}>{cat}</Text>
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

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 30, paddingVertical: 50 },
  topCircle: { position: 'absolute', width: width * 1.3, height: width * 1.3, borderRadius: width * 0.65, top: -height * 0.25, right: -width * 0.3 },
  bottomCircle: { position: 'absolute', width: width * 1.1, height: width * 1.1, borderRadius: width * 0.55, bottom: -height * 0.15, left: -width * 0.4 },
  customHeader: { marginBottom: 30 },
  headerTitle: { fontSize: 32, fontWeight: '900' },
  card: { borderRadius: 30, padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 12 },
  imagePicker: { width: '100%', height: 160, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 25, borderStyle: 'dashed', borderWidth: 1 },
  selectedImage: { width: '100%', height: '100%', borderRadius: 20 },
  imagePlaceholder: { alignItems: 'center' },
  imageText: { color: '#FF6B6B', marginTop: 5, fontWeight: 'bold' },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, marginLeft: 5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 15, marginBottom: 20, paddingHorizontal: 15, height: 55 },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 25 },
  catBtn: { paddingVertical: 10, borderRadius: 12, marginBottom: 10, width: '23%', alignItems: 'center' },
  catBtnActive: { backgroundColor: '#FF6B6B' },
  catText: { fontSize: 11, fontWeight: 'bold' },
  catTextActive: { color: '#fff' },
  submitBtnShadow: { marginTop: 10, shadowColor: '#EE5253', shadowOpacity: 0.4, shadowRadius: 15, elevation: 10 },
  submitBtn: { height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default AddItem;