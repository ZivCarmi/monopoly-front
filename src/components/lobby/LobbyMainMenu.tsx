import { useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import useJoinRoom from "@/hooks/useJoinRoom";
import { Gamepad2, Users2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage } from "../ui/avatar";
import Icon from "../ui/icon";
import NicknameForm from "./NicknameForm";

const LobbyMainMenu = () => {
  const { isAuthenticated, user, nickname } = useAppSelector(
    (state) => state.user
  );
  const createRoom = useJoinRoom();

  return (
    <div className="m-auto">
      {isAuthenticated && user ? (
        <div className="flex items-center justify-center gap-2">
          <Avatar>
            <AvatarImage src={user.avatar_url} alt={nickname} />
          </Avatar>
          <div className="leading-4">
            <span className="text-muted-foreground text-xs">משחק בתור</span>
            <div className="text-sm">{nickname}</div>
          </div>
        </div>
      ) : (
        <NicknameForm />
      )}
      <div className="flex items-center justify-center gap-2 mt-6">
        <Button
          data-testid="create-private-room"
          onClick={() => createRoom({ isPrivate: true })}
          variant="primaryFancy"
        >
          <Icon icon={Gamepad2} />
          צור חדר פרטי
        </Button>
        <Button asChild variant="yellowFancy">
          <Link to="/browse">
            <Icon icon={Users2} />
            לרשימת חדרים
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default LobbyMainMenu;
