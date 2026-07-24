import React from "react";

import Helper from "../../helper";

function init(initialState: Any) {
  const state = {
    ...initialState,
  };

  return state;
}

function createMapping(_settings: Any, stream: Any, skills: Any) {
  void _settings;
  stream = Helper.InitStream(stream);
  skills = Helper.InitSkills(skills);
  void skills;

  const mapping = {
    global: [],
    local: ["-c:v", "h264_cuvid"],
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

  React.useEffect((...args: Any[]) => {
    void args;
    handleChange(null);
  }, []);

  return null;
}

Coder.defaultProps = {
  stream: {},
  settings: {},
  skills: {},
  onChange: function (...args: Any[]) {
    void args;
  },
};

// -c:v h264_cuvid -i ...

const coder = "h264_cuvid";
const name = "H.264 (CUVID)";
const codecs = ["h264"];
const type = "video";
const hwaccel = true;

function defaults(stream: Any, skills: Any) {
  const settings = init({});

  return {
    settings: settings,
    mapping: createMapping(settings, stream, skills),
  };
}

export { coder, name, codecs, type, hwaccel, defaults, Coder as component };
