import React from 'react';

import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import Modal from 'react-native-modal';
import uuid from 'react-native-uuid';
import {RFValue} from 'react-native-responsive-fontsize';
import {TrashIcon} from 'react-native-heroicons/solid';
import {XCircleIcon} from 'react-native-heroicons/outline';
import {useDispatch} from 'react-redux';

import CustomText from './CustomText';
import {
  clearAllChats,
  createNewChat,
  deletChat,
} from '../redux/reducers/chatSlice';

const SideDrawer = ({
  setCurrentChatId,
  chats,
  onPressHide,
  visiable,
  currentChatId,
}) => {
  const dispatch = useDispatch();

  const renderChats = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setCurrentChatId(item.id);
          onPressHide();
        }}
        style={[
          styles.chatBtn,
          {
            backgroundColor: currentChatId === item.id ? '#041e49' : '#131314',
          },
        ]}>
        <CustomText
          fontWeight="500"
          numberOfLines={1}
          style={{width: '70%', fontSize: RFValue(11)}}>
          {item?.summary}
        </CustomText>
        <TouchableOpacity
          onPress={() => deletAChat(item.id)}
          style={styles.trashIcon}>
          <TrashIcon size={RFValue(12)} color="#ef4444" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const handleClearAllChats = () => {
    dispatch(clearAllChats());
    onPressHide();
  };
  const deletAChat = id => {
    dispatch(deletChat({chatId: id}));
    onPressHide();
  };

  const addNewChat = () => {
    dispatch(
      createNewChat({
        chatId: uuid.v4(),
        messages: [],
        summary: 'The is new Summary',
      }),
    );
  };
  return (
    <Modal
      isVisible={visiable}
      style={styles.bottomModalView}
      backdropColor="#000"
      backdropOpacity={0.5}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      onBackdropPress={onPressHide}
      onBackButtonPress={onPressHide}>
      <SafeAreaView>
        <View style={styles.modalContainer}>
          <View style={{height: '100%', width: '100%'}}>
            <View style={styles.header}>
              <View style={styles.flexRow}>
                <Image
                  source={require('../assets/logo_t.png')}
                  style={{width: 40, height: 40}}
                />
                <CustomText size={RFValue(20)} opacity={0.8} fontWeight="600">
                  All Chats
                </CustomText>
              </View>
              <TouchableOpacity onPress={onPressHide}>
                <XCircleIcon color="#ccc" size={RFValue(17)} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.newChat} onPress={addNewChat}>
              <CustomText size={RFValue(10)}>+ Add New Chat</CustomText>
            </TouchableOpacity>
            <CustomText style={{margin: 10, fontSize: RFValue(13)}}>
              Recent
            </CustomText>
            {/* Render the list of chats */}
            <View style={{height: '60%'}}>
              <FlatList
                data={[...chats].reverse()}
                renderItem={renderChats}
                key={item => item.id}
                keyExtractor={item => item.id}
                contentContainerStyle={{
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                }}
              />
            </View>
            <TouchableOpacity
              style={styles.clearAllChats}
              onPress={handleClearAllChats}>
              <CustomText fontWeight="800" style={{fontSize: RFValue(14)}}>
                Clear All Chats
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default SideDrawer;

const styles = StyleSheet.create({
  bottomModalView: {
    justifyContent: 'flex-start',
    width: '70%',
    height: '100%',
    margin: 10,
  },
  modalContainer: {
    backgroundColor: '#171717',
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: 'grey',
  },

  newChat: {
    backgroundColor: '#272a2c',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    width: '60%',
    margin: 10,
    alignSelf: 'center',
  },
  clearAllChats: {
    backgroundColor: '#ef4444',
    padding: 13,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  chatBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  trashIcon: {
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 20,
  },
});
