import { useSocket } from "@/app/socket-context";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { cycleNextItem, IAirport } from "@ziv-carmi/monopoly-utils";
import { getBoardAirports } from "@/utils";
import { buttonVariant } from "./RollDices";

const MotionButton = motion(Button);

const MoveToNextAirportButton = ({ airport }: { airport: IAirport }) => {
  const socket = useSocket();
  const nextAirport = cycleNextItem({
    array: getBoardAirports(),
    currentValue: airport,
  });

  const moveToNextAirportHandler = () => {
    socket.emit("move_to_next_airport");
  };

  return (
    <MotionButton
      variant="blueFancy"
      onClick={moveToNextAirportHandler}
      initial="hidden"
      animate="visible"
      exit="hidden"
      layout
      variants={buttonVariant}
    >
      דלג ל{nextAirport.name}
    </MotionButton>
  );
};

export default MoveToNextAirportButton;
