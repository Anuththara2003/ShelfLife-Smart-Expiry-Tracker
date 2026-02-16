import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  Image, Alert, ScrollView, Dimensions, ActivityIndicator 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { showMessage } from "react-native-flash-message"; 

import { auth, db } from '../../services/firebase';
import { doc, getDoc, collection, query, where, onSnapshot, getDocs, updateDoc } from 'firebase/firestore';
import { useTheme } from '../../constants/ThemeContext'; 
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const Profile = ({ navigation }: any) => {
  const [userData, setUserData] = useState<any>(null);
  const [itemCount, setItemCount] = useState(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const router = useRouter();
  
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        if (data.profileImageUri) setProfileImage(data.profileImageUri);
      }
    });

    const fetchItemCount = async () => {
        const q = query(collection(db, "items"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        setItemCount(querySnapshot.size);
    };
    fetchItemCount();

    return () => unsubscribeUser();
  }, []);

  const pickProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      try {
        const user = auth.currentUser;
        if (user) {
          await updateDoc(doc(db, "users", user.uid), { profileImageUri: uri });
          showMessage({
            message: "Success",
            description: "Profile picture updated successfully!",
            type: "success",
            backgroundColor: "#4CAF50",
            icon: "success",
          });
        }
      } catch (error) {
        showMessage({
          message: "Update Failed",
          description: "Could not save profile picture.",
          type: "danger",
          backgroundColor: "#EE5253",
        });
      }
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: async () => {
        await auth.signOut();
        showMessage({
          message: "Signed Out",
          description: "Come back soon!",
          type: "info",
          backgroundColor: "#2D3436",
          icon: "info",
        });
        navigation.replace('Login');
      }}
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <View style={[styles.topCircle, { backgroundColor: isDarkMode ? '#FF6B6B08' : '#FF6B6B15' }]} />
      <View style={[styles.bottomCircle, { backgroundColor: isDarkMode ? '#FF6B6B05' : '#FF6B6B10' }]} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}><Text style={[styles.headerTitle, { color: theme.text }]}>My <Text style={{color: '#EE5253'}}>Profile</Text></Text></View>

        <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
          <TouchableOpacity style={styles.avatarWrapper} onPress={pickProfileImage}>
            <LinearGradient colors={['#FF6B6B', '#EE5253']} style={styles.avatarGradient}>
              {profileImage ? <Image source={{ uri: profileImage }} style={styles.profileImg} /> : <Ionicons name="person" size={50} color="#fff" />}
            </LinearGradient>
            <View style={styles.cameraIconBadge}><Ionicons name="camera" size={16} color="#fff" /></View>
          </TouchableOpacity>
          <Text style={[styles.userName, { color: theme.text }]}>{userData?.fullName || "User"}</Text>
          <Text style={styles.userEmail}>{auth.currentUser?.email}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statBox}><Text style={[styles.statNumber, { color: '#EE5253' }]}>{itemCount}</Text><Text style={[styles.statLabel, { color: theme.text }]}>Items</Text></View>
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#333' : '#EEE' }]} />
            <View style={styles.statBox}><Text style={[styles.statNumber, { color: '#4CAF50' }]}>Active</Text><Text style={[styles.statLabel, { color: theme.text }]}>Account</Text></View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]} onPress={() => router.push('/notifications')}>
            <View style={[styles.iconCircle, {backgroundColor: '#FF6B6B20'}]}><Ionicons name="notifications" size={20} color="#EE5253" /></View>
            <Text style={[styles.menuText, { color: theme.text }]}>Notifications</Text>
            <Ionicons name="chevron-forward" size={18} color="#DDD" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.card }]} onPress={() => router.push('/security')}>
            <View style={[styles.iconCircle, {backgroundColor: '#4CAF5020'}]}><Ionicons name="shield-checkmark" size={20} color="#4CAF50" /></View>
            <Text style={[styles.menuText, { color: theme.text }]}>Privacy & Security</Text>
            <Ionicons name="chevron-forward" size={18} color="#DDD" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtnShadow} onPress={handleLogout}>
            <LinearGradient colors={['#FF6B6B', '#EE5253']} style={styles.logoutBtn} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
              <Ionicons name="log-out" size={22} color="#fff" style={{ marginRight: 10 }} /><Text style={styles.logoutText}>Sign Out</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 25, paddingVertical: 60 },
  topCircle: { position: 'absolute', width: width * 1.3, height: width * 1.3, borderRadius: width * 0.65, top: -height * 0.25, right: -width * 0.3 },
  bottomCircle: { position: 'absolute', width: width * 1.1, height: width * 1.1, borderRadius: width * 0.55, bottom: -height * 0.15, left: -width * 0.4 },
  header: { marginBottom: 30 },
  headerTitle: { fontSize: 32, fontWeight: '900' },
  profileCard: { borderRadius: 30, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 8 },
  avatarWrapper: { marginBottom: 15, position: 'relative' },
  avatarGradient: { width: 110, height: 110, borderRadius: 55, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 3, borderColor: '#fff' },
  profileImg: { width: '100%', height: '100%' },
  cameraIconBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#EE5253', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  userName: { fontSize: 24, fontWeight: 'bold', marginBottom: 2 },
  userEmail: { fontSize: 14, color: '#ADADAD', marginBottom: 25 },
  statsContainer: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', alignItems: 'center' },
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: 'bold' },
  statLabel: { fontSize: 12, opacity: 0.6 },
  divider: { width: 1, height: 35 },
  menuContainer: { marginTop: 25 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 22, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  iconCircle: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  menuText: { flex: 1, marginLeft: 15, fontSize: 16, fontWeight: '600' },
  logoutBtnShadow: { marginTop: 15, shadowColor: '#EE5253', shadowOpacity: 0.4, shadowRadius: 15, elevation: 10 },
  logoutBtn: { height: 58, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  logoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default Profile;