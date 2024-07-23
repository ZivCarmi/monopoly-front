import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LobbyRoom } from "@ziv-carmi/monopoly-utils";

export interface LobbyState {
  lobbyRooms: LobbyRoom[];
  nextUpdate: Date | null;
  isFetching: boolean;
  counter: number;
}

const initialState: LobbyState = {
  lobbyRooms: [],
  nextUpdate: null,
  isFetching: false,
  counter: 10,
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
    setCounter: (state, action: PayloadAction<number>) => {
      state.counter = action.payload;
    },
  },
});

export const { setLobbyRooms, setNextUpdate, setIsFetching, setCounter } =
  lobbySlice.actions;

export default lobbySlice.reducer;
