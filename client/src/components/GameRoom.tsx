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
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useSocket } from "@/app/socket-context";
import {
  bankruptPlayer,
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
import PlayersForm from "./PlayersForm";
import GameBoard from "./board/GameBoard";
import GameScoreboard from "./game-scoreboard/GameScoreboard";
import GameSidebar from "./game-sidebar/GameSidebar";
import WinnerScreen from "./winner/WinnerScreen";

const GameRoom = () => {
  const { isReady, started } = useAppSelector((state) => state.game);
  // const boardRef = useRef<HTMLDivElement>(null);
  // const boardSizeRef = useRef([0, 0]);
  // const scaleRef = useRef(1);
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

  const onPlayerInDebt = ({ playerId }: { playerId: string }) => {
    // handle in debt turn
    // maybe increase turn timer to allow the player to cover the debt
    console.log(`Player ID: ${playerId} in debt`);
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

  // const onResize = useCallback(() => {
  //   if (!boardRef.current) return;

  //   // const boardPadding = window.getComputedStyle(boardSizeRef.current).padding;
  //   if (
  //     boardSizeRef.current[0] !== boardRef.current.offsetWidth ||
  //     boardSizeRef.current[1] !== boardRef.current.offsetHeight
  //   ) {
  //     boardSizeRef.current = [
  //       boardRef.current.offsetWidth,
  //       boardRef.current.offsetHeight,
  //     ];

  //     const windowWidth = window.innerWidth;
  //     const windowHeight = window.innerHeight;

  //     console.log(windowWidth, windowHeight);

  //     console.log(
  //       boardSizeRef.current[0] / windowWidth,
  //       boardSizeRef.current[1] / windowHeight
  //     );

  //     // const isMax =
  //     //   boardSizeRef.current[0] >= windowWidth &&
  //     //   boardSizeRef.current[1] >= windowHeight;
  //     // const scale = Math.min(
  //     //   boardSizeRef.current[0] / windowWidth,
  //     //   boardSizeRef.current[1] / windowHeight
  //     // );
  //     // boardSizeRef.current[0] = !isMax ? windowWidth * scale : boardSizeRef.current[0];
  //     // boardSizeRef.current[1] = !isMax ? windowHeight * scale : boardSizeRef.current[1];

  //     // console.log(scaleRef.current);
  //     // console.log(boardSizeRef.current);

  //     // scaleRef.current = !isMax ? scale : 1;
  //   }
  // }, []);

  useEffect(() => {
    // onResize();
    // window.addEventListener("resize", onResize);
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
      // window.removeEventListener("resize", onResize);
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
    <>
      {!started && !isReady && <PlayersForm />}
      <div className="grid min-h-screen grid-cols-[minmax(20rem,1fr)_auto_minmax(20rem,1fr)]">
        <GameSidebar />
        <div
          className="relative p-4"
          // style={{
          //   transform: `scale(${scaleRef.current})`,
          //   width:
          //     scaleRef.current < 0 ? `${boardSizeRef.current[0]}px` : "auto",
          //   height:
          //     scaleRef.current < 0 ? `${boardSizeRef.current[1]}px` : "auto",
          // }}
          // ref={boardRef}
        >
          <GameBoard />
          <WinnerScreen />
        </div>
        <GameScoreboard />
      </div>
    </>
  );
};

export default GameRoom;
