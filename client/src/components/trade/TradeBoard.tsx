import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setPlayerProperties } from "@/slices/trade-slice";
import { rowClassname } from "@/types/Board";
import { createBoard } from "@/utils";
import { GameTile, isProperty, isPurchasable } from "@backend/types/Board";
import { useEffect, useMemo, useState } from "react";
import BoardCenter from "../board-center/BoardCenter";
import Board from "../board/Board";
import BoardRow from "../board/BoardRow";
import BoardTile from "../board/BoardTile";
import CityFlagIcon from "../board/CityFlagIcon";
import OwnerIndicator from "../board/OwnerIndicator";
import TileContent from "../board/TileContent";
import TradeBoardTile from "./TradeBoardTile";

type TradeBoardProps = {
  playerId: string;
};

const TradeBoard: React.FC<TradeBoardProps> = ({ playerId }) => {
  const dispatch = useAppDispatch();
  const { offeror, offeree, status } = useAppSelector((state) => state.trade);
  const tradePlayer = [offeror, offeree].find(
    (player) => player?.id === playerId
  );
  const [gameBoard, setGameBoard] = useState<GameTile[][]>([]);
  const isDisabled = status === "sent" || status === "recieved";
  const memoizedBoard = useMemo(
    () =>
      gameBoard.map((row, rowIndex) => (
        <BoardRow key={rowIndex} className={`row_${rowClassname[rowIndex]}`}>
          {row.map((tile, tileIndexInRow) => {
            const tileIndex = 10 * rowIndex + tileIndexInRow;
            const isOwnersProperty =
              isPurchasable(tile) && tile.owner === playerId;

            return (
              <BoardTile key={tileIndex}>
                <TradeBoardTile
                  isOwnersProperty={isOwnersProperty}
                  onClick={() => setPropertiesHandler(tileIndex)}
                  disabled={isDisabled}
                  className="w-full h-full disabled:opacity-50"
                  style={{
                    opacity: isOwnersProperty ? 1 : 0.2,
                    border: tradePlayer?.properties.includes(tileIndex)
                      ? "1px solid red"
                      : "",
                  }}
                >
                  <TileContent>
                    {isPurchasable(tile) && tile.owner && (
                      <OwnerIndicator ownerId={tile.owner} />
                    )}
                    {isProperty(tile) && (
                      <CityFlagIcon countryId={tile.country.id} size={16} />
                    )}
                  </TileContent>
                </TradeBoardTile>
              </BoardTile>
            );
          })}
        </BoardRow>
      )),
    [gameBoard, tradePlayer?.properties, status]
  );

  useEffect(() => {
    setGameBoard(createBoard());
  }, []);

  const setPropertiesHandler = (tileIndex: number) => {
    dispatch(
      setPlayerProperties({
        playerId,
        tileIndex,
      })
    );
  };

  return (
    <Board
      cornerSize={50}
      tileSize={30}
      className={`${isDisabled && "opacity-50"}`}
    >
      <BoardCenter />
      {memoizedBoard}
    </Board>
  );
};

export default TradeBoard;
