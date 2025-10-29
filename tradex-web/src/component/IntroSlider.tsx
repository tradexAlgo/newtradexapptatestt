// IntroSlider.js
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { font } from '../common/Font';

const IntroSlider = ({ slides, onDone }) => {
    // Utility function to generate random light colors
const getRandomLightColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    // Ensure the color is light by using higher values for r, g, b
    return `rgba(${r}, ${g}, ${b}, 0.3)`;
  };
  const renderItem = ({ item }) => (
    <View style={[styles.slide, { backgroundColor:getRandomLightColor() }]}>
      <Image source={{ uri: item.introBanner}} style={styles.image} resizeMode='contain' />
      <Text style={styles.title}>{item.introTitle}</Text>
      <Text style={styles.text}>{item.introDescription}</Text>
      <Text style={styles.hashtags}>{item.introHashtags.join(' ')}</Text>
    </View>
  );

  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={slides}
      onDone={onDone}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').width * 0.5,
    marginBottom: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily:font.nunitobold
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily:font.nunitobold
  },
  hashtags: {
    fontSize: 14,
    textAlign: 'center',
    color: '#888',
  },
});

export default IntroSlider;
