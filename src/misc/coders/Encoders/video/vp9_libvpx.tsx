import React from "react";

import Grid from "@mui/material/Grid";

import Video from "../../settings/Video";
import Helper from "../../helper";

function init(initialState: Any) {
  const state = {
    bitrate: "4096",
    fps: "25",
    gop: "2",
    fps_mode: "auto",
    ...initialState,
  };

  return state;
}

function createMapping(settings: Any, stream: Any, skills: Any) {
  stream = Helper.InitStream(stream);
  skills = Helper.InitSkills(skills);
  void skills;

  const local = [
    "-codec:v",
    "libvpx-vp9",
    "-b:v",
    `${settings.bitrate}k`,
    "-maxrate:v",
    `${settings.bitrate}k`,
    "-bufsize:v",
    `${settings.bitrate}k`,
    "-r",
    `${settings.fps}`,
    "-sc_threshold",
    "0",
    "-pix_fmt",
    "yuv420p",
  ];

  if (settings.gop !== "auto") {
    local.push(
      "-g",
      `${Math.round(parseInt(settings.fps) * parseInt(settings.gop)).toFixed(0)}`,
      "-keyint_min",
      `${Math.round(parseInt(settings.fps) * parseInt(settings.gop)).toFixed(0)}`,
    );
  }

  if (skills.ffmpeg.version_major >= 5) {
    local.push("-fps_mode", `${settings.fps_mode}`);
  }

  const mapping = {
    global: [],
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
    <Grid container spacing={2}>
      <Grid size={12}>
        <Video.Bitrate
          value={settings.bitrate}
          onChange={update("bitrate")}
          allowCustom
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 6,
        }}
      >
        <Video.Framerate
          value={settings.fps}
          onChange={update("fps")}
          allowCustom
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 6,
        }}
      >
        <Video.GOP
          value={settings.gop}
          onChange={update("gop")}
          allowAuto
          allowCustom
        />
      </Grid>
      {skills.ffmpeg.version_major >= 5 && (
        <Grid size={12}>
          <Video.FpsMode
            value={settings.fps_mode}
            onChange={update("fps_mode")}
          />
        </Grid>
      )}
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

const coder = "libvpx-vp9";
const name = "VP9 (libvpx-vp9)";
const codec = "vp9";
const type = "video";
const hwaccel = false;

function summarize(settings: Any) {
  return `${name}, ${settings.bitrate} kbit/s, ${settings.fps} FPS, Preset: ${settings.preset}, Profile: ${settings.profile}`;
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
