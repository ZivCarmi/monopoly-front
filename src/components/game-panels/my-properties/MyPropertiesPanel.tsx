import { useAppSelector } from "@/app/hooks";
import PurchasableTilePopover from "@/components/board/PurchasableTilePopover";
import TileIcon from "@/components/board/TileIcon";
import { getPlayerProperties } from "@/utils";
import GamePanel from "../GamePanel";
import GamePanelContent from "../GamePanelContent";
import PanelTitle from "../PanelTitle";
import { TileTypes } from "@ziv-carmi/monopoly-utils";

const order = [TileTypes.PROPERTY, TileTypes.AIRPORT, TileTypes.COMPANY];

const MyPropertiesPanel = () => {
  const { selfPlayer } = useAppSelector((state) => state.game);

  if (!selfPlayer) {
    return null;
  }

  const myProperties = getPlayerProperties(selfPlayer.id);
  const sortedMyProperties = myProperties.sort(
    (a, b) => order.indexOf(a.type) - order.indexOf(b.type)
  );

  return (
    <GamePanel>
      <GamePanelContent>
        <PanelTitle>הנכסים שלי ({myProperties.length})</PanelTitle>
        <ul className="divide-y-2">
          {sortedMyProperties.map((tile) => (
            <li key={tile.name}>
              <PurchasableTilePopover
                tile={tile}
                className="gap-4 items-center p-2 text-sm"
                popoverContentProps={{ side: "right", sideOffset: 24 }}
              >
                {tile.icon && (
                  <TileIcon tile={tile} className="w-4 h-4 p-0 rounded-full" />
                )}
                {tile.name}
              </PurchasableTilePopover>
            </li>
          ))}
        </ul>
      </GamePanelContent>
    </GamePanel>
  );
};

export default MyPropertiesPanel;
