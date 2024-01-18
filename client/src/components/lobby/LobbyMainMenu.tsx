import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { KeyRound, Users2 } from "lucide-react";
import CreateRoom from "@/components/CreateRoom";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
      <Button
        asChild
        className="bg-gradient-to-tl from-pink-500 to-yellow-500 bg-pos-0 hover:bg-pos-100 bg-size-100-400 transition-all duration-500"
      >
        <Link to="/rooms">
          <Icon icon={Users2} />
          All Game Rooms
        </Link>
      </Button>
      <CreateRoom>
        <Icon icon={KeyRound} />
        Create a Private Room
      </CreateRoom>
    </div>
  );
};

export default LobbyMainMenu;
