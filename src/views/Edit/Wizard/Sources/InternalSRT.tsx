import React from "react";
import { useRouter } from "next/navigation";

import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Icon from "@mui/icons-material/KeyboardTab";
import MenuItem from "@mui/material/MenuItem";
import RefreshIcon from "@mui/icons-material/Refresh";
import Typography from "@mui/material/Typography";

import * as S from "../../Sources/Network";
import BoxTextarea from "../../../../components/misc/BoxTextarea";
import Select from "../../../../components/misc/Select";
import Textarea from "../../../../components/misc/Textarea";

const initSettings = (initialSettings: Any, config: Any) => {
  const settings: DynamicObject = {
    ...S.func.initSettings(initialSettings, config),
    mode: "push",
  };

  settings.push.type = "srt";

  return settings;
};

function Source(props: Any) {
  const { i18n } = useLingui();
  const router = useRouter();
  const config = S.func.initConfig(props.config);
  const settings = initSettings(props.settings, config);
  const skills = S.func.initSkills(props.skills);

  const handleChange = (newSettings: Any = settings) => {
    newSettings = newSettings || settings;

    const inputs = S.func.createInputs(newSettings, config, skills);
    newSettings.address = inputs[0].address;

    props.onChange(S.id, newSettings, inputs, config.srt.enabled);
  };

  const handleRefresh = (...args: Any[]) => {
    void args;
    props.onRefresh();
  };

  const update = (what: Any) => (event: Any) => {
    const value = event.target.value;
    const newSettings = {
      ...settings,
    };

    if (what in newSettings.push) {
      newSettings.push[what] = value;
    }

    handleChange(newSettings);
  };

  React.useEffect((...args: Any[]) => {
    void args;
    handleChange();
  }, []);

  let form = null;

  if (config.srt.enabled === false) {
    form = (
      <React.Fragment>
        <Grid size={12}>
          <Typography>
            <Trans>SRT server is not enabled</Trans>
          </Typography>
        </Grid>
        <Grid size={12}>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            color="primary"
            onClick={() => router.push("/settings/srt")}
          >
            <Trans>Enable SRT server ...</Trans>
          </Button>
        </Grid>
      </React.Fragment>
    );
  } else {
    const filteredDevices = props.knownDevices.filter(
      (device: Any) => device.media === "srt",
    );
    const options = filteredDevices.map((device: Any) => {
      return (
        <MenuItem key={device.id} value={device.id}>
          {device.name}
        </MenuItem>
      );
    });

    options.unshift(
      <MenuItem key="none" value="none" disabled>
        {i18n._(t`Choose an input stream ...`)}
      </MenuItem>,
    );

    options.push(
      <MenuItem key={config.channelid} value={config.channelid}>
        {i18n._(t`Send stream to address ...`)}
      </MenuItem>,
    );

    const SRT = S.func.getSRT(config);

    form = (
      <React.Fragment>
        <Grid size={12}>
          <Select
            type="select"
            label={<Trans>Input stream</Trans>}
            value={settings.push.name}
            onChange={update("name")}
          >
            {options}
          </Select>
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{ float: "right" }}
          >
            <Trans>Refresh</Trans>
          </Button>
        </Grid>
        {settings.push.name === config.channelid && (
          <React.Fragment>
            <Grid size={12}>
              <Typography>
                <Trans>Address:</Trans>
              </Typography>
            </Grid>
            <Grid size={12}>
              <BoxTextarea>
                <Textarea rows={1} value={SRT} readOnly allowCopy />
              </BoxTextarea>
            </Grid>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  return form;
}

Source.defaultProps = {
  settings: {},
  config: null,
  skills: null,
  onChange: function (...args: Any[]) {
    void args;
  },
};

function SourceIcon(props: Any) {
  return <Icon style={{ color: "#FFF" }} {...props} />;
}

const id = "srt";
const type = "network";
const name = <Trans>SRT server</Trans>;
const capabilities = ["audio", "video"];

export {
  id,
  type,
  name,
  capabilities,
  SourceIcon as icon,
  Source as component,
};
