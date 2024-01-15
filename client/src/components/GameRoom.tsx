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
import {
  setPlayers,
  setRoomHostId,
  setSelfPlayerReady,
  startGame,
  switchTurn,
} from "@/slices/game-slice";
import { writeLog } from "@/slices/ui-slice";
import { TradeType } from "@backend/types/Game";
import Player from "@backend/types/Player";
import { useEffect } from "react";
import PlayersForm from "./PlayersForm";
import GameScoreboard from "./game-scoreboard/GameScoreboard";
import GameBoard from "./board/GameBoard";
import GameSidebar from "./game-sidebar/GameSidebar";
import Room from "@backend/classes/Room";

const GameRoom = () => {
  const { isReady, started } = useAppSelector((state) => state.game);
  const socket = useSocket();
  const dispatch = useAppDispatch();

  const onPlayerCreated = () => {
    dispatch(setSelfPlayerReady());
  };

  const onUpdatePlayers = ({
    players,
    message,
    roomHostId,
  }: {
    players: Room["players"];
    message: string | string[];
    roomHostId?: string;
  }) => {
    const updatedPlayers = Object.values(players).map((player) => player);
    dispatch(setPlayers(updatedPlayers));

    if (roomHostId) {
      dispatch(setRoomHostId(roomHostId));
    }

    if (Array.isArray(message)) {
      for (let i = 0; i < message.length; i++) {
        dispatch(writeLog(message[i]));
      }
    } else {
      dispatch(writeLog(message));
    }
  };

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
    socket.on("player_created", onPlayerCreated);
    socket.on("update_players", onUpdatePlayers);
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
      socket.off("player_created", onPlayerCreated);
      socket.off("update_players", onUpdatePlayers);
      socket.off("game_started", onGameStarted);
      socket.off("switched_turn", onSwitchedTurn);
      socket.off("purchased_property", onPurchasedProperty);
      socket.off("sold_property", onSoldProperty);
      socket.off("city_level_change", onCityLevelChange);
      socket.off("paid_out_of_jail", onPaidOutOfJail);
      socket.off("trade_created", onTradeCreated);
      socket.off("trade_accepted", onTradeAccepted);
      socket.off("trade_declined", onTradeDeclined);
      socket.off("trade_updated", onTradeUpdated);
      // socket.off("overcharged");
    };
  }, []);

  return (
    <>
      {!started && !isReady && <PlayersForm />}
      <div className="grid items-center justify-center min-h-screen grid-cols-[repeat(15,_1fr)]">
        <GameScoreboard />
        <GameBoard />
        <GameSidebar />
      </div>
    </>
  );
};

export default GameRoom;
