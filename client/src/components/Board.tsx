import styles from "./Board.module.css";
import Center from "./Center";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectGameBoard, selectPlayers } from "@/slices/game-slice";
import { setSelectedTile } from "@/slices/ui-slice";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { useEffect, useState } from "react";
import { GameTile } from "@backend/types/Board";
import Player from "@backend/types/Player";
import DrawnCardBox from "./DrawnCardBox";

type MappedPlayersByTiles = {
  [tileIndex: number]: Player[];
};

const Board = () => {
  const board = useAppSelector(selectGameBoard);
  const players = useAppSelector(selectPlayers);
  const { suspendedPlayers, drawnChanceCard, currentPlayerTurnId } =
    useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const [gameBoard, setGameBoard] = useState<GameTile[][]>([]);
  const [mappedPlayers, setMappedPlayers] = useState<MappedPlayersByTiles>({});
  const currentPlayerPosition = players.find(
    (player) => player.id === currentPlayerTurnId
  );

  useEffect(() => {
    const initialMap: MappedPlayersByTiles = {};

    players.map((player) => {
      if (initialMap[player.tilePos] === undefined) {
        initialMap[player.tilePos] = [player];
      } else {
        initialMap[player.tilePos] = [...initialMap[player.tilePos], player];
      }
    });

    setMappedPlayers(initialMap);
  }, [players]);

  // create board that contains 10 tiles in a each row
  useEffect(() => {
    const newBoard: GameTile[][] = [];

    for (let i = 0; i < board.length; i++) {
      if (i % 10 === 0) {
        newBoard.push([board[i]]);
      } else {
        newBoard[newBoard.length - 1].push(board[i]);
      }
    }

    setGameBoard(newBoard);
  }, [board]);

  return (
    <div className={styles.board}>
      <Center />
      {gameBoard.map((row, key) => (
        <ul
          className={`${styles.row}${
            key % 2 === 0 ? " " + styles.horizontal : ""
          }`}
          key={key}
        >
          <LayoutGroup>
            {row.map((tile, i) => {
              const isPurchasableTile =
                tile.type === "property" ||
                tile.type === "airport" ||
                tile.type === "company";

              return (
                <li key={tile.position} className="relative rtl text-right">
                  <AnimatePresence>
                    {tile.type === "chance" &&
                      drawnChanceCard &&
                      currentPlayerPosition &&
                      currentPlayerPosition.tilePos === tile.position && (
                        <DrawnCardBox>{drawnChanceCard.message}</DrawnCardBox>
                      )}
                  </AnimatePresence>
                  {tile.type === "jail" && (
                    <div className="absolute w-full h-full grid grid-cols-8">
                      {[...Array(8)].map((_, idx) => (
                        <span
                          className="border-r-2 border-l border-neutral-600"
                          key={idx}
                        />
                      ))}
                    </div>
                  )}
                  <button
                    className="w-full h-full flex gap-2"
                    onClick={() =>
                      dispatch(setSelectedTile(board[tile.position]))
                    }
                  >
                    {i !== 0 && (
                      <div
                        className="w-full h-full flex-[0_0_20%]"
                        style={{
                          backgroundColor:
                            tile.type === "property" ? tile.color : "",
                        }}
                      />
                    )}
                    <div
                      className={`w-full h-full grow flex justify-center ${styles.tileBody} relative`}
                    >
                      <div className="absolute text-sm">{tile.name}</div>
                    </div>
                    {isPurchasableTile && tile.owner && (
                      <div
                        className="w-full h-full flex-[0_0_20%]"
                        style={{
                          backgroundColor: players.find(
                            (player) => player.id === tile.owner
                          )?.color,
                        }}
                      />
                    )}
                  </button>
                  {mappedPlayers[tile.position]?.map((player, idx) => (
                    <button
                      key={player.character}
                      className={`w-8 h-8 rounded-full border border-neutral-400 p-[0.1rem] pointer-events-auto bg-black bg-opacity-75 absolute top-2${
                        suspendedPlayers[player.id] &&
                        suspendedPlayers[player.id].reason === "jail"
                          ? " z-[-1]"
                          : ""
                      }`}
                      style={{ left: `${0.5 + idx}rem` }}
                    >
                      <img src={`/${player.character}.png`} />
                    </button>
                  ))}
                </li>
              );
            })}
          </LayoutGroup>
        </ul>
      ))}
    </div>
  );
};

export default Board;
