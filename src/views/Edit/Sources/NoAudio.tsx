import { Trans } from "@lingui/react/macro";
import Icon from "@mui/icons-material/Block";

// This is a pseudo audio source for selecting no audio

const initSettings = (initialSettings: Any) => {
  if (!initialSettings) {
    initialSettings = {};
  }

  const settings: DynamicObject = {
    ...initialSettings,
  };

  return settings;
};

const createInputs = (...args: Any[]) => {
  void args;
  const input: DynamicObject = {
    address: "",
    options: [],
  };

  return [input];
};

function Source() {
  return null;
}

Source.defaultProps = {
  knownDevices: [],
  settings: {},
  onChange: function (...args: Any[]) {
    void args;
  },
  onProbe: function (...args: Any[]) {
    void args;
  },
};

function SourceIcon(props: Any) {
  return <Icon {...props} />;
}

const id = "noaudio";
const name = <Trans>No audio</Trans>;
const capabilities = ["audio"];
const ffversion = "^4.1.0 || ^5.0.0 || ^6.1.0";

const func = {
  initSettings,
  createInputs,
};

export {
  id,
  name,
  capabilities,
  ffversion,
  SourceIcon as icon,
  Source as component,
  func,
};
