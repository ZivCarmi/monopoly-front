import { useAppSelector } from "@/app/hooks";
import AuthPopoverContent from "./AuthPopoverContent";
import UnauthPopoverContent from "./UnauthPopoverContent";

const LoginPopover = () => {
  const { isAuthenticated } = useAppSelector((state) => state.user);

  return isAuthenticated ? <AuthPopoverContent /> : <UnauthPopoverContent />;
};

export default LoginPopover;
