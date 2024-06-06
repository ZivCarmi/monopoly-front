import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { selectGameBoard } from "@/slices/game-slice";
import { selectPurchasableTileIndex } from "@/slices/ui-slice";
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
  const propertyIndex = useAppSelector(selectPurchasableTileIndex);

  if (!selfPlayer || !hasMonopoly(board, property.country.id)) return null;

  const upgradedCityLevelText = getCityLevelText(property.rentIndex + 1);
  const downgradedCityLevelText = getCityLevelText(property.rentIndex - 1);

  const upgradeCityHandler = () => {
    socket.emit("upgrade_city", propertyIndex);
  };

  const downgradeCityHandler = () => {
    socket.emit("downgrade_city", propertyIndex);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="primaryFancy"
            disabled={!isPlayerCanUpgrade(selfPlayer.id, property)}
            onClick={upgradeCityHandler}
            className=""
            size="icon"
          >
            <ArrowUpFromLine className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="text-balance text-center">
          {upgradedCityLevelText
            ? `שדרג ל${upgradedCityLevelText}`
            : "במקסימום"}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="primaryFancy"
            disabled={!isPlayerCanDowngrade(selfPlayer.id, property)}
            onClick={downgradeCityHandler}
            className=""
            size="icon"
          >
            <ArrowDownToLine className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="text-balance text-center">
          {downgradedCityLevelText
            ? `שנמך ל${downgradedCityLevelText}`
            : "נכס ללא בתים"}
        </TooltipContent>
      </Tooltip>
    </>
  );
};

export default PropertyActions;
