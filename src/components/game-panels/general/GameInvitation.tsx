import { Settings } from "lucide-react";
import { Button } from "../../ui/button";
import GamePanel from "../../ui/game-panel";
import { Input } from "../../ui/input";
import CopyRoomButton from "./CopyRoomButton";

const GameInvitation = () => {
  return (
    <GamePanel>
      <h2 className="text-center text-pretty mb-4 text-muted-foreground">
        שתף את המשחק
      </h2>
      <div className="flex gap-4">
        <Input
          value={location.href}
          className="ltr min-w-6"
          readOnly
          onFocus={(e) => e.target.select()}
        />
        <CopyRoomButton />
        <Button className="">
          <Settings className="w-4 h-4 me-2" />
          הגדרות
        </Button>
      </div>
    </GamePanel>
  );
};

export default GameInvitation;
