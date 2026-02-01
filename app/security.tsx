import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../config/firebase';
import { updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useTheme } from '../constants/ThemeContext';
import { Colors } from '../constants/Colors';

const PrivacySecurity = ({ navigation }: any) => {
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const handleUpdate = async () => {
    if (!newName && !newPassword) return;
    setLoading(true);
    try {
      const user: any = auth.currentUser;
      // 1. නම Update කිරීම
      if (newName) {
        await updateDoc(doc(db, "users", user.uid), { fullName: newName });
      }
      // 2. Password Update කිරීම
      if (newPassword) {
        if (newPassword.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters");
            return;
        }
        await updatePassword(user, newPassword);
      }
      Alert.alert("Success", "Security settings updated!");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Security Settings</Text>
      
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.text }]}>New Full Name</Text>
        <TextInput style={[styles.input, { color: theme.text, backgroundColor: isDarkMode ? '#1D1F21' : '#F1F3F6' }]} placeholder="Enter new name" onChangeText={setNewName} />

        <Text style={[styles.label, { color: theme.text, marginTop: 20 }]}>New Password</Text>
        <TextInput style={[styles.input, { color: theme.text, backgroundColor: isDarkMode ? '#1D1F21' : '#F1F3F6' }]} placeholder="Enter new password" secureTextEntry onChangeText={setNewPassword} />

        <TouchableOpacity onPress={handleUpdate} disabled={loading} style={{ marginTop: 30 }}>
          <LinearGradient colors={['#FF6B6B', '#EE5253']} style={styles.btn}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Save Changes</Text>}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, paddingTop: 70 },
  title: { fontSize: 28, fontWeight: '900', marginBottom: 30 },
  card: { padding: 25, borderRadius: 25, elevation: 10, shadowOpacity: 0.1 },
  label: { fontWeight: 'bold', marginBottom: 10 },
  input: { height: 50, borderRadius: 12, paddingHorizontal: 15 },
  btn: { height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default PrivacySecurity;