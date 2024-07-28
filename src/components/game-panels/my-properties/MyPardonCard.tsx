import { GameCardDeck, PardonCard } from "@ziv-carmi/monopoly-utils";
import { ShieldCheck } from "lucide-react";
import MyPropertyItem from "./MyPropertyItem";

const MyPardonCard = ({ pardonCard }: { pardonCard: PardonCard }) => {
  const popoverTrigger = (
    <>
      <ShieldCheck className="w-4 h-4" />
      כרטיס חנינה (For testing - {GameCardDeck[pardonCard.deck]})
    </>
  );

  return (
    <MyPropertyItem
      _content={pardonCard}
      popoverTrigger={{ children: popoverTrigger }}
      className="text-sm p-3 shadow-pardon-card-shadow"
    >
      כרטיס חנינה מאפשר לך להשתחרר מהכלא ללא תשלום.
    </MyPropertyItem>
  );
};

export default MyPardonCard;
