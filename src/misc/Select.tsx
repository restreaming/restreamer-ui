import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function Component(props: Any) {
  return (
    <FormControl variant={props.variant} fullWidth>
      <InputLabel>{props.label}</InputLabel>
      <Select
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
        label={props.label}
        MenuProps={{ disableScrollLock: true }}
      >
        {props.children}
      </Select>
    </FormControl>
  );
}

Component.defaultProps = {
  variant: "outlined",
  label: "",
  value: "",
  disabled: false,
  onChange: function (...args: Any[]) {
    void args;
  },
};
