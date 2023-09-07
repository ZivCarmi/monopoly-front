import { useAppDispatch, useAppSelector } from "@/app/hooks";
import Board from "./board/Board";
import Scoreboard from "./Scoreboard";
import { Button } from "./ui/button";
import PlayersForm from "./PlayersForm";
import { useEffect } from "react";
import { useSocket } from "@/app/socket-context";
import { startGame, switchTurn } from "@/slices/game-slice";
import Player from "@backend/types/Player";
import { writeLog } from "@/slices/ui-slice";
import {
  soldPropertyThunk,
  purchasedPropertyThunk,
  cityLevelChangedThunk,
  paidOutOfJailThunk,
} from "@/actions/socket-actions";

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

  const onPurchasedProperty = (data: {
    propertyIndex: number;
    message: string;
  }) => {
    dispatch(purchasedPropertyThunk(data));
  };

  const onSoldProperty = (data: { propertyIndex: number; message: string }) => {
    dispatch(soldPropertyThunk(data));
  };

  const onCityLevelChange = (data: {
    propertyIndex: number;
    changeType: "upgrade" | "downgrade";
    message: string;
  }) => {
    dispatch(cityLevelChangedThunk(data));
  };

  const onPaidOutOfJail = (data: { message: string }) => {
    dispatch(paidOutOfJailThunk(data));
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("game_started", onGameStarted);
    socket.on("switched_turn", onSwitchedTurn);
    socket.on("purchased_property", onPurchasedProperty);
    socket.on("sold_property", onSoldProperty);
    socket.on("city_level_change", onCityLevelChange);
    socket.on("paid_out_of_jail", onPaidOutOfJail);

    return () => {
      socket.off("game_started");
      socket.off("switched_turn");
      socket.off("purchased_property");
      socket.off("sold_property");
      socket.off("city_level_change");
      socket.off("paid_out_of_jail");
    };
  }, []);

  return (
    <>
      {!started && !isReady && <PlayersForm />}
      <div className="grid items-center justify-center min-h-screen grid-cols-[repeat(15,_1fr)]">
        <div className="flex flex-col col-start-2 col-end-7 h-full py-8">
          <Scoreboard />
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
