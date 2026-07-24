import React from "react";

import VideoJS from "./videojs";

export default function Player(props) {
  const type = props.type ? props.type : "videojs-internal";

  if (type === "videojs-internal" || type === "videojs-public") {
    const config = {
      controls: props.controls,
      poster: props.poster,
      autoplay:
        type === "videojs-internal"
          ? true
          : props.autoplay
            ? props.mute === "muted"
              ? true
              : false
            : false,
      muted: type === "videojs-internal" ? "muted" : props.mute,
      liveui: true,
      responsive: true,
      fluid: true,
      plugins: {
        reloadSourceOnError: {},
      },
      sources: [{ src: props.source, type: "application/x-mpegURL" }],
    };

    return <VideoJS type={type} options={config} logo={props.logo} />;
  }
}

Player.defaultProps = {
  type: "videojs-internal",
  source: "",
  poster: "",
  controls: false,
  autoplay: false,
  mute: false,
  logo: {
    image: "",
    position: "top-right",
    link: "",
  },
  ga: {
    account: "",
    name: "",
  },
  colors: {
    seekbar: "#fff",
    buttons: "#fff",
  },
  statistics: false,
};
