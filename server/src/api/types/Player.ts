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
  id: string;
  name: string;
  character: Characters;
  color: Colors;
};

type Player = NewPlayer & {
  money: number;
  tilePos: number;
  properties: number[];
  bankrupted: boolean;
  debtTo: string | null;
};

export default Player;
