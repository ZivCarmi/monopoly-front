import { BASE_URL } from "@/api/config";
import { useAppSelector } from "@/app/hooks";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, LogOut } from "lucide-react";

const AuthPopoverContent = () => {
  const { user } = useAppSelector((state) => state.user);

  if (!user) {
    return null;
  }

  return (
    <>
      <PopoverTrigger className="inline-flex items-center gap-2 [&>svg]:data-[state=open]:-scale-100">
        <ChevronDown className="transition-all" />
        <Avatar>
          <AvatarImage src={user.avatar} alt={user.username} />
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-64 border-none">
        <div className="flex flex-col items-center">
          <div className="pt-4 mb-8">{user.username}</div>

          <Button
            variant="primaryFancy"
            className="text-xs h-auto"
            onClick={() => (window.location.href = `${BASE_URL}/auth/logout`)}
          >
            <Icon icon={LogOut} />
            התנתק
          </Button>
        </div>
      </PopoverContent>
    </>
  );
};

export default AuthPopoverContent;
