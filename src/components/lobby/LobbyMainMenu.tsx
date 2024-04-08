import { Button } from "@/components/ui/button";
import useJoinRoom from "@/hooks/useJoinRoom";
import { Gamepad2, Users2 } from "lucide-react";
import { Link } from "react-router-dom";
import Icon from "../ui/icon";

const LobbyMainMenu = () => {
  const createRoom = useJoinRoom();

  return (
    <div className="m-auto flex items-center justify-center gap-2">
      <Button
        onClick={() => createRoom({ isPrivate: true })}
        variant="primaryFancy"
      >
        <Icon icon={Gamepad2} />
        צור חדר פרטי
      </Button>
      <Button
        asChild
        className="bg-gradient-to-tl from-pink-500 to-yellow-500 bg-pos-0 hover:bg-pos-100 bg-size-100-400 transition-all duration-500"
      >
        <Link to="/rooms">
          <Icon icon={Users2} />
          לרשימת חדרים
        </Link>
      </Button>
    </div>
  );
};

export default LobbyMainMenu;
