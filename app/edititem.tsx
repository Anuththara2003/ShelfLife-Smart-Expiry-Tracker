import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EditItem = () => {
  return (
    <View style={styles.center}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Inventory Screen</Text>
      <Text>Soon you will see all your items here!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FB' }
});

export default EditItem;