import React, {useEffect, useRef, useState} from 'react';

import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  TextInput,
  Animated,
  TouchableOpacity,
} from 'react-native';

import uuid from 'react-native-uuid';
import {PaperAirplaneIcon} from 'react-native-heroicons/solid';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';

import useKeyBoardOffsetHeight from '../helpers/useKeyBoardOffsetHeight';
import {
  addMessage,
  createNewChat,
  selectChats,
  selectCurrentChatId,
  updateChatSummary,
} from '../redux/reducers/chatSlice';

const windowHeight = Dimensions.get('window').height;

const SendButton = ({
  isTyping,
  setIsTyping,
  setHeightOfMessageBox,
  heightOfMessageBox,
  setCurrentChatId,
  messages,
  length,
}) => {
  const dispatch = useDispatch();
  const chats = useSelector(selectChats);
  const currentChatId = useSelector(selectCurrentChatId);
  const animationValue = useRef(new Animated.Value(0)).current;

  const [message, setMessage] = useState('');
  const TextInputRef = useRef(null);
  const keyBoardOffsetHeight = useKeyBoardOffsetHeight();

  const handleTextChange = text => {
    setIsTyping(!!text);
    setMessage(text);
  };

  const handleContentSizeChange = event => {
    setHeightOfMessageBox(event.nativeEvent.contentSize.height);
  };

  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: isTyping ? 1 : 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [isTyping]);

  const sendButtonStyle = {
    opacity: animationValue,
    transform: [
      {
        scale: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1],
        }),
      },
    ],
  };

  const addChat = async newId => {
    let selectedChatId = newId ? newId : currentChatId;
    if (length === 0 && message.trim().length > 0) {
      await dispatch(
        updateChatSummary({
          chatId: selectedChatId,
          summary: message.trim().slice(0, 40),
        }),
      );
    }
    await dispatch(
      addMessage({
        chatId: selectedChatId,
        message: {
          content: message,
          time: new Date().toString(),
          role: 'user',
          id: length + 1,
          isMessageRead: false,
        },
      }),
    );
    setMessage('');
    setIsTyping(false);
    TextInputRef.current.blur();
  };

  const handleSendMessage = async () => {
    const chatIndex = chats.findIndex(chat => chat.id === currentChatId);

    if (chatIndex === -1) {
      const newId = uuid.v4();
      await dispatch(
        createNewChat({
          chatId: newId,
          messages: [],
          summary: 'The is new Summary',
        }),
      );

      setCurrentChatId(newId);
      await addChat(newId);
    } else {
      await addChat();
    }
  };

  console.log('Messages --->', JSON.stringify(chats));

  return (
    <View
      style={[
        styles.container,
        {
          bottom:
            Platform.OS === 'android'
              ? windowHeight * 0.02
              : Math.max(keyBoardOffsetHeight, windowHeight * 0.02),
        },
      ]}>
      <View style={styles.subContainer}>
        <View
          style={[styles.inputContainer, {width: isTyping ? '85%' : '100%'}]}>
          <TextInput
            editable
            multiline
            style={styles.textInput}
            placeholder="Enter your Prompt"
            onChangeText={handleTextChange}
            onContentSizeChange={handleContentSizeChange}
            value={message}
            ref={TextInputRef}
          />
        </View>
        {isTyping && (
          <Animated.View style={[styles.sendButtonWrapper, sendButtonStyle]}>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}>
              <PaperAirplaneIcon size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

export default SendButton;

const styles = StyleSheet.create({
  container: {
    minHeight: windowHeight * 0.06,
    maxHeight: windowHeight * 0.4,
    paddingHorizontal: '1%',
    padding: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    width: '98%',
    alignContent: 'center',
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row',
  },

  inputContainer: {
    maxHeight: windowHeight * 0.2,
    backgroundColor: '#232626',
    margin: '1%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '1%',
    borderRadius: 20,
  },

  textInput: {
    width: '98%',
    padding: 10,
    marginHorizontal: '2%',
    fontSize: RFValue(13),
    color: 'white',
  },
  sendButtonWrapper: {
    position: 'absolute',
    right: 5,
    bottom: 10,

    width: '11%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#22c063',
    borderRadius: 42,
    height: 42,
    width: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
