import React, { useState } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import ApiService from './ApiService'; // Import your ApiService
import AppData from './AppData'; // Import AppData

const FeedbackScreen = ({ navigation }) => {
  // State to hold the feedback input
  const [feedback, setFeedback] = useState('');

  // Reusable Header Section
  const renderHeader = () => (
    <SafeAreaView style={styles.headerSection}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.backButton} source={require('../assets/icon_back.png')} />
        </TouchableOpacity>
        <Text style={styles.menuTitle}>Feedback</Text>
      </View>
    </SafeAreaView>
  );

  // Function to handle feedback submission
  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      Alert.alert("Error", "Please enter your feedback.");
      return;
    }

    // Prepare the feedback data including fullName, className, role, and feedback text
    const feedbackData = {
      fullName: AppData.getFullName(),
      className: AppData.getClassName(),
      role: AppData.getRole(),
      feedbackText: feedback, // Updated to match backend expectations
    };

    try {
      await ApiService.submitFeedback(feedbackData); // Post the feedback data
      Alert.alert("Success", "Thank you for your feedback!");
      setFeedback(''); // Clear the feedback input after submission
    } catch (error) {
      console.error("Error submitting feedback:", error);
      Alert.alert("Error", "Failed to submit feedback. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      {renderHeader()}

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Feedback Input */}
        <TextInput
          style={styles.feedbackInput}
          placeholder="Enter your feedback"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          value={feedback}
          onChangeText={setFeedback} // Update the state with user input
        />

        {/* Submit Button */}
        <Button
          title="Submit"
          onPress={handleSubmitFeedback} // Call the submit function
          color="#1B79BB"
        />
      </ScrollView>
    </View>
  );
};

// Styles
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
    paddingStart: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 24,
    height: 24,
  },
  menuTitle: {
    marginLeft: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B97BB',
  },
  content: {
    paddingHorizontal: 16,
  },
  feedbackInput: {
    flex: 1,
    minHeight: 100,
    padding: 10,
    backgroundColor: '#F0F0F0',
    color: '#1B79BB',
    marginTop: 16,
    marginBottom: 16,
  },
});

export default FeedbackScreen;
