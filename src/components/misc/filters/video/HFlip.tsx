import React from "react";

import { Trans } from "@lingui/react/macro";
import Grid from "@mui/material/Grid";

import Checkbox from "../../Checkbox";

// HFlip Filter
// http://ffmpeg.org/ffmpeg-all.html#hflip

function init(initialState: Any) {
  const state = {
    enabled: false,
    ...initialState,
  };

  return state;
}

function createGraph(settings: Any) {
  settings = init(settings);

  const mapping: Any[] = [];

  if (settings.enabled) {
    mapping.push("hflip");
  }

  return mapping.join(",");
}

function Filter(props: Any) {
  const settings = init(props.settings);

  const handleChange = (newSettings: Any) => {
    let automatic = false;
    if (!newSettings) {
      newSettings = settings;
      automatic = true;
    }

    props.onChange(newSettings, createGraph(newSettings), automatic);
  };

  const update = (what: Any) => (event: Any) => {
    const newSettings = {
      ...settings,
    };
    if (["enabled"].includes(what)) {
      newSettings[what] = !settings.enabled;
    } else {
      newSettings[what] = event.target.value;
    }

    handleChange(newSettings);
  };

  React.useEffect((...args: Any[]) => {
    void args;
    handleChange(null);
  }, []);

  return (
    <Grid>
      <Checkbox
        label={<Trans>Horizontal Flip</Trans>}
        checked={settings.enabled}
        onChange={update("enabled")}
      />
    </Grid>
  );
}

Filter.defaultProps = {
  settings: {},
  onChange: function (...args: Any[]) {
    void args;
  },
};

const filter = "hflip";
const name = "Horizonal Flip";
const type = "video";
const hwaccel = false;

function summarize() {
  return `${name}`;
}

function defaults() {
  const settings = init({});

  return {
    settings: settings,
    graph: createGraph(settings),
  };
}

export {
  name,
  filter,
  type,
  hwaccel,
  summarize,
  defaults,
  createGraph,
  Filter as component,
};
