export const NOTIFY_MESSAGE_TRUE = "NOTIFY_MESSAGE_TRUE";
export const NOTIFY_MESSAGE_FALSE = "NOTIFY_MESSAGE_FALSE";

export const receiveMessageAction = () => {
  return {
    type: NOTIFY_MESSAGE_TRUE,
  };
};
export const sendMessageAction = () => {
  return {
    type: NOTIFY_MESSAGE_FALSE,
  };
};
