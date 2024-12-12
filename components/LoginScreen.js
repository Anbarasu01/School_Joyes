import React, { useState } from 'react';
import { View, Text, TextInput, Image, Button, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import ApiService from './ApiService'; // Adjust the path as necessary
import AppData from './AppData'; // Import the AppData module

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    try {

      AppData.clearData();
      
      const loginRequest = {
        email: email,
        password: password,
      };

      const response = await ApiService.loginUser(loginRequest);

      if (response.status === 200) {
        console.log('Login successful:', response.data);

        const { user } = response.data;
        AppData.setFullName(user.fullname); 
        AppData.setEmail(user.email); 
        AppData.setRole(user.role);

        // Fetch student details if the role is 'student'
        if (user.role === 'student') {
          await fetchStudentDetails();
        }

        displayLoginSuccessAlert(user);
      } else {
        Alert.alert('Login Failed', 'Invalid email or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login.');
    }
  };

  // Function to fetch student details using the stored email
  const fetchStudentDetails = async () => {
    try {
      const storedEmail = await AppData.getEmail();
      const studentDetailsResponse = await ApiService.getStudent(storedEmail);

      if (studentDetailsResponse.status === 200) {
        console.log('Student details:', studentDetailsResponse.data);
        const { section } = studentDetailsResponse.data; 
        AppData.setClassName(section); // Store the section in className
      } else {
        console.log('Failed to fetch student details.');
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  const displayLoginSuccessAlert = async () => {
    try {
      const fullName = await AppData.getFullName();
      const emailStored = await AppData.getEmail();
      const className = await AppData.getClassName(); // Retrieve the section value
      const role = await AppData.getRole();

      let alertMessage = "\n";

      alertMessage += fullName ? `Welcome Back, ${fullName}!\n` : '';
      alertMessage += emailStored ? `Email: ${emailStored}\n` : '';
      alertMessage += className ? `Class: ${className}\n` : ''; // Display the stored className
      alertMessage += role ? `Role: ${role}` : '';

      Alert.alert(
        "Login Successful",
        alertMessage,
        [{ text: "OK", onPress: () => navigation.navigate('HomeScreen') }]
      );
    } catch (error) {
      console.error('Error displaying login success alert:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.loginText}>Login</Text>

      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your e-mail here"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter your password here"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Image
            source={
              isPasswordVisible
                ? require('../assets/visibility.png')
                : require('../assets/visibility_off.png')
            }
            style={styles.visibilityIcon}
          />
        </TouchableOpacity>
      </View>

      <Button
        title="Login"
        onPress={handleLogin}
        color="#1B97BB"
      />

      <TouchableOpacity onPress={() => navigation.navigate('ForgotScreen')}>
        <Text style={styles.forgotPassword}>Forgot Your Password? Click here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBFB34',
    paddingHorizontal: width * 0.05,
  },
  logo: {
    width: width * 0.5,
    height: height * 0.25,
    marginBottom: height * 0.03,
    resizeMode: 'contain',
  },
  loginText: {
    fontSize: width * 0.08,
    color: '#1B97BB',
    marginBottom: height * 0.03,
  },
  label: {
    width: '100%',
    fontSize: width * 0.04,
    color: '#1B79BB',
    marginBottom: height * 0.01,
  },
  input: {
    width: '100%',
    padding: width * 0.03,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    marginBottom: height * 0.02,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    marginBottom: height * 0.02,
  },
  passwordInput: {
    flex: 1,
    padding: width * 0.03,
  },
  visibilityIcon: {
    width: width * 0.06,
    height: width * 0.06,
    marginRight: width * 0.02,
  },
  forgotPassword: {
    paddingTop: 15,
    fontSize: width * 0.04,
    color: '#1B97BB',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
