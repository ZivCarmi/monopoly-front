export type ValidTrade = { valid: true; tradeId: string };
export type TradeErrorReason = "properties" | "money" | "";
export type InvalidTrade = {
  valid: false;
  tradeId: string;
  error: {
    reason: TradeErrorReason;
    message: string;
    playerId: string;
  };
};

export type TradeValidityData = ValidTrade | InvalidTrade;
