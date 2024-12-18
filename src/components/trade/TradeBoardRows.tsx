import { useAppDispatch } from "@/app/hooks";
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
import OwnerIndicator from "../board/OwnerIndicator";
import PropertyIcon from "../board/PropertyIcon";
import { TileWrapper } from "../board/Tile";
import TileBackgroundImage from "../board/TileBackgroundImage";
import TileIcon from "../board/TileIcon";
import { useGameRoom } from "../game-room/GameRoomProvider";
import TradeBoardTile from "./TradeBoardTile";

const TradeBoardRows = ({
  trader,
  isDisabled,
}: {
  trader: TradePlayer;
  isDisabled: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { gameBoard } = useGameRoom();

  const setPropertiesHandler = (tileIndex: number) => {
    dispatch(setPlayerProperties({ traderId: trader.id, tileIndex }));
  };

  const memoizedBoard = useMemo(
    () =>
      gameBoard.map((row, rowIndex) => (
        <BoardRow key={rowIndex} area={row.area}>
          {row.tiles.map((tile, tileIndexInRow) => {
            const tileIndex = 10 * rowIndex + tileIndexInRow;
            const oppositeSide = getOppositeBoardSide(row.area);
            const isOwner = isPurchasable(tile) && tile.owner === trader.id;
            const isClickable = isOwner && !isDisabled;
            const isPropertyHasBuilds =
              isClickable && isProperty(tile) && hasBuildings(tile.country.id);

            return (
              <BoardRowTile key={tileIndex} tile={tile}>
                {isPurchasable(tile) && (
                  <TradeBoardTile
                    clickable={isClickable}
                    onClick={() => setPropertiesHandler(tileIndex)}
                    disabled={isPropertyHasBuilds}
                    className={cn(
                      "relative z-10 w-full h-full flex justify-between rounded-sm before:transition-colors before:duration-300  before:absolute before:z-30 before:inset-0 before:backdrop-invert-0 before:brightness-[0.3]",
                      trader.properties.includes(tileIndex) &&
                        "before:brightness-150"
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
                          <div
                            tabIndex={0}
                            className="relative z-30 w-full h-full"
                          >
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
    [trader.properties, isDisabled, gameBoard]
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
