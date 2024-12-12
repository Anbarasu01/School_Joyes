import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import ApiService from './ApiService'; // Import your ApiService
import AppData from './AppData'; // Import your AppData

const SiblingsScreen = ({ navigation }) => {
  // State to hold sibling information
  const [siblingInfo, setSiblingInfo] = useState({
    fullName: '',
    className: '',
    role: '',
    relationName: '',
    email: '',
    relation: '',
  });

  // Reusable Header Section
  const renderHeader = () => (
    <View style={styles.headerSection}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.backButton} source={require('../assets/icon_back.png')} />
        </TouchableOpacity>
        <Text style={styles.menuTitle}>Sibling Details</Text>
      </View>
    </View>
  );

  // Fetch sibling information on component mount
  useEffect(() => {
    const fetchSiblingInfo = async () => {
      const fullName = AppData.getFullName(); // Get the full name from AppData
      try {
        const response = await ApiService.getSiblingByFullName(fullName);
        const siblingData = response.data; // Access the data from the response
        if (siblingData && siblingData.length > 0) {
          // Ensure there is data before trying to access it
          setSiblingInfo({
            fullName: siblingData[0].fullName, // Access the first item in the array
            className: siblingData[0].className,
            role: siblingData[0].role,
            relationName: siblingData[0].name, // Update this to access the correct field
            email: siblingData[0].email,
            relation: siblingData[0].relation,
          });
        } else {
          Alert.alert("No data", "No sibling information found.");
        }
      } catch (error) {
        console.error("Error fetching sibling info:", error);
        Alert.alert("Error", "Failed to fetch sibling information. Please try again.");
      }
    };

    fetchSiblingInfo();
  }, []); // Empty dependency array to run only on mount

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      {renderHeader()}

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Sibling Information */}
        <View style={styles.backgroundContainer}>
          <View style={styles.reportContainer}>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{siblingInfo.fullName}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Class Name</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{siblingInfo.className}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Role</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{siblingInfo.role}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Relation Name</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{siblingInfo.relationName}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{siblingInfo.email}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Relation</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{siblingInfo.relation}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  headerSection: {
    backgroundColor: '#FFFFFF',
    elevation: 4,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 24,
    height: 24,
  },
  menuTitle: {
    marginLeft: 16,
    fontSize: 18,
    color: '#1B97BB',
  },
  content: {
    paddingHorizontal: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  infoLabel: {
    flex: 2, 
    fontSize: 16,
    color: '#1B97BB',
  },
  infoColon: {
    flex: 0.5, 
    textAlign: 'center', 
    fontSize: 16,
    color: '#1B97BB',
  },
  infoValue: {
    flex: 3, 
    fontSize: 16,
    color: '#1B97BB', 
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
});

export default SiblingsScreen;
