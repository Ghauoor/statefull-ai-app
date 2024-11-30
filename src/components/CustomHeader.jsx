import React, {useState} from 'react';

import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Bars3BottomLeftIcon,
  CheckBadgeIcon,
} from 'react-native-heroicons/solid';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch} from 'react-redux';

import CustomText from './CustomText';
import MetaAILogo from '../assets/logo_s.jpeg';
import SideDrawer from './SideDrawer';
import {clearChat} from '../redux/reducers/chatSlice';

const CustomHeader = ({currentChatId, chats, setCurrentChatId}) => {
  const dispatch = useDispatch();
  const [visiable, setVisiable] = useState(false);
  const onClearChats = async () => {
    await dispatch(clearChat({chatId: currentChatId}));
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.subContainer}>
          <TouchableOpacity onPress={() => setVisiable(true)}>
            <Bars3BottomLeftIcon size={RFValue(25)} color="white" />
          </TouchableOpacity>
          {/* Image with Text */}
          <View style={styles.flexRow}>
            <Image source={MetaAILogo} style={styles.img} />
            <View>
              <CustomText fontWeight="bold">
                State AI <CheckBadgeIcon size={RFValue(15)} color="#27d366" />
              </CustomText>
              <CustomText fontWeight={500} opacity={0.7} size={12}>
                with Llama 3
              </CustomText>
            </View>
          </View>
          {/* Clear Button */}
          <TouchableOpacity onPress={onClearChats}>
            <CustomText size={RFValue(15)}>Clear</CustomText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {visiable && (
        <SideDrawer
          setCurrentChatId={id => setCurrentChatId(id)}
          chats={chats}
          currentChatId={currentChatId}
          visiable={visiable}
          onPressHide={() => setVisiable(false)}
        />
      )}
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
