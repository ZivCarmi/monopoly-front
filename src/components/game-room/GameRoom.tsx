import {
  clearPlayerParticipation,
  handleDices,
  handleGameCard,
  handlePlayerLanding,
  handleSwitchTurn,
  walkPlayer,
} from "@/actions/game-actions";
import {
  cityLevelChangedThunk,
  movedToNextAirportThunk,
  newVotekickThunk,
  paidOutOfJailThunk,
  playerKickedThunk,
  purchasedPropertyThunk,
  removeParticipation,
  soldPropertyThunk,
  tradeAcceptedThunk,
  tradeCreatedThunk,
  tradeDeclinedThunk,
  tradeDeletedThunk,
  tradeUpdatedThunk,
  usedPardonCardThunk,
} from "@/actions/socket-actions";
import { useAppDispatch } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import useBackToLobby from "@/hooks/useBackToLobby";
import {
  addPlayer,
  allowTurnActions,
  clearPlayers,
  setCurrentPlayerVotekick,
  setGameSetting,
  setPlayerBankrupt,
  setPlayerColor,
  setPlayerConnection,
  setPlayerInDebt,
  setWinner,
  startGame,
  writeLog,
} from "@/slices/game-slice";
import { resetTrade } from "@/slices/trade-slice";
import { getPlayerName } from "@/utils";
import {
  Colors,
  GameCard,
  GameCardDeck,
  GameSetting,
  Player,
  Room,
  TradeType,
  WalkObject,
} from "@ziv-carmi/monopoly-utils";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarPanel from "../game-panels/SidebarPanel";
import InfoPanel from "../game-panels/general/InfoPanel";
import InvitationPanel from "../game-panels/general/InvitationPanel";
import ScoreboardPanel from "../game-panels/scoreboard/ScoreboardPanel";
import { useToast } from "../ui/use-toast";
import { useGameRoom } from "./GameRoomProvider";
import MainBoard from "./MainBoard";

