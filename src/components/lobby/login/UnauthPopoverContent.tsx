import { BASE_URL } from "@/api/config";
import { Button, ButtonProps } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Svg from "@/components/ui/svg";
import { cn } from "@/utils";
import { LogIn } from "lucide-react";

const UnauthPopoverContent = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto px-3 py-2" variant="ghost">
          <Icon icon={LogIn} />
          התחבר
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 border-none">
        <p className="text-muted-foreground text-center text-sm mb-4">
          בחר דרך התחברות:
        </p>
        <div className="space-y-2 ltr">
          <LoginButton
            name="google"
            className="from-[#174EA6] to-[#4285F4]"
            onClick={() => (window.location.href = `${BASE_URL}/auth/google`)}
          />
          <LoginButton
            name="discord"
            className="from-[#424549] to-[#282b30]"
            onClick={() => (window.location.href = `${BASE_URL}/auth/discord`)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface LoginButtonProps extends ButtonProps {
  name: string;
}

export const LoginButton = ({
  name,
  className,
  ...props
}: LoginButtonProps) => {
  return (
    <Button
      className={cn(
        "w-full relative bg-gradient-to-br overflow-hidden before:absolute before:inset-0 before:hover:bg-white before:opacity-0 before:hover:opacity-10 before:transition-all before:duration-300",
        className
      )}
      {...props}
    >
      <Svg name={name} className="h-6 me-3" />
      <span className="w-full text-left capitalize">{name}</span>
    </Button>
  );
};

export default UnauthPopoverContent;
