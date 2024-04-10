import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

const CopyRoomButton = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyHandler = () => {
    window.navigator.clipboard.writeText(location.href);
    setIsCopied(true);
  };

  useEffect(() => {
    if (!isCopied) return;

    setTimeout(() => setIsCopied(false), 4000);
  }, [isCopied]);

  return (
    <div className="w-full relative">
      {isCopied && (
        <div className="w-full absolute inset-0 z-20 flex items-center justify-center bg-background/80 rounded-md tracking-wider text-sm font-bold">
          <Check className="w-4 h-4 me-2 text-green-600" />
          הועתק
        </div>
      )}
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0}>
              <Input
                value={location.href}
                className="ltr min-w-6 text-muted-foreground"
                readOnly
                onFocus={(e) => e.target.select()}
              />
              <span className="absolute inset-y-0 rounded-tr-md border border-l-0 rounded-br-md z-10 bg-background px-3 py-2 flex justify-start items-center">
                <Copy className="w-4 h-4" />
              </span>
              <button
                onClick={copyHandler}
                className="w-full absolute inset-0 z-10"
              />
            </span>
          </TooltipTrigger>
          <TooltipContent>העתק קישור למשחק</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default CopyRoomButton;
