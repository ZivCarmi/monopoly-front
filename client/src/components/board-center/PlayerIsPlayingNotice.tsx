import { useAppSelector } from "@/app/hooks";
import { selectCurrentPlayerTurn } from "@/slices/game-slice";

const PlayerIsPlayingNotice = () => {
  const currentPlayerTurn = useAppSelector(selectCurrentPlayerTurn);

  return (
    <>
      <img src={`/${currentPlayerTurn?.character}.png`} width={32} />
      <h2 className="text-sm">
        <span className="font-medium">{currentPlayerTurn?.name}</span> משחק...
      </h2>
    </>
  );
};

export default PlayerIsPlayingNotice;
