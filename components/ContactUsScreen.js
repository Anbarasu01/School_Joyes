import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

const ContactUsScreen = ({ navigation }) => {
  // Reusable Header Section
  const renderHeader = () => (
    <SafeAreaView style={styles.headerSection}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.backButton} source={require('../assets/icon_back.png')} />
        </TouchableOpacity>
        <Text style={styles.menuTitle}>Contact Us</Text>
      </View>
    </SafeAreaView>
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      {renderHeader()}

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Company Name */}
        <Text style={styles.companyName}>JOEYS</Text>

        {/* Phone Section */}
        <View style={styles.phoneLayout}>
          <Image
            style={styles.icon}
            source={require('../assets/phone.png')}
          />
          <Text style={styles.phoneNumber}>+91 123567890</Text>
        </View>

        {/* Email Section */}
        <View style={styles.mailLayout}>
          <Image
            style={styles.icon}
            source={require('../assets/mail.png')}
          />
          <Text style={styles.email}>contactjoeys@gmail.com</Text>
        </View>

        {/* Location Section */}
        <View style={styles.locationLayout}>
          <Image
            style={styles.icon}
            source={require('../assets/location.png')}
          />
          <Text style={styles.locationAddress}>Nehru Nagar, Coimbatore.</Text>
        </View>
      </ScrollView>
    </View>
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
    padding: 15,
    alignItems: 'center',
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
  divider: {
    height: 1,
    backgroundColor: '#DDDDDD',
    marginBottom: 16,
  },
  content: {
    paddingHorizontal: 16,
  },
  companyName: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B97BB',
  },
  phoneLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  mailLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  locationLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  icon: {
    width: 44,
    height: 44,
  },
  phoneNumber: {
    marginStart: 8,
    marginTop: 15,
    alignItems: 'center',
    color: '#1B79BB',
  },
  email: {
    marginStart: 8,
    marginTop: 15,
    alignItems: 'center',
    color: '#1B79BB',
  },
  locationAddress: {
    marginStart: 8,
    marginTop: 15,
    alignItems: 'center',
    color: '#1B79BB',
  },
});

export default ContactUsScreen;
