import React from "react";

import Grid from "@mui/material/Grid";

const Component = function (props) {
  const { children, spacing, textAlign } = props;

  return (
    <Grid
      container
      spacing={spacing}
      sx={{ justifyContent: "center", textAlign }}
    >
      <Grid size={12}>{children}</Grid>
    </Grid>
  );
};

export default Component;

Component.defaultProps = {
  spacing: 3,
  textAlign: "left",
};
