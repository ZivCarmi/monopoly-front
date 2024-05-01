import { useSocket } from "@/app/socket-context";
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import Icon from "../ui/icon";
import { motion } from "framer-motion";
import { buttonVariant } from "./RollDices";

type PurchasePropertyButtonProps = {
  isDisabled: boolean;
  propertyIndex: number;
  price: number;
};

const MotionButton = motion(Button);

const PurchasePropertyButton = ({
  isDisabled,
  propertyIndex,
  price,
}: PurchasePropertyButtonProps) => {
  const socket = useSocket();

  const purchasePropertyHandler = () => {
    socket.emit("purchase_property", propertyIndex);
  };

  return (
    <MotionButton
      variant="primaryFancy"
      onClick={purchasePropertyHandler}
      disabled={isDisabled}
      initial="hidden"
      animate="visible"
      exit="hidden"
      layout
      variants={buttonVariant}
    >
      <Icon icon={ShoppingCart} />
      רכוש עבור ₪{price}
    </MotionButton>
  );
};

export default PurchasePropertyButton;
