import { useAppDispatch } from "@/app/hooks";
import { setIsSpectating } from "@/slices/game-slice";
import { Eye, Home } from "lucide-react";
import { Button } from "../ui/button";
import Icon from "../ui/icon";
import Modal from "../ui/modal";
import BackToLobbyLink from "./BackToLobbyLink";

const MaxPlayersDialog = () => {
  const dispatch = useAppDispatch();

  return (
    <Modal>
      <h3 className="text-lg font-bold">החדר מלא</h3>
      <div className="flex gap-4 mt-4">
        <Button
          onClick={() => dispatch(setIsSpectating(true))}
          variant="primaryFancy"
        >
          <Icon icon={Eye} />
          צפה במשחק
        </Button>
        <BackToLobbyLink>
          <Button variant="primaryFancy" asChild>
            <span>
              <Icon icon={Home} />
              חזרה ללובי
            </span>
          </Button>
        </BackToLobbyLink>
      </div>
    </Modal>
  );
};

export default MaxPlayersDialog;
