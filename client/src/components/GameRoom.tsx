import {
  cityLevelChangedThunk,
  paidOutOfJailThunk,
  purchasedPropertyThunk,
  soldPropertyThunk,
  tradeAcceptedThunk,
  tradeCreatedThunk,
  tradeDeclinedThunk,
  tradeUpdatedThunk,
} from "@/actions/socket-actions";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context2";
import { startGame, switchTurn } from "@/slices/game-slice";
import { writeLog } from "@/slices/ui-slice";
import { TradeType } from "@backend/types/Game";
import Player from "@backend/types/Player";
import { useEffect } from "react";
import PlayersForm from "./PlayersForm";
import Scoreboard from "./Scoreboard";
import GameBoard from "./board/GameBoard";
import Trade from "./trade/Trade";
import { Button } from "./ui/button";

const GameRoom = ({ onDisconnection }: { onDisconnection: () => void }) => {
  const { isReady, started } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const socket = useSocket();

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

  const onTradeCreated = (trade: TradeType) => {
    dispatch(tradeCreatedThunk(trade));
  };

  const onTradeAccepted = (data: { tradeId: string; message: string }) => {
    dispatch(tradeAcceptedThunk(data));
  };

  const onTradeDeclined = ({ tradeId }: { tradeId: string }) => {
    dispatch(tradeDeclinedThunk({ tradeId }));
  };

  const onTradeUpdated = (trade: TradeType) => {
    dispatch(tradeUpdatedThunk(trade));
  };

  // const onOvercharged = (data: { message: string }) => {};

  useEffect(() => {
    socket.on("game_started", onGameStarted);
    socket.on("switched_turn", onSwitchedTurn);
    socket.on("purchased_property", onPurchasedProperty);
    socket.on("sold_property", onSoldProperty);
    socket.on("city_level_change", onCityLevelChange);
    socket.on("paid_out_of_jail", onPaidOutOfJail);
    socket.on("trade_created", onTradeCreated);
    socket.on("trade_accepted", onTradeAccepted);
    socket.on("trade_declined", onTradeDeclined);
    socket.on("trade_updated", onTradeUpdated);
    // socket.on("overcharged", onOvercharged);

    return () => {
      socket.off("game_started");
      socket.off("switched_turn");
      socket.off("purchased_property");
      socket.off("sold_property");
      socket.off("city_level_change");
      socket.off("paid_out_of_jail");
      socket.off("trade_created");
      socket.off("trade_accepted");
      socket.off("trade_declined");
      socket.off("trade_updated");
      // socket.off("overcharged");
    };
  }, []);

  return (
    <>
      {!started && !isReady && <PlayersForm />}
      <div className="grid items-center justify-center min-h-screen grid-cols-[repeat(15,_1fr)]">
        <div className="flex flex-col col-start-2 col-end-7 h-full py-8">
          <Scoreboard />
        </div>
        <GameBoard />
        <div className="flex flex-col col-start-10 col-end-[15] h-full py-8">
          <div className="flex flex-col gap-2">
            <Button onClick={onDisconnection}>חזרה ללובי</Button>
            <Button variant="destructive">פשיטת רגל</Button>
            <Trade />
          </div>
        </div>
      </div>
    </>
  );
};

export default GameRoom;
