import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, ToastAndroid, StyleSheet, Text, Image } from 'react-native';
import ApiService from './ApiService'; // Import your API service
import PasswordRequirement from './PasswordRequirement'; // Import PasswordRequirement component
import AppData from './AppData';

const ResetPasswordScreen = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    specialChar: false,
  });

  useEffect(() => {
    validatePasswordRequirements(newPassword);
  }, [newPassword]);

  const validatePasswordRequirements = (password) => {
    const lengthValid = password.length >= 8;
    const uppercaseValid = /[A-Z]/.test(password);
    const lowercaseValid = /[a-z]/.test(password);
    const digitValid = /\d/.test(password);
    const specialCharValid = /[^a-zA-Z0-9]/.test(password);

    setRequirements({
      length: lengthValid,
      uppercase: uppercaseValid,
      lowercase: lowercaseValid,
      digit: digitValid,
      specialChar: specialCharValid,
    });
  };

  const resetPassword = async () => {
    if (newPassword === confirmPassword) {
      if (Object.values(requirements).every((req) => req)) {
        const email = AppData.resetEmail; // Retrieve email from AppData

        try {
          const response = await ApiService.resetPassword({
            email,
            newPassword,
          });

          if (response.data.success) {
            ToastAndroid.show('Password reset successfully', ToastAndroid.SHORT);
            navigation.navigate('Login'); // Navigate to LoginScreen
          } else {
            ToastAndroid.show(response.data.message || 'Failed to reset password', ToastAndroid.SHORT);
          }
        } catch (error) {
          console.error(error);
          ToastAndroid.show('Error resetting password', ToastAndroid.SHORT);
        }
      } else {
        ToastAndroid.show('Password does not meet all requirements', ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Image
        source={require('../assets/icon_back.png')}
        style={styles.backButton}
      />
      <Text style={styles.title}>Reset Password</Text>

      {/* Logo */}
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
      />

      {/* New Password Input */}
      <TextInput
        placeholder="New Password"
        secureTextEntry
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
      />

      {/* Confirm Password Input */}
      <TextInput
        placeholder="Confirm New Password"
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Password Requirements */}
      <View style={styles.requirementsContainer}>
        <Text style={styles.requirementsTitle}>Password Requirements</Text>
        <PasswordRequirement met={requirements.length} text="At least 8 characters" />
        <PasswordRequirement met={requirements.uppercase} text="At least 1 uppercase letter" />
        <PasswordRequirement met={requirements.lowercase} text="At least 1 lowercase letter" />
        <PasswordRequirement met={requirements.digit} text="At least 1 digit" />
        <PasswordRequirement met={requirements.specialChar} text="At least 1 special character" />
      </View>

      {/* Reset Password Button */}
      <TouchableOpacity style={styles.submitButton} onPress={resetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FBFB34', // Replace with your background color
  },
  backButton: {
    width: 30,
    height: 30,
    marginStart: 20,
    marginTop: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B79BB',
    marginTop: 15,
    marginStart: 16,
  },
  logo: {
    width: '70%',
    height: '30%',
    marginTop: 32,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF', // Replace with your background drawable if needed
  },
  requirementsContainer: {
    marginTop: 16,
    marginLeft: 20,
  },
  requirementsTitle: {
    fontSize: 16,
    color: '#1B79BB',
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#1B97BB', // Set the background color
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF', // Set text color to white for contrast
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResetPasswordScreen;