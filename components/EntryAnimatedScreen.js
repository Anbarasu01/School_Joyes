import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const EntryAnimation = () => {
  const navigation = useNavigation();
  const fullText = [..."Jolly", " ", ..."Joeys"]; // Combined text with space
  const [caption, setCaption] = useState('Learning');
  const animationCount = useSharedValue(0); // Track animation repetitions

  const captionOpacity = useSharedValue(0);
  const captionScale = useSharedValue(0.8);

  // Shared values for letter animations
  const letterAnimations = fullText.map(() => ({
    translateY: useSharedValue(-150),
    opacity: useSharedValue(0),
    scale: useSharedValue(0.5),
  }));

  useEffect(() => {
    const timeout = setTimeout(() => {
      startAnimation();
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const startAnimation = () => {
    fullText.forEach((_, index) => {
      setTimeout(() => {
        animateLetter(letterAnimations[index]);

        if (index === fullText.length - 1) {
          setTimeout(() => {
            if (animationCount.value < 1) {
              animationCount.value += 1;
              startAnimation();
            } else {
              showCaptionAnimation(); // Show caption with animation
              setTimeout(() => setCaption('Growing'), 1000);

              setTimeout(() => navigation.navigate('HomeScreen'), 3000); // Navigate after 2nd animation
            }
          }, 300);
        }
      }, index * 150);
    });
  };

  const animateLetter = (animation) => {
    animation.translateY.value = withSpring(0, { damping: 10, stiffness: 100 });
    animation.opacity.value = withTiming(1, { duration: 300 });
    animation.scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.exp) });
  };

  const showCaptionAnimation = () => {
    captionOpacity.value = withTiming(1, { duration: 600 });
    captionScale.value = withSpring(1, { damping: 8, stiffness: 90 });
  };

  const animatedStyles = letterAnimations.map((anim) =>
    useAnimatedStyle(() => ({
      transform: [{ translateY: anim.translateY.value }, { scale: anim.scale.value }],
      opacity: anim.opacity.value,
    }))
  );

  const captionStyle = useAnimatedStyle(() => ({
    opacity: captionOpacity.value,
    transform: [{ scale: captionScale.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {fullText.map((letter, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.letter,
              animatedStyles[index],
              letter === ' ' ? styles.space : index < 5 ? styles.jolly : styles.joeys,
            ]}
          >
            {letter}
          </Animated.Text>
        ))}
      </View>

      <Animated.Text style={[styles.captionText, captionStyle]}>
        Let's begin our journey of {caption}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FBFB34',
    },
    textContainer: {
      flexDirection: 'row',
      marginBottom: 5, // Reduced from 10 to 5
    },
    letter: {
      fontSize: 48,
      fontWeight: 'bold',
      marginHorizontal: 2,
    },
    jolly: {
      color: '#F2ADC0',
    },
    joeys: {
      color: '#1B97BB',
    },
    space: {
      width: 10,
    },
    captionText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#333',
      marginTop: 10, // Reduced from 30 to 10
    },
  });
  
export default EntryAnimation;