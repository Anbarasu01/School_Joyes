import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const PasswordRequirement = ({ met, text }) => {
  return (
    <View style={styles.requirementRow}>
      <Image
        source={met ? require('../assets/ic_right.png') : require('../assets/ic_wrong.png')}
        style={styles.requirementIcon}
      />
      <Text style={styles.requirementText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementIcon: {
    width: 24,
    height: 24,
  },
  requirementText: {
    marginLeft: 8,
  },
});

export default PasswordRequirement;
