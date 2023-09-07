import { AppThunk } from "@/app/store";
import {
  freePlayer,
  purchaseProperty,
  sellProperty,
  setCityLevel,
  transferMoney,
} from "@/slices/game-slice";
import { setSelectedTile, writeLog } from "@/slices/ui-slice";
import { PAY_OUT_FROM_JAIL_AMOUNT } from "@backend/constants";
import { IProperty, PurchasableTile } from "@backend/types/Board";

export const purchasedPropertyThunk = ({
  propertyIndex,
  message,
}: {
  propertyIndex: number;
  message: string;
}): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedTile } = state.ui;

    dispatch(purchaseProperty({ propertyIndex }));

    dispatch(writeLog(message));

    if (selectedTile) {
      dispatch(
        setSelectedTile(
          getState().game.map.board[propertyIndex] as PurchasableTile
        )
      );
    }
  };
};

export const soldPropertyThunk = ({
  propertyIndex,
  message,
}: {
  propertyIndex: number;
  message: string;
}): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedTile } = state.ui;

    dispatch(sellProperty({ propertyIndex }));

    dispatch(writeLog(message));

    if (selectedTile) {
      dispatch(
        setSelectedTile(
          getState().game.map.board[propertyIndex] as PurchasableTile
        )
      );
    }
  };
};

export const cityLevelChangedThunk = ({
  propertyIndex,
  changeType,
  message,
}: {
  propertyIndex: number;
  changeType: "upgrade" | "downgrade";
  message: string;
}): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedTile } = state.ui;

    dispatch(setCityLevel({ propertyIndex, changeType }));

    dispatch(writeLog(message));

    if (selectedTile) {
      dispatch(
        setSelectedTile(getState().game.map.board[propertyIndex] as IProperty)
      );
    }
  };
};

export const paidOutOfJailThunk = ({
  message,
}: {
  message: string;
}): AppThunk => {
  return (dispatch, getState) => {
    const { currentPlayerTurnId } = getState().game;

    if (!currentPlayerTurnId) {
      throw new Error("currentPlayerTurnId not found in paidOutOfJailThunk");
    }

    dispatch(
      transferMoney({
        payerId: currentPlayerTurnId,
        amount: PAY_OUT_FROM_JAIL_AMOUNT,
      })
    );

    dispatch(freePlayer({ playerId: currentPlayerTurnId }));

    dispatch(writeLog(message));
  };
};
