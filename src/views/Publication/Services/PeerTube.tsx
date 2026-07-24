import { Trans } from "@lingui/react/macro";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import Logo from "./logos/peertube.svg";

import Checkbox from "../../../components/misc/Checkbox";
import FormInlineButton from "../../../components/misc/FormInlineButton";

const id = "peertube";
const name = "PeerTube";
const version = "1.0";
const stream_key_link = "/videos/upload#go-live";
const description = (
  <Trans>Live-Streaming to PeerTube v3+ RTMP/S Service.</Trans>
);
const image_copyright = "";
const author = {
  creator: {
    name: "datarhei",
    link: "https://github.com/datarhei",
  },
  maintainer: {
    name: "datarhei",
    link: "https://github.com/datarhei",
  },
};
const category = "platform";
const requires = {
  protocols: ["rtmp", "rtmps"],
  formats: ["flv"],
  codecs: {
    audio: ["aac", "mp3"],
    video: ["h264"],
  },
};

function ServiceIcon(props: Any) {
  return <img src={Logo} alt="PeerTube Logo" {...props} />;
}

function init(settings: Any) {
  const initSettings = {
    rtmps: false,
    domain: "",
    key: "",
    ...settings,
  };

  return initSettings;
}

function Service(props: Any) {
  const settings = init(props.settings);

  const handleChange = (what: Any) => (event: Any) => {
    const value = event.target.value;

    if (["rtmps"].includes(what)) {
      settings[what] = !settings[what];
    } else {
      settings[what] = value;
    }

    const output = createOutput(settings);

    props.onChange([output], settings);
  };

  const createOutput = (settings: Any) => {
    const output: DynamicObject = {
      address: `${settings.rtmps ? "rtmps" : "rtmp"}://${settings.domain}:${settings.rtmps ? "1936" : "1935"}/live/${settings.key}`,
      options: ["-f", "flv"],
    };

    return output;
  };

  return (
    <Grid container spacing={2}>
      <Grid
        size={{
          xs: 12,
          md: 12,
        }}
      >
        <TextField
          variant="outlined"
          fullWidth
          label={<Trans>Instance domain</Trans>}
          placeholder="joinpeertube.org"
          value={settings.domain}
          onChange={handleChange("domain")}
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 9,
        }}
      >
        <TextField
          variant="outlined"
          fullWidth
          label={<Trans>Stream key</Trans>}
          value={settings.key}
          onChange={handleChange("key")}
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 3,
        }}
      >
        <FormInlineButton
          target="blank"
          href={`https://${settings.domain}${stream_key_link}`}
          component="a"
          disabled={settings.domain === ""}
        >
          <Trans>GET</Trans>
        </FormInlineButton>
      </Grid>
      <Grid size={12}>
        <Checkbox
          label={<Trans>Enable RTMPS transfer</Trans>}
          checked={settings.rtmps}
          onChange={handleChange("rtmps")}
        />
      </Grid>
    </Grid>
  );
}

Service.defaultProps = {
  settings: {},
  skills: {},
  metadata: {},
  streams: [],
  onChange: function (...args: Any[]) {
    void args;
  },
};

export {
  id,
  name,
  version,
  stream_key_link,
  description,
  image_copyright,
  author,
  category,
  requires,
  ServiceIcon as icon,
  Service as component,
};
