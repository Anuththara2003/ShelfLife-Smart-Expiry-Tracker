import { View, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import React from 'react'
import useAuth from '../hooks/useAuth'
import { Redirect } from 'expo-router'

const { height: screenHeight } = Dimensions.get('window');

const index = () => {

  const { user, loading } = useAuth()

//   if (loading) {
//     return (
//       <View style={styles.fullScreenLoader}>
//         <View style={styles.indicatorWrapper}>
//           <ActivityIndicator size="large" color="#FF5A5F" />
//         </View>
//       </View>
//     );
//   }

  if (user) {
    return <Redirect href="/home" />
  } else {
    return <Redirect href="/welcome" />
  }

}

const styles = StyleSheet.create({
  fullScreenLoader: {
    position: 'absolute',
    top: -23,
    left: 0,
    right: 0,
    height: screenHeight,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  indicatorWrapper: {
    marginTop: 60,
  }
});

export default index