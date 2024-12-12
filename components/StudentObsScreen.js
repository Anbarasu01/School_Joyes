import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ApiService from './ApiService';
import AppData from './AppData';

const StudentObsScreen = () => {
  const navigation = useNavigation();

  const [observationData, setObservationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fullName = AppData.getFullName();

  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const response = await ApiService.getStudentObservations(fullName);
        const records = response.data;

        if (records && records.length > 0) {
          // Sort the records by createdAt date in descending order and get the latest one
          const latestObservation = records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
          setObservationData(latestObservation);
        } else {
          setError('No observations found.');
        }
      } catch (err) {
        setError('Failed to fetch observations: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchObservations();
  }, [fullName]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.backButton}
            source={require('../assets/icon_back.png')}
            accessibilityLabel="Back"
          />
        </TouchableOpacity>
        <Text style={styles.title}>Child Observations</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1B96BA" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : observationData ? ( // Check if observationData is not null
        <ScrollView>
          <View style={styles.backgroundContainer}>
            <View style={styles.reportContainer}>
              <Text style={styles.reportField}>Full Name: {observationData.fullName}</Text>
              <Text style={styles.reportField}>Roll ID: {observationData.rollId}</Text>
              <Text style={styles.reportField}>Date: {observationData.date}</Text>
              <Text style={styles.reportField}>Description: {observationData.description}</Text>
              <Text style={styles.reportField}>Time: {new Date(observationData.createdAt).toLocaleString()}</Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        <Text>No observation records found.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
  },
  backButton: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    color: '#1B97BB',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  backgroundContainer: {
    backgroundColor: '#E6F7FF',
    padding: 20,
    borderRadius: 10,
    elevation: 3, 
    marginTop: 10,
  },
  reportContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
  },
  reportField: {
    color: '#1B96BA',
    fontSize: 16,
    marginBottom: 8,
  },
});

export default StudentObsScreen;
