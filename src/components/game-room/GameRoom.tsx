import { handleDices } from "@/actions/game-actions";
import {
  cityLevelChangedThunk,
  paidOutOfJailThunk,
  purchasedPropertyThunk,
  soldPropertyThunk,
  tradeAcceptedThunk,
  tradeCreatedThunk,
  tradeDeclinedThunk,
  tradeDeletedThunk,
  tradeUpdatedThunk,
} from "@/actions/socket-actions";
import { useAppDispatch } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import {
  addPlayer,
  bankruptPlayer,
  removePlayer,
  setGameSetting,
  setHostId,
  setPlayerConnection,
  setPlayerInDebt,
  setWinner,
  startGame,
  switchTurn,
} from "@/slices/game-slice";
import { resetTrade } from "@/slices/trade-slice";
import { writeLog } from "@/slices/ui-slice";
import { getPlayerName } from "@/utils";
import { GameSetting, Player, TradeType } from "@ziv-carmi/monopoly-utils";
import { useEffect } from "react";
import GameSidebar from "../game-panels/GameSidebar";
import GameInfo from "../game-panels/general/GameInfo";
import GameInvitation from "../game-panels/general/GameInvitation";
import GameScoreboard from "../game-panels/scoreboard/GameScoreboard";
import MainBoard from "./MainBoard";

const GameRoom = () => {
  const socket = useSocket();
  const dispatch = useAppDispatch();

  const onGameSettingsUpdated = (setting: GameSetting) => {
    dispatch(setGameSetting(setting));
  };

  const onPlayerConnectivity = ({
    playerId,
    isConnected,
    kickAt,
  }: {
    playerId: string;
    isConnected: boolean;
    kickAt: Player["connectionKickAt"];
  }) => {
    dispatch(setPlayerConnection({ playerId, isConnected, kickAt }));
  };

  const onPlayerCreated = (player: Player) => {
    dispatch(addPlayer({ player, isSelf: true }));
  };

  const onPlayerJoined = (player: Player) => {
    dispatch(addPlayer({ player }));
    dispatch(writeLog(`${player.name} נכנס למשחק`));
  };

  const onPlayerLeft = ({
    playerId,
    hostId,
  }: {
    playerId: string;
    hostId?: string;
  }) => {
    const player = getPlayerName(playerId);

    dispatch(removePlayer({ playerId }));
    dispatch(writeLog(`${player} עזב את המשחק`));

    if (hostId) {
      dispatch(setHostId(hostId));
    }
  };

  const onGameStarted = ({
    generatedPlayers,
    currentPlayerTurn,
  }: {
    generatedPlayers: Player[];
    currentPlayerTurn: string;
  }) => {
    dispatch(startGame({ generatedPlayers, currentPlayerTurn }));
    dispatch(writeLog("המשחק התחיל!"));
  };

  const onDiceRolled = (dices: number[]) => {
    dispatch(handleDices(dices));
  };

  const onSwitchedTurn = (nextPlayerId: string) => {
    dispatch(switchTurn({ nextPlayerId }));
  };

  const onPurchasedProperty = (propertyIndex: number) => {
    dispatch(purchasedPropertyThunk(propertyIndex));
  };

  const onSoldProperty = (propertyIndex: number) => {
    dispatch(soldPropertyThunk(propertyIndex));
  };

  const onCityLevelChange = (data: {
    propertyIndex: number;
    changeType: "upgrade" | "downgrade";
  }) => {
    dispatch(cityLevelChangedThunk(data));
  };

  const onPaidOutOfJail = () => {
    dispatch(paidOutOfJailThunk());
  };

  const onTradeCreated = (trade: TradeType) => {
    dispatch(tradeCreatedThunk(trade));
  };

  const onTradeAccepted = (tradeId: string) => {
    dispatch(tradeAcceptedThunk(tradeId));
  };

  const onTradeDeclined = (tradeId: string) => {
    dispatch(tradeDeclinedThunk(tradeId));
  };

  const onTradeUpdated = (trade: TradeType) => {
    dispatch(tradeUpdatedThunk(trade));
  };

  const onTradeDeleted = (tradeId: string) => {
    dispatch(tradeDeletedThunk(tradeId));
  };

  const onTradeReset = () => {
    dispatch(resetTrade());
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

  const onPlayerBankrupted = (playerId: string) => {
    dispatch(bankruptPlayer({ playerId }));
    dispatch(writeLog(`${getPlayerName(playerId)} פשט את הרגל`));
  };

  const onGameEnded = (winner: Player) => {
    dispatch(setWinner({ winner }));
  };

  useEffect(() => {
    socket.on("game_settings_updated", onGameSettingsUpdated);
    socket.on("player_connectivity", onPlayerConnectivity);
    socket.on("player_created", onPlayerCreated);
    socket.on("player_joined", onPlayerJoined);
    socket.on("player_left", onPlayerLeft);
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
    socket.on("deleted_trade", onTradeDeleted);
    socket.on("reset_trade", onTradeReset);
    socket.on("player_in_debt", onPlayerInDebt);
    socket.on("player_bankrupted", onPlayerBankrupted);
    socket.on("game_ended", onGameEnded);

    return () => {
      socket.off("game_settings_updated", onGameSettingsUpdated);
      socket.off("player_connectivity", onPlayerConnectivity);
      socket.off("player_created", onPlayerCreated);
      socket.off("player_joined", onPlayerJoined);
      socket.off("player_left", onPlayerLeft);
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
      socket.off("deleted_trade", onTradeDeleted);
      socket.off("reset_trade", onTradeReset);
      socket.off("player_in_debt", onPlayerInDebt);
      socket.off("player_bankrupted", onPlayerBankrupted);
      socket.off("game_ended", onGameEnded);
    };
  }, []);

  return (
    <div className="room-container" id="main-board">
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
