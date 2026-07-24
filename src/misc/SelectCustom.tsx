import React from "react";

import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

function isCustomOption(value: Any, options: Any) {
  for (const o of options) {
    if (o.value === value) {
      return false;
    }
  }

  return true;
}

export default function Component(props: Any) {
  const [$value, setValue] = React.useState({
    value: props.value,
    isCustom: isCustomOption(props.value, props.options),
    custom:
      isCustomOption(props.value, props.options) === true ? props.value : "",
  });

  const handleChange = (event: Any) => {
    const v = event.target.value;

    const value = $value;

    value.isCustom = v === props.customKey ? true : false;
    if (value.isCustom === true) {
      value.custom = value.value;
    }
    value.value = v;

    setValue({
      ...$value,
      value: v,
      isCustom: v === props.customKey ? true : false,
    });

    props.onChange({
      target: {
        value: v === props.customKey ? value.custom : value.value,
      },
    });
  };

  const handleCustomChange = (event: Any) => {
    setValue({
      ...$value,
      custom: event.target.value,
    });

    props.onChange(event);
  };

  const options: Any[] = [];

  for (const o of props.options) {
    options.push(
      <MenuItem key={o.value} value={o.value} disabled={o.disabled === true}>
        {o.label}
      </MenuItem>,
    );
  }

  return (
    <Grid container spacing={2}>
      {props.allowCustom === true ? (
        <React.Fragment>
          {$value.isCustom === true ? (
            <React.Fragment>
              <Grid size={6}>
                <FormControl variant={props.variant} fullWidth>
                  <InputLabel>{props.label}</InputLabel>
                  <Select
                    value={props.customKey}
                    onChange={handleChange}
                    disabled={props.disabled}
                    label={props.label}
                  >
                    {options}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={6}>
                <TextField
                  variant={props.variant}
                  fullWidth
                  disabled={props.disabled === true}
                  label={props.customLabel ? props.customLabel : props.label}
                  value={$value.custom}
                  onChange={handleCustomChange}
                />
              </Grid>
            </React.Fragment>
          ) : (
            <Grid size={12}>
              <FormControl variant={props.variant} fullWidth>
                <InputLabel>{props.label}</InputLabel>
                <Select
                  value={
                    $value.isCustom === false ? $value.value : props.customKey
                  }
                  onChange={handleChange}
                  disabled={props.disabled}
                  label={props.label}
                >
                  {options}
                </Select>
              </FormControl>
            </Grid>
          )}
        </React.Fragment>
      ) : (
        <Grid size={12}>
          <FormControl variant={props.variant} fullWidth>
            <InputLabel>{props.label}</InputLabel>
            <Select
              value={$value.value}
              onChange={handleChange}
              disabled={props.disabled}
              label={props.label}
            >
              {options}
            </Select>
          </FormControl>
        </Grid>
      )}
    </Grid>
  );
}

Component.defaultProps = {
  variant: "outlined",
  label: "",
  value: "",
  disabled: false,
  customKey: "custom",
  allowCustom: false,
  onChange: function (...args: Any[]) {
    void args;
  },
};
