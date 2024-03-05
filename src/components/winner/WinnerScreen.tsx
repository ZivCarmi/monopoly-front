import { useAppSelector } from "@/app/hooks";
import { Dices } from "lucide-react";
import PlayerCharacter from "../player/PlayerCharacter";
import PlayerName from "../player/PlayerName";
import WinnerScreenActions from "./WinnerScreenActions";
import PlayerNamePlate from "../player/PlayerNamePlate";

const WinnerScreen = () => {
  const { winner } = useAppSelector((state) => state.game);

  if (!winner) {
    return null;
  }

  return (
    <>
      <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <div className="absolute inset-0 z-50 text-center flex items-center justify-center flex-col pb-10 gap-4">
        <Dices size={120} />
        <h1 className="text-9xl/[7rem] tracking-tighter mb-8">משחק נגמר!</h1>
        <div className="text-3xl tracking-tight">המנצח הוא...</div>
        <PlayerNamePlate className="gap-8 justify-center -mt-4 mb-4">
          <PlayerCharacter character={winner.character} width="25%" />
          <h2 className="text-5xl font-semibold">
            <PlayerName name={winner.name} color={winner.color} />
          </h2>
        </PlayerNamePlate>
        <WinnerScreenActions />
      </div>
    </>
  );
};

export default WinnerScreen;
