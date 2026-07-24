import React from "react";

import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import * as Encoders from "./coders/Encoders";
import * as Decoders from "./coders/Decoders";
import Select from "./Select";
import H from "../utils/help";

export default function EncodingSelect(props: Any) {
  const { i18n } = useLingui();

  const profile = props.profile;
  const availableEncoders =
    props.type === "video"
      ? props.skills.encoders.video
      : props.skills.encoders.audio;
  const availableDecoders =
    props.type === "video" ? props.skills.decoders.video : [];

  const handleDecoderChange = (event: Any) => {
    const decoder = profile.decoder;
    const stream = props.streams[profile.stream];
    decoder.coder = event.target.value;

    // If the coder changes, use the coder's default settings
    const c =
      props.type === "audio"
        ? Decoders.Audio.Get(decoder.coder)
        : Decoders.Video.Get(decoder.coder);

    if (c !== null) {
      const defaults = c.defaults(stream, props.skills);
      decoder.settings = defaults.settings;
      decoder.mapping = defaults.mapping;
    }

    props.onChange(profile.encoder, decoder, false);
  };

  const handleDecoderSettingsChange = (
    settings: Any,
    mapping: Any,
    automatic: Any,
  ) => {
    const decoder = profile.decoder;

    decoder.settings = settings;
    decoder.mapping = mapping;

    props.onChange(profile.encoder, decoder, automatic);
  };

  const handleEncoderChange = (event: Any) => {
    const encoder = profile.encoder;
    const stream = props.streams[profile.stream];
    encoder.coder = event.target.value;

    // If the coder changes, use the coder's default settings
    const c =
      props.type === "audio"
        ? Encoders.Audio.Get(encoder.coder)
        : Encoders.Video.Get(encoder.coder);

    if (c !== null) {
      const defaults = c.defaults(stream, props.skills);
      encoder.settings = defaults.settings;
      encoder.mapping = defaults.mapping;
    }

    props.onChange(encoder, profile.decoder, false);
  };

  const handleEncoderSettingsChange = (
    settings: Any,
    mapping: Any,
    automatic: Any,
  ) => {
    const encoder = profile.encoder;

    encoder.settings = settings;
    encoder.mapping = mapping;

    props.onChange(encoder, profile.decoder, automatic);
  };

  const handleEncoderHelp = (topic: Any) => (event: Any) => {
    event.preventDefault();
    H("encoder-" + topic);
  };

  const stream =
    profile.stream >= 0 && profile.stream < props.streams.length
      ? props.streams[profile.stream]
      : null;

  if (stream === null) {
    return null;
  }

  if (stream.type !== props.type) {
    return null;
  }

  const allowCopy = props.codecs.includes(stream.codec);
  const encoderRegistry =
    props.type === "video" ? Encoders.Video : Encoders.Audio;
  const decoderRegistry =
    props.type === "video" ? Decoders.Video : Decoders.Audio;
  if (props.type !== "video" && props.type !== "audio") {
    return null;
  }

  const coder = encoderRegistry.Get(profile.encoder.coder);
  const EncoderSettings =
    coder !== null && availableEncoders.includes(coder.coder)
      ? coder.component
      : null;
  const encoderSettings = EncoderSettings ? (
    <EncoderSettings
      stream={stream}
      settings={profile.encoder.settings}
      skills={props.skills}
      onChange={handleEncoderSettingsChange}
    />
  ) : null;
  const encoderSettingsHelp =
    coder !== null &&
    availableEncoders.includes(coder.coder) &&
    props.type === "video" &&
    !["copy", "none", "rawvideo"].includes(coder.coder)
      ? handleEncoderHelp(coder.coder)
      : null;

  const encoderList: Any[] = [];

  for (const c of encoderRegistry.List()) {
    // Does ffmpeg support the coder?
    if (!availableEncoders.includes(c.coder)) {
      continue;
    }

    // Is the encoder in the list of codec we allow as target?
    if (!props.codecs.includes(c.codec)) {
      continue;
    }

    if (c.coder === "copy") {
      if (allowCopy === true) {
        encoderList.push(
          <MenuItem value={c.coder} key={c.coder}>
            {c.name}
          </MenuItem>,
        );
      }
    } else {
      encoderList.push(
        <MenuItem value={c.coder} key={c.coder}>
          {c.name}
        </MenuItem>,
      );
    }
  }

  if (encoderSettings === null || encoderList.length === 0) {
    return (
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography>
            <Trans>No suitable encoder found.</Trans>
          </Typography>
        </Grid>
      </Grid>
    );
  }

  const decoderSettings = ((...args: Any[]) => {
    void args;
    if (coder.coder !== "copy" && coder.coder !== "none") {
      const c = decoderRegistry.Get(profile.decoder.coder);
      if (c !== null && availableDecoders.includes(c.coder)) {
        const Settings = c.component;

        return (
          <Settings
            stream={stream}
            settings={profile.decoder.settings}
            skills={props.skills}
            onChange={handleDecoderSettingsChange}
          />
        );
      }
    }

    return null;
  })();
  const decoderList: Any[] = [];

  if (coder.coder !== "copy" && coder.coder !== "none") {
    // List all decoders for the codec of the stream
    for (const c of decoderRegistry.GetCodersForCodec(
      stream.codec,
      availableDecoders,
      "Any",
    )) {
      decoderList.push(
        <MenuItem value={c.coder} key={c.coder}>
          {c.name}
        </MenuItem>,
      );
    }
  }

  // TODO: in case there's no decoder for a codec it should be mentioned.

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Typography>
          <Trans>Select your encoding setting:</Trans>
        </Typography>
      </Grid>
      <Grid size={12}>
        <Select
          label={<Trans>Codec</Trans>}
          value={profile.encoder.coder}
          onChange={handleEncoderChange}
        >
          <MenuItem value="none" disabled>
            {i18n._(t`Choose codec ...`)}
          </MenuItem>
          {encoderList}
        </Select>
      </Grid>
      {decoderList.length >= 2 && (
        <React.Fragment>
          <Grid size={12}>
            <Select
              label={<Trans>Decoder</Trans>}
              value={profile.decoder.coder}
              onChange={handleDecoderChange}
            >
              {decoderList}
            </Select>
          </Grid>
          <Grid size={12}>{decoderSettings}</Grid>
        </React.Fragment>
      )}
      <Grid size={12}>{encoderSettings}</Grid>
      {encoderSettingsHelp !== null && (
        <Grid size={12}>
          <Trans>
            <Link color="secondary" href="#" onClick={encoderSettingsHelp}>
              Compatibility list
            </Link>
          </Trans>
        </Grid>
      )}
    </Grid>
  );
}

EncodingSelect.defaultProps = {
  type: "",
  streams: [],
  profile: {},
  codecs: [],
  skills: {},
  onChange: function (...args: Any[]) {
    void args;
  },
};
