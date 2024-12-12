import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import AppData from './AppData';

const MenuScreen = ({ navigation }) => {
  const [isQADropdownVisible, setQADropdownVisible] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = AppData.getRole();
    setUserRole(role);
  }, []);

  const toggleQADropdown = () => {
    setQADropdownVisible(!isQADropdownVisible);
  };

  const handleLogout = async () => {
    try {
      AppData.clearData();
      Alert.alert(
        'Logged Out',
        'You have been logged out successfully.',
        [{ text: 'OK', onPress: () => navigation.replace('Login') }]
      );
    } catch (error) {
      console.log('Error clearing data: ', error);
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
          <Text style={styles.menuTitle}>Menu</Text>
        </View>
      </View>

      {/* Body Section */}
      <ScrollView style={styles.bodySection}>
        {userRole === 'student' && (
          <>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('CrewMembers')}>
              <Image style={styles.icon} source={require('../assets/crew.png')} />
              <Text style={styles.menuText}>Crew Members</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('SiblingsScreen')}>
              <Image style={styles.icon} source={require('../assets/children.png')} />
              <Text style={styles.menuText}>Siblings</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.menuItem} onPress={toggleQADropdown}>
          <Image style={styles.icon} source={require('../assets/quetion.png')} />
          <Text style={styles.menuText}>Guidelines - Standards</Text>
          <Image style={styles.dropdownIcon} source={require('../assets/dropdown.png')} />
        </TouchableOpacity>

        {isQADropdownVisible && (
          <View style={styles.qaAdditionalSettings}>
            <TouchableOpacity style={styles.qaItem}>
              <Text style={styles.qaText}>Common Q/A</Text>
              <Image style={styles.linkIcon} source={require('../assets/icon_link.png')} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.qaItem}>
              <Text style={styles.qaText}>Do's and Don'ts</Text>
              <Image style={styles.linkIcon} source={require('../assets/icon_link.png')} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.qaItem}>
              <Text style={styles.qaText}>Dress Code</Text>
              <Image style={styles.linkIcon} source={require('../assets/icon_link.png')} />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ContactUsScreen')}>
          <Image style={styles.icon} source={require('../assets/contactus.png')} />
          <Text style={styles.menuText}>Contact Us</Text>
        </TouchableOpacity>

        {/* Conditionally render Feedback menu item if the userRole is 'student' */}
        {userRole === 'student' && (
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('FeedbackScreen')}>
            <Image style={styles.icon} source={require('../assets/feedback_icon.png')} />
            <Text style={styles.menuText}>Feedback</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.menuItem}>
          <Image style={styles.icon} source={require('../assets/privacypolicy.png')} />
          <Text style={styles.menuText}>Privacy Policy</Text>
          <Image style={styles.linkIcon} source={require('../assets/icon_link.png')} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('SettingsScreen')}>
          <Image style={styles.icon} source={require('../assets/settings.png')} />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Image style={styles.icon} source={require('../assets/logout.png')} />
          <Text style={styles.menuText}>Logout</Text>
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
    paddingTop: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingBottom: 16,
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
  bodySection: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  menuText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#1B79BB',
  },
  dropdownIcon: {
    marginLeft: 'auto',
    width: 24,
    height: 24,
  },
  qaAdditionalSettings: {
    paddingLeft: 16,
    backgroundColor: '#FFFFFF',
  },
  qaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  qaText: {
    fontSize: 16,
    color: '#1B79BB',
  },
  linkIcon: {
    marginLeft: 'auto',
    width: 24,
    height: 24,
  },
});

export default MenuScreen;
