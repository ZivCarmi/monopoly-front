import { LobbyRoom, isGameStarted } from "@ziv-carmi/monopoly-utils";
import { LucideIcon, Play } from "lucide-react";
import PlayerMoney from "../player/PlayerMoney";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type SettingIconType = {
  id: number;
  icon: JSX.Element;
  description: React.ReactNode;
  show?: boolean;
};

const GameRoomSettingsIcons = ({ room }: { room: LobbyRoom }) => {
  const settingIcons: SettingIconType[] = [
    {
      id: 1,
      icon: <SettingIcon icon={Play} />,
      description: "משחק התחיל",
      show: isGameStarted(room.state),
    },
    {
      id: 2,
      icon: (
        <PlayerMoney money={room.settings.startingMoney} className="text-xs" />
      ),
      description: "סכום כסף התחלתי לכל שחקן",
    },
  ];

  return (
    <TooltipProvider>
      {settingIcons.map(({ id, show, icon, description }) => {
        const isShown = show ?? true;

        return (
          isShown && (
            <Tooltip key={id} delayDuration={0}>
              <TooltipTrigger asChild>
                <div tabIndex={1} className="flex items-center h-5 px-1">
                  {icon}
                </div>
              </TooltipTrigger>
              <TooltipContent>{description}</TooltipContent>
            </Tooltip>
          )
        );
      })}
    </TooltipProvider>
  );
};

const SettingIcon = ({ icon }: { icon: LucideIcon }) => {
  const Icon = icon;

  return <Icon className="w-4 h-4" />;
};

export default GameRoomSettingsIcons;
