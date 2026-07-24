import React from "react";

const NotifyContext = React.createContext({
  Dispatch: (...args: Any[]) => {
    void args;
  },
});

export const NotifyProvider = NotifyContext.Provider;
export const NotifyConsumer = NotifyContext.Consumer;

export default NotifyContext;
