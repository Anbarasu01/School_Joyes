import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { ProgressBar } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { Audio } from 'expo-av';
import AppData from './AppData';
import ApiService from './ApiService';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [showWebView, setShowWebView] = useState(false);
  const [role, setRole] = useState(null);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [isUrlValid, setIsUrlValid] = useState(true);
  const [submittedUrl, setSubmittedUrl] = useState('');
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [audioFileName, setAudioFileName] = useState('');
  const [currentPosition, setCurrentPosition] = useState(0); // Current position in ms
  const [duration, setDuration] = useState(0);
  const [playbackUpdateInterval, setPlaybackUpdateInterval] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleSelectAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*', // Allows selecting only audio files
        copyToCacheDirectory: false,
      });
  
      // Log the result to verify structure
      console.log('Selected File:', result);
  
      // Check if the selection was successful and assets array exists
      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        const selectedFile = result.assets[0]; // Access the first file in the assets array
        console.log('Audio File URI:', selectedFile.uri);
  
        // Post the audio file after selecting
        await postAudioFile(selectedFile);
      } else if (result.canceled) {
        // Handle if the user explicitly cancels the selection
        console.log('User canceled the selection.');
        Alert.alert('Cancelled', 'Audio selection was cancelled.');
      } else {
        // If any other case occurs
        Alert.alert('No file selected', 'No audio file was selected.');
      }
    } catch (error) {
      console.error('Error selecting audio file:', error);
      Alert.alert('Error', 'An error occurred while selecting the audio file.');
    }
  };
  
  // Function to post the selected audio file
  const postAudioFile = async (audioFile) => {
    try {
      setUploading(true); // Set uploading state to true when upload starts
      const response = await ApiService.postUploadAudio(audioFile, (progressEvent) => {
        // Calculate the percentage of file uploaded
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress / 100); // Set progress (value between 0 and 1 for ProgressBar)
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Audio uploaded successfully!');
        fetchLatestAudio();
      } else {
        Alert.alert('Upload Error', 'Failed to upload audio.');
      }
    } catch (error) {
      console.error('Error uploading audio file:', error);
      Alert.alert('Error', 'Failed to upload audio. Please try again.');
    } finally {
      setUploading(false); // Reset uploading state after upload completes
      setUploadProgress(0); // Reset progress bar
    }
  };
  
  // Fetch the latest audio file on component mount
  const fetchLatestAudio = async () => {
    try {
      const response = await ApiService.getLatestAudio();
      console.log("Response:", response); // Log the response for debugging
  
      // Access the fileUrl from the response data
      if (response && response.data && response.data.fileUrl) {
        const audioFileUrl = response.data.fileUrl;
        const audioFileName = response.data.filename;
        setAudioUrl(audioFileUrl);
        setAudioFileName(audioFileName);
      } else {
        Alert.alert('Error', 'No audio file found.');
      }
    } catch (error) {
      console.error('Error fetching latest audio:', error);
      Alert.alert('Error', 'Unable to fetch the latest audio file. Please try again.');
    }
  };

  const fetchVideoUrl = async () => {
    try {
      const response = await ApiService.getVideoUrl();
      if (response && response.data && response.data.videoUrl) {
        setVideoUrl(response.data.videoUrl);
        setSubmittedUrl(response.data.videoUrl);
        setShowWebView(true);
      }
    } catch (error) {
      console.error('Error fetching video URL:', error);
      Alert.alert('Error', 'Unable to fetch video URL. Please try again.');
    }
  };

  const handleVideoSubmit = async () => {
    // Regex to validate YouTube URLs
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    
    if (youtubeRegex.test(videoUrl)) {
      try {
        // Post the video URL to the server using the correct key
        await ApiService.postVideoUrl({ videoUrl }); // Use 'videoUrl' as the key
        setSubmittedUrl(videoUrl);
        setShowWebView(true);
        setShowVideoInput(false);
        setIsUrlValid(true);
        Alert.alert('Success','Video posted Successfully!');
        // Send a notification after successful video url posting
        const notificationTitle = "Video Posted Successfully";
        const notificationMessage = "Video posted Successfully please check in the Story of the day";
        const dateTime = new Date().toISOString();

        // Call sendNotification from ApiService
        await ApiService.sendNotification({
          title: notificationTitle,
          message: notificationMessage,
          dateTime: dateTime,
        });
        fetchVideoUrl();
      } catch (error) {
        console.error('Error posting video URL:', error.message || error);
        alert("Failed to post video URL. Please try again.");
        setIsUrlValid(false);
      }
    } else {
      alert("Please enter a valid YouTube URL.");
      setIsUrlValid(false);
    }
  };
  
  const getYoutubeEmbedUrl = (url) => {
    // Updated regex to match different YouTube URL formats
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/
    );
    
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return null;
  };

  // Function to play or pause audio
  const handleAudioPlayback = async (audioUrl) => {
    try {
      if (isPlaying) {
        await sound.pauseAsync(); // Pause if currently playing
        setIsPlaying(false);
      } else {
        if (sound) {
          // If sound is already loaded, just play it
          await sound.playAsync();
        } else {
          // Create a new sound object
          const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
          setSound(newSound);
          await newSound.playAsync();
          newSound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded) {
              setCurrentPosition(status.positionMillis);
              setDuration(status.durationMillis);
            }
          });
        }
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error in audio playback:", error);
      Alert.alert('Playback Error', 'An error occurred while playing audio.');
    }
  };

  // Update audio position based on slider
  const handleSliderValueChange = async (value) => {
    if (sound) {
      const newPosition = value * duration; // Convert to milliseconds
      await sound.setPositionAsync(newPosition);
      setCurrentPosition(newPosition);
    }
  };

  // Function to seek audio backward by 10 seconds
  const seekBackward = async () => {
    try {
      if (sound) {
        const { positionMillis } = await sound.getStatusAsync();
        const newPosition = Math.max(positionMillis - 10000, 0); 
        await sound.setPositionAsync(newPosition);
        setCurrentPosition(newPosition);
      }
    } catch (error) {
      console.error("Error seeking backward:", error);
      Alert.alert('Seek Error', 'An error occurred while seeking backward.');
    }
  };

  // Function to seek audio forward by 10 seconds
  const seekForward = async () => {
    try {
      if (sound) {
        const { positionMillis } = await sound.getStatusAsync();
        const { durationMillis } = await sound.getStatusAsync(); // Get the total duration
        const newPosition = Math.min(positionMillis + 10000, durationMillis);
        await sound.setPositionAsync(newPosition);
        setCurrentPosition(newPosition);
      }
    } catch (error) {
      console.error("Error seeking forward:", error);
      Alert.alert('Seek Error', 'An error occurred while seeking forward.');
    }
  };

  useEffect(() => {
    const userRole = AppData.getRole();
    setRole(userRole);
    fetchVideoUrl();
    fetchLatestAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (playbackUpdateInterval) {
        clearInterval(playbackUpdateInterval);
      }
    };
  }, [sound]);

  useEffect(() => {
    if (isPlaying && sound) {
      const interval = setInterval(async () => {
        const { positionMillis } = await sound.getStatusAsync();
        setCurrentPosition(positionMillis);
      }, 1000);
      setPlaybackUpdateInterval(interval);
    } else if (playbackUpdateInterval) {
      clearInterval(playbackUpdateInterval);
    }

    return () => clearInterval(playbackUpdateInterval);
  }, [isPlaying, sound]);
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.nameText}>JOLLY </Text>
            <Text style={styles.logoText}>JOEYS</Text>
          </View>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('Menu')}
          >
            <Image
              source={require('../assets/menu.png')}
              style={styles.menuIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Body Layout */}
        <ScrollView contentContainerStyle={styles.bodyLayout}>
          <View style={styles.section}>
            <Text style={styles.dailyActivitiesText}>Today's Activities</Text>
            <Text style={styles.dailyActivitiesSubtitle}>Details of daily activities</Text>
          </View>

          <TouchableOpacity
            style={styles.activityRow}
            onPress={() => {
              if (role === 'admin' || role === 'teacher') {
                navigation.navigate('CheckedInScreen');
              } else if (role === 'student') {
                navigation.navigate('StudentCheckedInScreen');
              }
            }}
          >
            <Image source={require('../assets/icon_attendance.png')} style={styles.circularImage} />
            <Text style={styles.activityText}>Checked In</Text>
          </TouchableOpacity>

          {role !== 'student' && (
            <TouchableOpacity style={styles.activityRow} onPress={() => navigation.navigate('JoeysDailyReportScreen')}>
              <Image source={require('../assets/checkedin.png')} style={styles.circularImage} />
              <View>
                <Text style={styles.activityText}>Joeys Daily Report</Text>
                <Text style={styles.activitySubtitle}>Learning Activities</Text>
              </View>
            </TouchableOpacity>
          )}

          {role === 'student' && (
            <TouchableOpacity style={styles.activityRow} onPress={() => navigation.navigate('StudentJoeysDailyReportScreen')}>
              <Image source={require('../assets/checkedin.png')} style={styles.circularImage} />
              <View>
                <Text style={styles.activityText}>Your Joeys Daily Report</Text>
                <Text style={styles.activitySubtitle}>Learning Activities</Text>
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.activityRow} 
            onPress={() => {
              if (role === 'admin' || role === 'teacher') {
                navigation.navigate('ChildObservationScreen');
              } else if (role === 'student') {
                navigation.navigate('StudentObsScreen');
              }
            }}>
            <Image source={require('../assets/icon_childobs.png')} style={styles.circularImageSmall} />
            <Text style={styles.activityText}>Child Observations</Text>
          </TouchableOpacity>

          {/* Song of the Day */}
          <View style={styles.songLayout}>
            <View style={styles.songRow}>
              <Image source={require('../assets/icon_song.png')} style={styles.songImage} />
              <Text style={styles.songText}>Song of the Day</Text>
              {(role === 'admin' || role === 'teacher') && (
                <TouchableOpacity onPress={handleSelectAudioFile}>
                  <Image source={require('../assets/icon_add.png')} style={styles.songButton} />
                </TouchableOpacity>
              )}
            </View>
            {uploading && (
              <View style={styles.uploadProgressContainer}>
                <Text style={styles.uploadProgressText}>Uploading... {Math.round(uploadProgress * 100)}%</Text>
                <ProgressBar progress={uploadProgress} color="#1B97BB" style={styles.uploadProgressBar} />
              </View>
            )}
            <Text style={styles.songName}>{audioFileName || 'No song selected'}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={duration ? currentPosition / duration : 0}
              onValueChange={handleSliderValueChange}
              minimumTrackTintColor='#1B97BB'
              maximumTrackTintColor='#1B97BB'
              thumbTintColor='#1B97BB' />
            <View style={styles.progressText}>
              <Text>{`${Math.floor(currentPosition / 60000)}:${((currentPosition % 60000) / 1000).toFixed(0).padStart(2, '0')}`}</Text>
              <Text>{`${Math.floor(duration / 60000)}:${((duration % 60000) / 1000).toFixed(0).padStart(2, '0')}`}</Text>
            </View>
            {/* Audio Player Controls */}
            <View style={styles.audioPlayer}>
              <TouchableOpacity onPress={seekBackward}>
                <Image source={require('../assets/previous.png')} style={styles.audioButton} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAudioPlayback(audioUrl)}>
                <Image source={isPlaying ? require('../assets/pause.png') : require('../assets/play.png')} style={styles.audioButton} />
              </TouchableOpacity>
              <TouchableOpacity onPress={seekForward}>
                <Image source={require('../assets/next.png')} style={styles.audioButton} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Story of the Day */}
          <View style={styles.storyLayout}>
            <View style={styles.storyRow}>
              <Image source={require('../assets/icon_song.png')} style={styles.storyImage} />
              <Text style={styles.storyText}>Story of the Day</Text>
            </View>

            {/* Show video URL input and buttons for admin and teacher only */}
            {(role === 'admin' || role === 'teacher') && (
              <>
                {!showVideoInput ? (
                  <TouchableOpacity style={styles.uploadButton} onPress={() => setShowVideoInput(true)}>
                    <Text style={styles.uploadButtonText}>Upload</Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TextInput
                      style={styles.videoUrlInput}
                      placeholder="Enter YouTube video URL"
                      value={videoUrl}
                      onChangeText={setVideoUrl}
                    />
                    {!isUrlValid && (
                      <Text style={styles.errorText}>Please enter a valid YouTube URL</Text>
                    )}
                    <TouchableOpacity style={styles.submitButton} onPress={handleVideoSubmit}>
                      <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}

             {/* WebView for displaying the embedded YouTube video */}
             {showWebView && submittedUrl && (
              <WebView
                source={{ uri: getYoutubeEmbedUrl(submittedUrl) }}
                style={styles.youtubeWebView}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                mixedContentMode="always"
                onError={() => {
                  setShowWebView(false);
                  Alert.alert('Error', 'Error loading video. Please try again.');
                }}
              />
              )}
          </View>
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
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
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
  bodyLayout: {
    paddingHorizontal: 15,
  },
  section: {
    marginVertical: 16,
  },
  dailyActivitiesText: {
    fontSize: 22,
    color: '#1B97BB',
    fontWeight: 'bold',
  },
  dailyActivitiesSubtitle: {
    fontSize: 12,
    color: '#1B97BB',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  circularImage: {
    width: 40,
    height: 40,
    marginEnd: 10,
    borderRadius: 30,
  },
  circularImageSmall: {
    width: 48,
    height: 48,
    marginEnd: 10,
    borderRadius: 24,
  },
  activityText: {
    fontSize: 18,
    color: '#1B97BB',
    fontWeight: 'bold',
    marginTop: 15,
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#1B97BB',
  },
  songLayout: {
    marginTop: 15,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  songImage: {
    width: 50,
    height: 50,
    marginEnd: 10,
  },
  songText: {
    fontSize: 18,
    color: '#1B97BB',
    fontWeight: 'bold',
    flex: 1,
  },
  songButton: {
    marginLeft: 'auto',
    width: 30,
    height: 30,
  },
  songName: {
    padding: 15,
    color: '#1B96BA',
    fontSize: 14,
  },
  audioPlayer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  audioButton: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
  },
  storyLayout: {
    marginTop: 20,
  },
  storyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storyImage: {
    width: 50,
    height: 50,
    marginEnd: 10,
  },
  storyText: {
    fontSize: 18,
    color: '#1B97BB',
    fontWeight: 'bold',
    flex: 1,
  },
  videoUrlInput: {
    borderColor: '#1B97BB',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#1B97BB',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#1B97BB',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  youtubeWebView: {
    marginTop: 20,
    width:'100%',
    height: 400,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  slider: {
    width: '100%',
    height: 25,
    marginVertical: 20,
  },
  progressText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
    paddingHorizontal: 10,
  },
  uploadProgressContainer: {
    width: '100%',
    marginVertical: 20,
  },
  uploadProgressText: {
    textAlign: 'center',
    backgroundColor: '#1B97BB',
    marginBottom: 10,
  },
  uploadProgressBar: {
    height: 10,
    borderRadius: 5,
    color: '#1B97BB',
  },
});

export default HomeScreen;