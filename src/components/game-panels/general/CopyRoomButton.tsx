import { Check, Copy } from "lucide-react";
import { Button } from "../../ui/button";
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

  return isCopied ? (
    <Button className="inline-flex items-center" variant="ghost" asChild>
      <div>
        <Check className="w-4 h-4 me-2 text-green-600" />
        הועתק
      </div>
    </Button>
  ) : (
    <Button onClick={copyHandler} className="">
      <Copy className="w-4 h-4 me-2" />
      העתק
    </Button>
  );
};

export default CopyRoomButton;
