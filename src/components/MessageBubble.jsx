import React from 'react';

import {Image, StyleSheet, Text, View} from 'react-native';

import MarkdownDisplay from 'react-native-markdown-display';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

import LoadingDots from './LoadingDots';
import TickIcon from '../assets/tick.png';

const MessageBubble = ({message}) => {
  const isMyMessage = message?.role === 'user';
  const isMessageRead = message?.isMessageRead;

  return (
    <View
      style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessage : styles.otherMessage,
      ]}>
      {message?.isLoading ? (
        <LoadingDots />
      ) : message?.imageUri ? (
        <Image source={{uri: message?.imageUri}} style={styles.messageImage} />
      ) : (
        <MarkdownDisplay
          style={{
            body: {...styles.messageText},
            link: {
              color: '#34B7F1',
              textDecorationLine: 'underline',
            },
            blockquote: {
              backgroundColor: '#F1F0F0',
              color: '#1e0f5e',
            },
            table: {
              borderColor: '#145240',
            },
            code_inline: {
              backgroundColor: '#1d211e',
              color: '#f1f0f0',
            },
            fense: {
              backgroundColor: '#1d211e',
              color: '#f1f0f0',
              borderWidth: 0,
            },
            tr: {
              borderColor: '#145240',
            },
          }}>
          {message?.content}
        </MarkdownDisplay>
      )}
      <View style={styles.footerContainer}>
        <Text style={styles.messageTime}>
          {new Date(message?.time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>

        {isMyMessage && (
          <Image
            source={TickIcon}
            style={styles.tickIcon}
            tintColor={isMessageRead ? '#34B7F1' : '#888'}
          />
        )}
      </View>
    </View>
  );
};

export default MessageBubble;

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 8,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderTopRightRadius: 0,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F0F0',
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: RFValue(15),
    color: '#000',
    lineHeight: RFValue(20),
  },
  messageTime: {
    fontSize: RFValue(11),
    color: '#888',
    alignSelf: 'flex-start',
    marginRight: 2,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tickIcon: {
    width: 18,
    height: 18,
    marginLeft: 5,
  },
  rightMessageArrow: {
    height: 0,
    position: 'absolute',
    width: 0,
    borderRadius: 10,
    borderRightColor: 'transparent',
    borderTopColor: '#154d37',
    borderTopWidth: 10,
    alignSelf: 'flex-start',
    right: -8,
    top: 0,
  },
  messageImage: {
    height: RFPercentage(25),
    width: RFPercentage(20),
    aspectRatio: 4 / 4,
    borderRadius: 10,
    left: -5,
    resizeMode: 'cover',
  },
});
