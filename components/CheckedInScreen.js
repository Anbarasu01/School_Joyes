import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import RNPickerSelect from 'react-native-picker-select';
import ApiService from './ApiService';

const CheckedInScreen = ({ navigation }) => {
  const [selectedClass, setSelectedClass] = useState('primary');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectAllPresent, setSelectAllPresent] = useState(false);
  const [selectAllAbsent, setSelectAllAbsent] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getStudents();
      const allStudents = response.data.students;
      const filteredStudents = allStudents.filter(
        (student) => student.section.toLowerCase() === selectedClass.toLowerCase()
      );

      const initializedStudents = filteredStudents
        .map((student) => ({
          ...student,
          attendance: null,
        }))
        .sort((a, b) => a.roll_id - b.roll_id);

      setStudents(initializedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendance = (studentId, attendanceValue) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.roll_id === studentId
          ? { ...student, attendance: attendanceValue }
          : student
      )
    );
  };

  const handleSelectAllPresent = (isChecked) => {
    setSelectAllPresent(isChecked);
    setSelectAllAbsent(false);
    setStudents((prevStudents) =>
      prevStudents.map((student) => ({
        ...student,
        attendance: isChecked ? 'Present' : null,
      }))
    );
  };

  const handleSelectAllAbsent = (isChecked) => {
    setSelectAllAbsent(isChecked);
    setSelectAllPresent(false);
    setStudents((prevStudents) =>
      prevStudents.map((student) => ({
        ...student,
        attendance: isChecked ? 'Absent' : null,
      }))
    );
  };

  const handleSearch = () => {
    fetchStudents();
  };

  // Submit attendance data
  const handleSubmit = async () => {
    const attendanceData = students
      .filter((student) => student.attendance !== null) // Only include students with a selected attendance status
      .map((student) => ({
        fullName: student.fullName, // Updated to match backend structure
        rollId: student.roll_id.toString(), // Ensure rollId is a string
        date: new Date().toISOString().split('T')[0], // Get current date in YYYY-MM-DD format
        status: student.attendance === 'Present' ? 'present' : 'absent', // Map attendance to backend status
      }));

    try {
      const response = await ApiService.postAttendance(attendanceData);
      if (response.status === 201) {
        Alert.alert("Success", "Attendance posted successfully!");
        // Optionally, reset the form or navigate to another screen
        // Send a notification after successful attendance posting
        const notificationTitle = "Attendance Posted";
        const notificationMessage = "Attendance for the selected class has been recorded.";
        const dateTime = new Date().toISOString();

        // Call sendNotification from ApiService
        await ApiService.sendNotification({
          title: notificationTitle,
          message: notificationMessage,
          dateTime: dateTime,
        });
        
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to post attendance.");
      }
    } catch (error) {
      console.error("Error posting attendance:", error);
      Alert.alert("Error", "An error occurred while posting attendance.");
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/icon_back.png')}
              style={styles.backButton}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Checked In</Text>
        </View>
      </SafeAreaView>

      <View style={styles.selectionContainer}>
        <Text style={styles.selectionLabel}>Select Class:</Text>
        <RNPickerSelect
          value={selectedClass}
          onValueChange={(itemValue) => setSelectedClass(itemValue)}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
          items={[
            { label: 'Primary', value: 'primary' },
            { label: 'Pre-Primary', value: 'pre-primary' },
          ]}
        />
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.searchButtonWrapper}>
          <Button title="Search" onPress={handleSearch} />
        </View>
      </View>

      {loading && <ActivityIndicator size="large" color="#1B97BB" />}

      <ScrollView style={styles.scrollView}>
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Roll ID</Text>
            <Text style={styles.tableHeader}>Student Name</Text>

            <Text style={styles.tableHeader}>Present</Text>
            <CheckBox
              style={styles.tableHeaderCheckbox}
              onClick={() => handleSelectAllPresent(!selectAllPresent)}
              isChecked={selectAllPresent}
            />

            <Text style={styles.tableHeader}>Absent</Text>
            <CheckBox
              style={styles.tableHeaderCheckbox}
              onClick={() => handleSelectAllAbsent(!selectAllAbsent)}
              isChecked={selectAllAbsent}
            />
          </View>

          {students.length > 0 ? (
            students.map((student, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{student.roll_id}</Text>
                <Text style={styles.tableCell}>{student.fullName}</Text>

                <CheckBox
                  style={styles.checkbox}
                  onClick={() => handleAttendance(student.roll_id, 'Present')}
                  isChecked={student.attendance === 'Present'}
                />

                <CheckBox
                  style={styles.checkbox}
                  onClick={() => handleAttendance(student.roll_id, 'Absent')}
                  isChecked={student.attendance === 'Absent'}
                />
              </View>
            ))
          ) : (
            !loading && <Text>No students found for this class.</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.submitButtonContainer}>
        <Button
          title="Submit"
          onPress={handleSubmit} // Call the handleSubmit function
        />
      </View>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: '#000',
    paddingRight: 30,
    marginLeft: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: '#000',
    paddingRight: 30,
    marginLeft: 10,
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#ffffff',
  },
  safeArea: {
    padding: 15,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 24,
    height: 24,
    marginRight: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  selectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  selectionLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  searchButtonWrapper: {
    width: '50%',
  },
  scrollView: {
    marginVertical: 20,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tableHeader: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  tableHeaderCheckbox: {
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  checkbox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonContainer: {
    marginVertical: 20,
  },
});

export default CheckedInScreen;
