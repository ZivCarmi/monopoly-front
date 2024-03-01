import { handleDices } from "@/actions/game-actions";
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
import { useAppDispatch } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import {
  bankruptPlayer,
  setPlayerInDebt,
  setPlayers,
  setRoomHostId,
  setSelfPlayerReady,
  setWinner,
  startGame,
  switchTurn,
} from "@/slices/game-slice";
import { writeLog } from "@/slices/ui-slice";
import Room from "@backend/classes/Room";
import { TradeType } from "@backend/types/Game";
import Player from "@backend/types/Player";
import { useEffect } from "react";
import GameSidebar from "../game-panels/GameSidebar";
import GameInfo from "../game-panels/general/GameInfo";
import GameInvitation from "../game-panels/general/GameInvitation";
import GameScoreboard from "../game-panels/scoreboard/GameScoreboard";
import MainBoard from "./MainBoard";

const GameRoom = () => {
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

  const onDiceRolled = ({ dices }: { dices: number[] }) => {
    dispatch(handleDices(dices));
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

  const onPlayerInDebt = ({
    playerId,
    debtTo,
  }: {
    playerId: string;
    debtTo: Player["debtTo"];
  }) => {
    dispatch(setPlayerInDebt({ playerId, debtTo }));
  };

  const onPlayerBankrupted = ({
    playerId,
    message,
  }: {
    playerId: string;
    message: string;
  }) => {
    dispatch(bankruptPlayer({ playerId }));
    dispatch(writeLog(message));
  };

  const onGameEnded = ({ winnerId }: { winnerId: string }) => {
    dispatch(setWinner({ winnerId }));
  };

  useEffect(() => {
    socket.on("player_created", onPlayerCreated);
    socket.on("update_players", onUpdatePlayers);
    socket.on("game_started", onGameStarted);
    socket.on("switched_turn", onSwitchedTurn);
    socket.on("dice_rolled", onDiceRolled);
    socket.on("purchased_property", onPurchasedProperty);
    socket.on("sold_property", onSoldProperty);
    socket.on("city_level_change", onCityLevelChange);
    socket.on("paid_out_of_jail", onPaidOutOfJail);
    socket.on("created_trade", onTradeCreated);
    socket.on("accepted_trade", onTradeAccepted);
    socket.on("declined_trade", onTradeDeclined);
    socket.on("updated_trade", onTradeUpdated);
    socket.on("player_in_debt", onPlayerInDebt);
    socket.on("player_bankrupted", onPlayerBankrupted);
    socket.on("game_ended", onGameEnded);

    return () => {
      socket.off("player_created", onPlayerCreated);
      socket.off("update_players", onUpdatePlayers);
      socket.off("game_started", onGameStarted);
      socket.off("switched_turn", onSwitchedTurn);
      socket.off("dice_rolled", onDiceRolled);
      socket.off("purchased_property", onPurchasedProperty);
      socket.off("sold_property", onSoldProperty);
      socket.off("city_level_change", onCityLevelChange);
      socket.off("paid_out_of_jail", onPaidOutOfJail);
      socket.off("created_trade", onTradeCreated);
      socket.off("accepted_trade", onTradeAccepted);
      socket.off("declined_trade", onTradeDeclined);
      socket.off("updated_trade", onTradeUpdated);
      socket.off("player_in_debt", onPlayerInDebt);
      socket.off("player_bankrupted", onPlayerBankrupted);
      socket.off("game_ended", onGameEnded);
    };
  }, []);

  return (
    <div className="room-container">
      <div className="game-general">
        <GameInfo />
        <GameInvitation />
      </div>
      <MainBoard className="main-board" />
      <div className="game-sidebar">
        <GameScoreboard />
        <GameSidebar />
      </div>
    </div>
  );
};

export default GameRoom;
