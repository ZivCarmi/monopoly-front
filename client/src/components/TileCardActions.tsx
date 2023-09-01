import { useSocket } from "@/app/socket-context";
import { Button } from "./ui/button";
import PropertyActions from "./PropertyActions";
import { useAppSelector } from "@/app/hooks";
import { IAirport, ICompany, IProperty, TileTypes } from "@backend/types/Board";

type TileCardActionsProps = {
  tileIndex: number;
  tile: IProperty | IAirport | ICompany;
};

const TileCardActions: React.FC<TileCardActionsProps> = ({
  tileIndex,
  tile,
}) => {
  const { socket } = useSocket();
  const { currentPlayerTurnId, suspendedPlayers } = useAppSelector(
    (state) => state.game
  );

  if (!socket) return null;

  const canTakeActions =
    currentPlayerTurnId === socket.id && !suspendedPlayers[socket.id];

  const sellPropertyHandler = () => {
    socket.emit("sell_property", {
      propertyIndex: tileIndex,
    });
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="destructive"
        disabled={!canTakeActions}
        onClick={sellPropertyHandler}
      >
        מכור עבור ${tile.cost / 2}
      </Button>
      {tile.type === TileTypes.PROPERTY && (
        <PropertyActions
          property={tile}
          tileIndex={tileIndex}
          canTakeActions={canTakeActions}
        />
      )}
    </div>
  );
};

export default TileCardActions;
