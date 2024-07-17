import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { setPlayerProperties } from "@/slices/trade-slice";
import { BoardRow as BoardRowType } from "@/types/Board";
import { cn, getOppositeBoardSide, hasBuildings } from "@/utils";
import { TooltipContentProps } from "@radix-ui/react-tooltip";
import {
  TradePlayer,
  isAirport,
  isCompany,
  isProperty,
  isPurchasable,
} from "@ziv-carmi/monopoly-utils";
import { useMemo } from "react";
import BoardRow from "../board/BoardRow";
import BoardRowTile from "../board/BoardRowTile";
import { useGameBoard } from "../board/GameBoardProvider";
import OwnerIndicator from "../board/OwnerIndicator";
import PropertyIcon from "../board/PropertyIcon";
import { TileWrapper } from "../board/Tile";
import TileBackgroundImage from "../board/TileBackgroundImage";
import TileIcon from "../board/TileIcon";
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
            const isPropertyHasBuilds =
              isProperty(tile) && hasBuildings(tile.country.id);
            const oppositeSide = getOppositeBoardSide(row.area);

            return (
              <BoardRowTile key={tileIndex} tile={tile}>
                {isPurchasable(tile) && (
                  <TradeBoardTile
                    isOwned={tile.owner === trader.id}
                    onClick={() => setPropertiesHandler(tileIndex)}
                    disabled={
                      (mode !== "creating" && mode !== "editing") ||
                      isPropertyHasBuilds
                    }
                    className={cn(
                      "w-full h-full flex justify-between rounded-sm",
                      trader.properties.includes(tileIndex) &&
                        "outline outline-2 outline-white"
                    )}
                  >
                    <TooltipProvider delayDuration={0} disableHoverableContent>
                      {isProperty(tile) && (
                        <TileBackgroundImage
                          tile={tile}
                          className="blur-none"
                        />
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div tabIndex={0} className="w-full h-full">
                            <TileWrapper
                              rowSide={row.area}
                              className="justify-between items-center relative"
                            >
                              {tile.owner && (
                                <OwnerIndicator
                                  ownerId={tile.owner}
                                  className={cn(
                                    "[max-block-size:.75rem]",
                                    isPropertyHasBuilds &&
                                      tile.owner === trader.id
                                      ? "opacity-20"
                                      : tile.owner === trader.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              )}
                              {(isCompany(tile) || isAirport(tile)) && (
                                <TileIcon
                                  tile={tile}
                                  className="p-0 m-1.5 w-3 h-3"
                                />
                              )}
                            </TileWrapper>
                          </div>
                        </TooltipTrigger>
                        {(isCompany(tile) || isAirport(tile)) && (
                          <PropertyNameTooltipContent
                            area={row.area}
                            side={oppositeSide}
                          >
                            {tile.name}
                          </PropertyNameTooltipContent>
                        )}
                        {isProperty(tile) && (
                          <PropertyNameTooltipContent
                            className="flex items-center gap-2"
                            area={row.area}
                            side={oppositeSide}
                          >
                            {tile.name}
                            {isPropertyHasBuilds &&
                              tile.owner === trader.id && (
                                <PropertyIcon rentIndex={tile.rentIndex} />
                              )}
                          </PropertyNameTooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </TradeBoardTile>
                )}
              </BoardRowTile>
            );
          })}
        </BoardRow>
      )),
    [trader.properties, mode, gameBoard]
  );

  return memoizedBoard;
};

type PropertyNameTooltipContentProps = TooltipContentProps & {
  area: BoardRowType;
};

const PropertyNameTooltipContent = ({
  className,
  area,
  ...props
}: PropertyNameTooltipContentProps) => {
  return (
    <div className={cn(area === "right" && "rotate-180")}>
      <TooltipContent
        className={cn(
          "text-balance text-center [writing-mode:initial] rtl",
          className
        )}
        {...props}
      />
    </div>
  );
};

export default TradeBoardRows;
