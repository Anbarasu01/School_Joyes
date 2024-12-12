import React, { useState, useRef } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import ApiService from './ApiService';
import AppData from './AppData';

const OtpVerificationScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '']); // State for storing OTP digits
  const inputRefs = useRef([React.createRef(), React.createRef(), React.createRef(), React.createRef()]); // Create refs for each input

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input
    if (value.length === 1 && index < 3) {
      inputRefs.current[index + 1].current.focus(); // Focus the next input
    } else if (value.length === 0 && index > 0) {
      inputRefs.current[index - 1].current.focus(); // Focus the previous input
    }
  };

  // Submit OTP for verification
  const handleSubmitOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length === 4) {
      const email = AppData.resetEmail; // Ensure AppData contains resetEmail
      if (!email) {
        ToastAndroid.show("Email not found. Please try again.", ToastAndroid.SHORT);
        return;
      }

      // Create the OTP verification request object
      const otpVerificationRequest = {
        email: email,
        otp: otpString,
      };

      try {
        const response = await ApiService.verifyOtp(otpVerificationRequest);

        if (response.data.success) {
          navigation.navigate('ResetPasswordScreen');
        } else {
          ToastAndroid.show(response.data.message || "Invalid OTP", ToastAndroid.SHORT);
        }
      } catch (error) {
        console.error(error);
        ToastAndroid.show("Error: " + error.message, ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show("Please enter a valid 4-digit OTP", ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image
            source={require('../assets/icon_back.png')}
            style={styles.backButtonImage}
            accessibilityLabel="Back button"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.centeredContent}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />

        <Text style={styles.title}>Forgot Password</Text>

        <Text style={styles.label}>Enter OTP</Text>

        <View style={styles.otpInputContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={inputRefs.current[index]} // Attach ref
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              value={digit}
              onChangeText={(value) => handleOtpChange(index, value)}
            />
          ))}
        </View>

        <TouchableOpacity onPress={handleSubmitOtp} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFB34',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 30,
  },
  backButton: {
    width: 24,
    height: 24,
  },
  backButtonImage: {
    width: 24,
    height: 24,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    color: '#1B97BB',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#1B79BB',
    marginVertical: 20,
    textAlign: 'center',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  otpInput: {
    width: 50,
    height: 50,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    fontSize: 18,
  },
  submitButton: {
    backgroundColor: '#1B97BB',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OtpVerificationScreen;