import { User } from "@/types/Auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  nickname: string;
  userId: string;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  nickname: "",
  userId: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    setNickname: (state, action: PayloadAction<string>) => {
      state.nickname = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
  },
});

export const { setUser, clearUser, setNickname, setUserId } = userSlice.actions;

export default userSlice.reducer;
