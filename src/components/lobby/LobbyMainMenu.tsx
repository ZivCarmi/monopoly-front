import { Button } from "@/components/ui/button";
import useJoinRoom from "@/hooks/useJoinRoom";
import { Gamepad2, Users2 } from "lucide-react";
import { Link } from "react-router-dom";
import Icon from "../ui/icon";
import NicknameForm from "./NicknameForm";

const LobbyMainMenu = () => {
  const createRoom = useJoinRoom();

  return (
    <div className="m-auto">
      <NicknameForm />
      <div className="flex items-center justify-center gap-2 mt-5">
        <Button
          data-testid="create-private-room"
          onClick={() => createRoom({ isPrivate: true })}
          variant="primaryFancy"
        >
          <Icon icon={Gamepad2} />
          צור חדר פרטי
        </Button>
        <Button asChild variant="yellowFancy">
          <Link to="/rooms">
            <Icon icon={Users2} />
            לרשימת חדרים
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default LobbyMainMenu;
