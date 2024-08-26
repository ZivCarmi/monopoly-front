import { UserProfile } from "@/types/Auth";
import { cn } from "@/utils";
import { CalendarPlus, Gamepad2, Trophy } from "lucide-react";
import { useAsyncValue } from "react-router-dom";
import TimeAgo from "react-timeago";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import heStrings from "react-timeago/lib/language-strings/he";
import Icon from "../ui/icon";
import ProfileSection from "./ProfileSection";

const formatter = buildFormatter(heStrings);

const UserStats = () => {
  const {
    statistics: { gamesPlayed, gamesWon },
    created_at,
  } = useAsyncValue() as UserProfile;

  return (
    <ProfileSection title="סטטיסטיקות">
      <ul className="flex flex-col gap-8">
        <StatRow>
          <Icon icon={Gamepad2} className="w-6 h-6 text-card-foreground" />
          שיחק {gamesPlayed} משחקים
        </StatRow>
        <StatRow>
          <Icon icon={Trophy} className="w-6 h-6 text-card-foreground" />
          ניצח {gamesWon} משחקים
        </StatRow>
        <StatRow>
          <Icon icon={CalendarPlus} className="w-6 h-6 text-card-foreground" />
          הצטרף <TimeAgo date={created_at} formatter={formatter} />
        </StatRow>
      </ul>
    </ProfileSection>
  );
};

interface StatRowProps extends React.LiHTMLAttributes<HTMLLIElement> {}

const StatRow = ({ className, ...props }: StatRowProps) => {
  return (
    <li
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    />
  );
};

export default UserStats;
