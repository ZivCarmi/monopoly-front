import { AppThunk } from "@/app/store";
import { resetRoom } from "@/slices/game-slice";
import { resetTrade } from "@/slices/trade-slice";

export const resetGameRoom = (): AppThunk => {
  return (dispatch) => {
    dispatch(resetRoom());
    dispatch(resetTrade());
  };
};
