import React from "react";
import { useNavigate } from "react-router-dom";

export default function ChannelSelector(props: Any) {
  const navigate = useNavigate();
  const [$channelid, setChannelid] = React.useState("");

  React.useEffect((...args: Any[]) => {
    void args;
    onMount();
  }, []);

  React.useEffect(
    (...args: Any[]) => {
      void args;
      navigate(`/${$channelid}`, { replace: true });
    },
    [navigate, $channelid],
  );

  const onMount = (...args: Any[]) => {
    void args;
    setChannelid(props.channelid);
  };

  return null;
}

ChannelSelector.defaultProps = {
  channelid: "",
};
