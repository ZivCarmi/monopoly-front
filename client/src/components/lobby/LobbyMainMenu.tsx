import CreateRoom from "@/components/CreateRoom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Gamepad2, Users2 } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "../ui/icon";

const LobbyMainMenu = () => {
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.toast) {
      toast(location.state.toast);
    }
  }, [location.state?.toast]);

  return (
    <div className="flex items-center justify-center gap-2">
      <CreateRoom>
        <Icon icon={Gamepad2} />
        צור חדר חדש
      </CreateRoom>
      <Button
        asChild
        className="bg-gradient-to-tl from-pink-500 to-yellow-500 bg-pos-0 hover:bg-pos-100 bg-size-100-400 transition-all duration-500"
      >
        <Link to="/rooms">
          <Icon icon={Users2} />
          לרשימת חדרים
        </Link>
      </Button>
    </div>
  );
};

export default LobbyMainMenu;
