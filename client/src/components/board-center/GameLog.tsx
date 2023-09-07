import { useAppSelector } from "@/app/hooks";

const GameLog = () => {
  const gameLog = useAppSelector((state) => state.ui.gameLog);

  return (
    <div className="text-center text-sm h-[10rem] mt-auto space-y-1 overflow-auto">
      {gameLog.map((log) => (
        <p key={log.id}>{log.message}</p>
      ))}
    </div>
  );
};

export default GameLog;
