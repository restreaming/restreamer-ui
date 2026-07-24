import { Trans } from "@lingui/react/macro";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import Paper from "../../../components/misc/Paper";
import PaperHeader from "../../../components/misc/PaperHeader";

export default function Probe(props: Any) {
  return (
    <Paper xs={12} md={5} marginBottom="6em" className="PaperM">
      <PaperHeader spacing={2} variant="h1" onAbort={props.onAbort} />
      <Grid
        container
        spacing={2}
        sx={{ justifyContent: "center", alignItems: "center" }}
      >
        <Grid size={12}>
          <CircularProgress color="inherit" />
        </Grid>
        <Grid size={12}>
          <Typography sx={{ textAlign: "center" }}>
            <Trans>Please wait. Probe stream data ...</Trans>
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

Probe.defaultProps = {
  onAbort: (...args: Any[]) => {
    void args;
  },
};
