import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import ApiService from './ApiService';
const { width } = Dimensions.get('window');

const AdminWorkUpdatesScreen = ({ navigation }) => {
  const [workUpdates, setWorkUpdates] = useState([]); // State to store work updates
  const [loading, setLoading] = useState(true); // State to handle loading

  // Fetch work updates from API when the component mounts
  useEffect(() => {
    ApiService.getWorkUpdates()
      .then((response) => {
        setWorkUpdates(response.data); // Assuming response.data contains the updates
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching work updates:', error);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      {/* Header with Back Button and Title */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/icon_back.png')} // Replace with correct image path
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Work Updates</Text>
      </View>

      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#1B96BA" />
      ) : (
        <ScrollView>
          <View style={styles.workUpdatesContainer}>
            {/* Render each work update */}
            {workUpdates.length > 0 ? (
              workUpdates.map((update, index) => (
                <View key={index} style={styles.updateItem}>
                  <Text style={styles.workUpdatesText}>{update.details}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noUpdatesText}>No work updates available.</Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  backButton: {
    marginRight: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    color: '#1B96BA',
    fontSize: 22,
  },
  workUpdatesContainer: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: '#E6F7FF',
    borderRadius: 5,
  },
  updateItem: {
    marginTop:10,
    marginBottom: 10,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 5,
  },
  workUpdatesText: {
    color: '#1B97BB',
    fontSize: 16,
  },
  noUpdatesText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default AdminWorkUpdatesScreen;
