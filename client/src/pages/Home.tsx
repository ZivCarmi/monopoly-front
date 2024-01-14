import { useAppSelector } from "@/app/hooks";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { KeyRound, Users2 } from "lucide-react";
import CreateRoom from "@/components/CreateRoom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const toastData = useAppSelector((state) => state.ui.toast);
  const { toast } = useToast();

  useEffect(() => {
    if (toastData) {
      toast({
        variant: toastData.variant,
        title: toastData.title,
      });
    }
  }, [toastData]);

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        asChild
        className="bg-gradient-to-tl from-pink-500 to-yellow-500 bg-pos-0 hover:bg-pos-100 bg-size-100-400 transition-all duration-500"
      >
        <Link to="/rooms">
          <Users2 className="mr-2 h-4 w-4" />
          All Game Rooms
        </Link>
      </Button>
      <CreateRoom>
        <KeyRound className="mr-2 h-4 w-4" />
        Create a Private Room
      </CreateRoom>
    </div>
  );
};

export default HomePage;
