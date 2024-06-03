import GameSettings from "../settings/GameSettings";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const SettingsModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">
          <Settings className="w-4 h-4 me-2" />
          הגדרות
        </Button>
      </DialogTrigger>
      <DialogContent>
        <GameSettings className="my-4" />
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
