import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import ApiService from './ApiService'; // Import your API service
import AppData from './AppData'; // Import your AppData

const CrewMembersScreen = ({ navigation }) => {
  const [showFields, setShowFields] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [relation, setRelation] = useState('Father');
  const [crewMembers, setCrewMembers] = useState([]); // To store fetched crew members

  // Fetch crew members when the component mounts
  useEffect(() => {
    fetchCrewMembers();
  }, []);

  const handleAddMember = () => {
    setShowFields(true);
  };

  const handleSubmit = async () => {
    const crewMember = {
      name: name,
      email: email,
      relation: relation,
      fullName: AppData.getFullName(),      // Get full name from AppData
      className: AppData.getClassName(),    // Get class name from AppData
      role: AppData.getRole(),               // Get role from AppData
    };

    try {
      // Call your API service to store the crew member
      const response = await ApiService.storeCrewMembers(crewMember);
      console.log("Member added successfully:", response.data);
      
      // Show prompt for successful submission
      Alert.alert("Success", "Crew member added successfully!");

      // Fetch crew members after submission
      await fetchCrewMembers();

      // Reset fields after submission
      setName('');
      setEmail('');
      setRelation('Father');
      setShowFields(false);
    } catch (error) {
      console.error("Error adding member:", error);
      Alert.alert("Error", "Failed to add crew member. Please try again.");
    }
  };

  const fetchCrewMembers = async () => {
    try {
      const fullName = AppData.getFullName();
      const response = await ApiService.getCrewMembersByFullName(fullName);
      setCrewMembers(response.data); // Assuming response.data is the list of crew members
    } catch (error) {
      console.error("Error fetching crew members:", error);
      Alert.alert("Error", "Failed to fetch crew members. Please try again.");
    }
  };

  // Define your relation items
  const relationItems = [
    { label: 'Father', value: 'Father' },
    { label: 'Mother', value: 'Mother' },
    { label: 'Grandmother/Grandfather', value: 'Grandparent' },
    { label: 'Uncle/Aunt', value: 'Uncle/Aunt' },
    { label: 'Guardian', value: 'Guardian' },
  ];

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <SafeAreaView style={styles.headerSection}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image style={styles.backButton} source={require('../assets/icon_back.png')} />
          </TouchableOpacity>
          <Text style={styles.menuTitle}>Crew Members</Text>
        </View>
      </SafeAreaView>

      {/* Body Section */}
      <View style={styles.bodySection}>
        {!showFields && (
          <Button title="Add Member" color="#1B97BB" onPress={handleAddMember} />
        )}

        {showFields && (
          <View style={styles.memberContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.inputField}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <RNPickerSelect
              onValueChange={(itemValue) => setRelation(itemValue)}
              items={relationItems} // Pass items here
              style={pickerSelectStyles}
              placeholder={{
                label: 'Select Relation...',
                value: null,
                color: '#9EA0A4',
              }}
            />
            <Button title="Submit" color="#1B97BB" onPress={handleSubmit} />
          </View>
        )}

        <ScrollView style={styles.scrollView}>
          <View style={styles.backgroundContainer}>
            {crewMembers.map((member, index) => (
              <View key={index} style={styles.memberDetail}>
                <View style={styles.reportContainer}>
                  <Text style={styles.reportField}>{member.name}</Text>
                  <Text style={styles.reportField}>{member.email}</Text>
                  <Text style={styles.reportField}>{member.relation}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
  },
  headerSection: {
    backgroundColor: '#FFFFFF',
    elevation: 4,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
  bodySection: {
    flex: 1,
    padding: 16,
  },
  memberContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
  },
  inputField: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 4,
    marginBottom: 10,
  },
  scrollView: {
    marginTop: 16,
  },
  memberDetail: {
    padding: 15,
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 4,
    color: 'black',
    width: '100%',
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 4,
    color: 'black',
    width: '100%',
    marginBottom: 10,
  },
});

export default CrewMembersScreen;
