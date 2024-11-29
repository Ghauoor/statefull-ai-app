import React, {useEffect, useRef} from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

import MetaAI from '../assets/logo_t.png';
import CustomText from './CustomText';

const aiQuestions = [
  "🤔 What's the meaning of life?",
  '🚀 Can you take me to space?',
  '🐶 Why do dogs love humans?',
  "🎨 What's the most popular color?",
  '🍕 Is pineapple on pizza okay?',
  "📚 What's the best book ever?",
  '💡 Any fun facts about AI?',
  '🌍 How old is the Earth?',
  '🎶 Who invented music?',
  "✨ What's a cool magic trick?",
  '🍫 Why do we love chocolate?',
  '🔥 How hot is the sun?',
  '🛸 Are aliens real?',
  '🕒 Why is time so mysterious?',
  "🌌 What's beyond the universe?",
  "🎥 What's your favorite movie?",
  '🐦 Why do birds sing?',
  '🎮 Can you play games?',
  '🌱 How do plants grow?',
  '🚗 Will cars fly someday?',
];

const ItemScroll = ({item}) => {
  return (
    <TouchableOpacity style={styles.touchableItem}>
      <Text style={styles.touchableText}>{item}</Text>
    </TouchableOpacity>
  );
};

const EmptyComponent = ({isTyping}) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotation]);
  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Animated.Image
          source={MetaAI}
          style={[
            styles.img,
            {
              transform: [{rotate}],
            },
          ]}
        />
      </View>
      <CustomText size={RFValue(15)}>Ask StateFull Ai any thing</CustomText>
      {!isTyping && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          centerContent={true}
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}>
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {aiQuestions?.slice(0, 7).map((item, index) => {
                return <ItemScroll item={item} key={index} />;
              })}
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {aiQuestions?.slice(7, 14).map((item, index) => {
                return <ItemScroll item={item} key={index} />;
              })}
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {aiQuestions?.slice(14, aiQuestions.length).map((item, index) => {
                return <ItemScroll item={item} key={index} />;
              })}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default EmptyComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: RFValue(100),
    height: RFValue(100),
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  scrollContainer: {
    maxHeight: RFValue(200),
    marginTop: 15,
  },
  scrollContent: {
    alignItems: 'center',
  },
  touchableText: {
    fontSize: RFValue(14),
    color: '#fff',
  },
  touchableItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 5,
    marginVertical: 12,
  },
});
