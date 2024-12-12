import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import ApiService from './ApiService'; // Update the import path as needed

const ChildObservationScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]); // State for students
  const [filteredStudents, setFilteredStudents] = useState([]); // State for filtered students
  const [error, setError] = useState(''); // State for error messages
  const [descriptions, setDescriptions] = useState({}); // State for student descriptions

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await ApiService.getStudents(); // Fetch students from API
      setStudents(response.data.students); // Set all students data in state
      filterStudents(response.data.students); // Filter students based on the selected class
    } catch (err) {
      setError('Failed to fetch students.'); // Handle error
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = (allStudents) => {
    // Filter students based on selectedClass
    const filtered = allStudents.filter(student => student.section.toLowerCase() === selectedClass.toLowerCase());
    setFilteredStudents(filtered); // Set filtered students
  };

  const handleDescriptionChange = (studentId, text) => {
    setDescriptions((prev) => ({ ...prev, [studentId]: text })); // Update description for the specific student
  };

  const handleSubmit = async () => {
    // Check if all description fields are filled
    const emptyDescriptions = filteredStudents.some(student => {
      return !descriptions[student._id] || descriptions[student._id].trim() === ''; // Check if any description is empty
    });

    if (emptyDescriptions) {
      // Show an error message or alert if any field is empty
      alert('Please fill out all description fields before submitting.');
      return; // Exit the function if any field is empty
    }

    // Prepare the observation request
    const childObservationRequest = filteredStudents.map(student => ({
      fullName: student.fullName,
      rollId: student.roll_id, // Change to rollId as per your backend schema
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      description: descriptions[student._id],
    }));

    try {
      setLoading(true);
      await ApiService.postChildObservation({ observations: childObservationRequest }); // Post observations
      alert('Child observations submitted successfully!'); // Show success message
      const notificationTitle = "Child Observations Posted";
      const notificationMessage = " Child Observations for the selected class has been recorded.";
      const dateTime = new Date().toISOString();

      // Call sendNotification from ApiService
      await ApiService.sendNotification({
      title: notificationTitle,
      message: notificationMessage,
      dateTime: dateTime,
      });
      navigation.goBack(); // Navigate back or to another screen after submission
    } catch (error) {
      alert('Failed to submit observations. Please try again.'); // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.main}>
      {/* Header with Back Button and Title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/icon_back.png')} // Update the path as needed
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.textChildObservation}>Child Observations</Text>
      </View>

      {/* Class Selection Dropdown */}
      <RNPickerSelect
        onValueChange={(itemValue) => {
          setSelectedClass(itemValue);
          if (students.length > 0) {
            filterStudents(students); // Filter when class is selected
          }
        }}
        items={[
          { label: 'Primary', value: 'primary' },
          { label: 'Pre-Primary', value: 'pre-primary' },
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: 'Select Class', value: null }}
      />

      {/* Search Button */}
      <Button
        title="Search"
        onPress={handleSearch}
        color="#1B96BA"
      />

      {/* ScrollView containing the report */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.tableLayout}>
          {/* Header Row */}
          <View style={styles.tableHeaderRow}>
            <View style={styles.tableCellHeader}><Text style={styles.tableHeaderText}>Roll ID</Text></View>
            <View style={styles.tableCellHeader}><Text style={styles.tableHeaderText}>Student Name</Text></View>
            <View style={styles.tableCellHeader}><Text style={styles.tableHeaderText}>Description</Text></View>
          </View>

          {/* Students Table Rows */}
          {loading && <ActivityIndicator size="large" color="#1B96BA" style={styles.loadingSpinner} />}
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            filteredStudents.map(student => (
              <View key={student._id} style={styles.tableRow}>
                <View style={styles.tableCellHeader}><Text>{student.roll_id}</Text></View>
                <View style={styles.tableCellHeader}><Text>{student.fullName}</Text></View>
                <View style={styles.tableCellHeader}>
                  <TextInput
                    style={styles.descriptionInput}
                    value={descriptions[student._id] || ''} // Retrieve the description or set to empty string
                    onChangeText={(text) => handleDescriptionChange(student._id, text)} // Update description on change
                    placeholder="Enter description" // Placeholder text
                  />
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Submit Button */}
      <Button
        title="Submit"
        onPress={handleSubmit}
        color="#1B96BA"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 15,
    paddingTop: 45,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  textChildObservation: {
    fontSize: 22,
    color: '#1B96BA',
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
  },
  tableLayout: {
    marginTop: 16,
    padding: 8,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    backgroundColor: '#1B97BB',
    borderBottomColor: '#ddd',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableCellHeader: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  loadingSpinner: {
    alignSelf: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  descriptionInput: {
    borderColor: '#1B97BB',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    width: '90%', // Adjust width as needed
    color: 'black',
  },
});

// Style for RNPickerSelect
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#1B97BB',
    borderRadius: 10,
    color: 'black',
    marginBottom: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#1B97BB',
    borderRadius: 10,
    color: 'black',
    marginBottom: 16,
  },
});

export default ChildObservationScreen;
