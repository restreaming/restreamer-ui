import React from "react";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";

export default function Component(props) {
  return (
    <Box
      sx={{
        borderBottom: "2px solid",
        borderColor: "background.light1",
        p: 0,
        mb: "1em",
        mt: "-1.7em",
      }}
    >
      <Tabs
        sx={{
          "& .tab": {
            minWidth: "0px",
            margin: "unset",
            color: "text.primary",
            borderRadius: "4px 4px 0px 0px",
          },
          "@media (max-width: 415px)": {
            "& .tab": {
              padding: "10px 6px!important",
            },
          },
        }}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        value={props.value}
        onChange={props.onChange}
      >
        {props.children}
      </Tabs>
    </Box>
  );
}

Component.defaultProps = {
  value: "",
  children: null,
  onChange: function (event) {},
};
