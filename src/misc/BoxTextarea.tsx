import React from "react";

import Stack from "@mui/material/Stack";

export default function Component(props) {
  const { children, sx, ...other } = props;

  return (
    <Stack
      direction="column"
      spacing={1}
      sx={[
        {
          backgroundColor: "background.modalbox",
          borderRadius: 1,
          p: "0em 1em",
          width: "100%",
        },
        { justifyContent: "center", alignItems: "center" },
        sx,
      ]}
      {...other}
    >
      {children}
    </Stack>
  );
}

Component.defaultProps = {};
