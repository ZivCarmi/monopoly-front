import { useSocket } from "@/app/socket-context";
import { Footprints } from "lucide-react";
import { Button } from "../../ui/button";
import Icon from "../../ui/icon";

const BankruptcyButton = () => {
  const socket = useSocket();

  const bankruptcyHandler = () => {
    if (confirm("האם אתה בטוח שברצונך לפשוט רגל?")) {
      socket.emit("player_bankrupt");
    }
  };

  return (
    <Button onClick={bankruptcyHandler} variant="destructive">
      <Icon icon={Footprints} />
      פשוט רגל
    </Button>
  );
};
export default BankruptcyButton;
