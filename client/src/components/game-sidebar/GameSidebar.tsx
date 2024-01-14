import { Button } from "../ui/button";
import Trade from "../trade/Trade";
import BackToLobbyButton from "./BackToLobbyButton";

const GameSidebar = () => {
  return (
    <div className="flex flex-col col-start-10 col-end-[15] h-full py-8">
      <div className="flex flex-col gap-2">
        <BackToLobbyButton />
        <Button variant="destructive">פשיטת רגל</Button>
        <Trade />
      </div>
    </div>
  );
};

export default GameSidebar;
