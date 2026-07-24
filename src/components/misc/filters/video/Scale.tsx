import React from "react";

import { Trans } from "@lingui/react/macro";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";

import Select from "../../Select";
import Video from "../../coders/settings/Video";

// Scale Filter
// https://ffmpeg.org/ffmpeg-all.html#scale-1

function init(initialState: Any) {
  const state = {
    mode: "none",
    fix: "1280x720",
    width: "1280",
    height: "720",
    ...initialState,
  };

  return state;
}

function createGraph(settings: Any) {
  settings = init(settings);

  const mapping: Any[] = [];

  if (settings.mode === "height") {
    mapping.push(`scale=-1:${settings.height}`);
  } else if (settings.mode === "width") {
    mapping.push(`scale=${settings.width}:-1`);
  } else if (settings.mode === "fix") {
    mapping.push(`scale=${settings.fix}`);
  }

  return mapping.join(",");
}

function Mode(props: Any) {
  return (
    <Select
      label={<Trans>Scale</Trans>}
      value={props.value}
      onChange={props.onChange}
    >
      <MenuItem value="none">
        <Trans>None</Trans>
      </MenuItem>
      <MenuItem value="fix">
        <Trans>Fix size</Trans>
      </MenuItem>
      <MenuItem value="height">
        <Trans>By height</Trans>
      </MenuItem>
      <MenuItem value="width">
        <Trans>By width</Trans>
      </MenuItem>
    </Select>
  );
}

Mode.defaultProps = {
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
      [what]: event.target.value,
    };

    handleChange(newSettings);
  };

  React.useEffect((...args: Any[]) => {
    void args;
    handleChange(null);
  }, []);

  return (
    <React.Fragment>
      <Grid size={settings.mode === "none" ? 12 : 4}>
        <Mode value={settings.mode} onChange={update("mode")}></Mode>
      </Grid>
      {settings.mode === "fix" && (
        <Grid size={8}>
          <Video.Size
            allowCustom
            label={<Trans>Scale size</Trans>}
            value={settings.fix}
            onChange={update("fix")}
          ></Video.Size>
        </Grid>
      )}
      {settings.mode === "width" && (
        <Grid size={8}>
          <Video.Width
            allowCustom
            label={<Trans>Scale size</Trans>}
            value={settings.width}
            onChange={update("width")}
          ></Video.Width>
        </Grid>
      )}
      {settings.mode === "height" && (
        <Grid size={8}>
          <Video.Height
            allowCustom
            label={<Trans>Scale size</Trans>}
            value={settings.height}
            onChange={update("height")}
          ></Video.Height>
        </Grid>
      )}
    </React.Fragment>
  );
}

Filter.defaultProps = {
  settings: {},
  onChange: function (...args: Any[]) {
    void args;
  },
};

const filter = "scale";
const name = "Scale";
const type = "video";
const hwaccel = false;

function summarize(settings: Any) {
  if (settings.mode === "height") {
    return `${name} (-1:${settings.height})`;
  } else if (settings.mode === "width") {
    return `${name} (${settings.width}:-1)`;
  } else if (settings.mode === "fix") {
    return `${name} (${settings.fix})`;
  }
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
