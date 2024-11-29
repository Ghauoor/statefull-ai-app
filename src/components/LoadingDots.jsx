import {Animated, Easing, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';

const LoadingDots = () => {
  const [animatedValues] = useState(
    Array.from({length: 3}, () => new Animated.Value(0)),
  );

  const startAnimation = () => {
    Animated.loop(
      Animated.stagger(
        200,
        animatedValues.map(animatedValue =>
          Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }),
          ]),
        ),
      ),
    ).start();
  };

  useEffect(() => {
    startAnimation();
    return () => {
      animatedValues.forEach(animatedValue => animatedValue.stopAnimation());
    };
  }, []);

  return (
    <View style={styles.container}>
      {animatedValues.map((animatedValue, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              transform: [
                {
                  scale: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.5],
                  }),
                },
              ],
              // opacity: animatedValue,
            },
          ]}
        />
      ))}
    </View>
  );
};

export default LoadingDots;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    height: RFValue(20),
    width: RFValue(30),
  },
  dot: {
    width: RFValue(5),
    height: RFValue(5),
    borderRadius: RFValue(2.5),
    backgroundColor: 'grey',
  },
});
