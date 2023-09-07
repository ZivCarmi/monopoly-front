import { IProperty, RentIndexes } from "@backend/types/Board";
import { getCityLevelText } from "@backend/helpers";
import { hasMonopoly } from "@backend/helpers";
import { Button } from "../ui/button";
import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import { selectPurchasableTileIndex } from "@/slices/ui-slice";
import { isPlayerSuspended } from "@/utils";

type PropertyActionsProps = {
  property: IProperty;
};

const PropertyActions: React.FC<PropertyActionsProps> = ({ property }) => {
  const { socket } = useSocket();
  const {
    currentPlayerTurnId,
    players,
    map: { board },
  } = useAppSelector((state) => state.game);
  const selectedTileIndex = useAppSelector(selectPurchasableTileIndex);
  const selfPlayer = players.find((player) => player.id === socket?.id);

  if (!socket || !selfPlayer) return null;

  const selfPlayerHasTurn = currentPlayerTurnId === socket.id;
  const isSuspended = isPlayerSuspended(socket.id);
  const canAffordUpgrade =
    property.rentIndex + 1 === RentIndexes.HOTEL
      ? selfPlayer.money >= property.hotelCost
      : selfPlayer.money >= property.houseCost;
  const canUpgrade = selfPlayerHasTurn && !isSuspended && canAffordUpgrade;
  const canDowngrade =
    selfPlayerHasTurn &&
    !isSuspended &&
    property.rentIndex !== RentIndexes.BLANK;
  const upgradedCityLevelText = getCityLevelText(property.rentIndex + 1);
  const downgradedCityLevelText = getCityLevelText(property.rentIndex - 1);

  const upgradeCityHandler = () => {
    socket.emit("upgrade_city", {
      tileIndex: selectedTileIndex,
    });
  };

  const downgradeCityHandler = () => {
    socket.emit("downgrade_city", {
      tileIndex: selectedTileIndex,
    });
  };

  return (
    hasMonopoly(board, property.country.id) && (
      <div className="flex gap-2">
        {property.rentIndex !== RentIndexes.HOTEL && (
          <Button
            variant="primary"
            disabled={!canUpgrade}
            onClick={upgradeCityHandler}
            className="flex-1"
          >
            שדרג ל{upgradedCityLevelText}
          </Button>
        )}
        {property.rentIndex !== RentIndexes.BLANK && (
          <Button
            variant="info"
            disabled={!canDowngrade}
            onClick={downgradeCityHandler}
            className="flex-1"
          >
            שנמך ל{downgradedCityLevelText}
          </Button>
        )}
      </div>
    )
  );
};

export default PropertyActions;
