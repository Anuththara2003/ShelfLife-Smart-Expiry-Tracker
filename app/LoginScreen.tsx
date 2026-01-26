import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, KeyboardAvoidingView, Platform, 
  Dimensions 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Navigation සඳහා props එකතු කිරීම
const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState<string>(''); 
  const [password, setPassword] = useState<string>('');

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.topCircle} />
      <View style={styles.bottomCircle} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.contentWrapper}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.logoText}>Shelf<Text style={{color: '#EE5253'}}>Life</Text></Text>
          <Text style={styles.subtitle}>Smart Expiry Tracker</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.instructionText}>Log in to manage your pantry</Text>

          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#999" />
            <TextInput 
              style={styles.input} 
              placeholder="Email Address" 
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(text: string) => setEmail(text)}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#999" />
            <TextInput 
              style={styles.input} 
              placeholder="Password" 
              placeholderTextColor="#999"
              secureTextEntry 
              onChangeText={(text: string) => setPassword(text)}
            />
          </View>

          <TouchableOpacity activeOpacity={0.8} style={styles.buttonShadow}>
            <LinearGradient
              colors={['#FF6B6B', '#EE5253']} 
              style={styles.loginButton}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          {/* මෙන්න මෙතන navigation navigate එක එකතු කළා */}
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

// Styles කලින් වගේමයි...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  contentWrapper: { flex: 1, justifyContent: 'center', paddingHorizontal: 30, zIndex: 1 },
  topCircle: { position: 'absolute', width: width * 1.3, height: width * 1.3, borderRadius: width * 0.65, backgroundColor: '#FF6B6B18', top: -height * 0.25, right: -width * 0.3 },
  bottomCircle: { position: 'absolute', width: width * 1.1, height: width * 1.1, borderRadius: width * 0.55, backgroundColor: '#FF6B6B12', bottom: -height * 0.15, left: -width * 0.4 },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  logoText: { fontSize: 42, fontWeight: '900', color: '#2D3436', letterSpacing: -1 },
  subtitle: { fontSize: 13, color: '#636E72', letterSpacing: 2, textTransform: 'uppercase' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 30, padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.1, shadowRadius: 30, elevation: 12 },
  welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#2D3436', textAlign: 'center' },
  instructionText: { fontSize: 14, color: '#ADADAD', textAlign: 'center', marginBottom: 25 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F3F6', borderRadius: 15, marginBottom: 15, paddingHorizontal: 15 },
  input: { flex: 1, height: 55, fontSize: 16, color: '#2D3436', marginLeft: 10 },
  buttonShadow: { marginTop: 10, shadowColor: '#EE5253', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.45, shadowRadius: 15, elevation: 10 },
  loginButton: { height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  loginButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  forgotBtn: { marginTop: 15, alignItems: 'center' },
  forgotText: { color: '#ADADAD', fontSize: 13 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: '#636E72' },
  signUpText: { color: '#EE5253', fontWeight: 'bold' }
});

export default LoginScreen;