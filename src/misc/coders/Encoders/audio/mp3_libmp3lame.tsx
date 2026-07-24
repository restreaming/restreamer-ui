import React from "react";

import Grid from "@mui/material/Grid";

import Audio from "../../settings/Audio";
import Helper from "../../helper";

function init(initialState: Any) {
  const state = {
    bitrate: "64",
    ...initialState,
  };

  return state;
}

function createMapping(settings: Any, stream: Any, skills: Any) {
  stream = Helper.InitStream(stream);
  skills = Helper.InitSkills(skills);
  void skills;

  // '-qscale:a', '6'
  const local = [
    "-codec:a",
    "libmp3lame",
    "-b:a",
    `${settings.bitrate}k`,
    "-shortest",
  ];

  const mapping = {
    global: [["-vsync", "drop"]],
    local: local,
    filter: [],
  };

  return mapping;
}

function Coder(props: Any) {
  const settings = init(props.settings);
  const stream = Helper.InitStream(props.stream);
  const skills = Helper.InitSkills(props.skills);

  const handleChange = (newSettings: Any) => {
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

  const update = (what: Any) => (event: Any) => {
    const value = event.target.value;

    const newSettings = {
      ...settings,
      [what]: value,
    };

    handleChange(newSettings);
  };

  React.useEffect((...args: Any[]) => {
    void args;
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
  onChange: function (...args: Any[]) {
    void args;
  },
};

const coder = "libmp3lame";
const name = "MP3 (libmp3lame)";
const codec = "mp3";
const type = "audio";
const hwaccel = false;

function summarize(settings: Any) {
  return `${name}, ${settings.bitrate} kbit/s`;
}

function defaults(stream: Any, skills: Any) {
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
