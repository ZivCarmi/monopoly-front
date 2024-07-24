import useBackToLobby from "@/hooks/useBackToLobby";
import { isSelfPlayerParticipating } from "@/utils";
import { Link } from "react-router-dom";

const BackToLobbyLink = ({ children }: { children: React.ReactNode }) => {
  const returnToLobby = useBackToLobby();

  const backToLobbyHandler = () => {
    if (!isSelfPlayerParticipating()) {
      returnToLobby();
    }
  };

  return (
    <Link to="/" onClick={backToLobbyHandler}>
      {children}
    </Link>
  );
};

export default BackToLobbyLink;
