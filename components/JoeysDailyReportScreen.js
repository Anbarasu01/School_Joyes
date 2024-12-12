import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome';
import ApiService from './ApiService';

const { width } = Dimensions.get('window');

const JoeysDailyReportScreen = ({ navigation }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getStudents();
      const filteredStudents = response.data.students.filter(
        (student) => student.section.toLowerCase() === selectedClass.toLowerCase()
      );
      setStudents(filteredStudents.map(student => ({
        ...student,
        present: false,
        absent: false,
        hadSnack: false,
        notHadSnack: false,
        usedToilet: false,
        notUsedToilet: false,
        editField1: '',
        editField2: '',
      })));
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch students.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxToggle = (studentId, field, value) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) => {
        if (student._id === studentId) {
          const updatedStudent = { ...student, [field]: value };
          if (field === 'present' && value) updatedStudent.absent = false;
          if (field === 'absent' && value) updatedStudent.present = false;
          if (field === 'hadSnack' && value) updatedStudent.notHadSnack = false;
          if (field === 'notHadSnack' && value) updatedStudent.hadSnack = false;
          if (field === 'usedToilet' && value) updatedStudent.notUsedToilet = false;
          if (field === 'notUsedToilet' && value) updatedStudent.usedToilet = false;
          return updatedStudent;
        }
        return student;
      })
    );
  };

  const validateInputs = () => {
    for (let student of students) {
      if (
        !student.present &&
        !student.absent &&
        !student.hadSnack &&
        !student.notHadSnack &&
        !student.usedToilet &&
        !student.notUsedToilet
      ) {
        Alert.alert('Validation Error', 'All fields must be filled for each student.');
        return false;
      }
      // if (student.editField1.trim() === '' || student.editField2.trim() === '') {
      //   Alert.alert('Validation Error', 'All edit fields must be filled for each student.');
      //   return false;
      // }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validateInputs()) {
      try {
        setLoading(true);
        const reports = students.map(({ _id, fullName, roll_id, present, absent, hadSnack, notHadSnack, usedToilet, notUsedToilet, editField1, editField2 }) => ({
          studentId: roll_id,
          studentName: fullName,
          isPresent: present ? 'Your Child has left the school' : null,
          isAbsent: absent ? 'Your Child is still at the school' : null,
          hasEaten: hadSnack ? 'Your Child had their Snacks' : null,
          hasNotEaten: notHadSnack ? 'Your Child did not have their Snacks.' : null,
          hasUsedRestroom: usedToilet ? 'Your Child used the restroom' : null,
          hasNotUsedRestroom: notUsedToilet ? 'Your Child did not use the restroom' : null,
          todayActivity: editField1 || null,
          circleTimeActivity: editField2 || null,
          dateTime: new Date().toISOString(),
        }));
        await ApiService.sendDailyReports(reports);
        Alert.alert('Success', 'Daily report submitted successfully!');
        await ApiService.sendNotification({
          title: "Daily Report Posted",
          message: "Daily Reports was posted please check in the Joeys Daily Report page.",
          dateTime: new Date().toISOString(),
        });
        navigation.goBack();
      } catch (error) {
        console.error('Error submitting report:', error);
        Alert.alert('Error', 'Failed to submit daily report.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/icon_back.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Joeys Daily Report</Text>
      </View>

      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(itemValue) => setSelectedClass(itemValue)}
          items={[
            { label: 'Primary', value: 'primary' },
            { label: 'Pre-Primary', value: 'pre-primary' },
          ]}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select Class', value: null }}
        />
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#008CBA" />
        </View>
      )}

      <ScrollView style={styles.scrollView}>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { flex: 0.5 }]}>Roll ID</Text>
            <Text style={[styles.headerCell, { flex: 1 }]}>Name</Text>
            <Text style={[styles.headerCell, { flex: 0.7 }]}>Attendance</Text>
            <Text style={[styles.headerCell, { flex: 0.7 }]}>Snack</Text>
            <Text style={[styles.headerCell, { flex: 0.7 }]}>Toilet</Text>
          </View>

          {students.map((student) => (
            <View key={student._id} style={styles.tableRow}>
              <Text style={[styles.cell, { flex: 0.5 }]}>{student.roll_id}</Text>
              <Text style={[styles.cell, { flex: 1 }]}>{student.fullName}</Text>

              <View style={[styles.checkboxGroup, { flex: 0.7 }]}>
                <TouchableOpacity
                  style={styles.customCheckbox}
                  onPress={() => handleCheckboxToggle(student._id, 'present', !student.present)}
                >
                  {student.present && <Icon name="check" size={16} color="#008CBA" />}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.customCheckbox}
                  onPress={() => handleCheckboxToggle(student._id, 'absent', !student.absent)}
                >
                  {student.absent && <Icon name="times" size={16} color="#FF0000" />}
                </TouchableOpacity>
              </View>

              <View style={[styles.checkboxGroup, { flex: 0.7 }]}>
                <TouchableOpacity
                  style={styles.customCheckbox}
                  onPress={() => handleCheckboxToggle(student._id, 'hadSnack', !student.hadSnack)}
                >
                  {student.hadSnack && <Icon name="check" size={16} color="#008CBA" />}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.customCheckbox}
                  onPress={() => handleCheckboxToggle(student._id, 'notHadSnack', !student.notHadSnack)}
                >
                  {student.notHadSnack && <Icon name="times" size={16} color="#FF0000" />}
                </TouchableOpacity>
              </View>

              <View style={[styles.checkboxGroup, { flex: 0.7 }]}>
                <TouchableOpacity
                  style={styles.customCheckbox}
                  onPress={() => handleCheckboxToggle(student._id, 'usedToilet', !student.usedToilet)}
                >
                  {student.usedToilet && <Icon name="check" size={16} color="#008CBA" />}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.customCheckbox}
                  onPress={() => handleCheckboxToggle(student._id, 'notUsedToilet', !student.notUsedToilet)}
                >
                  {student.notUsedToilet && <Icon name="times" size={16} color="#FF0000" />}
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {students.map((student) => (
          <View key={`${student._id}-activities`} style={styles.activitiesContainer}>
            <Text style={styles.studentName}>{student.fullName}</Text>
            <TextInput
              style={styles.textInput}
              value={student.editField1}
              onChangeText={(text) =>
                setStudents((prevStudents) =>
                  prevStudents.map((s) =>
                    s._id === student._id ? { ...s, editField1: text } : s
                  )
                )
              }
              placeholder="Today's Activities"
              multiline
            />
            <TextInput
              style={styles.textInput}
              value={student.editField2}
              onChangeText={(text) =>
                setStudents((prevStudents) =>
                  prevStudents.map((s) =>
                    s._id === student._id ? { ...s, editField2: text } : s
                  )
                )
              }
              placeholder="Circle Time Activities"
              multiline
            />
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickerContainer: {
    margin: 10,
  },
  scrollView: {
    flex: 1,
  },
  tableContainer: {
    margin: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1B97BB',
    padding: 10,
  },
  headerCell: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    padding: 10,
  },
  cell: {
    textAlign: 'center',
  },
  checkboxGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activitiesContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  studentName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    minHeight: 80,
  },
  submitButton: {
    backgroundColor: '#008CBA',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#ffffff',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#ffffff',
  },
});

export default JoeysDailyReportScreen;

