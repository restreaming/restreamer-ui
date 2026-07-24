
import Grid from "@mui/material/Grid";

const Component = function (props: any) {
  return (
    <Grid container spacing={3}>
      <Grid
        sx={{
          marginBottom: ".3em",
          marginTop: "1.2em",
          minHeight: "42px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          "& button": {
            marginRight: ".5em",
          },
          "& > div": {
            display: "flex",
            gap: 1,
            alignItems: "center",
          },
        }}
        size={12}
      >
        <div>{props.buttonsRight}</div>
        {props.buttonsLeft}
      </Grid>
    </Grid>
  );
};

export default Component;

Component.defaultProps = {
  buttonsLeft: null,
  buttonsRight: null,
};
