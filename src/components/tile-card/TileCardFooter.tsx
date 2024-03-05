import { useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import PlayerNamePlate from "../player/PlayerNamePlate";
import PlayerCharacter from "../player/PlayerCharacter";
import PlayerName from "../player/PlayerName";
import { Separator } from "../ui/separator";
import TileCardActions from "./TileCardActions";

const TileCardFooter = () => {
  const socket = useSocket();
  const { players } = useAppSelector((state) => state.game);
  const { selectedTile } = useAppSelector((state) => state.ui);

  if (!selectedTile) return null;

  const selfPlayerIsOwner = socket.id === selectedTile.owner;
  const tileOwner = players.find((player) => player.id === selectedTile.owner);

  return (
    <>
      {selfPlayerIsOwner && <TileCardActions tile={selectedTile} />}
      {!selfPlayerIsOwner && tileOwner && (
        <>
          <Separator className="my-4" />
          <div className="flex items-center justify-center gap-4">
            <span className="text-muted-foreground text-sm">בבעלות</span>
            <PlayerNamePlate>
              <PlayerCharacter character={tileOwner.character} />
              <PlayerName name={tileOwner.name} color={tileOwner.color} />
            </PlayerNamePlate>
          </div>
        </>
      )}
    </>
  );
};

export default TileCardFooter;
