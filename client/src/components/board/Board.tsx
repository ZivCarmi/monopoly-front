import styles from "./Board.module.css";
import Center from "../board-center/Center";
import { useAppSelector } from "@/app/hooks";
import { selectGameBoard, selectPlayers } from "@/slices/game-slice";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { useEffect, useState } from "react";
import {
  GameTile,
  isCard,
  isCorner,
  isJail,
  isPurchasable,
} from "@backend/types/Board";
import Player from "@backend/types/Player";
import DrawnCardBox from "../DrawnCardBox";
import { useSocket } from "@/app/socket-context";
import { cn } from "@/utils";
import PurchasableTile from "./PurchasableTile";
import Tile from "./Tile";
import CornerTile from "./CornerTile";
import { isPlayerInJail } from "../../utils";

const rowTypes: any = {
  0: "top",
  1: "right",
  2: "bottom",
  3: "left",
};

type MappedPlayersByTiles = {
  [tileIndex: number]: Player[];
};

const Board = () => {
  const { socket } = useSocket();
  const board = useAppSelector(selectGameBoard);
  const players = useAppSelector(selectPlayers);
  const { drawnGameCard, landedTileIndexInTurn, currentPlayerTurnId } =
    useAppSelector((state) => state.game);
  const [gameBoard, setGameBoard] = useState<GameTile[][]>([]);
  const [mappedPlayers, setMappedPlayers] = useState<MappedPlayersByTiles>({});

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
      {gameBoard.map((row, rowIndex) => {
        const rowClassname = rowTypes[rowIndex];

        return (
          <ul
            key={rowIndex}
            className={cn(styles.row, "row", `row_${rowClassname}`)}
          >
            <LayoutGroup>
              {row.map((tile, rowTileIndex) => {
                const tileIndex = 10 * rowIndex + rowTileIndex;

                return (
                  <li key={tileIndex} className="relative rtl text-right">
                    <AnimatePresence>
                      {isCard(tile) &&
                        drawnGameCard &&
                        landedTileIndexInTurn === tileIndex && (
                          <DrawnCardBox row={rowClassname}>
                            {drawnGameCard.message}
                          </DrawnCardBox>
                        )}
                    </AnimatePresence>
                    {isJail(tile) && (
                      <div className="absolute w-full h-full grid grid-cols-8">
                        {[...Array(8)].map((_, idx) => (
                          <span
                            className="border-r-2 border-l border-neutral-600"
                            key={idx}
                          />
                        ))}
                      </div>
                    )}
                    {isPurchasable(tile) ? (
                      <PurchasableTile tile={tile} />
                    ) : isCorner(tile) ? (
                      <CornerTile tile={tile} />
                    ) : (
                      <Tile tile={tile} />
                    )}
                    {mappedPlayers[tileIndex]?.map((player, idx) => {
                      const isPlayerTurn = player.id === currentPlayerTurnId;
                      const isSelfPlayer = player.id === socket?.id;

                      return (
                        <button
                          key={player.id}
                          className={cn(
                            "w-8 h-8 rounded-full p-[0.1rem] pointer-events-auto bg-black bg-opacity-75 absolute top-2",
                            isPlayerInJail(player.id) && "z-[-1]",
                            isPlayerTurn && "animate-pulse duration-1000"
                          )}
                          style={{
                            left: `${0.5 + idx}rem`,
                            boxShadow: isSelfPlayer
                              ? `0px 0px 7px 1px ${player.color}`
                              : "",
                          }}
                        >
                          <img src={`/${player.character}.png`} />
                        </button>
                      );
                    })}
                  </li>
                );
              })}
            </LayoutGroup>
          </ul>
        );
      })}
    </div>
  );
};

export default Board;
