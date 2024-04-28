import { useSocket } from "@/app/socket-context";
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import Icon from "../ui/icon";

type PurchasePropertyButtonProps = {
  isDisabled: boolean;
  propertyIndex: number;
  price: number;
};

const PurchasePropertyButton: React.FC<PurchasePropertyButtonProps> = ({
  isDisabled,
  propertyIndex,
  price,
}) => {
  const socket = useSocket();

  const purchasePropertyHandler = () => {
    socket.emit("purchase_property", propertyIndex);
  };

  return (
    <Button
      variant="primaryFancy"
      onClick={purchasePropertyHandler}
      disabled={isDisabled}
    >
      <Icon icon={ShoppingCart} />
      רכוש עבור ₪{price}
    </Button>
  );
};

export default PurchasePropertyButton;
