import Board, { IGo, IJail } from "./types/Board";

export const getGoTile = (board: Board) =>
  board.find((tile) => tile.type === "go") as IGo;

export const getJailTile = (board: Board) =>
  board.find((tile) => tile.type === "jail") as IJail | undefined;
