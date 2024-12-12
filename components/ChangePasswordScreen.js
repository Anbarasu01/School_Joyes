import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import PasswordRequirement from './PasswordRequirement';
import ApiService from './ApiService';
import AppData from './AppData';

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [requirementsMet, setRequirementsMet] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    specialChar: false,
  });

  // Get the email from AppData
  const email = AppData.getEmail();

  const togglePasswordVisibility = (field) => {
    setPasswordVisible((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  useEffect(() => {
    setRequirementsMet({
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      digit: /[0-9]/.test(newPassword),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    });
  }, [newPassword]);

  // Function to handle password change
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirm password do not match");
      return;
    }

    const changePasswordRequest = {
      email: email, 
      oldPassword: currentPassword, 
      newPassword: newPassword,
    };

    try {
      const response = await ApiService.changePassword(changePasswordRequest);
      if (!response.data.error) { 
        Alert.alert("Success", "Password changed successfully");
        navigation.goBack();
      } else {
        Alert.alert("Error", response.data.message || "Failed to change password");
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "An error occurred while changing password");
    }
  };

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.backButton} source={require('../assets/icon_back.png')} />
        </TouchableOpacity>
        <Text style={styles.menuTitle}>Change Password</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      {renderHeader()}

      {/* Current Password */}
      <View style={styles.passwordLayout}>
        <Text style={styles.passwordLabel}>Current Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={styles.passwordInput}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!passwordVisible.current}
            placeholder="Enter current password"
          />
          <TouchableOpacity onPress={() => togglePasswordVisibility('current')}>
            <Image
              source={passwordVisible.current ? require('../assets/visibility.png') : require('../assets/visibility_off.png')}
              style={styles.visibilityToggle}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* New Password */}
      <View style={styles.passwordLayout}>
        <Text style={styles.passwordLabel}>New Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={styles.passwordInput}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!passwordVisible.new}
            placeholder="Enter new password"
          />
          <TouchableOpacity onPress={() => togglePasswordVisibility('new')}>
            <Image
              source={passwordVisible.new ? require('../assets/visibility.png') : require('../assets/visibility_off.png')}
              style={styles.visibilityToggle}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirm Password */}
      <View style={styles.passwordLayout}>
        <Text style={styles.passwordLabel}>Confirm New Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={styles.passwordInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!passwordVisible.confirm}
            placeholder="Re-enter new password"
          />
          <TouchableOpacity onPress={() => togglePasswordVisibility('confirm')}>
            <Image
              source={passwordVisible.confirm ? require('../assets/visibility.png') : require('../assets/visibility_off.png')}
              style={styles.visibilityToggle}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Password Requirements */}
      <View style={styles.requirementsLayout}>
        <Text style={styles.requirementsTitle}>Password Requirements</Text>
        <PasswordRequirement met={requirementsMet.length} text="At least 8 characters" />
        <PasswordRequirement met={requirementsMet.uppercase} text="At least one uppercase letter" />
        <PasswordRequirement met={requirementsMet.lowercase} text="At least one lowercase letter" />
        <PasswordRequirement met={requirementsMet.digit} text="At least one digit" />
        <PasswordRequirement met={requirementsMet.specialChar} text="At least one special character" />
      </View>

      {/* Change Password Button */}
      <TouchableOpacity 
        style={styles.changePasswordButton} 
        onPress={handleChangePassword}
        activeOpacity={0.8}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerSection: {
    backgroundColor: '#FFFFFF',
    elevation: 4,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 30,
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
  passwordLayout: {
    marginTop: 16,
    paddingLeft: 15,
    paddingRight: 15,
  },
  passwordLabel: {
    color: '#1B79BB',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 4,
  },
  visibilityToggle: {
    width: 24,
    height: 24,
    marginLeft: 8,
  },
  requirementsLayout: {
    marginTop: 16,
    paddingLeft: 15,
    paddingRight: 15,
  },
  requirementsTitle: {
    fontSize: 16,
    color: '#1B79BB',
    marginBottom: 8,
  },
  changePasswordButton: {
    backgroundColor: '#1B79BB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen;
