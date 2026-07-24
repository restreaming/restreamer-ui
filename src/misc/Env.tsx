import React from "react";

import { Trans } from "@lingui/react/macro";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const HtmlTooltip = styled(Tooltip)(({ theme }) => ({
  "& .MuiTooltip-tooltip": {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.text.primary,
    maxWidth: 100,
    fontSize: ".8rem",
  },
  "& .MuiTooltip-arrow": {
    color: theme.palette.error.main,
  },
}));

export default function Component(props) {
  return (
    <HtmlTooltip
      title={
        <React.Fragment>
          <Trans>An environment variable sets this value.</Trans>
        </React.Fragment>
      }
      placement="right"
      arrow
    >
      <Chip
        size="small"
        label="ENV"
        sx={{
          color: "text.primary",
          bgcolor: "error.main",
          borderRadius: 1,
          fontWeight: "bold",
          height: 20,
        }}
        {...props}
      />
    </HtmlTooltip>
  );
}

Component.defaultProps = {};
