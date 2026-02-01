import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, KeyboardAvoidingView, Platform, 
  Dimensions, ScrollView, Image, ActivityIndicator 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { showMessage } from "react-native-flash-message"; // Flash Message Import

// Firebase සහ Theme Imports
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useTheme } from '../constants/ThemeContext';
import { Colors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

const EditItem = ({ route, navigation }: any) => {
  const { itemId } = route.params;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  // දත්ත කියවා ගැනීම
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, "items", itemId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name);
          setCategory(data.category);
          setExpiryDate(new Date(data.expiryDate));
          setImage(data.imageUri);
        }
      } catch (error: any) {
        showMessage({
          message: "Error Loading Data",
          description: error.message,
          type: "danger",
          backgroundColor: "#EE5253",
          icon: "danger",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleUpdate = async () => {
    if (!name || !expiryDate) {
      showMessage({
        message: "Missing Information",
        description: "Please fill all fields before updating.",
        type: "danger",
        backgroundColor: "#EE5253",
        icon: "warning",
      });
      return;
    }

    setUpdating(true);
    try {
      const docRef = doc(db, "items", itemId);
      await updateDoc(docRef, {
        name: name,
        category: category,
        expiryDate: expiryDate.toISOString(),
        imageUri: image,
      });

      // සාර්ථක පණිවිඩය
      showMessage({
        message: "Updated Successfully!",
        description: `${name} has been updated.`,
        type: "success",
        backgroundColor: "#4CAF50",
        icon: "success",
      });

      // තත්පර 1.5 කට පසු ආපසු යෑම
      setTimeout(() => {
        navigation.goBack();
      }, 1500);

    } catch (error: any) {
      showMessage({
        message: "Update Failed",
        description: error.message,
        type: "danger",
        backgroundColor: "#EE5253",
        icon: "danger",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#EE5253" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      {/* Background Decor */}
      <View style={[styles.topCircle, { backgroundColor: isDarkMode ? '#FF6B6B08' : '#FF6B6B15' }]} />
      <View style={[styles.bottomCircle, { backgroundColor: isDarkMode ? '#FF6B6B05' : '#FF6B6B10' }]} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.customHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backCircle, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Edit <Text style={{color: '#EE5253'}}>Item</Text></Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.card }]}>
            {/* Image Picker */}
            <TouchableOpacity 
              style={[styles.imagePicker, { backgroundColor: isDarkMode ? '#1D1F21' : '#F1F3F6', borderColor: isDarkMode ? '#333' : '#FF6B6B40' }]} 
              onPress={pickImage}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.selectedImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera-outline" size={40} color="#FF6B6B" />
                  <Text style={styles.imageText}>Change Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Name Input */}
            <Text style={[styles.label, { color: theme.text }]}>Item Name</Text>
            <View style={[styles.inputWrapper, { backgroundColor: isDarkMode ? '#1D1F21' : '#F1F3F6' }]}>
              <Ionicons name="pencil-outline" size={20} color="#999" />
              <TextInput 
                style={[styles.input, { color: theme.text }]} 
                value={name} 
                onChangeText={setName} 
              />
            </View>

            {/* Date Picker */}
            <Text style={[styles.label, { color: theme.text }]}>Expiry Date</Text>
            <TouchableOpacity 
              style={[styles.inputWrapper, { backgroundColor: isDarkMode ? '#1D1F21' : '#F1F3F6' }]} 
              onPress={() => setDatePickerVisibility(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#999" />
              <Text style={[styles.dateText, { color: theme.text }]}>{expiryDate?.toDateString()}</Text>
            </TouchableOpacity>

            {/* Categories */}
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

            {/* Update Button */}
            <TouchableOpacity activeOpacity={0.8} style={styles.buttonShadow} onPress={handleUpdate} disabled={updating}>
              <LinearGradient
                colors={['#FF6B6B', '#EE5253']} 
                style={styles.updateButton}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                {updating ? <ActivityIndicator color="#fff" /> : <Text style={styles.updateButtonText}>Update Item</Text>}
              </LinearGradient>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={(date) => { setExpiryDate(date); setDatePickerVisibility(false); }} onCancel={() => setDatePickerVisibility(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  innerContainer: { flex: 1 },
  scrollContent: { paddingHorizontal: 30, paddingVertical: 50 },
  topCircle: { position: 'absolute', width: width * 1.3, height: width * 1.3, borderRadius: width * 0.65, top: -height * 0.25, right: -width * 0.3 },
  bottomCircle: { position: 'absolute', width: width * 1.1, height: width * 1.1, borderRadius: width * 0.55, bottom: -height * 0.15, left: -width * 0.4 },
  customHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  backCircle: { width: 45, height: 45, borderRadius: 23, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  headerTitle: { fontSize: 28, fontWeight: '900', marginLeft: 20 },
  card: { borderRadius: 30, padding: 25, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 30, elevation: 12 },
  imagePicker: { width: '100%', height: 160, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 25, borderStyle: 'dashed', borderWidth: 1 },
  selectedImage: { width: '100%', height: '100%', borderRadius: 20 },
  imagePlaceholder: { alignItems: 'center' },
  imageText: { color: '#FF6B6B', marginTop: 5, fontWeight: 'bold' },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, marginLeft: 5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 15, marginBottom: 20, paddingHorizontal: 15, height: 55 },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },
  dateText: { marginLeft: 10, fontSize: 16 },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 25 },
  catBtn: { paddingVertical: 10, borderRadius: 12, marginBottom: 10, width: '23%', alignItems: 'center' },
  catBtnActive: { backgroundColor: '#FF6B6B' },
  catText: { fontSize: 11, fontWeight: 'bold' },
  catTextActive: { color: '#fff' },
  buttonShadow: { marginTop: 10, shadowColor: '#EE5253', shadowOpacity: 0.4, shadowRadius: 15, elevation: 10 },
  updateButton: { height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  updateButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default EditItem;