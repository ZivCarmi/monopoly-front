import useBackToLobby from "@/hooks/useBackToLobby";
import { Button } from "../ui/button";
import NewGameButton from "./NewGameButton";
import Icon from "../ui/icon";
import { X } from "lucide-react";

const WinnerScreenActions = () => {
  const backToLobby = useBackToLobby();

  return (
    <div className="space-x-2">
      <NewGameButton />
      <Button onClick={backToLobby}>
        <Icon icon={X} />
        חזרה ללובי
      </Button>
    </div>
  );
};
export default WinnerScreenActions;
