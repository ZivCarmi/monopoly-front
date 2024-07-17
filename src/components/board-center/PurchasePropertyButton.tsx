import { useSocket } from "@/app/socket-context";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import Icon from "../ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { buttonVariant } from "./RollDices";

type PurchasePropertyButtonProps = {
  isDisabled: boolean;
  propertyIndex: number;
  price: number;
};

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
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      layout
      variants={buttonVariant}
    >
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div tabIndex={0}>
              <Button
                variant="primary"
                onClick={purchasePropertyHandler}
                disabled={isDisabled}
              >
                <Icon icon={ShoppingCart} />
                רכוש עבור ₪{price}
              </Button>
            </div>
          </TooltipTrigger>
          {isDisabled && (
            <TooltipContent className="text-balance text-center">
              אינך עם מספיק כסף כדי לרכוש נכס זה
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
};

export default PurchasePropertyButton;
