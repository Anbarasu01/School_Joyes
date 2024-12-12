import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, FlatList, Button, Dimensions } from 'react-native';
import RNPickerSelect from 'react-native-picker-select'; 
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import ApiService from './ApiService';
import Modal from 'react-native-modal'; 
import * as FileSystem from 'expo-file-system';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const MediaScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('daily');
  const [filteredCategory, setFilteredCategory] = useState('daily');
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [numColumns, setNumColumns] = useState(2);
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const categories = ["daily", "event", "activity"];

  useEffect(() => {
    const getPermission = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
      }
    };

    getPermission();
  }, []);

  const pickImagesAndUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        allowsMultipleSelection: true, // Allow multiple selections
    });

    if (result.assets && result.assets.length > 0) {
        const uris = result.assets.map(asset => asset.uri); // Get URIs of selected images
        setSelectedPhotos(uris);

        // Create an array of promises for all uploads
        const uploadPromises = uris.map(uri => handleUpload(uri, selectedCategory));
        
        try {
            // Wait for all uploads to complete
            await Promise.all(uploadPromises);
            alert("All photos uploaded successfully!"); // Show success after all uploads
        } catch (error) {
            console.error("Error uploading photos:", error);
            alert("Failed to upload some photos.");
        }
    }
};

  const handleUpload = async (uri, category) => {
    if (!uri || !category) {
      alert("Please select a photo and category before uploading.");
      return;
    }

    try {
      setUploading(true);
      const photoFile = {
        uri: uri,
        type: 'image/jpeg', 
        name: 'photo.jpg',
      };

      await ApiService.uploadPhoto(photoFile, category);
      
      fetchPhotos(filteredCategory);
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  const fetchPhotos = async (category) => {
    try {
      const response = await ApiService.getPhotos(category);
      const photosWithBase64 = response.data.map(photo => ({
        _id: photo._id,
        url: `data:image/jpeg;base64,${photo.imageData}`,
      }));
      setPhotos(photosWithBase64);
    } catch (error) {
      console.error("Error fetching photos:", error);
      alert("Failed to fetch photos.");
    }
  };

  useEffect(() => {
    fetchPhotos(filteredCategory);
  }, [filteredCategory]);

  const handleImageClick = (photoUrl) => {
    setSelectedPhoto(photoUrl); // Set the clicked image URL
    setIsModalVisible(true);
  };

  const saveImageToGallery = async () => {
    if (!selectedPhoto) {
      alert("No photo selected to save!");
      return;
    }
  
    try {
      if (selectedPhoto.startsWith('data:image')) {
        // If the photo is base64 encoded
        const base64Code = selectedPhoto.split('base64,')[1];
        const fileUri = `${FileSystem.cacheDirectory}photo.jpg`; // You may want to generate unique names here
        await FileSystem.writeAsStringAsync(fileUri, base64Code, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        if (asset) {
          alert("Image saved to gallery!");
        }
      } else {
        // If the photo is a URI
        const asset = await MediaLibrary.createAssetAsync(selectedPhoto);
        if (asset) {
          alert("Image saved to gallery!");
        }
      }
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Failed to save image.");
    }
  };
  
  // Usage in the Modal
  <TouchableOpacity style={styles.saveButton} onPress={saveImageToGallery}>
    <Text style={styles.saveButtonText}>Save Image</Text>
  </TouchableOpacity>
  

  return (
    <SafeAreaView style={styles.container}>
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

      <FlatList
        key={numColumns}  
        ListHeaderComponent={(
          <>
            <Text style={styles.photoManagerTitle}>MEDIA</Text>
            <Text style={styles.categoryLabel}>Select Category</Text>
            <RNPickerSelect
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              items={categories.map((category) => ({ label: category, value: category }))} 
              style={pickerSelectStyles}
              value={selectedCategory}
            />
            
            <TouchableOpacity 
              style={styles.uploadButton} 
              onPress={pickImagesAndUpload} // Update the function here
              disabled={uploading}
            >
              <Text style={styles.uploadButtonText}>
                {uploading ? "Uploading..." : "Select Images to Upload"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.uploadsTitle}>Uploaded Media</Text>
            <Text style={styles.categoryLabel}>Filter by Category</Text>
            <RNPickerSelect
              onValueChange={(itemValue) => setFilteredCategory(itemValue)}
              items={categories.map((category) => ({ label: category, value: category }))} 
              style={pickerSelectStyles}
              value={filteredCategory}
            />

            <Text style={styles.categoryLabel}>Select Number of Columns</Text>
            <RNPickerSelect
              onValueChange={(itemValue) => setNumColumns(itemValue)}
              items={[
                { label: '2 Columns', value: 2 },
                { label: '3 Columns', value: 3 },
                { label: '4 Columns', value: 4 },
              ]}
              style={pickerSelectStyles}
              value={numColumns}
            />
          </>
        )}
        data={photos}
        keyExtractor={(item) => item._id}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleImageClick(item.url)}>
            <View style={[styles.photoContainer, { width: (width - 40) / numColumns }]} >
              <Image source={{ uri: item.url }} style={styles.photo} />
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Full Screen Image Modal */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)} style={styles.fullscreenModal}>
        <View style={styles.modalContent}>
          {selectedPhoto && ( // Check if selectedPhoto is not null
            <Image source={{ uri: selectedPhoto }} style={styles.enlargedPhoto} />
          )}
          <TouchableOpacity style={styles.saveButton} onPress={saveImageToGallery}>
            <Text style={styles.saveButtonText}>Save Image</Text>
          </TouchableOpacity>
         
          {/* New Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => setIsModalVisible(false)}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  photoManagerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  categoryLabel: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 10,
  },
  uploadButton: {
    backgroundColor: '#006D77',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  uploadsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  photoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  photo: {
    width: '100%',
    height: height * 0.15, // Set height as 15% of screen height
    borderRadius: 10,
  },
  fullscreenModal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  enlargedPhoto: {
    width: '100%',
    height: height * 0.5, // Set height as 50% of screen height
    borderRadius: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#006D77',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#E63946',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 4,
    color: 'black',
    marginVertical: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 4,
    color: 'black',
    marginVertical: 10,
  },
});

export default MediaScreen;