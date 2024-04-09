import { useAppSelector } from "@/app/hooks";
import { Switch } from "@/components/ui/switch";
import { isHost } from "@/utils";
import { SwitchProps } from "@radix-ui/react-switch";
import SettingSelect, { SettingSelectProps } from "./SettingSelect";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const isDisabled = !isHost(userId);

  function renderContent() {
    switch (props.settingType) {
      case "select":
        return <SettingSelect disabled={isDisabled} {...props} />;
      case "switch":
        const { settingType, ...rest } = props;
        return <Switch disabled={isDisabled} {...rest} />;
    }
  }

  return (
    <div className="flex items-center">
      <div className="grow">
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0}>{renderContent()}</span>
          </TooltipTrigger>
          {isDisabled && (
            <TooltipContent className="text-balance text-center">
              רק מארח החדר יכול לשנות את הגדרות המשחק
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default Setting;
