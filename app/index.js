import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaView, Image } from 'react-native';
import { NavigationContainer, NavigationIndependentTree, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TransitionPresets } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Import your screens
import WelcomeScreen from '../components/WelcomeScreen';
import LoginScreen from '../components/LoginScreen';
import HomeScreen from '../components/HomeScreen';
import NotificationScreen from '../components/NotificationScreen';
import MediaScreen from '../components/MediaScreen';
import ProfileScreen from '../components/ProfileScreen';
import MenuScreen from '../components/MenuScreen';
import CrewMembersScreen from '../components/CrewMembersScreen';
import SettingsScreen from '../components/SettingsScreen';
import ChangePasswordScreen from '../components/ChangePasswordScreen';
import PasswordRequirements from '../components/PasswordRequirement';
import SiblingsScreen from '../components/SiblingsScreen';
import ContactUsScreen from '../components/ContactUsScreen';
import FeedbackScreen from '../components/FeedbackScreen';
import ForgotScreen from '../components/ForgotScreen';
import OtpVerificationScreen from '../components/OtpVerificationScreen';
import ResetPasswordScreen from '../components/ResetPasswordScreen';
import CheckedInScreen from '../components/CheckedInScreen';
import JoeysDailyReportScreen from '../components/JoeysDailyReportScreen';
import StudentJoeysDailyReportScreen from '../components/StudentJoeysDailyReportScreen';
import ChildObservationScreen from '../components/ChildObservationScreen';
import StudentCheckedInScreen from '../components/StudentCheckedInScreen';
import StudentObsScreen from '../components/StudentObsScreen';
import TeacherWorkUpdatesScreen from '../components/TeacherWorkUpdatesScreen';
import AdminWorkUpdatesScreen from '../components/AdminWorkUpdatesScreen';
import EntryAnimation from '../components/EntryAnimatedScreen'

// Create stack and tab navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Define the bottom tab navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconPath;

          if (route.name === 'Home') {
            iconPath = focused
              ? require('../assets/home_active.png')
              : require('../assets/ic_home.png');
          } else if (route.name === 'Notification') {
            iconPath = focused
              ? require('../assets/notification_active.png')
              : require('../assets/ic_notification.png');
          } else if (route.name === 'Media') {
            iconPath = focused
              ? require('../assets/photo_active.png')
              : require('../assets/ic_photo.png');
          } else if (route.name === 'Profile') {
            iconPath = focused
              ? require('../assets/user_active.png')
              : require('../assets/ic_user.png');
          }

          return <Image source={iconPath} style={{ width: 24, height: 24 }} />;
        },
        tabBarActiveTintColor: '#1B97BB',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Notification" component={NotificationScreen} />
      <Tab.Screen name="Media" component={MediaScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main application component
export default function App() {
  return (
    <NavigationIndependentTree>
        <NavigationContainer independent={true} >
            <SafeAreaView style={{ flex: 1 }} >
              <StatusBar style="auto" />
              <Stack.Navigator
                initialRouteName="Welcome"
                screenOptions={{
                  headerShown: false,
                  ...TransitionPresets.FadeFromBottomAndroid,
                  gestureEnabled: true,
                  gestureDirection: 'horizontal',
                }}
              >
                {/* Authentication and Onboarding */}
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="ForgotScreen" component={ForgotScreen} />
                <Stack.Screen name="OtpVerificationScreen" component={OtpVerificationScreen} />
                <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />

                {/* Main Application */}
                <Stack.Screen name="HomeScreen" component={MainTabs} />
                <Stack.Screen name="Menu" component={MenuScreen} />
                <Stack.Screen name="CrewMembers" component={CrewMembersScreen} />
                <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
                <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
                <Stack.Screen name="PasswordRequirements" component={PasswordRequirements} />
                <Stack.Screen name="SiblingsScreen" component={SiblingsScreen} />
                <Stack.Screen name="ContactUsScreen" component={ContactUsScreen} />
                <Stack.Screen name="FeedbackScreen" component={FeedbackScreen} />
                <Stack.Screen name="CheckedInScreen" component={CheckedInScreen} />
                <Stack.Screen name="JoeysDailyReportScreen" component={JoeysDailyReportScreen} />
                <Stack.Screen name="StudentJoeysDailyReportScreen" component={StudentJoeysDailyReportScreen} />
                <Stack.Screen name="ChildObservationScreen" component={ChildObservationScreen} />
                <Stack.Screen name="StudentCheckedInScreen" component={StudentCheckedInScreen} />
                <Stack.Screen name="StudentObsScreen" component={StudentObsScreen} />
                <Stack.Screen name="TeacherWorkUpdatesScreen" component={TeacherWorkUpdatesScreen} />
                <Stack.Screen name="AdminWorkUpdatesScreen" component={AdminWorkUpdatesScreen} />
                <Stack.Screen name="EntryAnimation" component={EntryAnimation} />
              </Stack.Navigator>
            </SafeAreaView>
         </NavigationContainer>
    </NavigationIndependentTree>
    
  );
};
 
