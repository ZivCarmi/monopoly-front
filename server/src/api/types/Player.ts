export enum Characters {
  Genji = "genji",
  Hanzo = "hanzo",
  Mercy = "mercy",
  Pharha = "pharha",
  Reaper = "reaper",
  Reinhardt = "reinhardt",
}

export enum Colors {
  Orange = "orange",
  Blue = "blue",
  Red = "red",
  Yellow = "yellow",
  Gray = "gray",
  Green = "green",
  Pink = "pink",
}

export type NewPlayer = {
  name: string;
  character: Characters;
  color: Colors;
};

type Player = NewPlayer & {
  id: string;
  money: number;
  tilePos: number;
  bankrupted: boolean;
  debtTo: string | null;
};

export default Player;
