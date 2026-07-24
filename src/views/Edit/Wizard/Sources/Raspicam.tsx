import React from "react";

import { faRaspberryPi } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Trans } from "@lingui/react/macro";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import * as S from "../../Sources/Raspicam";
import Select from "../../../../components/misc/Select";

function initSettings(initialSettings: Any, knownDevices: Any) {
  const settings: DynamicObject = {
    ...S.func.initSettings(initialSettings),
  };

  const devices = initDevices(knownDevices);

  if (devices.length !== 0) {
    let found = false;
    for (const device of devices) {
      if (settings.device === device.id) {
        found = true;
        break;
      }
    }

    if (found === false) {
      settings.device = "";
    }
  }

  if (devices.length !== 0) {
    const device = devices[0];

    if (settings.device.length === 0) {
      settings.device = device.id;
    }
  }

  return settings;
}

function initDevices(initialDevices: Any) {
  const devices = initialDevices.filter(
    (device: Any) =>
      device.media === "video" &&
      device.extra.match(/bcm2835[-_]v4l2/) !== null,
  );

  return devices;
}

function Source(props: Any) {
  const settings = initSettings(props.settings, props.knownDevices);
  const devices = initDevices(props.knownDevices);

  const handleChange = (newSettings: Any = settings) => {
    newSettings = newSettings || settings;

    props.onChange(S.id, newSettings, S.func.createInputs(newSettings), true);
  };

  const update = (what: Any) => (event: Any) => {
    const value = event.target.value;
    const newSettings = settings;

    if (what in newSettings) {
      newSettings[what] = value;
    }

    handleChange(newSettings);
  };

  React.useEffect((...args: Any[]) => {
    void args;
    handleChange();
  }, []);

  const options = devices.map((device: Any) => {
    return (
      <MenuItem key={device.id} value={device.id}>
        {device.name} ({device.id})
      </MenuItem>
    );
  });

  const videoDevices = (
    <Select
      label={<Trans>Video device</Trans>}
      value={settings.device}
      onChange={update("device")}
    >
      {options}
    </Select>
  );

  return (
    <React.Fragment>
      <Grid size={12}>
        <Typography>
          <Trans>Select a device:</Trans>
        </Typography>
      </Grid>
      <Grid size={12}>{videoDevices}</Grid>
    </React.Fragment>
  );
}

Source.defaultProps = {
  knownDevices: [],
  settings: {},
  onChange: function (...args: Any[]) {
    void args;
  },
};

function SourceIcon(props: Any) {
  return (
    <FontAwesomeIcon
      icon={faRaspberryPi}
      style={{ color: "#FFF" }}
      {...props}
    />
  );
}

const id = "raspicam";
const type = "raspicam";
const name = <Trans>Raspberry Pi camera</Trans>;
const capabilities = ["video"];

export {
  id,
  type,
  name,
  capabilities,
  SourceIcon as icon,
  Source as component,
};
