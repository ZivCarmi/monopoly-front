import useWindowSize from "@/hooks/useWindowSize";
import ChatFloat from "./ChatFloat";
import ChatFluid from "./ChatFluid";

const ChatPanel = () => {
  const width = useWindowSize();

  return width <= 1600 ? <ChatFloat /> : <ChatFluid />;
};

export default ChatPanel;
