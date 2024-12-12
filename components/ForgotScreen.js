import React, { useState, useRef } from 'react';
import { 
  View, 
  Image, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Animated, 
  ActivityIndicator // Import ActivityIndicator
} from 'react-native';
import ApiService from './ApiService'; // Ensure this points to your API client
import AppData from './AppData'; // Ensure this points to your AppData

const ForgotScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // State for loading
  const scaleAnim = useRef(new Animated.Value(1)).current; // Initial scale value

  // Function to handle OTP request
  const handleOtpRequest = () => {
    if (email.trim()) {
      // Animate button
      Animated.spring(scaleAnim, {
        toValue: 0.9, // Scale down to 90%
        friction: 2,
        useNativeDriver: true, // Use native driver for performance
      }).start(() => {
        // After scaling down, reset to original size
        Animated.spring(scaleAnim, {
          toValue: 1, // Scale back to 100%
          friction: 2,
          useNativeDriver: true,
        }).start();
      });

      // Store email in AppData
      AppData.resetEmail = email; 

      sendOtpToServer(email); // Request OTP from server
    } else {
      setErrorMessage('Please enter an email address');
    }
  };

  // Function to send OTP to server
  const sendOtpToServer = async (email) => {
    setLoading(true); // Start loading
    const otp = generateOtp(); // Generate OTP locally
    const otpData = { email, otp }; // Create data model for OTP

    try {
      // Use the API service method to send OTP
      const response = await ApiService.sendOtp(otpData); // Call your API service method

      if (response.status === 200) {
        console.log('OTP sent to server successfully');
        // Navigate to OTP verification screen
        navigateToOtpVerificationActivity();
      } else {
        console.log('Failed to send OTP to server');
        setErrorMessage('Mail does not exist');
      }
    } catch (error) {
      console.error('Error sending OTP:', error.message);
      setErrorMessage('Error sending OTP');
    } finally {
      setLoading(false); // End loading
    }
  };

  // Simple OTP generation logic
  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString(); // Generate a random 4-digit OTP
  };

  // Navigate to OTP verification activity
  const navigateToOtpVerificationActivity = () => {
    navigation.navigate('OtpVerificationScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled" // Ensures taps on buttons are handled
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.innerContainer}
        >
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Image
              source={require('../assets/icon_back.png')}
              style={styles.backButtonImage}
              accessibilityLabel="Back button"
            />
          </TouchableOpacity>

          {/* Logo */}
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            accessibilityLabel="App logo"
          />

          {/* Title */}
          <Text style={styles.title}>Forgot Password</Text>

          {/* Email Address Label */}
          <Text style={styles.label}>Email Address</Text>

          {/* Email Input */}
          <TextInput
            style={styles.emailInput}
            placeholder="    Enter your e-mail here"
            keyboardType="email-address"
            textAlign="left"
            placeholderTextColor="#CCCCCC"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />

          {/* Error Message */}
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          {/* Confirm Button */}
          <View style={styles.buttonContainer}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleOtpRequest}
                disabled={loading} // Disable button while loading
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Loading Indicator */}
          {loading && (
            <ActivityIndicator 
              size="large" 
              color="#1B97BB" 
              style={styles.loadingIndicator} // Style to center the indicator
            />
          )}
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFB34',
    padding: 15,
  },
  scrollViewContent: {
    flexGrow: 1, // Allow content to grow
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  backButton: {
    position: 'absolute', // Position the button absolutely
    top: 16,             // Distance from the top
    left: 16,            // Distance from the left
    zIndex: 1,           // Ensure it is above other components
  },
  backButtonImage: {
    width: 24,
    height: 24,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    width: '100%', // Ensures it takes full width
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 16,
    alignSelf: 'center',
  },
  title: {
    fontSize: 32,
    color: '#1B97BB',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#1B79BB',
    marginStart: 32,
    marginTop: 20,
    marginEnd: 32,
    textAlign: 'center',
    width: '100%',
  },
  emailInput: {
    width: '100%',
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingHorizontal: 12,
    marginHorizontal: 32,
    marginTop: 10,
    color: '#1B79BB',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 5,
  },
  buttonContainer: {
    paddingTop: 10, // Add 10 padding to top
    width: '80%',
  },
  confirmButton: {
    backgroundColor: '#1B97BB',
    borderRadius: 5,
    paddingVertical: 8, // Adjust padding for smaller height
    paddingHorizontal: 16, // Adjust padding for horizontal size
    alignItems: 'center', // Center the text
  },
  confirmButtonText: {
    color: '#FFFFFF', // White text color
    fontSize: 16, // Adjust font size as needed
  },
  loadingIndicator: {
    marginTop: 15, // Add some margin above the loading indicator
  },
});

export default ForgotScreen;