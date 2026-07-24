"use client";

import React from "react";
import RestreamerUI from "../../RestreamerUI";

function getAddress() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("address")) {
    return urlParams.get("address") ?? "";
  }

  return window.location.pathname.endsWith("/ui/")
    ? window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname.replace(/ui\/$/, "")
    : window.location.protocol + "//" + window.location.host;
}

export function ClientOnly() {
  const [address, setAddress] = React.useState("");

  React.useEffect((...args: Any[]) => {
    void args;
    setAddress(getAddress());
  }, []);

  if (address === "") {
    return null;
  }

  return <RestreamerUI address={address} />;
}
