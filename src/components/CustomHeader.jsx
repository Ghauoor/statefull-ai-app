import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  Bars3BottomLeftIcon,
  CheckBadgeIcon,
} from 'react-native-heroicons/solid';
import {RFValue} from 'react-native-responsive-fontsize';
import MetaAILogo from '../assets/logo_s.jpeg';
import CustomText from './CustomText';

const CustomHeader = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.subContainer}>
          <TouchableOpacity>
            <Bars3BottomLeftIcon size={RFValue(25)} color="white" />
          </TouchableOpacity>
          {/* Image with Text */}
          <View style={styles.flexRow}>
            <Image source={MetaAILogo} style={styles.img} />
            <View>
              <CustomText fontWeight="bold">
                Meta AI <CheckBadgeIcon size={RFValue(15)} color="#27d366" />
              </CustomText>
              <CustomText fontWeight={500} opacity={0.7} size={12}>
                with Llama 3
              </CustomText>
            </View>
          </View>
          {/* Clear Button */}
          <TouchableOpacity>
            <CustomText size={RFValue(15)}>Clear</CustomText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'rgba(20,25,46,1)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(62,62,63,1)',
  },
  subContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  img: {
    width: 38,
    height: 38,
    borderRadius: 40,
  },
  flexRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
});
