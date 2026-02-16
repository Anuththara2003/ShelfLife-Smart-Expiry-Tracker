import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  ActivityIndicator, Dimensions, KeyboardAvoidingView, Platform, ScrollView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../services/firebase';
import { updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useTheme } from '../constants/ThemeContext';
import { Colors } from '../constants/Colors';
import { showMessage } from "react-native-flash-message"; 

const { width, height } = Dimensions.get('window');

const PrivacySecurity = ({ navigation }: any) => {
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const handleUpdate = async () => {
    if (!newName && !newPassword) {
      showMessage({
        message: "Notice",
        description: "Please enter a name or password to update.",
        type: "info",
        backgroundColor: "#FF9F43", 
        icon: "info",
      });
      return;
    }

    setLoading(true);
    try {
      const user: any = auth.currentUser;
      
      if (newName) {
        await updateDoc(doc(db, "users", user.uid), { fullName: newName });
      }
      
      if (newPassword) {
        if (newPassword.length < 6) {
            showMessage({
                message: "Short Password",
                description: "Password must be at least 6 characters.",
                type: "danger",
                backgroundColor: "#EE5253",
                icon: "warning",
            });
            setLoading(false);
            return;
        }
        await updatePassword(user, newPassword);
      }
      
      showMessage({
        message: "Security Updated!",
        description: "Your changes have been saved successfully.",
        type: "success",
        backgroundColor: "#4CAF50",
        icon: "success",
      });

      setTimeout(() => {
        navigation.goBack();
      }, 1500);

    } catch (error: any) {
      showMessage({
        message: "Update Error",
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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, {backgroundColor: theme.card}]}>
                <Ionicons name="arrow-back" size={22} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Security <Text style={{color: '#EE5253'}}>Center</Text></Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Ionicons name="shield-checkmark" size={50} color="#EE5253" style={styles.centerIcon} />
            <Text style={[styles.cardTitle, { color: theme.text }]}>Update Your Details</Text>
            <Text style={styles.cardSub}>Keep your account secure and up to date.</Text>

            {/* Name Input */}
            <Text style={[styles.label, { color: theme.text }]}>New Full Name</Text>
            <View style={[styles.inputWrapper, { backgroundColor: isDarkMode ? '#1D1F21' : '#F1F3F6' }]}>
              <Ionicons name="person-outline" size={20} color="#999" />
              <TextInput 
                style={[styles.input, { color: theme.text }]} 
                placeholder="Enter new name" 
                placeholderTextColor="#999"
                onChangeText={setNewName} 
              />
            </View>

            {/* Password Input */}
            <Text style={[styles.label, { color: theme.text }]}>New Security Password</Text>
            <View style={[styles.inputWrapper, { backgroundColor: isDarkMode ? '#1D1F21' : '#F1F3F6' }]}>
              <Ionicons name="lock-closed-outline" size={20} color="#999" />
              <TextInput 
                style={[styles.input, { color: theme.text }]} 
                placeholder="Enter new password" 
                placeholderTextColor="#999"
                secureTextEntry 
                onChangeText={setNewPassword} 
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity onPress={handleUpdate} disabled={loading} style={styles.buttonShadow}>
              <LinearGradient colors={['#FF6B6B', '#EE5253']} style={styles.btn} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
                {loading ? <ActivityIndicator color="#fff" /> : (
                  <>
                    <Ionicons name="save-outline" size={20} color="#fff" style={{marginRight: 10}} />
                    <Text style={styles.btnText}>Save Changes</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 25, paddingVertical: 60 },
  topCircle: { position: 'absolute', width: width * 1.3, height: width * 1.3, borderRadius: width * 0.65, top: -height * 0.25, right: -width * 0.3 },
  bottomCircle: { position: 'absolute', width: width * 1.1, height: width * 1.1, borderRadius: width * 0.55, bottom: -height * 0.15, left: -width * 0.4 },
  header: { marginBottom: 30, flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 3, shadowOpacity: 0.1 },
  headerTitle: { fontSize: 30, fontWeight: '900', marginLeft: 15 },
  card: { padding: 25, borderRadius: 30, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20 },
  centerIcon: { alignSelf: 'center', marginBottom: 15 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  cardSub: { fontSize: 13, color: '#ADADAD', textAlign: 'center', marginBottom: 25 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, marginLeft: 5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 15, marginBottom: 20, paddingHorizontal: 15, height: 55 },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },
  buttonShadow: { marginTop: 10, shadowColor: '#EE5253', shadowOpacity: 0.4, shadowRadius: 15, elevation: 10 },
  btn: { height: 55, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default PrivacySecurity;