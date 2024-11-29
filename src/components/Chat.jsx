import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import useKeyBoardOffsetHeight from '../helpers/useKeyBoardOffsetHeight';
import getMessageHeightOffset from '../helpers/getMessageHeightOffset';
import {FlashList} from '@shopify/flash-list';
import MessageBubble from './MessageBubble';
import EmptyComponent from './EmptyComponent';

const windowHeight = Dimensions.get('window').height;

const Chat = ({isTyping, messages, heightOfMessageBox}) => {
  const keyBoardOffsetHeight = useKeyBoardOffsetHeight();
  const renderMessageBubble = ({item}) => {
    return <MessageBubble message={item} />;
  };
  return (
    <View
      style={{
        height:
          windowHeight * 0.76 -
          keyBoardOffsetHeight * 0.95 -
          getMessageHeightOffset(heightOfMessageBox, windowHeight),
      }}>
      {messages?.length === 0 ? (
        <EmptyComponent isTyping={isTyping} />
      ) : (
        <FlashList
          indicatorStyle="black"
          data={[...messages].reverse()}
          inverted
          estimatedItemSize={40}
          renderItem={renderMessageBubble}
        />
      )}
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({});
