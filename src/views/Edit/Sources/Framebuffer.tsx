
import { faImages } from "@fortawesome/free-solid-svg-icons";
import { useLingui } from "@lingui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import FormInlineButton from "../../../misc/FormInlineButton";
import SelectCustom from "../../../misc/SelectCustom";
import Video from "../../../misc/coders/settings/Video";

const initSettings = (initialSettings: any) => {
  if (!initialSettings) {
    initialSettings = {};
  }

  const settings = {
    device: "none",
    framerate: "25",
    ...initialSettings,
  };

  return settings;
};

const createInputs = (settings: any) => {
  const address =
    settings.device === "custom" || settings.device === "none"
      ? settings.deviceCustom
      : settings.device;
  const input = {
    address: address,
    options: [],
  };

  input.options.push("-f", "fbdev");
  input.options.push("-framerate", "" + settings.framerate);

  return [input];
};

function Source(props: any) {
  const { i18n } = useLingui();
  const settings = initSettings(props.settings);

  const handleChange = (what: any) => (event: any) => {
    const data = {};

    if (["device", "framerate"].includes(what)) {
      data[what] = event.target.value;
    }

    props.onChange({
      ...settings,
      ...data,
    });
  };

  const handleProbe = () => {
    props.onProbe(settings, createInputs(settings));
  };

  const filteredDevices = props.knownDevices.filter(
    (device: any) => device.extra !== "",
  );
  const options = filteredDevices.map((device: any) => {
    return {
      value: device.id,
      label: device.name + " (" + device.extra + ")",
    };
  });

  options.unshift({
    value: "none",
    label: i18n._(t`Choose an input device ...`),
    disabled: true,
  });

  const videoDevices = (
    <SelectCustom
      options={options}
      label={<Trans>Device</Trans>}
      customLabel={<Trans>Custom device</Trans>}
      value={settings.device}
      onChange={handleChange("device")}
      variant="outlined"
    />
  );

  return (
    <Grid container spacing={2} sx={{ mt: 0.5, alignItems: "flex-start" }}>
      <Grid size={12}>
        <Typography>
          <Trans>Select a device:</Trans>
        </Typography>
      </Grid>
      <Grid size={12}>{videoDevices}</Grid>
      <Grid size={12}>
        <Video.Framerate
          value={settings.framerate}
          onChange={handleChange("framerate")}
          allowCustom
        />
      </Grid>
      <Grid size={12}>
        <FormInlineButton onClick={handleProbe}>
          <Trans>Probe</Trans>
        </FormInlineButton>
      </Grid>
    </Grid>
  );
}

Source.defaultProps = {
  knownDevices: [],
  settings: {},
  onChange: function (settings: any) {},
  onProbe: function (settings: any, inputs: any) {},
};

function SourceIcon(props: any) {
  return (
    <FontAwesomeIcon icon={faImages} style={{ color: "#FFF" }} {...props} />
  );
}

const id = "fbdev";
const name = <Trans>Framebuffer</Trans>;
const capabilities = ["video"];
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
