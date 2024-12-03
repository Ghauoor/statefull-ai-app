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

import EventSource from 'react-native-sse';
import uuid from 'react-native-uuid';
import {PaperAirplaneIcon} from 'react-native-heroicons/solid';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';

import useKeyBoardOffsetHeight from '../helpers/useKeyBoardOffsetHeight';
import {
  addAssistantMessage,
  addMessage,
  createNewChat,
  markMessageAsRead,
  selectChats,
  selectCurrentChatId,
  updateAssistantMessage,
  updateChatSummary,
} from '../redux/reducers/chatSlice';
import {
  HUGGING_API_KEY,
  HUGGING_API_URL,
  STABLE_DIFFUSION_API_KEY,
  STABLE_DIFFUSION_API_URL,
} from '../redux/API';
import axios from 'axios';

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

  const identifyImageApi = prompt => {
    const imageRegex = /\(generate\s*image\)|imagine\b/i;

    if (imageRegex.test(prompt)) {
      return true;
    }
    return false;
  };

  const fetchResponse = async (mes, selectedChatId) => {
    let id = length + 2;
    dispatch(
      addAssistantMessage({
        chatId: selectedChatId,
        message: {
          content: '...',
          time: mes.time,
          role: 'assistant',
          id: id,
        },
      }),
    );

    const eventSource = new EventSource(HUGGING_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HUGGING_API_KEY}`,
        'Content-Type': 'application/json',
      },
      pollingInterval: 0,
      body: JSON.stringify({
        model: 'meta-llama/Meta-Llama-3-8B-Instruct',
        messages: [...messages, mes],
        max_tokens: 500,
        n: 1,
        temperature: 0.7,
        stream: true,
      }),
    });

    let content = '';
    let responseCompleted = false;

    eventSource.addEventListener('message', async event => {
      if (event.data !== '[DONE]') {
        try {
          const parsedData = JSON.parse(event.data);
          if (parsedData.choices && parsedData.choices.length > 0) {
            const delta = parsedData.choices[0].delta.content;
            if (delta) {
              content += delta;
              await dispatch(
                updateAssistantMessage({
                  chatId: selectedChatId,
                  messageId: id,
                  message: {
                    content: content,
                    time: new Date().toString(),
                    role: 'assistant',
                    id: id,
                  },
                }),
              );
            }
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      } else {
        responseCompleted = true;
        eventSource.close();
      }
    });

    eventSource.addEventListener('error', async error => {
      console.log(error?.message);
      await dispatch(
        updateAssistantMessage({
          chatId: selectedChatId,
          messageId: id,
          message: {
            content: 'OOPSSS....',
            time: new Date().toString(),
            role: 'assistant',
            id: id,
          },
        }),
      );

      eventSource.close();
    });

    eventSource.addEventListener('close', () => {
      if (!responseCompleted) {
        console.warn('Response not completed but connection closed.');
      }
      eventSource.close();
    });

    return () => {
      eventSource.removeAllEventListeners();
      eventSource.close();
    };
  };

  const generateImage = async (mes, selectedChatId) => {
    let id = length + 2;
    dispatch(
      addAssistantMessage({
        chatId: selectedChatId,
        message: {
          content: '...',
          time: mes.time,
          role: 'assistant',
          id: id,
        },
      }),
    );

    try {
      const res = await axios.post(
        STABLE_DIFFUSION_API_URL,
        {
          key: STABLE_DIFFUSION_API_KEY,
          prompt: message,

          width: '512',
          height: '512',
          safety_checker: false,
          seed: null,
          sample: 1,
          base64: false,
          track_id: null,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },

        await dispatch(
          updateAssistantMessage({
            chatId: selectedChatId,
            messageId: id,
            message: {
              content: res?.data?.output[0],
              imageUri: res?.data?.output[0],
              time: new Date().toString(),
              role: 'assistant',
              id: id,
            },
          }),
        ),
      );
    } catch (error) {
      console.log('Error in generating image: ', error?.message);
      await dispatch(
        updateAssistantMessage({
          chatId: selectedChatId,
          messageId: id,
          message: {
            content: 'OOPSSS....',
            time: new Date().toString(),
            role: 'assistant',
            id: id,
          },
        }),
      );
    }
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
    TextInputRef.current.blur();
    setIsTyping(false);

    let promptForAssistant = {
      content: message,
      time: new Date().toString(),
      role: 'user',
      id: length + 1,
    };

    if (!identifyImageApi(message?.trim())) {
      fetchResponse(promptForAssistant, selectedChatId);
    } else {
      generateImage(promptForAssistant, selectedChatId);
    }

    dispatch(
      markMessageAsRead({chatId: selectedChatId, messageId: length + 1}),
    );
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
