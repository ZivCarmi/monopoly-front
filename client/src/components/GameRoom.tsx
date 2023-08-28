import { useAppDispatch, useAppSelector } from "@/app/hooks";
import Board from "./Board";
import Scoreboard from "./Scoreboard";
import TileInfo from "./TileInfo";
import { Button } from "./ui/button";
import PlayersForm from "./PlayersForm";
import { useEffect } from "react";
import { useSocket } from "@/app/socket-context";
import {
  purchaseProperty,
  startGame,
  switchTurn,
  transferMoney,
  freePlayer,
  setPlayers,
} from "@/slices/game-slice";
import Player from "@backend/types/Player";
import { writeLog } from "@/slices/ui-slice";
import { PAY_OUT_FROM_JAIL_AMOUNT } from "@backend/constans";

const GameRoom = ({ onDisconnection }: { onDisconnection: () => void }) => {
  const { isReady, started } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const { socket } = useSocket();

  const onGameStarted = ({
    generatedPlayers,
    currentPlayerTurn,
    message,
  }: {
    generatedPlayers: Player[];
    currentPlayerTurn: string;
    message: string;
  }) => {
    dispatch(startGame({ generatedPlayers, currentPlayerTurn }));

    dispatch(writeLog(message));
  };

  const onSwitchedTurn = ({ nextPlayerId }: { nextPlayerId: string }) => {
    dispatch(switchTurn({ nextPlayerId }));
  };

  const onPurchasedProperty = ({
    playerId,
    tileIndex,
    message,
  }: {
    playerId: string;
    tileIndex: number;
    message: string;
  }) => {
    dispatch(purchaseProperty({ playerId, tileIndex }));

    dispatch(writeLog(message));
  };

  const onPaidOutOfJail = ({ player }: { player: Player }) => {
    dispatch(
      transferMoney({ payerId: player.id, amount: PAY_OUT_FROM_JAIL_AMOUNT })
    );

    dispatch(freePlayer({ playerId: player.id, forceEndTurn: true }));

    dispatch(
      writeLog(
        `${player.name} שילם $${PAY_OUT_FROM_JAIL_AMOUNT} בשביל להשתחרר מהכלא`
      )
    );
  };

  const onCreatedPlayer = ({
    players,
    message,
  }: {
    players: Player[];
    message: string;
  }) => {
    dispatch(setPlayers(players));
    dispatch(writeLog(message));
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("player_created", onCreatedPlayer);
    socket.on("game_started", onGameStarted);
    socket.on("switched_turn", onSwitchedTurn);
    socket.on("purchased_property", onPurchasedProperty);
    socket.on("paid_out_of_jail", onPaidOutOfJail);

    return () => {
      socket.off("player_created");
      socket.off("game_started");
      socket.off("switched_turn");
      socket.off("purchased_property");
      socket.off("paid_out_of_jail");
    };
  }, []);

  return (
    <>
      {!started && !isReady && <PlayersForm />}
      <div className="grid items-center justify-center min-h-screen grid-cols-[repeat(15,_1fr)]">
        <div className="flex flex-col col-start-2 col-end-7 h-full py-8">
          <Scoreboard />
          <TileInfo />
        </div>
        <Board />
        <div className="flex flex-col col-start-10 col-end-[15] h-full py-8">
          <div className="flex flex-col gap-2">
            <Button onClick={onDisconnection}>חזרה ללובי</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameRoom;
