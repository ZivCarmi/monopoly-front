import { useAppSelector } from "@/app/hooks";
import { Popover } from "@/components/ui/popover";
import AuthPopoverContent from "./AuthPopoverContent";
import UnauthPopoverContent from "./UnauthPopoverContent";

const LoginPopover = () => {
  const { isAuthenticated } = useAppSelector((state) => state.user);

  return (
    <Popover>
      {isAuthenticated ? <AuthPopoverContent /> : <UnauthPopoverContent />}
    </Popover>
  );
};

export default LoginPopover;
