import {
  IProperty,
  RentIndexes,
  getCityLevelText,
  hasMonopoly,
} from "@ziv-carmi/monopoly-utils";
import { Button } from "../ui/button";
import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { selectPurchasableTileIndex } from "@/slices/ui-slice";
import { isPlayerSuspended, isPlayerTurn } from "@/utils";
import { selectGameBoard } from "@/slices/game-slice";

const PropertyActions = ({ property }: { property: IProperty }) => {
  const socket = useSocket();
  const { selfPlayer } = useAppSelector((state) => state.game);
  const board = useAppSelector(selectGameBoard);
  const propertyIndex = useAppSelector(selectPurchasableTileIndex);

  if (!selfPlayer) return null;

  const selfPlayerHasTurn = isPlayerTurn(selfPlayer.id);
  const isSuspended = isPlayerSuspended(selfPlayer.id);
  const upgradeCost =
    property.rentIndex === RentIndexes.FOUR_HOUSES
      ? property.hotelCost
      : property.houseCost;
  const canUpgrade =
    selfPlayerHasTurn &&
    !isSuspended &&
    selfPlayer.money >= upgradeCost &&
    property.rentIndex !== RentIndexes.HOTEL;
  const canDowngrade =
    selfPlayerHasTurn &&
    !isSuspended &&
    property.rentIndex !== RentIndexes.BLANK;
  const upgradedCityLevelText = getCityLevelText(property.rentIndex + 1);
  const downgradedCityLevelText = getCityLevelText(property.rentIndex - 1);

  const upgradeCityHandler = () => {
    socket.emit("upgrade_city", propertyIndex);
  };

  const downgradeCityHandler = () => {
    socket.emit("downgrade_city", propertyIndex);
  };

  return (
    hasMonopoly(board, property.country.id) && (
      <div className="flex gap-2">
        <Button
          variant="primary"
          disabled={!canUpgrade}
          onClick={upgradeCityHandler}
          className="flex-1"
        >
          {upgradedCityLevelText
            ? `שדרג ל${upgradedCityLevelText}`
            : "במקסימום"}
        </Button>
        <Button
          variant="warning"
          disabled={!canDowngrade}
          onClick={downgradeCityHandler}
          className="flex-1"
        >
          {downgradedCityLevelText
            ? `שנמך ל${downgradedCityLevelText}`
            : "במינימום"}
        </Button>
      </div>
    )
  );
};

export default PropertyActions;
