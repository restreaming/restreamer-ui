
import { Trans } from "@lingui/react/macro";
import Icon from "@mui/icons-material/Block";

// This is a pseudo audio source for selecting no audio

const initSettings = (initialSettings: any) => {
  if (!initialSettings) {
    initialSettings = {};
  }

  const settings = {
    ...initialSettings,
  };

  return settings;
};

const createInputs = (settings: any) => {
  const input = {
    address: "",
    options: [],
  };

  return [input];
};

function Source(props: any) {
  return null;
}

Source.defaultProps = {
  knownDevices: [],
  settings: {},
  onChange: function (settings: any) {},
  onProbe: function (settings: any, inputs: any) {},
};

function SourceIcon(props: any) {
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
