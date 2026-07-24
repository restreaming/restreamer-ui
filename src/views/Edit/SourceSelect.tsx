import React from "react";
import SemverSatisfies from "semver/functions/satisfies";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { Trans } from "@lingui/react/macro";

import Sources from "./Sources";

function initConfig(initialConfig: Any) {
  let config: DynamicObject = {};

  for (const s of Sources.List()) {
    config[s.id] = {};
  }

  config = {
    ...config,
    ...initialConfig,
  };

  return config;
}

function init(source: Any) {
  const settings: DynamicObject = {};

  for (const id of Sources.IDs()) {
    settings[id] = {};
  }

  settings[source.type] = source.settings;

  return settings;
}

function reducer(settings: Any, data: Any) {
  const newSettings = {
    ...settings,
    ...data,
  };

  return newSettings;
}

export default function SourceSelect(props: Any) {
  // $source holds the currently selected device. It is initialized with the
  // last stored source.
  const [$source, setSource] = React.useState(props.source.type);

  // $settings is for storing the settings of the different devices, such that if
  // the user switches between them, they can be restored. It takes the last
  // stored source settings as initial value.
  const [$settings, setSettings] = React.useReducer(
    reducer,
    props.source,
    init,
  );

  const config: DynamicObject = initConfig(props.config);

  const handleSource = (source: Any) => {
    props.onChange(props.type);
    setSource(source);

    props.onSelect(props.type, source);
  };

  const handleRefresh = async (...args: Any[]) => {
    void args;
    await props.onRefresh();
  };

  const handleStore = async (name: Any, data: Any) => {
    return await props.onStore(name, data);
  };

  const handleProbe = async (settings: Any, inputs: Any) => {
    await props.onProbe(props.type, $source, settings, inputs);
  };

  const handleChange = (source: Any) => (settings: Any) => {
    setSettings({
      ...$settings,
      [source]: settings,
    });

    props.onChange(props.type, source, settings);
  };

  let sourceControl = null;

  const s = Sources.Get($source);
  if (s !== null) {
    const Component = s.component;

    if (SemverSatisfies(props.skills.ffmpeg.version, s.ffversion)) {
      sourceControl = (
        <Component
          knownDevices={props.skills.sources[$source]}
          skills={props.skills}
          config={config[$source]}
          settings={$settings[$source]}
          onChange={handleChange($source)}
          onProbe={handleProbe}
          onRefresh={handleRefresh}
          onStore={handleStore}
        />
      );
    }
  }

  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        <Select
          type={props.type}
          selected={$source}
          ffversion={props.skills.ffmpeg.version}
          availableSources={props.skills.sources}
          onSelect={handleSource}
        />
      </Grid>
      <Grid size={12}>{sourceControl}</Grid>
    </Grid>
  );
}

SourceSelect.defaultProps = {
  type: "",
  skills: {},
  source: {},
  config: {},
  onProbe: function (...args: Any[]) {
    void args;
  },
  onSelect: function (...args: Any[]) {
    void args;
  },
  onChange: function (...args: Any[]) {
    void args;
  },
  onRefresh: function (...args: Any[]) {
    void args;
  },
  onStore: function (...args: Any[]) {
    void args;
  },
};

function Select(props: Any) {
  const handleSource =
    (source: Any) =>
    (...args: Any[]) => {
      void args;
      props.onSelect(source);
    };

  const availableSources: Any[] = [];

  for (const s of Sources.List()) {
    if (!(s.id in props.availableSources)) {
      continue;
    }

    if (!s.capabilities.includes(props.type)) {
      continue;
    }

    if (!SemverSatisfies(props.ffversion, s.ffversion)) {
      continue;
    }

    const variant = s.id === props.selected ? "bigSelected" : "big";
    const Icon = s.icon;

    availableSources.push(
      <Grid
        sx={{ textAlign: "center" }}
        key={s.id}
        size={{
          xs: 6,
          md: 4,
        }}
      >
        <Button variant={variant} onClick={handleSource(s.id)}>
          <div>
            <Icon />
            <Typography>{s.name}</Typography>
          </div>
        </Button>
      </Grid>,
    );
  }

  if (availableSources.length === 0) {
    return (
      <Grid container spacing={1}>
        <Grid size={12}>
          <Typography variant="body1">
            <Trans>No sources available</Trans>
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={1}>
      {availableSources}
    </Grid>
  );
}

Select.defaultProps = {
  type: "",
  selected: "",
  ffversion: "0.0.0",
  availableSources: {},
  onSelect: function (...args: Any[]) {
    void args;
  },
};
