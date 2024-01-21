import { useAppSelector } from "@/app/hooks";

const GameLog = () => {
  const gameLog = useAppSelector((state) => state.ui.gameLog);

  return (
    <div className="flex flex-col flex-grow mt-4 overflow-y-auto relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:h-1/2 before:w-full before:pointer-events-none before:bg-gradient-to-b before:from-transparent before:to-background before:z-10">
      <div className="text-center text-sm space-y-1.5 overflow-y-auto max-w-xl w-full mx-auto px-8 scrollbar-thin scrollbar-thumb-rounded-xl scrollbar-thumb-stone-700">
        {gameLog.map((log) => (
          <p
            key={log.message}
            className="tracking-tighter text-pretty text-slate-100 opacity-[.6]"
          >
            {log.message}
          </p>
        ))}
      </div>
    </div>
  );
};

export default GameLog;
