import { useAppSelector } from "@/app/hooks";
import useBackToLobby from "@/hooks/useBackToLobby";
import { Dices, Home, RefreshCcw } from "lucide-react";
import PlayerCharacter from "../player/PlayerCharacter";
import PlayerName from "../player/PlayerName";
import PlayerNamePlate from "../player/PlayerNamePlate";
import { Button } from "../ui/button";
import Icon from "../ui/icon";
import Modal from "../ui/modal";

const WinnerScreen = () => {
  const {
    stats: { winner },
  } = useAppSelector((state) => state.game);
  const backToLobby = useBackToLobby();

  if (!winner) {
    return null;
  }

  return (
    <Modal className="flex items-center justify-center flex-col pb-10 gap-4">
      <Dices size={120} />
      <h1 className="text-9xl/[7rem] tracking-tighter mb-8">משחק נגמר!</h1>
      <div className="text-3xl tracking-tight">המנצח הוא...</div>
      <PlayerNamePlate className="gap-8 justify-center -mt-2 mb-4">
        <PlayerCharacter color={winner.color} size={3} />
        <h2 className="text-5xl font-semibold">
          <PlayerName name={winner.name} />
        </h2>
      </PlayerNamePlate>
      <div className="flex gap-2">
        <Button>
          <Icon icon={RefreshCcw} />
          משחק חדש
        </Button>
        <Button onClick={backToLobby}>
          <Icon icon={Home} />
          חזרה ללובי
        </Button>
      </div>
    </Modal>
  );
};

export default WinnerScreen;
