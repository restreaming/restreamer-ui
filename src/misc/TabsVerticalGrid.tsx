
import Grid from "@mui/material/Grid";

export default function Component(props: any) {
  return (
    <Grid
      sx={{ flexGrow: 1, display: "flex", height: "100%", minWidth: 0 }}
      size={12}
    >
      {props.children}
    </Grid>
  );
}

Component.defaultProps = {
  children: null,
};
