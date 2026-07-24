import React from "react";

import Helper from "../../helper";

function createMapping(_settings: Any, stream: Any, skills: Any) {
  void _settings;
  stream = Helper.InitStream(stream);
  skills = Helper.InitSkills(skills);
  void skills;

  const local = ["-an"];

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

const coder = "none";
const name = "No Audio";
const codec = "none";
const type = "audio";
const hwaccel = false;

function summarize() {
  return `${name}`;
}

function defaults(stream: Any, skills: Any) {
  const settings: DynamicObject = {};

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
