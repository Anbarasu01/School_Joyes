import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select'; // Import RNPickerSelect
import ApiService from './ApiService'; // Import ApiService

const { width } = Dimensions.get('window');

const TeacherWorkUpdatesScreen = ( {navigation}) => {
  const [selectedClass, setSelectedClass] = useState(''); // State to hold selected class
  const [workUpdates, setWorkUpdates] = useState(''); // State to hold work updates input

  // Function to handle form submission
  const handleSubmit = async () => {
    // Validate if class and work updates are filled
    if (!selectedClass || !workUpdates) {
      Alert.alert('Error', 'Please select a class and enter your work updates.');
      return;
    }

    // Create the request object
    const workUpdatesRequest = {
      className: selectedClass,
      details: workUpdates,
    };

    try {
      // Call the API service to submit work updates
      await ApiService.submitWorkUpdates(workUpdatesRequest);
      Alert.alert('Success', 'Work updates submitted successfully!');
      // Clear the input fields after submission
      setSelectedClass('');
      setWorkUpdates('');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit work updates. Please try again.');
      console.error('Error submitting work updates:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button and Title */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}> 
          <Image
            source={require('../assets/icon_back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Work Updates</Text>
      </View>

      {/* Class Selection Dropdown */}
      <View style={styles.spinnerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setSelectedClass(value)}
          items={[
            { label: 'Primary', value: 'primary' },
            { label: 'Pre-Primary', value: 'pre-primary' },
          ]}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select Class', value: null }}
          value={selectedClass}
        />
      </View>

      {/* Multi-line TextInput for Work Updates */}
      <TextInput
        style={styles.detailsInput}
        multiline
        placeholder="Enter your Work Updates here"
        textAlignVertical="top"
        value={workUpdates}
        onChangeText={(text) => setWorkUpdates(text)} // Update state as user types
      />

      {/* Submit Button */}
      <Button
        title="Submit"
        onPress={handleSubmit} // Call handleSubmit function on button press
        color="#1B96BA"
      />
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
  spinnerContainer: {
    marginTop: 24,
  },
  detailsInput: {
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 20,
    padding: 10,
  },
});

// RNPickerSelect styling
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default TeacherWorkUpdatesScreen;
