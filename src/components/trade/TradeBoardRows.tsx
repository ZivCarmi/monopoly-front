import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { setPlayerProperties } from "@/slices/trade-slice";
import { cn, hasBuildings } from "@/utils";
import {
  TradePlayer,
  isProperty,
  isPurchasable,
} from "@ziv-carmi/monopoly-utils";
import { useMemo } from "react";
import BoardRow from "../board/BoardRow";
import BoardRowTile from "../board/BoardRowTile";
import { useGameBoard } from "../board/GameBoardProvider";
import OwnerIndicator from "../board/OwnerIndicator";
import PropertyIcon from "../board/PropertyIcon";
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
            const isPropertyHasBuilds =
              isProperty(tile) && hasBuildings(tile.country.id);

            return (
              <BoardRowTile key={tileIndex} tile={tile}>
                <TradeBoardTile
                  isOwnersProperty={isOwnersProperty}
                  onClick={() => setPropertiesHandler(tileIndex)}
                  disabled={
                    (mode !== "creating" && mode !== "editing") ||
                    isPropertyHasBuilds
                  }
                  className={cn(
                    "w-full h-full rounded-sm",
                    row.area === "right" && "rotate-180"
                  )}
                  style={{
                    outlineOffset: 1,
                    outline: trader.properties.includes(tileIndex)
                      ? "red solid 1px"
                      : "",
                  }}
                >
                  <TooltipProvider delayDuration={0} disableHoverableContent>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0}>
                          <Tile
                            className={cn(
                              "flex w-full h-full justify-between relative",
                              row.area === "top" || row.area === "right"
                                ? "flex-col"
                                : "flex-col-reverse"
                            )}
                          >
                            {isPurchasable(tile) && tile.owner && (
                              <OwnerIndicator
                                ownerId={tile.owner}
                                className={
                                  isPropertyHasBuilds && isOwnersProperty
                                    ? "opacity-20"
                                    : isOwnersProperty
                                    ? "opacity-100"
                                    : "opacity-0"
                                }
                              />
                            )}
                          </Tile>
                        </span>
                      </TooltipTrigger>
                      {isProperty(tile) && (
                        <TooltipContent
                          className={cn(
                            "text-balance text-center [writing-mode:initial] rtl flex items-center gap-2"
                          )}
                        >
                          {tile.name}
                          {isPropertyHasBuilds && isOwnersProperty && (
                            <PropertyIcon rentIndex={tile.rentIndex} />
                          )}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
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
