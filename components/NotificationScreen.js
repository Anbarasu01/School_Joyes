import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import ApiService from './ApiService'; 
import AppData from './AppData';

// Get the screen width for responsive styling
const { width } = Dimensions.get('window');

const NotificationScreen = ({ navigation }) => {
  const role = AppData.getRole();
  const [notifications, setNotifications] = useState([]); // State to store notifications
  const [loading, setLoading] = useState(true); // State for loading indicator

  // Fetch notifications when the component mounts
  useEffect(() => {
    ApiService.getNotifications()
      .then(response => {
        setNotifications(response.data); // Set notifications from API response
        setLoading(false); // Stop loading
      })
      .catch(error => {
        console.error('Error fetching notifications:', error);
        setLoading(false); // Stop loading even if there's an error
      });
  }, []);

  const handleWorkUpdatesPress = () => {
    if (role === 'admin') {
      navigation.navigate('AdminWorkUpdatesScreen');
    } else if (role === 'teacher') {
      navigation.navigate('TeacherWorkUpdatesScreen');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.nameText}>JOLLY </Text>
            <Text style={styles.logoText}>JOEYS</Text>
          </View>

          {/* TouchableOpacity for Menu Button */}
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              navigation.navigate('Menu');
            }}
          >
            <Image
              source={require('../assets/menu.png')}
              style={styles.menuIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Content Layout */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Conditional Rendering Based on Role */}
          {role === 'admin' || role === 'teacher' ? (
            <>
              <Text style={styles.notificationText}>Notifications</Text>

              {/* Work Updates Section */}
              <TouchableOpacity
                style={styles.workUpdatesLayout}
                onPress={handleWorkUpdatesPress} // Handle press event
              >
                <Image
                  style={styles.circularImage}
                  source={require('../assets/icon_alert.png')}
                />
                <View style={styles.workUpdatesTextContainer}>
                  <Text style={styles.workUpdatesText}>Work Updates</Text>
                  <Text style={styles.workUpdatesSubtitle}>Alert for work updates</Text>
                </View>
              </TouchableOpacity>
            </>
          ) : null}

          {/* Recent Notifications */}
          <Text style={styles.recentNotificationText}>Recent Notifications</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#1B97BB" />
          ) : notifications.length > 0 ? (
            <View style={styles.notificationContainer}>
              {notifications.map((notification, index) => (
                <View key={index} style={styles.notificationItem}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationBody}>{notification.message}</Text>
                  <Text style={styles.notificationBody}>{notification.dateTime}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noNotificationsText}>No notifications available.</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextContainer: {
    flexDirection: 'row',
  },
  nameText: {
    fontSize: 26,
    color: '#F2ADC0',
    fontWeight: 'bold',
  },
  logoText: {
    fontSize: 26,
    color: '#1B97BB',
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 10,
  },
  menuIcon: {
    width: 30,
    height: 30,
  },
  scrollContent: {
    padding: 15,
  },
  notificationText: {
    color: '#1B97BB',
    fontSize: width < 360 ? 22 : 24, // Responsive font size
    fontWeight: 'bold',
  },
  workUpdatesLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  circularImage: {
    width: 60,
    height: 60,
    marginEnd: 10,
  },
  workUpdatesTextContainer: {
    flexDirection: 'column',
  },
  workUpdatesText: {
    color: '#1B97BB',
    fontSize: width < 360 ? 16 : 18, // Responsive font size
    fontWeight: 'bold',
  },
  workUpdatesSubtitle: {
    color: '#1B97BB',
    fontSize: width < 360 ? 10 : 12, // Responsive font size
  },
  recentNotificationText: {
    marginTop: 16,
    marginBottom: 16,
    color: '#1B97BB',
    fontSize: width < 360 ? 22 : 24, // Responsive font size
    fontWeight: 'bold',
  },
  notificationContainer: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: 'white',
    elevation: 4,
  },
  notificationItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#E6F7FF',
    borderRadius: 5,
  },
  notificationTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1B97BB',
  },
  notificationBody: {
    fontSize: 14,
    color: '#1B97BB',
  },
  noNotificationsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#1B97BB',
  },
});

export default NotificationScreen;
