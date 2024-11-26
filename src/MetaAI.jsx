import {ImageBackground, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import WABG from './assets/w_bg.png';
import CustomHeader from './components/CustomHeader';
import {useDispatch, useSelector} from 'react-redux';
import {
  addChat,
  clearAllChats,
  selectChats,
  selectCurrentChatId,
  setCurrentChat,
} from './redux/reducers/chatSlice';

const MetaAI = () => {
  const chat = useSelector(selectChats);
  const currentChatId = useSelector(selectCurrentChatId);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearAllChats());
  }, [dispatch]);

  console.log("I'm working Fine -->", chat, currentChatId);
  return (
    <ImageBackground source={WABG} style={styles.container} resizeMode="cover">
      <CustomHeader />
    </ImageBackground>
  );
};

export default MetaAI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