const GameRoom = () => {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setIsVotekicked } = useGameRoom();
  const backToLobby = useBackToLobby();

  useEffect(() => {
    // const onGameUpdate = (room: Room) => {
    // dispatch(setRoom(room));
    // };

    const onGameSettingsUpdated = (setting: GameSetting) => {
      dispatch(setGameSetting(setting));
    };

    const onPlayerWalking = (walkData: WalkObject) => {
      dispatch(walkPlayer(walkData));
    };

    const onPlayerLanded = ({
      playerId,
      landedIndex,
    }: {
      playerId: string;
      landedIndex: number;
    }) => {
      dispatch(handlePlayerLanding(playerId, landedIndex));
    };

    const onGameCard = (card: GameCard) => {
      dispatch(handleGameCard(card));
    };

    const onAllowedTurnActions = (isAllowed: boolean) => {
      dispatch(allowTurnActions(isAllowed));
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
      hostId: Room["hostId"];
    }) => {
      dispatch(removeParticipation({ playerId, hostId }));
      dispatch(writeLog(`${getPlayerName(playerId)} עזב את המשחק`));
    };

    const onGameStarted = ({
      generatedPlayers,
      currentPlayerId,
    }: {
      generatedPlayers: Player[];
      currentPlayerId: string;
    }) => {
      dispatch(startGame({ generatedPlayers, currentPlayerId }));
      dispatch(writeLog("המשחק התחיל!"));
    };

    const onDiceRolled = (dices: number[]) => {
      dispatch(handleDices(dices));
    };

    const onSwitchedTurn = (nextPlayerId: string) => {
      dispatch(handleSwitchTurn(nextPlayerId));
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

    const onUsedPardonCard = (fromDeck: GameCardDeck) => {
      dispatch(usedPardonCardThunk(fromDeck));
    };

    const onMovedToNextAirport = (airportIndex: number) => {
      dispatch(movedToNextAirportThunk(airportIndex));
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
      dispatch(setPlayerBankrupt({ playerId }));
      dispatch(clearPlayerParticipation(playerId));
      dispatch(writeLog(`${getPlayerName(playerId)} פשט את הרגל`));
    };

    const onGameEnded = (winner: Player) => {
      dispatch(clearPlayers());
      dispatch(setWinner({ winner }));
    };

    const onNewVotekick = (votekickData: {
      votekicker: Player;
      votekickAt: Date;
    }) => {
      dispatch(newVotekickThunk(votekickData));
    };

    const onUpdateVotekick = (votekickAt: Date) => {
      dispatch(setCurrentPlayerVotekick({ kickAt: votekickAt }));
    };

    const onColorChanged = ({
      playerId,
      color,
    }: {
      playerId: string;
      color: Colors;
    }) => {
      dispatch(setPlayerColor({ playerId, color }));
    };

    const onPlayerKicked = (kickData: {
      playerId: string;
      hostId: Room["hostId"];
    }) => {
      const notifyOnKicked = () => {
        if (setIsVotekicked) {
          setIsVotekicked(true);
        }

        setTimeout(() => {
          navigate("/");
          backToLobby();
          toast({
            variant: "destructive",
            title: "הוסרת מהמשחק על ידי מארח החדר",
          });
        }, 0);
      };

      dispatch(playerKickedThunk(kickData, notifyOnKicked));
    };

    // socket.on("game_updated", onGameUpdate);
    socket.on("game_settings_updated", onGameSettingsUpdated);
    socket.on("player_walking", onPlayerWalking);
    socket.on("player_landed", onPlayerLanded);
    socket.on("game_card", onGameCard);
    socket.on("allow_turn_actions", onAllowedTurnActions);
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
    socket.on("used_pardon_card", onUsedPardonCard);
    socket.on("moved_to_next_airport", onMovedToNextAirport);
    socket.on("created_trade", onTradeCreated);
    socket.on("accepted_trade", onTradeAccepted);
    socket.on("declined_trade", onTradeDeclined);
    socket.on("updated_trade", onTradeUpdated);
    socket.on("deleted_trade", onTradeDeleted);
    socket.on("reset_trade", onTradeReset);
    socket.on("player_in_debt", onPlayerInDebt);
    socket.on("player_bankrupted", onPlayerBankrupted);
    socket.on("game_ended", onGameEnded);
    socket.on("new_votekick", onNewVotekick);
    socket.on("update_votekick", onUpdateVotekick);
    socket.on("color_changed", onColorChanged);
    socket.on("player_votekicked", onPlayerKicked);

    return () => {
      // socket.off("game_updated", onGameUpdate);
      socket.off("game_settings_updated", onGameSettingsUpdated);
      socket.off("player_walking", onPlayerWalking);
      socket.off("player_landed", onPlayerLanded);
      socket.off("game_card", onGameCard);
      socket.off("allow_turn_actions", onAllowedTurnActions);
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
      socket.off("used_pardon_card", onUsedPardonCard);
      socket.off("moved_to_next_airport", onMovedToNextAirport);
      socket.off("created_trade", onTradeCreated);
      socket.off("accepted_trade", onTradeAccepted);
      socket.off("declined_trade", onTradeDeclined);
      socket.off("updated_trade", onTradeUpdated);
      socket.off("deleted_trade", onTradeDeleted);
      socket.off("reset_trade", onTradeReset);
      socket.off("player_in_debt", onPlayerInDebt);
      socket.off("player_bankrupted", onPlayerBankrupted);
      socket.off("game_ended", onGameEnded);
      socket.off("new_votekick", onNewVotekick);
      socket.off("update_votekick", onUpdateVotekick);
      socket.off("color_changed", onColorChanged);
      socket.off("player_votekicked", onPlayerKicked);
    };
  }, []);

  return (
    <div className="room-container" id="main-board">
      <div className="game-general">
        <InfoPanel />
        <InvitationPanel />
      </div>
      <MainBoard className="main-board" />
      <div className="game-sidebar">
        <ScoreboardPanel />
        <SidebarPanel />
      </div>
    </div>
  );
};

export default GameRoom;
