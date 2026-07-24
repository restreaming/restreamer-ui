import React from "react";

import Grid from "@mui/material/Grid";

import Audio from "../../settings/Audio";
import Helper from "../../helper";

function init(initialState: any) {
  const state = {
    bitrate: "64",
    ...initialState,
  };

  return state;
}

function createMapping(settings: any, stream: any, skills: any) {
  stream = Helper.InitStream(stream);
  skills = Helper.InitSkills(skills);

  const local = [
    "-codec:a",
    "libopus",
    "-b:a",
    `${settings.bitrate}k`,
    "-shortest",
  ];

  const mapping = {
    global: [],
    local: local,
    filter: [],
  };

  return mapping;
}

function Coder(props: any) {
  const settings = init(props.settings);
  const stream = Helper.InitStream(props.stream);
  const skills = Helper.InitSkills(props.skills);

  const handleChange = (newSettings: any) => {
    let automatic = false;
    if (!newSettings) {
      newSettings = settings;
      automatic = true;
    }

    props.onChange(
      newSettings,
      createMapping(newSettings, stream, skills),
      automatic,
    );
  };

  const update = (what: any) => (event: any) => {
    const value = event.target.value;

    const newSettings = {
      ...settings,
      [what]: value,
    };

    handleChange(newSettings);
  };

  React.useEffect(() => {
    handleChange(null);
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Audio.Bitrate
          value={settings.bitrate}
          onChange={update("bitrate")}
          allowCustom
        />
      </Grid>
    </Grid>
  );
}

Coder.defaultProps = {
  stream: {},
  settings: {},
  skills: {},
  onChange: function (settings: any, mapping: any) {},
};

const coder = "libopus";
const name = "Opus (libopus)";
const codec = "opus";
const type = "audio";
const hwaccel = false;

function summarize(settings: any) {
  return `${name}, ${settings.bitrate} kbit/s`;
}

function defaults(stream: any, skills: any) {
  const settings = init({});

  return {
    settings: settings,
    mapping: createMapping(settings, stream, skills),
  };
}

export {
  coder,
  name,
  codec,
  type,
  hwaccel,
  summarize,
  defaults,
  Coder as component,
};
