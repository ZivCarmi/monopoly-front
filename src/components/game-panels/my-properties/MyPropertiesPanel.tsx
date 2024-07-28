import { useAppSelector } from "@/app/hooks";
import { getPlayerPardonCards, getPlayerPurchasables } from "@/utils";
import GamePanel from "../GamePanel";
import PanelTitle from "../PanelTitle";
import MyPropertiesList from "./MyPropertiesList";

const MyPropertiesPanel = () => {
  const { selfPlayer } = useAppSelector((state) => state.game);

  if (!selfPlayer) {
    return null;
  }

  const myPardonCards = getPlayerPardonCards(selfPlayer.id);
  const myProperties = getPlayerPurchasables(selfPlayer.id);
  const propertiesAndPardonsCount = myProperties.length + myPardonCards.length;

  return (
    // height to be changed
    <GamePanel className="overflow-y-auto max-h-[38.2rem]">
      <PanelTitle
        className={propertiesAndPardonsCount > 0 ? "pb-2" : undefined}
      >
        הנכסים שלי ({propertiesAndPardonsCount})
      </PanelTitle>
      {propertiesAndPardonsCount > 0 && (
        <MyPropertiesList properties={myProperties} pardons={myPardonCards} />
      )}
    </GamePanel>
  );
};

export default MyPropertiesPanel;
