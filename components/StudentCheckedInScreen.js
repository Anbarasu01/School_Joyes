import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ApiService from './ApiService';
import AppData from './AppData';

const StudentCheckedInScreen = () => {
  const navigation = useNavigation();
  
  const [latestRecord, setLatestRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fullName = AppData.getFullName();
  
  // Fetch attendance data when the component mounts
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await ApiService.getAttendance(fullName);
        const records = response.data.attendanceRecords;

        if (records && records.length > 0) {
          // Sort by 'createdAt' to get the latest one
          records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setLatestRecord(records[0]);
        }
      } catch (err) {
        setError('Failed to fetch attendance');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendance();
  }, [fullName]);

  // Helper function to format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image 
              source={require('../assets/icon_back.png')} 
              style={styles.backButton}
            />
          </TouchableOpacity>
          <Text style={styles.checkedInTitle}>Checked In</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#1B96BA" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : latestRecord ? (
            <View style={styles.backgroundContainer}>
                <View style={styles.reportContainer}>
                    <Text style={styles.reportField}>Student Name: {latestRecord.fullName}</Text>
                    <Text style={styles.reportField}>Roll ID: {latestRecord.rollId}</Text>
                    <Text style={styles.reportField}>Date: {latestRecord.date}</Text>
                    <Text style={styles.reportField}>Status: {latestRecord.status}</Text>
                    <Text style={styles.reportField}>Time: {formatDateTime(latestRecord.createdAt)}</Text>
                </View>
          </View>
        ) : (
          <Text>No attendance records found.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 15,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  checkedInTitle: {
    fontSize: 22,
    color: '#1B96BA',
    marginStart: 8,
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
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  reportField: {
    color: '#1B96BA',
    fontSize: 16,
    marginBottom: 8,
  },
});

export default StudentCheckedInScreen;
