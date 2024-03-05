import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TSocketId = string | null;

export interface UserState {
  socketId: TSocketId;
}

const initialState: UserState = {
  socketId: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSocketId: (state, action: PayloadAction<TSocketId>) => {
      state.socketId = action.payload;
    },
  },
});

export const { setSocketId } = userSlice.actions;

export default userSlice.reducer;
