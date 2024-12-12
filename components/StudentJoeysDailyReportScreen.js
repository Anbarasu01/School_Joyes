import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import ApiService from './ApiService';
import AppData from './AppData';

const StudentJoeysDailyReportScreen = ({ navigation }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const studentName = AppData.fullName; 

  useEffect(() => {
    // Fetch report for the student
    ApiService.getReportByStudentName(studentName)
      .then((response) => {
        setReportData(response.data); 
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [studentName]);

  if (loading) {
    return <ActivityIndicator size="large" color="#1B96BA" />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button and Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/icon_back.png')}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Your Joeys Daily Report</Text>
      </View>

      {/* Background for the Report Section */}
      <View style={styles.backgroundContainer}>
        {/* Report Section */}
        {reportData && (
          <View style={styles.reportContainer}>
            {reportData.studentId && <Text style={styles.reportField}>Student ID: {reportData.studentId}</Text>}
            {reportData.studentName && <Text style={styles.reportField}>Student Name: {reportData.studentName}</Text>}
            {reportData.isPresent && <Text style={styles.reportField}>Leaving Status: {reportData.isPresent}</Text>}
            {reportData.isAbsent && <Text style={styles.reportField}>Leaving Status: {reportData.isAbsent}</Text>}
            {reportData.hasEaten && <Text style={styles.reportField}>Snack: {reportData.hasEaten}</Text>}
            {reportData.hasNotEaten && <Text style={styles.reportField}>Snack: {reportData.hasNotEaten}</Text>}
            {reportData.hasUsedRestroom && <Text style={styles.reportField}>Toilet Usage: {reportData.hasUsedRestroom}</Text>}
            {reportData.hasNotUsedRestroom && <Text style={styles.reportField}>Toilet Usage: {reportData.hasNotUsedRestroom}</Text>}
            {reportData.todayActivity && <Text style={styles.reportField}>Today's Activity: {reportData.todayActivity}</Text>}
            {reportData.circleTimeActivity && <Text style={styles.reportField}>Circle Time Activity: {reportData.circleTimeActivity}</Text>}
            {reportData.dateTime && <Text style={styles.reportField}>Date & Time: {new Date(reportData.dateTime).toLocaleString()}</Text>}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 15,
  },
  backButton: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  headerText: {
    fontSize: 22,
    color: '#1B96BA',
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
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});

export default StudentJoeysDailyReportScreen;
