
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function Component(props: any) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          sx={{
            color: "text.pirmary",
            "&.Mui-checked": {
              color: "text.primary",
            },
            "&.Mui-disabled": {
              color: "text.disabled",
            },
          }}
          checked={props.checked}
          onChange={props.onChange}
        />
      }
      label={props.label}
      disabled={props.disabled}
    />
  );
}

Component.defaultProps = {
  label: "",
  checked: false,
  disabled: false,
  onChange: function (event: any) {},
};
