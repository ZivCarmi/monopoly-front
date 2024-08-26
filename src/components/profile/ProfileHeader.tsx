import { useAppSelector } from "@/app/hooks";
import { UserProfile } from "@/types/Auth";
import { useAsyncValue } from "react-router-dom";
import { Avatar, AvatarImage } from "../ui/avatar";
import EditNameDialog from "./EditNameDialog";

const ProfileHeader = () => {
  const { statistics, avatar_url, user_id, name } =
    useAsyncValue() as UserProfile;
  const { user, nickname } = useAppSelector((state) => state.user);
  const isThisUser = user_id === user?.user_id;
  const hasWinrateStat =
    statistics.gamesPlayed !== 0 && statistics.gamesWon !== 0;

  return (
    <header className="flex flex-col items-center justify-between gap-6 ltr sm:flex-row">
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <Avatar className="w-32 h-32 border-[6px] p-1">
          <AvatarImage
            src={avatar_url}
            alt={isThisUser ? nickname : name}
            className="rounded-full"
          />
        </Avatar>
        <div className="flex items-center gap-2">
          <h1 className="text-4xl tracking-tight font-bold">
            {isThisUser ? nickname : name}
          </h1>
          {isThisUser && <EditNameDialog />}
        </div>
      </div>
      <div>
        <div className="text-center">
          <div className="text-2xl">
            {hasWinrateStat
              ? Math.round((statistics.gamesWon / statistics.gamesPlayed) * 100)
              : 0}
            %
          </div>
          <span className="text-muted-foreground">אחוז נצחונות</span>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
