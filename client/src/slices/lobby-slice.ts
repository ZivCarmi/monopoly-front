import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LobbyRoom } from "@ziv-carmi/monopoly-utils";

export interface LobbyState {
  lobbyRooms: LobbyRoom[];
}

const initialState: LobbyState = {
  lobbyRooms: [],
};

export const lobbySlice = createSlice({
  name: "lobby",
  initialState,
  reducers: {
    setLobbyRooms: (state, action: PayloadAction<LobbyRoom[]>) => {
      state.lobbyRooms = action.payload;
    },
  },
});

export const { setLobbyRooms } = lobbySlice.actions;

export default lobbySlice.reducer;
