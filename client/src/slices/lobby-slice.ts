import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Room } from "@backend/types/Room";

export interface LobbyState {
  lobbyRooms: Room[];
}

const initialState: LobbyState = {
  lobbyRooms: [],
};

export const lobbySlice = createSlice({
  name: "lobby",
  initialState,
  reducers: {
    setLobbyRooms: (state, action: PayloadAction<Room[]>) => {
      state.lobbyRooms = action.payload;
    },
  },
});

export const { setLobbyRooms } = lobbySlice.actions;

export default lobbySlice.reducer;
