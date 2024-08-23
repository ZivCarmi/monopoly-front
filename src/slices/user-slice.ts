import { User } from "@/types/Auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  nickname: string;
  socketId: string;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  nickname: "",
  socketId: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.nickname = action.payload.name;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.nickname = "";
    },
    setNickname: (state, action: PayloadAction<string>) => {
      state.nickname = action.payload;
    },
    setSocketId: (state, action: PayloadAction<string>) => {
      state.socketId = action.payload;
    },
  },
});

export const { setUser, clearUser, setNickname, setSocketId } =
  userSlice.actions;

export default userSlice.reducer;
