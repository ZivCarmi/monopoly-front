import { useAppSelector } from "@/app/hooks";
import PlayerName from "../player/PlayerName";
import PlayerNamePlate from "../player/PlayerNamePlate";
import { Separator } from "../ui/separator";
import TileCardActions from "./TileCardActions";
import PlayerCharacter from "../player/PlayerCharacter";
import { isPurchasable } from "@ziv-carmi/monopoly-utils";

const TileCardFooter = () => {
  const { players, selfPlayer, selectedPopover } = useAppSelector(
    (state) => state.game
  );

  if (!isPurchasable(selectedPopover)) {
    return null;
  }

  const owner = selectedPopover.owner;

  if (!owner) {
    return null;
  }

  const selfPlayerIsOwner = !!selfPlayer && selfPlayer.id === owner;
  const tileOwner = players.find((player) => player.id === owner);

  if (selfPlayerIsOwner) {
    return <TileCardActions tile={selectedPopover} />;
  }

  if (tileOwner) {
    return (
      <>
        <Separator className="my-4" />
        <div className="flex items-center justify-center gap-4">
          <span className="text-muted-foreground text-sm">בבעלות</span>
          <PlayerNamePlate>
            <PlayerCharacter color={tileOwner.color} />
            <PlayerName name={tileOwner.name} />
          </PlayerNamePlate>
        </div>
      </>
    );
  }
};

export default TileCardFooter;
