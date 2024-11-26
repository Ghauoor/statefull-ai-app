import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  chats: [],
  currentChatId: '',
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearAllChats: state => {
      state.chats = [];
      state.currentChatId = '';
    },
    addChat: (state, action) => {
      state.chats.push(action.payload);
    },
    setCurrentChat: (state, action) => {
      state.currentChatId = action.payload;
    },
  },
});

export const {addChat, setCurrentChat, clearAllChats} = chatSlice.actions;

export const selectChats = state => state.chat.chats;
export const selectCurrentChatId = state => state.chat.currentChatId;

export default chatSlice.reducer;
