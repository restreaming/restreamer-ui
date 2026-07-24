import React from "react";
import { useRouter } from "next/navigation";

export default function ChannelSelector(props: Any) {
  const router = useRouter();
  const [$channelid, setChannelid] = React.useState("");

  React.useEffect((...args: Any[]) => {
    void args;
    onMount();
  }, []);

  React.useEffect(
    (...args: Any[]) => {
      void args;
      router.replace(`/${$channelid}`);
    },
    [router, $channelid],
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
