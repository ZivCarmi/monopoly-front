import { useAppSelector } from "@/app/hooks";
import { selectGameBoard, selectPlayers } from "@/slices/game-slice";
import { cn, createBoard, isPlayerInJail, mapPlayersOnBoard } from "@/utils";
import {
  GameTile,
  isCard,
  isCorner,
  isJail,
  isPurchasable,
} from "@backend/types/Board";
import { useEffect, useState } from "react";
import { rowClassname, MappedPlayersByTiles } from "@/types/Board";
import CenterContent from "../board-center/CenterContent";
import BoardTile from "./BoardTile";
import { AnimatePresence } from "framer-motion";
import DrawnCardBox from "../DrawnCardBox";
import PurchasableTile from "./PurchasableTile";
import CornerTile from "./CornerTile";
import Tile from "./Tile";
import BoardRow from "./BoardRow";
import Board from "./Board";

const GameBoard = () => {
  const players = useAppSelector(selectPlayers);
  const { drawnGameCard, currentPlayerTurnId } = useAppSelector(
    (state) => state.game
  );
  const [mappedPlayers, setMappedPlayers] = useState<MappedPlayersByTiles>({});
  const board = useAppSelector(selectGameBoard);
  const [gameBoard, setGameBoard] = useState<GameTile[][]>([]);

  useEffect(() => {
    setMappedPlayers(mapPlayersOnBoard());
  }, [players]);

  useEffect(() => {
    setGameBoard(createBoard());
  }, [board]);

  return (
    <Board className="game-board">
      <CenterContent />
      {gameBoard.map((row, rowIndex) => (
        <BoardRow key={rowIndex} className={`row_${rowClassname[rowIndex]}`}>
          {row.map((tile, tileIndexInRow) => {
            const tileIndex = 10 * rowIndex + tileIndexInRow;

            return (
              <BoardTile key={tileIndex}>
                <AnimatePresence>
                  {isCard(tile) &&
                    drawnGameCard.card &&
                    drawnGameCard.tileIndex === tileIndex && (
                      <DrawnCardBox row={rowClassname[rowIndex]}>
                        {drawnGameCard.card.message}
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

                  return (
                    <button
                      key={player.id}
                      className={cn(
                        "w-8 h-8 rounded-full p-[0.1rem] pointer-events-auto bg-opacity-75 absolute ",
                        isPlayerInJail(player.id) && "z-[-1]",
                        isPlayerTurn && "animate-pulse duration-1000",
                        "mapped_player"
                      )}
                      style={{
                        backgroundColor: player.color,
                        top:
                          rowClassname[rowIndex] === "right"
                            ? `${0.5 + idx}rem`
                            : "",
                        right:
                          rowClassname[rowIndex] === "bottom"
                            ? `${0.5 + idx}rem`
                            : "",
                        left:
                          rowClassname[rowIndex] === "top"
                            ? `${0.5 + idx}rem`
                            : "",
                        bottom:
                          rowClassname[rowIndex] === "left"
                            ? `${0.5 + idx}rem`
                            : "",
                        boxShadow: `0px 0px 7px 1px ${player.color}`,
                      }}
                    >
                      <img src={`/${player.character}.png`} />
                    </button>
                  );
                })}
              </BoardTile>
            );
          })}
        </BoardRow>
      ))}
    </Board>
  );
};

export default GameBoard;
