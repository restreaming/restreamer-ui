import React from "react";

const NotifyContext = React.createContext({
  Dispatch: (..._args: any[]) => {},
});

export const NotifyProvider = NotifyContext.Provider;
export const NotifyConsumer = NotifyContext.Consumer;

export default NotifyContext;
