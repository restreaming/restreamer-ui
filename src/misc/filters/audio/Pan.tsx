import React from "react";

import { Trans } from "@lingui/react/macro";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import Select from "../../Select";

// Pan Filter
// https://ffmpeg.org/ffmpeg-filters.html#pan-1

function init(initialState: Any) {
  const state = {
    value: "inherit",
    ...initialState,
  };

  return state;
}

function createGraph(settings: Any) {
  settings = init(settings);

  const mapping: Any[] = [];

  switch (settings.value) {
    case "mute_left":
      mapping.push("pan=stereo|c1=c1");
      break;
    case "mute_right":
      mapping.push("pan=stereo|c0=c0");
      break;
    default:
      break;
  }

  return mapping;
}

// filter
function Pan(props: Any) {
  return (
    <React.Fragment>
      <Select
        label={<Trans>Pan</Trans>}
        value={props.value}
        onChange={props.onChange}
      >
        <MenuItem value="inherit">
          <Trans>Inherit</Trans>
        </MenuItem>
        <MenuItem value="mute_left">
          <Trans>Mute left</Trans>
        </MenuItem>
        <MenuItem value="mute_right">
          <Trans>Mute right</Trans>
        </MenuItem>
      </Select>
      <Typography variant="caption">
        <Trans>Mute a channel.</Trans>
      </Typography>
    </React.Fragment>
  );
}

Pan.defaultProps = {
  value: "",
  onChange: function (...args: Any[]) {
    void args;
  },
};

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

    newSettings[what] = event.target.value;

    handleChange(newSettings);
  };

  React.useEffect((...args: Any[]) => {
    void args;
    handleChange(null);
  }, []);

  return (
    <React.Fragment>
      <Grid size={12}>
        <Pan value={settings.value} onChange={update("value")} allowCustom />
      </Grid>
    </React.Fragment>
  );
}

Filter.defaultProps = {
  settings: {},
  onChange: function (...args: Any[]) {
    void args;
  },
};

const filter = "pan";
const name = "Pan";
const type = "audio";
const hwaccel = false;

function summarize(settings: Any) {
  return `${name} (${settings.value.replace(/_/i, " ")})`;
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
