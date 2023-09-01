import { IProperty } from "@backend/types/Board";
import { getCityRentText } from "@/helpers/tiles";
import { hasMonopoly } from "@backend/helpers";
import { Button } from "./ui/button";
import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";

type PropertyActionsProps = {
  property: IProperty;
  tileIndex: number;
  canTakeActions: boolean;
};

const PropertyActions: React.FC<PropertyActionsProps> = ({
  property,
  tileIndex,
  canTakeActions,
}) => {
  const { socket } = useSocket();
  const {
    players,
    map: { board },
  } = useAppSelector((state) => state.game);
  const selfPlayer = players.find((player) => player.id === socket?.id);

  if (!socket || !selfPlayer) return null;

  const canUpgrade = canTakeActions && selfPlayer.money >= property.houseCost;
  const rentText = getCityRentText(property.rentIndex);

  const upgradeCityHandler = () => {
    socket.emit("upgrade_city", {
      tileIndex: tileIndex,
    });
  };

  return (
    hasMonopoly(board, property.country.id) && (
      <div>
        <Button disabled={!canUpgrade} onClick={upgradeCityHandler}>
          שדרג ל{rentText}
        </Button>
      </div>
    )
  );
};

export default PropertyActions;
