import React from "react";

import Helper from "../../helper";

function createMapping(_settings: Any, stream: Any, skills: Any) {
  void _settings;
  stream = Helper.InitStream(stream);
  skills = Helper.InitSkills(skills);
  void skills;

  const local = ["-codec:v", "copy"];

  const mapping = {
    global: [],
    local: local,
    filter: [],
  };

  return mapping;
}

function Coder(props: Any) {
  const settings: DynamicObject = {};
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

function summarize() {
  return `${name}`;
}

function defaults(stream: Any, skills: Any) {
  return {
    settings: {},
    mapping: createMapping({}, stream, skills),
  };
}

const coder = "copy";
const name = "Passthrough (copy)";
const codec = "copy";
const type = "video";
const hwaccel = false;

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
