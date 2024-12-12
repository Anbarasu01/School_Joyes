import React, { useState, useEffect } from 'react';
import { View, Text, Image, Switch, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert, Linking } from 'react-native';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';

const SettingsScreen = ({ navigation }) => {
  const [locationPermission, setLocationPermission] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState(false);
  const [storagePermission, setStoragePermission] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    await checkLocationPermission();
    await checkMicrophonePermission();
    await checkStoragePermission();
  };

  const checkLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setLocationPermission(status === 'granted');
  };

  const checkMicrophonePermission = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    setMicrophonePermission(status === 'granted');
  };

  const checkStoragePermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    setStoragePermission(status === 'granted');
  };

  const handlePermissionToggle = async (permissionType, isEnabled, setPermissionState) => {
    try {
      if (isEnabled) {
        let result;

        switch (permissionType) {
          case 'location':
            result = await Location.requestForegroundPermissionsAsync();
            break;
          case 'microphone':
            result = await Audio.requestPermissionsAsync();
            break;
          case 'storage':
            result = await MediaLibrary.requestPermissionsAsync();
            break;
        }

        if (result.status === 'granted') {
          setPermissionState(true);
        } else {
          Alert.alert(
            'Permission Denied',
            'You need to allow the permission in settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openURL('app-settings:') },
            ]
          );
          setPermissionState(false);
        }
      } else {
        Alert.alert(
          'Permission Change',
          'You can only revoke permissions from the device settings.',
          [
            { text: 'Open Settings', onPress: () => Linking.openURL('app-settings:') },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        setPermissionState(false);
      }
    } catch (error) {
      console.log('Error handling permission: ', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image style={styles.backButton} source={require('../assets/icon_back.png')} />
          </TouchableOpacity>
          <Text style={styles.menuTitle}>Settings</Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Location Permission Toggle */}
        <View style={styles.permissionLayout}>
          <Text style={styles.permissionLabel}>Location Permission</Text>
          <Switch
            value={locationPermission}
            onValueChange={() =>
              handlePermissionToggle('location', !locationPermission, setLocationPermission)
            }
            thumbColor={locationPermission ? '#1B97BB' : '#ccc'}
          />
        </View>

        {/* Microphone Permission Toggle */}
        <View style={styles.permissionLayout}>
          <Text style={styles.permissionLabel}>Microphone Permission</Text>
          <Switch
            value={microphonePermission}
            onValueChange={() =>
              handlePermissionToggle('microphone', !microphonePermission, setMicrophonePermission)
            }
            thumbColor={microphonePermission ? '#1B97BB' : '#ccc'}
          />
        </View>

        {/* Storage Permission Toggle */}
        <View style={styles.permissionLayout}>
          <Text style={styles.permissionLabel}>Storage Permission</Text>
          <Switch
            value={storagePermission}
            onValueChange={() =>
              handlePermissionToggle('storage', !storagePermission, setStoragePermission)
            }
            thumbColor={storagePermission ? '#1B97BB' : '#ccc'}
          />
        </View>

        {/* Change Password Label */}
        <TouchableOpacity onPress={() => navigation.navigate('ChangePasswordScreen')}>
          <Text style={styles.changePasswordLabel}>Change Password</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
  },
  headerSection: {
    backgroundColor: '#FFFFFF',
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  backButton: {
    width: 24,
    height: 24,
  },
  menuTitle: {
    marginLeft: 10,
    fontSize: 20,
    color: '#1B97BB',
  },
  content: {
    paddingHorizontal: 16,
  },
  permissionLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  permissionLabel: {
    color: '#1B79BB',
    fontSize: 16,
  },
  changePasswordLabel: {
    marginTop: 20,
    fontSize: 16,
    color: '#1B79BB',
  },
});

export default SettingsScreen;
