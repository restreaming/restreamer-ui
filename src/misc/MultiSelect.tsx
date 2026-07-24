import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";

export default function Component(props: Any) {
  return (
    <FormControl variant={props.variant} disabled={props.disabled} fullWidth>
      <InputLabel>{props.label}</InputLabel>
      <Select
        multiple
        value={props.value}
        onChange={props.onChange}
        input={<OutlinedInput />}
        renderValue={props.renderValue}
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
  value: [],
  disabled: false,
  renderValue: (selected: Any) => selected.join(", "),
  onChange: function (...args: Any[]) {
    void args;
  },
};
