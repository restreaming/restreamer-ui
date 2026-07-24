import React from "react";

import Helper from "../../helper";

function createMapping(settings: any, stream: any, skills: any) {
  stream = Helper.InitStream(stream);
  skills = Helper.InitSkills(skills);

  const local = ["-an"];

  const mapping = {
    global: [],
    local: local,
    filter: [],
  };

  return mapping;
}

function Coder(props: any) {
  const settings = {};
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

  React.useEffect(() => {
    handleChange(null);
  }, []);

  return null;
}

Coder.defaultProps = {
  stream: {},
  settings: {},
  skills: {},
  onChange: function (settings: any, mapping: any) {},
};

const coder = "none";
const name = "No Audio";
const codec = "none";
const type = "audio";
const hwaccel = false;

function summarize(settings: any) {
  return `${name}`;
}

function defaults(stream: any, skills: any) {
  const settings = {};

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
