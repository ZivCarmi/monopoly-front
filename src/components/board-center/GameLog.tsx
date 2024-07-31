import { useAppSelector } from "@/app/hooks";
import { GameLogType } from "@/slices/game-slice";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const GameLog = () => {
  const gameLog = useAppSelector((state) => state.game.gameLog);

  return (
    <div className="flex flex-col flex-grow mt-4 overflow-y-auto relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:h-1/2 before:w-full before:pointer-events-none before:bg-gradient-to-b before:from-transparent before:to-background before:z-10">
      <div className="text-center text-sm space-y-1.5 overflow-y-auto max-w-xl w-full mx-auto px-8 scrollbar scrollbar-w-2 scrollbar-thumb-rounded-xl scrollbar-thumb-stone-700">
        <AnimatePresence>
          {gameLog.slice(0, 30).map((log) => (
            <Log key={log.id} log={log} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Log = ({ log }: { log: GameLogType }) => {
  const [logIn5Seconds, setLogIn5Seconds] = useState(
    log.date.getTime() + 4000 - new Date().getTime()
  );

  useEffect(() => {
    if (logIn5Seconds <= 0) return;

    const interval = setInterval(() => {
      setLogIn5Seconds((prevTime) => prevTime - 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [logIn5Seconds]);

  return (
    <motion.p
      layout
      className={`tracking-tighter text-pretty text-slate-100 transition-colors ${
        logIn5Seconds > 0 ? "opacity-100" : "opacity-[.6]"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: logIn5Seconds > 0 ? 1 : 0.6 }}
      transition={{ duration: 0.25 }}
    >
      {log.message}
    </motion.p>
  );
};

export default GameLog;
