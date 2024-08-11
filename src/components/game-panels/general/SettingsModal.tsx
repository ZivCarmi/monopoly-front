import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Settings } from "lucide-react";
import GameSettings from "../settings/GameSettings";

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
        <DialogTitle hidden>הגדרות</DialogTitle>
        <DialogDescription hidden>הגדרות משחק</DialogDescription>
        <GameSettings />
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
