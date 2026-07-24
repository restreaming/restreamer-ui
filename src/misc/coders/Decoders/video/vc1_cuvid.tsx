import React from "react";

import Helper from "../../helper";

function init(initialState: any) {
  const state = {
    ...initialState,
  };

  return state;
}

function createMapping(settings: any, stream: any, skills: any) {
  stream = Helper.InitStream(stream);
  skills = Helper.InitSkills(skills);

  const mapping = {
    global: [],
    local: ["-c:v", "vc1_cuvid"],
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

const coder = "vc1_cuvid";
const name = "VC1 (CUVID)";
const codecs = ["vc1"];
const type = "video";
const hwaccel = true;

function defaults(stream: any, skills: any) {
  const settings = init({});

  return {
    settings: settings,
    mapping: createMapping(settings, stream, skills),
  };
}

export { coder, name, codecs, type, hwaccel, defaults, Coder as component };
