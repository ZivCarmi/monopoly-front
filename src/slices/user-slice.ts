import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  nickname: string;
  userId: string;
}

const initialState: UserState = {
  nickname: "",
  userId: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setNickname: (state, action: PayloadAction<string>) => {
      state.nickname = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
  },
});

export const { setNickname, setUserId } = userSlice.actions;

export default userSlice.reducer;
