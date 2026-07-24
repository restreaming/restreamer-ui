import { useRouter, useParams } from "next/navigation";

import { Trans } from "@lingui/react/macro";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import welcomeImage from "../assets/images/welcome.png";
import Paper from "../misc/Paper";
import PaperThumb from "../misc/PaperThumb";

export default function Welcome() {
  const router = useRouter();
  const { channelid: _channelid } = useParams<{
    channelid: string;
    tab?: string;
    service?: string;
    index?: string;
  }>();

  return (
    <Paper xs={12} md={6} className="PaperM">
      <Grid container spacing={2} sx={{ justifyContent: "center" }}>
        <Grid size={12}>
          <PaperThumb
            image={welcomeImage}
            title="Welcome to Restreamer v2"
            height="200px"
          />
        </Grid>
        <Grid size={12}></Grid>
        <Grid size={12}>
          <Typography sx={{ textAlign: "center" }}>
            <Trans>
              Welcome to Restreamer v2, the solution for fast and easy video
              publishing. Free for private and commercial use. Further help in
              the{" "}
              <Link
                color="secondary"
                target="_blank"
                href="https://docs.datarhei.com"
              >
                docs
              </Link>
              .
            </Trans>
          </Typography>
        </Grid>
        <Grid size={12}></Grid>
        <Grid size={12}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={() => router.push(`/${_channelid}/edit/wizard`)}
          >
            <Trans>Next: Video setup</Trans>
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
