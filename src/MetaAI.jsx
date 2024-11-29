import {ImageBackground, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import WABG from './assets/w_bg.png';
import CustomHeader from './components/CustomHeader';
import SendButton from './components/SendButton';
import {useDispatch, useSelector} from 'react-redux';
import {
  changeCurrentChatId,
  selectChats,
  selectCurrentChatId,
} from './redux/reducers/chatSlice';
import Chat from './components/Chat';

const MetaAI = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [heightOfMessageBox, setHeightOfMessageBox] = useState(0);
  const currentChatId = useSelector(selectCurrentChatId);
  const chats = useSelector(selectChats);
  const dispatch = useDispatch();

  const setCurrentChatId = id => {
    dispatch(changeCurrentChatId({chatId: id}));
  };

  return (
    <ImageBackground source={WABG} style={styles.container} resizeMode="cover">
      <CustomHeader
        chats={chats}
        currentChatId={currentChatId}
        setCurrentChatId={id => setCurrentChatId(id)}
      />
      <Chat
        isTyping={isTyping}
        heightOfMessageBox={heightOfMessageBox}
        messages={
          chats?.find(chat => chat.id === currentChatId)?.messages || []
        }
      />
      <SendButton
        isTyping={isTyping}
        setHeightOfMessageBox={setHeightOfMessageBox}
        heightOfMessageBox={heightOfMessageBox}
        setIsTyping={setIsTyping}
        currentChatId={currentChatId}
        setCurrentChatId={id => setCurrentChatId(id)}
        messages={
          chats?.find(chat => chat.id === currentChatId)?.messages || []
        }
        length={
          chats?.find(chat => chat.id === currentChatId)?.messages?.length || 0
        }
      />
    </ImageBackground>
  );
};

export default MetaAI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
