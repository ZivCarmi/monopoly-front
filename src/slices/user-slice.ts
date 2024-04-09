import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  userId: string;
}

const initialState: UserState = {
  userId: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
  },
});

export const { setUserId } = userSlice.actions;

export default userSlice.reducer;
