import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  Dimensions, ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Alert, ActivityIndicator } from 'react-native';

const { width, height } = Dimensions.get('window');


const SignUpScreen = ({ navigation }: any) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Register Logic

  const handleSignUp = async () => {
    if (email === '' || password === '' || name === '') {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Account created!", [
        { text: "OK", onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.topCircle} />
      <View style={styles.bottomCircle} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.innerContainer}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.logoText}>Create<Text style={{ color: '#EE5253' }}> Account</Text></Text>
            <Text style={styles.subtitle}>Join ShelfLife Today</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#999" />
              <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#999" onChangeText={(text) => setName(text)} />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#999" />
              <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#999" keyboardType="email-address" autoCapitalize="none" onChangeText={(text) => setEmail(text)} />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#999" />
              <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#999" secureTextEntry onChangeText={(text) => setPassword(text)} />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#999" />
              <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#999" secureTextEntry onChangeText={(text) => setConfirmPassword(text)} />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.buttonShadow}
              onPress={handleSignUp} 
              disabled={loading}     //disable button while loading
            >
              <LinearGradient colors={['#FF6B6B', '#EE5253']} style={styles.signUpButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {loading ? (
                  <ActivityIndicator color="#fff" /> // loading spinner
                ) : (
                  <Text style={styles.signUpButtonText}>Sign Up</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            
            {/* මෙන්න මෙතන navigation navigate එක එකතු කළා */}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signInText}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  innerContainer: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 30, paddingVertical: 50 },
  topCircle: { position: 'absolute', width: width * 1.3, height: width * 1.3, borderRadius: width * 0.65, backgroundColor: '#FF6B6B18', top: -height * 0.25, right: -width * 0.3 },
  bottomCircle: { position: 'absolute', width: width * 1.1, height: width * 1.1, borderRadius: width * 0.55, backgroundColor: '#FF6B6B12', bottom: -height * 0.15, left: -width * 0.4 },
  headerContainer: { alignItems: 'center', marginBottom: 35 },
  logoText: { fontSize: 36, fontWeight: '900', color: '#2D3436', letterSpacing: -1 },
  subtitle: { fontSize: 13, color: '#636E72', letterSpacing: 2, textTransform: 'uppercase' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 30, padding: 25, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 30, elevation: 12 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F3F6', borderRadius: 15, marginBottom: 15, paddingHorizontal: 15 },
  input: { flex: 1, height: 55, fontSize: 16, color: '#2D3436', marginLeft: 10 },
  buttonShadow: { marginTop: 10, shadowColor: '#EE5253', shadowOpacity: 0.45, shadowRadius: 15, elevation: 10 },
  signUpButton: { height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  signUpButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: '#636E72' },
  signInText: { color: '#EE5253', fontWeight: 'bold' }
});

export default SignUpScreen;