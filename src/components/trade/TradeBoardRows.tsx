import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setPlayerProperties } from "@/slices/trade-slice";
import { TradePlayer, isPurchasable } from "@ziv-carmi/monopoly-utils";
import { useMemo } from "react";
import BoardRow from "../board/BoardRow";
import BoardRowTile from "../board/BoardRowTile";
import { useGameBoard } from "../board/GameBoardProvider";
import OwnerIndicator from "../board/OwnerIndicator";
import Tile from "../board/Tile";
import TradeBoardTile from "./TradeBoardTile";

const TradeBoardRows = ({ trader }: { trader: TradePlayer }) => {
  const dispatch = useAppDispatch();
  const gameBoard = useGameBoard();
  const { mode } = useAppSelector((state) => state.trade);

  const setPropertiesHandler = (tileIndex: number) => {
    dispatch(setPlayerProperties({ traderId: trader.id, tileIndex }));
  };

  const memoizedBoard = useMemo(
    () =>
      gameBoard.map((row, rowIndex) => (
        <BoardRow key={rowIndex} area={row.area}>
          {row.tiles.map((tile, tileIndexInRow) => {
            const tileIndex = 10 * rowIndex + tileIndexInRow;
            const isOwnersProperty =
              isPurchasable(tile) && tile.owner === trader.id;

            return (
              <BoardRowTile key={tileIndex} tile={tile}>
                <TradeBoardTile
                  isOwnersProperty={isOwnersProperty}
                  onClick={() => setPropertiesHandler(tileIndex)}
                  disabled={mode !== "creating" && mode !== "editing"}
                  className="w-full h-full disabled:opacity-50 rounded-sm"
                  style={{
                    opacity: isOwnersProperty ? 1 : 0.2,
                    outlineOffset: 1,
                    outline: trader.properties.includes(tileIndex)
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
    [trader.properties, mode]
  );

  return memoizedBoard;
};

export default TradeBoardRows;
