import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import Icon from "../ui/icon";

const NewGameButton = () => {
  return (
    <Button>
      <Icon icon={RefreshCcw} />
      משחק חדש
    </Button>
  );
};

export default NewGameButton;
