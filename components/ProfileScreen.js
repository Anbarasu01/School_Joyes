import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { StyleSheet } from 'react-native';
import { colors } from './colors';
import ApiService from './ApiService';
import AppData from './AppData';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';


const ProfileScreen = () => {
  const [profile, setProfile] = useState({
    name: '',
    rollno: '',
    email: '',
    mobilenumber: '',
    address: '',
    dob: '',
    fathername: '',
    fatherprofession: '',
    mothername: '',
    motherprofession: '',
    medicaldetails: '',
    allergies: '',
    medication : '',
    profilePhoto: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch profile details when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = AppData.email; // Replace with the actual user's email
        const response = await ApiService.getProfile(email);
        
        // Assuming the API returns profile data in response.data
        const profileData = response.data;
  
        // If the profile photo is returned as a base64 string, update the profile state
        if (profileData.profilePhoto) {
          profileData.profilePhoto = `data:image/jpeg;base64,${profileData.profilePhoto}`;
        }
  
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
  
    fetchProfile();
  }, []);
  

  // Update profile details
  const handleUpdateProfile = async () => {
    try {
      const email = AppData.email; // Replace with the actual user's email
      
      // Create a copy of the profile excluding 'medicaldetails'
      const { medicaldetails, ...profileWithoutMedicalDetails } = profile;
  
      // Call the API with the filtered profile data
      await ApiService.updateProfile(email, profileWithoutMedicalDetails);
      
      setIsEditing(false); // Exit edit mode after updating
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  

  // Handle date change
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date; // If the user cancels, keep the current date
    setShowDatePicker(false); // Hide the date picker
    setSelectedDate(currentDate);
    setProfile({ ...profile, dob: formatDate(currentDate) }); // Update dob in profile state
  };

  const handleViewMedicalDetails = async () => {
    if (profile.medicaldetails) {
      const base64data = profile.medicaldetails;
      const fileUri = FileSystem.documentDirectory + 'medical_details.pdf';
  
      try {
        // Write the base64 string to a file
        await FileSystem.writeAsStringAsync(fileUri, base64data, {
          encoding: FileSystem.EncodingType.Base64,
        });
  
        // Check if sharing is available
        if (await Sharing.isAvailableAsync()) {
          // Share the file
          await Sharing.shareAsync(fileUri);
        } else {
          Alert.alert('Error', 'Sharing is not available on this device.');
        }
      } catch (error) {
        console.error('Error writing medical details to file:', error);
        Alert.alert('Error', 'Unable to view medical details.');
      }
    } else {
      Alert.alert('No medical details available.');
    }
  };
  
  



  // Function to format the date as DD-MM-YYYY
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };


  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Button title={isEditing ? 'Save' : 'Edit'} color={'#1B97BB'} onPress={isEditing ? handleUpdateProfile : () => setIsEditing(true)} />
      </SafeAreaView>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Profile Image */}
          <Image
            style={styles.profileImage}
            value = {profile.profilePhoto}
            source={profile.profilePhoto ? { uri: profile.profilePhoto } : require('../assets/image-holder-icon.png')}
          />

          {/* Name */}
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={profile.name}
            onChangeText={(text) => setProfile({ ...profile, name: text })}
            placeholder="Enter your name"
            editable={isEditing}
          />

          {/* Student ID */}
          <Text style={styles.label}>Student Id / Roll No</Text>
          <TextInput
            style={styles.input}
            value={profile.rollno}
            onChangeText={(text) => setProfile({ ...profile, rollno: text })}
            placeholder="Enter your Id"
            editable={isEditing}
          />

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={profile.email}
            onChangeText={(text) => setProfile({ ...profile, email: text })}
            placeholder="Enter your e-mail"
            editable={isEditing}
          />

          {/* Mobile Number */}
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={profile.mobilenumber}
            onChangeText={(text) => setProfile({ ...profile, mobilenumber: text })}
            placeholder="Mobile No"
            editable={isEditing}
          />

          {/* Address */}
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={profile.address}
            onChangeText={(text) => setProfile({ ...profile, address: text })}
            placeholder="Enter your Address"
            editable={isEditing}
          />

          {/* Date of Birth */}
          <Text style={styles.label}>Date of Birth</Text>
          <View style={styles.dateInputContainer}>
            <TextInput
              style={styles.dateInput}
              value={profile.dob}
              placeholder="DD-MM-YYYY"
              editable={false} // Make it non-editable, controlled by the date picker
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Image
                source={require('../assets/icon_calendar.png')}
                style={styles.calendarIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          {/* Parent Details Section */}
          <View style={styles.parentDetailsLayout}>
            <Text style={styles.label}>Father's Name</Text>
            <TextInput
              style={styles.input}
              value={profile.fathername}
              onChangeText={(text) => setProfile({ ...profile, fathername: text })}
              placeholder="Enter your father's name"
              editable={isEditing}
            />
            <Text style={styles.label}>Father's Profession</Text>
            <TextInput
              style={styles.input}
              value={profile.fatherprofession}
              onChangeText={(text) => setProfile({ ...profile, fatherprofession: text })}
              placeholder="Enter your father's profession"
              editable={isEditing}
            />
            <Text style={styles.label}>Mother's Name</Text>
            <TextInput
              style={styles.input}
              value={profile.mothername}
              onChangeText={(text) => setProfile({ ...profile, mothername: text })}
              placeholder="Enter your mother's name"
              editable={isEditing}
            />
            <Text style={styles.label}>Mother's Profession</Text>
            <TextInput
              style={styles.input}
              value={profile.motherprofession}
              onChangeText={(text) => setProfile({ ...profile, motherprofession: text })}
              placeholder="Enter your mother's profession"
              editable={isEditing}
            />
            <Text style={styles.label}>Medical Details</Text>
            <TouchableOpacity style={styles.input} onPress={handleViewMedicalDetails}>
              <Text style={styles.hintText}>{profile.medicaldetails ? "medical_details.pdf" : "Enter any medical details"}</Text>
              <Image
                source={require('../assets/icon_upload.png')}
                style={styles.uploadIcon}
              />
            </TouchableOpacity>
            <Text style={styles.label}>Allergies</Text>
            <TextInput
              style={styles.input}
              value={profile.allergies}
              onChangeText={(text) => setProfile({ ...profile, allergies: text })}
              placeholder="Enter any allergies"
              editable={isEditing}
            />
            <TextInput
              style={styles.input}
              value={profile.medication}
              onChangeText={(text) => setProfile({ ...profile, medication: text })}
              placeholder="Enter any medication"
              editable={isEditing}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 15,
  },
  header: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    flex: 1,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1B97BB',
    marginStart: 10,
  },
  scrollView: {
    padding: 15,
  },
  content: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    backgroundColor: colors.colorPrimary,
    marginTop: 10,
    marginBottom: 8,
  },
  label: {
    width: '100%',
    marginBottom: 4,
    color: '#1B79BB',
    fontSize: 18,
  },
  input: {
    width: '100%',
    height: 45,
    marginBottom: 8,
    padding: 10,
    backgroundColor: colors.addActivityButtonBackground,
    color: '#000000',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  dateInput: {
    flex: 1,
    height: 45,
    padding: 10,
    backgroundColor: colors.addActivityButtonBackground,
    color: '#000000',
  },
  calendarIcon: {
    width: 24,
    height: 24,
    marginLeft: 8,
  },
  parentDetailsLayout: {
    width: '100%',
    marginTop: 8,
  },
  uploadIcon: {
    width: 24,
    height: 24,
    position: 'absolute',
    right: 10,
    top: 10,
  },
  hintText: {
    color: 'grey',
  },
});

export default ProfileScreen;