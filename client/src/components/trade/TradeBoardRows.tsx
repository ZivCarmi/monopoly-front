import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setPlayerProperties } from "@/slices/trade-slice";
import { isPurchasable } from "@ziv-carmi/monopoly-utils";
import { useMemo } from "react";
import BoardRow from "../board/BoardRow";
import BoardRowTile from "../board/BoardRowTile";
import { useGameBoard } from "../board/GameBoardProvider";
import OwnerIndicator from "../board/OwnerIndicator";
import Tile from "../board/Tile";
import TradeBoardTile from "./TradeBoardTile";

type TradeBoardRowsProps = {
  playerId: string;
};

// TRY SEPERATE THE CALL FOR { offeror, offeree, status } FROM REDUX
// TO A SINGLE COMPONENT, MAYBE IT WILL PREVENT RERENDER

const TradeBoardRows = ({ playerId }: TradeBoardRowsProps) => {
  const dispatch = useAppDispatch();
  const { offeror, offeree, status } = useAppSelector((state) => state.trade);
  const tradePlayer = [offeror, offeree].find(
    (player) => player?.id === playerId
  );
  const isDisabled = status === "sent" || status === "recieved";
  const gameBoard = useGameBoard();
  const memoizedBoard = useMemo(
    () =>
      gameBoard.map((row, rowIndex) => (
        <BoardRow key={rowIndex} area={row.area}>
          {row.tiles.map((tile, tileIndexInRow) => {
            const tileIndex = 10 * rowIndex + tileIndexInRow;
            const isOwnersProperty =
              isPurchasable(tile) && tile.owner === playerId;

            return (
              <BoardRowTile key={tileIndex} tile={tile}>
                <TradeBoardTile
                  isOwnersProperty={isOwnersProperty}
                  onClick={() => setPropertiesHandler(tileIndex)}
                  disabled={isDisabled}
                  className="w-full h-full disabled:opacity-50 rounded-sm"
                  style={{
                    opacity: isOwnersProperty ? 1 : 0.2,
                    outlineOffset: 1,
                    outline: tradePlayer?.properties.includes(tileIndex)
                      ? "red solid 1px"
                      : "",
                  }}
                >
                  <Tile
                    className={`flex w-full h-full justify-between relative ${
                      row.area === "top" ? "flex-col" : "flex-col-reverse"
                    }`}
                  >
                    {isPurchasable(tile) && tile.owner && (
                      <OwnerIndicator ownerId={tile.owner} />
                    )}
                  </Tile>
                </TradeBoardTile>
              </BoardRowTile>
            );
          })}
        </BoardRow>
      )),
    [tradePlayer?.properties]
  );

  const setPropertiesHandler = (tileIndex: number) => {
    dispatch(setPlayerProperties({ playerId, tileIndex }));
  };

  return memoizedBoard;
};

export default TradeBoardRows;
