import React from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  Dimensions, StatusBar 
} from 'react-native';
import { Video, ResizeMode } from 'expo-av'; 
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; 

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <Video
        source={require('../../assets/welcome4.mp4')} 
        style={styles.video}
        shouldPlay
        isLooping
        isMuted
        resizeMode={ResizeMode.COVER}
      />

      <LinearGradient
        colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.85)']}
        style={styles.overlay}
      >
        <View style={styles.content}>
          
          <View style={styles.centerSection}>
            <Text style={styles.logoText}>Shelf<Text style={{color: '#FF6B6B'}}>Life</Text></Text>
            <Text style={styles.sloganText}>Track your pantry, save money, and reduce food waste easily.</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              activeOpacity={0.8} 
              onPress={() => router.push('/login')}
              style={styles.mainBtn}
            >
              <LinearGradient
                colors={['#FF6B6B', '#EE5253']}
                style={styles.gradientBtn}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                <Text style={styles.btnText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={0.7} 
              onPress={() => router.push('/signup')}
              style={styles.outlineBtn}
            >
              <Text style={styles.outlineBtnText}>Get Started</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>Smart Pantry Management</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  video: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0, right: 0,
  },
  overlay: { flex: 1, justifyContent: 'center' },
  content: { flex: 1, paddingHorizontal: 30, alignItems: 'center', justifyContent: 'center' },
  centerSection: { alignItems: 'center', marginTop: -height * 0.15, width: '100%' },
  logoText: { fontSize: 60, fontWeight: '900', color: '#fff', letterSpacing: -2, marginBottom: 10, textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 10 },
  sloganText: { fontSize: 18, color: '#EEE', textAlign: 'center', lineHeight: 26, paddingHorizontal: 15, fontWeight: '500', opacity: 0.9 },
  buttonContainer: { width: '100%', gap: 15, position: 'absolute', bottom: 80 },
  mainBtn: { width: '100%', height: 60, borderRadius: 20, overflow: 'hidden', elevation: 5 },
  gradientBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  outlineBtn: { width: '100%', height: 60, borderRadius: 20, borderWidth: 2, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  outlineBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footerText: { position: 'absolute', bottom: 30, color: '#888', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2 }
});