import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LobbyRoom } from "@ziv-carmi/monopoly-utils";

export interface LobbyState {
  lobbyRooms: LobbyRoom[];
  nextUpdate: Date | null;
  isFetching: boolean;
}

const initialState: LobbyState = {
  lobbyRooms: [],
  nextUpdate: null,
  isFetching: false,
};

export const lobbySlice = createSlice({
  name: "lobby",
  initialState,
  reducers: {
    setLobbyRooms: (state, action: PayloadAction<LobbyRoom[]>) => {
      state.lobbyRooms = action.payload;
    },
    setNextUpdate: (state, action: PayloadAction<Date>) => {
      state.nextUpdate = action.payload;
    },
    setIsFetching: (state, action: PayloadAction<boolean>) => {
      state.isFetching = action.payload;
    },
  },
});

export const { setLobbyRooms, setNextUpdate, setIsFetching } =
  lobbySlice.actions;

export default lobbySlice.reducer;
