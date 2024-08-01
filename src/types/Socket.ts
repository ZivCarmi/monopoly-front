export type CallbackResponseData = {
  success: boolean;
  message?: string;
};

export type EventCallback = (response: CallbackResponseData) => void;
