import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import TileCardActions from "./TileCardActions";
import { Separator } from "../ui/separator";

const TileCardFooter = () => {
  const socket = useSocket();
  const { players } = useAppSelector((state) => state.game);
  const { selectedTile } = useAppSelector((state) => state.ui);

  if (!selectedTile) return null;

  const selfPlayerIsOwner = socket.id === selectedTile.owner;
  const tileOwnerName = players.find(
    (player) => player.id === selectedTile.owner
  )?.name;

  return (
    <>
      {selfPlayerIsOwner && <TileCardActions tile={selectedTile} />}
      {!selfPlayerIsOwner && tileOwnerName && (
        <>
          <Separator className="my-4" />
          <p>
            הנכס בבעלות <strong>{tileOwnerName}</strong>
          </p>
        </>
      )}
    </>
  );
};

export default TileCardFooter;
