import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { selectGameBoard } from "@/slices/game-slice";
import { selectSelectedTileIndex } from "@/slices/ui-slice";
import { isPlayerCanDowngrade, isPlayerCanUpgrade } from "@/utils";
import {
  IProperty,
  getCityLevelText,
  hasMonopoly,
} from "@ziv-carmi/monopoly-utils";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const PropertyActions = ({ property }: { property: IProperty }) => {
  const socket = useSocket();
  const { selfPlayer } = useAppSelector((state) => state.game);
  const board = useAppSelector(selectGameBoard);
  const propertyIndex = useAppSelector(selectSelectedTileIndex);

  if (!selfPlayer || !hasMonopoly(board, property.country.id)) {
    return null;
  }

  const upgradedCityLevelText = getCityLevelText(property.rentIndex + 1);
  const downgradedCityLevelText = getCityLevelText(property.rentIndex - 1);
  const upgrade = isPlayerCanUpgrade(selfPlayer.id, property);
  const downgrade = isPlayerCanDowngrade(selfPlayer.id, property);

  const upgradeCityHandler = () => {
    socket.emit("upgrade_city", propertyIndex);
  };

  const downgradeCityHandler = () => {
    socket.emit("downgrade_city", propertyIndex);
  };

  return (
    <>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <span tabIndex={0}>
            <Button
              variant="primary"
              disabled={!upgrade.isValid}
              onClick={upgradeCityHandler}
              size="icon"
            >
              <ArrowUpFromLine className="w-4 h-4" />
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent className="text-pretty text-center max-w-52">
          {!upgrade.isValid
            ? upgrade.error
            : `שדרג ל${upgradedCityLevelText} עבור ₪${property.houseCost}`}
        </TooltipContent>
      </Tooltip>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <span tabIndex={0}>
            <Button
              variant="primary"
              disabled={!downgrade.isValid}
              onClick={downgradeCityHandler}
              size="icon"
            >
              <ArrowDownToLine className="w-4 h-4" />
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent className="text-pretty text-center max-w-52">
          {!downgrade.isValid
            ? downgrade.error
            : `שנמך ל${downgradedCityLevelText} עבור ₪${
                property.houseCost / 2
              }`}
        </TooltipContent>
      </Tooltip>
    </>
  );
};

export default PropertyActions;
