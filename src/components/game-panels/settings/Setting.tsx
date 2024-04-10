import { useAppSelector } from "@/app/hooks";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isHost } from "@/utils";
import { SwitchProps } from "@radix-ui/react-switch";
import { isGameStarted } from "@ziv-carmi/monopoly-utils";
import SettingSelect, { SettingSelectProps } from "./SettingSelect";

type SettingTypeSelect = {
  settingType: "select";
} & SettingSelectProps;

type SettingTypeSwitch = {
  settingType: "switch";
} & SwitchProps;

type SettingProps = {
  title: string;
  description: string;
} & (SettingTypeSelect | SettingTypeSwitch);

const Setting = ({ title, description, ...props }: SettingProps) => {
  const { userId } = useAppSelector((state) => state.user);
  const { state } = useAppSelector((state) => state.game);
  const isGameInProgress = isGameStarted(state);
  const isNotHost = !isHost(userId);
  const isDisabled = isGameInProgress || isNotHost;

  const renderSetting = () => {
    switch (props.settingType) {
      case "select":
        return <SettingSelect disabled={isDisabled} {...props} />;
      case "switch":
        const { settingType, ...rest } = props;
        return <Switch disabled={isDisabled} {...rest} />;
    }
  };

  const renderTooltipContent = () => {
    if (isGameInProgress) {
      return "אין אפשרות לשנות הגדרות במהלך משחק";
    } else if (isNotHost) {
      return "רק מארח החדר יכול לשנות את הגדרות המשחק";
    }
  };

  return (
    <div className="flex items-center gap-8">
      <div className="grow">
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>{renderSetting()}</span>
          </TooltipTrigger>
          {isDisabled && (
            <TooltipContent className="text-balance text-center">
              {renderTooltipContent()}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default Setting;
