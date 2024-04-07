import { AlertDialogContent } from "../ui/alert-dialog";
import TradeDialogCancel from "./TradeDialogCancel";

const TradeDialogContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <AlertDialogContent className="min-w-[500px] max-w-max">
      <TradeDialogCancel />
      {children}
    </AlertDialogContent>
  );
};

export default TradeDialogContent;
