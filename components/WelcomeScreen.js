import React from 'react';
import { View, Text, Image, Button, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.welcomeText}>Welcome</Text>
      <Button
        title="Let's Start"
        onPress={() => navigation.navigate('Login')}
        color="#1B97BB"
      />
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
    width: width * 0.7, // Scales based on screen width
    height: height * 0.4, // Scales based on screen height
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: width * 0.07, // Relative font size based on screen width
    color: '#1B97BB',
    fontWeight: 'bold',
    marginVertical: height * 0.02,
  },
});

export default WelcomeScreen;
