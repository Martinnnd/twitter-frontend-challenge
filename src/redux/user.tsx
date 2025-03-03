import {createSlice} from "@reduxjs/toolkit";
import {LIMIT} from "../util/Constants";
import {ChatDTO, Post, User} from "../service";

type InitalStateType = {
  feed: Post[];
  query: string;
  length: number;
  currentChat?: ChatDTO;
  user?: User;
};

const initialState: InitalStateType = {
  feed: [],
  length: LIMIT,
  query: "",
  user: undefined
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateFeed: (state, action) => {
      state.feed = action.payload;
    },
    setLength: (state, action) => {
      state.length = action.payload;
    },
    setQuery: (state, action) => {
      state.query = action.payload;
    },

    setChat: (state, action) => {
      state.currentChat = action.payload;
    },

    addMessage: (state, action) => {
      if (state.currentChat) {
        state.currentChat.messages.push(action.payload);
      }
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.user = undefined;
      localStorage.removeItem("token");
    }
  },
});

export const {updateFeed, setLength, setQuery, setChat, addMessage, setUser, logout} =
    userSlice.actions;

export default userSlice.reducer;
