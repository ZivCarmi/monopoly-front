import { useAppSelector } from "@/app/hooks";
import { getPlayerPardonCards, getPlayerPurchasables } from "@/utils";
import GamePanel from "../GamePanel";
import PanelTitle from "../PanelTitle";
import MyPropertiesList from "./MyPropertiesList";
import { ScrollArea } from "@/components/ui/scroll-area";

const MyPropertiesPanel = () => {
  const { selfPlayer } = useAppSelector((state) => state.game);

  if (!selfPlayer) {
    return null;
  }

  const myPardonCards = getPlayerPardonCards(selfPlayer.id);
  const myProperties = getPlayerPurchasables(selfPlayer.id);
  const propertiesAndPardonsCount = myProperties.length + myPardonCards.length;

  return (
    <GamePanel className="grow">
      <PanelTitle>הנכסים שלי ({propertiesAndPardonsCount})</PanelTitle>
      {!!propertiesAndPardonsCount && (
        <ScrollArea dir="rtl" className="h-0 grow">
          {propertiesAndPardonsCount > 0 && (
            <MyPropertiesList
              properties={myProperties}
              pardons={myPardonCards}
            />
          )}
        </ScrollArea>
      )}
    </GamePanel>
  );
};

export default MyPropertiesPanel;
