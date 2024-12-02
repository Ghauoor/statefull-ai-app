import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  chats: [],
  currentChatId: '',
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const {message, chatId} = action.payload;
      const chatIndex = state.chats.findIndex(chat => chat.id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].messages.push(message);
      }
    },
    clearAllChats: state => {
      state.chats = [];
      state.currentChatId = '';
    },
    changeCurrentChatId: (state, action) => {
      state.currentChatId = action.payload.chatId;
    },
    createNewChat: (state, action) => {
      const {chatId, messages, summary} = action.payload;
      state.chats.push({
        id: chatId,
        messages,
        summary,
      });
    },
    clearChat: (state, action) => {
      const chatIndex = state.chats.findIndex(
        chat => chat.id === action.payload.chatId,
      );
      if (chatIndex !== -1) {
        state.chats[chatIndex].messages = [];
      }
    },
    deletChat: (state, action) => {
      state.chats = state.chats.filter(
        chat => chat.id !== action.payload.chatId,
      );
    },
    markMessageAsRead: (state, action) => {
      const {chatId, messageId} = action.payload;
      const chat = state.chats.find(chat => chat.id === chatId);
      if (chat) {
        const messageIndex = chat.messages.findIndex(
          message => message.id === messageId,
        );
        if (messageIndex !== -1) {
          chat.messages[messageIndex].isMessageRead = true;
        }
      }
    },

    updateChatSummary: (state, action) => {
      const {chatId, messages, summary} = action.payload;
      const chatIndex = state.chats.findIndex(chat => chat.id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].summary = summary;
        if (messages) {
          state.chats[chatIndex].messages = messages;
        }
      }
    },
  },
});

export const {
  addMessage,
  clearAllChats,
  changeCurrentChatId,
  createNewChat,
  clearChat,
  deletChat,
  updateChatSummary,
  markMessageAsRead,
} = chatSlice.actions;

export const selectChats = state => state.chat.chats;
export const selectCurrentChatId = state => state.chat.currentChatId;

export default chatSlice.reducer;
