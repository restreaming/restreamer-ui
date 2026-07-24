"use client";

import Views from "./views";

interface AppRouteProps {
  route: string;
  restreamer: Any;
}

export default function AppRoute({ route, restreamer }: AppRouteProps) {
  const channelid = restreamer.GetCurrentChannelID();

  switch (route) {
    case "playersite":
      return <Views.Playersite restreamer={restreamer} />;
    case "settings":
      return <Views.Settings restreamer={restreamer} />;
    case "main":
      return <Views.Main key={channelid} restreamer={restreamer} />;
    case "edit":
      return <Views.Edit key={channelid} restreamer={restreamer} />;
    case "wizard":
      return <Views.Wizard key={channelid} restreamer={restreamer} />;
    case "publication":
      return <Views.AddService key={channelid} restreamer={restreamer} />;
    case "player":
      return <Views.EditPlayer key={channelid} restreamer={restreamer} />;
    case "service":
      return <Views.EditService key={channelid} restreamer={restreamer} />;
    case "channel-select":
    default:
      return <Views.ChannelSelect channelid={channelid} />;
  }
}
