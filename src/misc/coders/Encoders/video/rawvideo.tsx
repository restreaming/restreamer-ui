import React from "react";

import Helper from "../../helper";

function createMapping(settings: any, stream: any, skills: any) {
  stream = Helper.InitStream(stream);
  skills = Helper.InitSkills(skills);

  const local = ["-codec:v", "rawvideo"];

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

function summarize(settings: any) {
  return `${name}`;
}

function defaults(stream: any, skills: any) {
  return {
    settings: {},
    mapping: createMapping({}, stream, skills),
  };
}

const coder = "rawvideo";
const name = "RAWVIDEO";
const codec = "rawvideo";
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
