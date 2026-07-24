import React from "react";

import { Trans } from "@lingui/react/macro";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Icon from "@mui/icons-material/Cached";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import Dialog from "../../../components/misc/modals/Dialog";
import Filesize from "../../../components/misc/Filesize";
import FormInlineButton from "../../../components/misc/FormInlineButton";
import UploadButton from "../../../components/misc/UploadButton";

const imageTypes = [
  { mimetype: "image/*", extension: "image", maxSize: 2 * 1024 * 1024 },
  { mimetype: "video/*", extension: "video", maxSize: 25 * 1024 * 1024 },
];

const initSettings = (initialSettings: Any) => {
  if (!initialSettings) {
    initialSettings = {};
  }

  const settings: DynamicObject = {
    address: "",
    mimetype: "",
    ...initialSettings,
  };

  return settings;
};

const createInputs = (settings: Any) => {
  const address = "{diskfs}" + settings.address;
  const input: DynamicObject = {
    address: address,
    options: [],
  };

  if (settings.mimetype.startsWith("image/")) {
    input.options.push("-framerate", "1");
    input.options.push("-loop", "1");
  } else {
    input.options.push("-stream_loop", "-1");
  }
  input.options.push("-re");

  return [input];
};

function Source(props: Any) {
  const settings = initSettings(props.settings);
  const [$saving, setSaving] = React.useState(false);
  const [$error, setError] = React.useState({
    open: false,
    title: "",
    message: "",
  });

  const handleFileUpload = async (data: Any, mimetype: Any) => {
    const path = await props.onStore("videoloop.source", data);

    props.onChange({
      ...settings,
      address: path,
      mimetype: mimetype,
    });

    setSaving(false);
  };

  const handleUploadStart = (...args: Any[]) => {
    void args;
    setSaving(true);
  };

  const handleUploadError = (title: Any) => (err: Any) => {
    let message = null;

    switch (err.type) {
      case "nofiles":
        message = <Trans>Please select a file to upload.</Trans>;
        break;
      case "mimetype":
        message = (
          <Trans>
            The selected file type ({err.actual}) is not allowed. Allowed file
            types are {err.allowed.join(", ")}
          </Trans>
        );
        break;
      case "size":
        message = (
          <Trans>
            The selected file is too big (
            <Filesize bytes={err.actual} />
            ). Only <Filesize bytes={err.allowed} /> are allowed.
          </Trans>
        );
        break;
      case "read":
        message = (
          <Trans>There was an error during upload: {err.message}</Trans>
        );
        break;
      default:
        message = <Trans>Unknown upload error</Trans>;
    }

    setSaving(false);

    showUploadError(title, message);
  };

  const showUploadError = (title: Any, message: Any) => {
    setError({
      ...$error,
      open: true,
      title: title,
      message: message,
    });
  };

  const hideUploadError = (...args: Any[]) => {
    void args;
    setError({
      ...$error,
      open: false,
    });
  };

  const handleProbe = (...args: Any[]) => {
    void args;
    props.onProbe(settings, createInputs(settings));
  };

  return (
    <React.Fragment>
      <Grid container spacing={2} sx={{ mt: 0.5, alignItems: "flex-start" }}>
        <Grid size={12}>
          <Typography variant="caption">
            <Trans>
              Upload an image or video file (
              {imageTypes.map((t: Any) => t.mimetype).join(", ")}) in order to
              loop it.
            </Trans>
          </Typography>
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
            label={<Trans>File path</Trans>}
            value={settings.address}
            readOnly
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 3,
          }}
        >
          <UploadButton
            label={<Trans>Upload</Trans>}
            acceptTypes={imageTypes}
            onStart={handleUploadStart}
            onError={handleUploadError(
              <Trans>Uploading the file failed</Trans>,
            )}
            onUpload={handleFileUpload}
          />
        </Grid>
        <Grid size={12}>
          <FormInlineButton
            onClick={handleProbe}
            disabled={!settings.address.length}
          >
            <Trans>Probe</Trans>
          </FormInlineButton>
        </Grid>
      </Grid>
      <Backdrop open={$saving}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        open={$error.open}
        title={$error.title}
        onClose={hideUploadError}
        buttonsRight={
          <Button variant="outlined" color="primary" onClick={hideUploadError}>
            <Trans>OK</Trans>
          </Button>
        }
      >
        <Typography variant="body1">{$error.message}</Typography>
      </Dialog>
    </React.Fragment>
  );
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
  onRefresh: function (...args: Any[]) {
    void args;
  },
  onStore: function (...args: Any[]) {
    void args;
    return "";
  },
};

function SourceIcon(props: Any) {
  return <Icon style={{ color: "#FFF" }} {...props} />;
}

const id = "videoloop";
const name = <Trans>Loop</Trans>;
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
