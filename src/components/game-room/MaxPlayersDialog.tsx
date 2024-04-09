import { useAppDispatch } from "@/app/hooks";
import useBackToLobby from "@/hooks/useBackToLobby";
import { setIsSpectating } from "@/slices/game-slice";
import { Eye, Home } from "lucide-react";
import { Button } from "../ui/button";
import Icon from "../ui/icon";
import Modal from "../ui/modal";

const MaxPlayersDialog = () => {
  const dispatch = useAppDispatch();
  const backToLobby = useBackToLobby();

  return (
    <Modal>
      <h3 className="text-lg font-bold">החדר מלא</h3>
      <div className="flex gap-4 mt-4">
        <Button
          onClick={() => dispatch(setIsSpectating(true))}
          variant="primary"
        >
          <Icon icon={Eye} />
          צפה במשחק
        </Button>
        <Button onClick={backToLobby} variant="outline">
          <Icon icon={Home} />
          חזרה ללובי
        </Button>
      </div>
    </Modal>
  );
};

export default MaxPlayersDialog;
