import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Settings } from "lucide-react";
import PanelTitle from "../PanelTitle";
import GameSettings from "../settings/GameSettings";

const SettingsModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primaryFancy" className="shrink-0">
          <Settings className="w-4 h-4 me-2" />
          הגדרות חדר
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className="gap-0">
          <DialogTitle asChild>
            <PanelTitle className="pt-0">הגדרות חדר</PanelTitle>
          </DialogTitle>
          <DialogDescription hidden>הגדרות משחק</DialogDescription>
          <GameSettings />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default SettingsModal;
