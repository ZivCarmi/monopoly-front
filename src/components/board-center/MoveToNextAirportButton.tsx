import { useSocket } from "@/app/socket-context";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { cycleNextItem, IAirport } from "@ziv-carmi/monopoly-utils";
import { getBoardAirports } from "@/utils";

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      viewport={{ once: true }}
    >
      דלג ל{nextAirport.name}
    </MotionButton>
  );
};

export default MoveToNextAirportButton;
