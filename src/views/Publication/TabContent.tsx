import React from "react";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";

import { Trans } from "@lingui/react/macro";

import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const PREFIX = "TabContent";

const classes = {
  serviceIcon: `${PREFIX}-serviceIcon`,
  serviceName: `${PREFIX}-serviceName`,
};

const StyledGrid = styled(Grid)(({ theme }) => ({
  [`& .${classes.serviceIcon}`]: {
    fontSize: "4rem!important",
    maxHeight: 64,
    marginTop: "-0.065em",
  },

  [`& .${classes.serviceName}`]: {
    marginTop: "-.2rem",
  },
}));

export default function TabContent(props) {
  return (
    <StyledGrid container spacing={2}>
      <Grid size={12}>
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "flex-start" }}
          spacing={2}
        >
          <props.service.icon className={classes.serviceIcon} />
          <Stack
            direction="column"
            sx={{
              alignItems: "flex-start",
              justifyContent: "center",
            }}
            spacing={0}
          >
            <Typography variant="h1" className={classes.serviceName}>
              {props.service.name}
            </Typography>
            <Typography>v{props.service.version}</Typography>
          </Stack>
        </Stack>
      </Grid>
      <Grid size={12}>
        <Divider />
      </Grid>
      {props.children}
      <Grid size={12}>
        <Divider />
      </Grid>
      <Grid size={12}>
        <Typography>
          <Trans>Maintainer:</Trans>{" "}
          <Link
            color="secondary"
            target="_blank"
            href={props.service.author.maintainer.link}
          >
            {props.service.author.maintainer.name}
          </Link>
        </Typography>
      </Grid>
    </StyledGrid>
  );
}

TabContent.defaultProps = {
  service: null,
};

TabContent.propTypes = {
  service: PropTypes.object.isRequired,
};
