import { BASE_URL } from "@/api/config";
import { useAppSelector } from "@/app/hooks";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const AuthPopoverContent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, nickname } = useAppSelector((state) => state.user);

  if (!user) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="inline-flex items-center gap-2 [&>svg]:data-[state=open]:-scale-100 ltr">
        <Avatar>
          <AvatarImage src={user.avatar_url} alt={nickname} />
        </Avatar>
        <ChevronDown className="transition-all" />
      </PopoverTrigger>
      <PopoverContent className="w-64 border-none">
        <div className="flex flex-col">
          <div className="text-center pt-4 mb-8">{nickname}</div>
          <div className="border-t border-b mb-8">
            <Link
              className="flex items-center gap-4 py-4 px-3 leading-4"
              onClick={() => setIsOpen(false)}
              to={`/profile/${user.user_id}`}
            >
              <Icon icon={User} className="w-5 h-5" />
              הפרופיל שלך
            </Link>
          </div>
          <Button
            variant="primaryFancy"
            className="text-xs h-auto ms-auto"
            onClick={() => (window.location.href = `${BASE_URL}/auth/logout`)}
          >
            <Icon icon={LogOut} />
            התנתק
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AuthPopoverContent;
