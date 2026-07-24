import React from "react";
import { styled } from "@mui/material/styles";
import { useRouter, useParams } from "next/navigation";

import { Trans } from "@lingui/react/macro";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import WarningIcon from "@mui/icons-material/Warning";

import * as M from "../../utils/metadata";
import { anonymize } from "../../utils/anonymizer";
import useInterval from "../../hooks/useInterval";
import ActionButton from "../../misc/ActionButton";
import CopyButton from "../../misc/CopyButton";
import DebugModal from "../../misc/modals/Debug";
import H from "../../utils/help";
import Paper from "../../misc/Paper";
import PaperHeader from "../../misc/PaperHeader";
import Player from "../../misc/Player";
import Progress from "./Progress";
import Publication from "./Publication";
import ProcessModal from "../../misc/modals/Process";
import Welcome from "../Welcome";

const PREFIX = "index";

const classes = {
  gridContainerL1: `${PREFIX}-gridContainerL1`,
  gridContainerL2: `${PREFIX}-gridContainerL2`,
  link: `${PREFIX}-link`,
  playerL1: `${PREFIX}-playerL1`,
  playerL2: `${PREFIX}-playerL2`,
  playerL3: `${PREFIX}-playerL3`,
  playerWarningIcon: `${PREFIX}-playerWarningIcon`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled("div")(({ theme }: Any) => ({
  [`& .${classes.gridContainerL1}`]: {
    marginBottom: "6em",
  },

  [`& .${classes.gridContainerL2}`]: {
    paddingTop: ".6em",
  },

  [`& .${classes.link}`]: {
    marginLeft: 10,
  },

  [`& .${classes.playerL1}`]: {
    //padding: '4px 1px 4px 8px',
    paddingTop: 10,
    paddingLeft: 18,
  },

  [`& .${classes.playerL2}`]: {
    position: "relative",
    width: "100%",
    paddingTop: "56.25%",
  },

  [`& .${classes.playerL3}`]: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: theme.palette.common.black,
  },

  [`& .${classes.playerWarningIcon}`]: {
    color: theme.palette.warning.main,
    fontSize: "xxx-large",
  },
}));

export default function Main(props: Any) {
  const router = useRouter();
  const { channelid: _channelid } = useParams<{ channelid: string; tab?: string; service?: string; index?: string }>();
  const [$state, setState] = React.useState<DynamicObject>({
    ready: false,
    valid: false,
    progress: {},
    state: "disconnected",
    onConnect: null,
  });
  const [$metadata, setMetadata] = React.useState(M.getDefaultIngestMetadata());
  const [$processDetails, setProcessDetails] = React.useState({
    open: false,
    data: {
      prelude: [],
      log: [],
    },
  });
  const processLogTimer = React.useRef<
    ReturnType<typeof setInterval> | undefined
  >(undefined);
  const [$processDebug, setProcessDebug] = React.useState({
    open: false,
    data: "",
  });
  const [$config, setConfig] = React.useState<DynamicObject | null>(null);
  const [$invalid, setInvalid] = React.useState(false);

  useInterval(async (...args: Any[]) => {
    void args;
    await update();
  }, 1000);

  React.useEffect((...args: Any[]) => {
    void args;
    (async (...args: Any[]) => {
      void args;
      await load();
      await update();
    })();
  }, []);

  React.useEffect(
    (...args: Any[]) => {
      void args;
      if ($invalid === true) {
        router.replace("/");
      }
    },
    [router, $invalid],
  );

  const load = async (...args: Any[]) => {
    void args;
    const config = props.restreamer.ConfigActive();
    setConfig(config);

    const metadata = await props.restreamer.GetIngestMetadata(_channelid);
    setMetadata({
      ...$metadata,
      ...metadata,
    });

    await update();
  };

  const update = async (...args: Any[]) => {
    void args;
    const channelid = props.restreamer.SelectChannel(_channelid);
    if (channelid === "" || channelid !== _channelid) {
      setInvalid(true);
      return;
    }

    const progress = await props.restreamer.GetIngestProgress(_channelid);

    const state: DynamicObject = {
      ...$state,
      ready: true,
      valid: progress.valid,
      progress: progress,
      state: progress.state,
    };

    if (state.state === "connecting") {
      if (state.onConnect === null) {
        state.onConnect = async (...args: Any[]) => {
          void args;
          await props.restreamer.StopIngestSnapshot(_channelid);
          await props.restreamer.StartIngestSnapshot(_channelid);
        };
      }
    } else if (state.state === "connected") {
      if (state.onConnect !== null && typeof state.onConnect === "function") {
        const onConnect = state.onConnect;
        setTimeout(async (...args: Any[]) => {
          void args;
          await onConnect();
        }, 100);
        state.onConnect = null;
      }
    }

    if ($metadata.control.rtmp.enable) {
      if (!$config?.source?.network?.rtmp?.enabled) {
        state.state = "error";
        state.progress.error = "RTMP server is not enabled, but required.";
      }
    } else if ($metadata.control.srt.enable) {
      if (!$config?.source?.network?.srt?.enabled) {
        state.state = "error";
        state.progress.error = "SRT server is not enabled, but required.";
      }
    }

    setState({
      ...$state,
      ...state,
    });
  };

  const connect = async (...args: Any[]) => {
    void args;
    setState({
      ...$state,
      state: "connecting",
      onConnect: async (...args: Any[]) => {
        void args;
        await props.restreamer.StopIngestSnapshot(_channelid);
        await props.restreamer.StartIngestSnapshot(_channelid);
      },
    });

    await props.restreamer.StartIngest(_channelid);
    await props.restreamer.StartIngestSnapshot(_channelid);
  };

  const disconnect = async (...args: Any[]) => {
    void args;
    setState({
      ...$state,
      state: "disconnecting",
    });

    await props.restreamer.StopIngestSnapshot(_channelid);
    await props.restreamer.StopIngest(_channelid);

    await disconnectEgresses();
  };

  const reconnect = async (...args: Any[]) => {
    void args;
    await disconnect();
    await connect();
  };

  const disconnectEgresses = async (...args: Any[]) => {
    void args;
    await props.restreamer.StopAllEgresses(_channelid);
  };

  const handleProcessDetails = async (event: Any) => {
    event.preventDefault();

    const open = !$processDetails.open;
    let logdata = {
      prelude: [],
      log: [],
    };

    if (open === true) {
      const data = await props.restreamer.GetIngestLog(_channelid);
      if (data !== null) {
        logdata = data;
      }

      processLogTimer.current = setInterval(async (...args: Any[]) => {
        void args;
        await updateProcessDetailsLog();
      }, 1000);
    } else {
      clearInterval(processLogTimer.current);
    }

    setProcessDetails({
      ...$processDetails,
      open: open,
      data: logdata,
    });
  };

  const updateProcessDetailsLog = async (...args: Any[]) => {
    void args;
    const data = await props.restreamer.GetIngestLog(_channelid);
    if (data !== null) {
      setProcessDetails({
        ...$processDetails,
        open: true,
        data: data,
      });
    }
  };

  const handleProcessDebug = async (event: Any) => {
    event.preventDefault();

    let data = "";

    if ($processDebug.open === false) {
      const debug = await props.restreamer.GetIngestDebug(_channelid);
      data = JSON.stringify(debug, null, 2);
    }

    setProcessDebug({
      ...$processDebug,
      open: !$processDebug.open,
      data: data,
    });
  };

  const handleHelp =
    (topic: Any) =>
    (...args: Any[]) => {
      void args;
      H(topic);
    };

  if ($state.ready === false) {
    return (
      <Paper xs={8} sm={6} md={4} className="PaperM">
        <Grid
          container
          spacing={2}
          sx={{ justifyContent: "center", alignItems: "center" }}
        >
          <Grid size={12}>
            <CircularProgress color="primary" />
          </Grid>
          <Grid size={12}>
            <Trans>Retrieving stream data ...</Trans>
          </Grid>
        </Grid>
      </Paper>
    );
  }

  if ($state.valid === false) {
    return <Welcome />;
  }

  const storage = $metadata.control.hls.storage;
  const channel = props.restreamer.GetChannel(_channelid);
  const manifest = props.restreamer.GetChannelAddress(
    "hls+" + storage,
    _channelid,
  );
  const poster = props.restreamer.GetChannelAddress(
    "snapshot+" + storage,
    _channelid,
  );

  let title = <Trans>Main channel</Trans>;
  if (channel && channel.name && channel.name.length !== 0) {
    title = channel.name;
  }

  return (
    <Root>
      <Grid
        container
        spacing={1}
        sx={{ justifyContent: "center" }}
        className={classes.gridContainerL1}
      >
        <Grid
          size={{
            xs: 12,
            sm: 12,
            md: 8,
          }}
        >
          <Paper marginBottom="0">
            <PaperHeader
              title={title}
              onEdit={() => router.push(`/${_channelid}/edit`)}
              onHelp={handleHelp("main")}
            />
            <Grid container spacing={1} className={classes.gridContainerL2}>
              <Grid size={12}>
                <Grid container spacing={0} className={classes.playerL1}>
                  <Grid className={classes.playerL2} size={12}>
                    {($state.state === "disconnected" ||
                      $state.state === "disconnecting") && (
                      <Grid
                        container
                        className={classes.playerL3}
                        spacing={1}
                        sx={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Grid>
                          <Typography variant="h2">
                            <Trans>No video</Trans>
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                    {$state.state === "connecting" && (
                      <Grid
                        container
                        className={classes.playerL3}
                        spacing={1}
                        sx={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Grid>
                          <CircularProgress color="inherit" />
                        </Grid>
                        <Grid>
                          <Typography>
                            <Trans>Connecting ...</Trans>
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                    {$state.state === "error" && (
                      <Grid
                        container
                        className={classes.playerL3}
                        spacing={1}
                        sx={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Grid>
                          <WarningIcon className={classes.playerWarningIcon} />
                        </Grid>
                        <Grid>
                          <Typography>
                            <Trans>
                              Error:{" "}
                              {anonymize($state.progress.error) || "unknown"}
                            </Trans>
                          </Typography>
                        </Grid>
                        <Grid>
                          <Typography>
                            <Trans>
                              Please check the{" "}
                              <Link href="#!" onClick={handleProcessDetails}>
                                process log
                              </Link>
                            </Trans>
                          </Typography>
                        </Grid>
                        {$state.progress.reconnect !== -1 && (
                          <Grid>
                            <Typography>
                              <Trans>
                                Reconnecting in {$state.progress.reconnect}s
                              </Trans>
                            </Typography>
                          </Grid>
                        )}
                        {$state.progress.reconnect === -1 && (
                          <Grid>
                            <Typography>
                              <Trans>You have to reconnect manually</Trans>
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    )}
                    {$state.state === "connected" && (
                      <Player
                        type="videojs-internal"
                        source={manifest}
                        poster={poster}
                        autoplay
                        mute
                        controls
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid sx={{ mt: "-.3em" }} size={12}>
                <Progress progress={$state.progress} />
              </Grid>
              <Grid sx={{ mt: "-.2em" }} size={12}>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  spacing={2}
                >
                  <Typography variant="body1">
                    <Trans>Content URL</Trans>
                  </Typography>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                    spacing={0.5}
                  >
                    <CopyButton
                      variant="outlined"
                      color="default"
                      size="small"
                      value={props.restreamer.GetPublicAddress(
                        "hls+" + storage,
                        _channelid,
                      )}
                    >
                      <Trans>HLS</Trans>
                    </CopyButton>
                    {$metadata.control.rtmp.enable && (
                      <CopyButton
                        variant="outlined"
                        color="default"
                        size="small"
                        value={props.restreamer.GetPublicAddress(
                          "rtmp",
                          _channelid,
                        )}
                      >
                        <Trans>RTMP</Trans>
                      </CopyButton>
                    )}
                    {$metadata.control.srt.enable && (
                      <CopyButton
                        variant="outlined"
                        color="default"
                        size="small"
                        value={props.restreamer.GetPublicAddress(
                          "srt",
                          _channelid,
                        )}
                      >
                        <Trans>SRT</Trans>
                      </CopyButton>
                    )}
                    <CopyButton
                      variant="outlined"
                      color="default"
                      size="small"
                      value={props.restreamer.GetPublicAddress(
                        "snapshot+memfs",
                        _channelid,
                      )}
                    >
                      <Trans>Snapshot</Trans>
                    </CopyButton>
                  </Stack>
                </Stack>
              </Grid>
              <Grid sx={{ mt: 0 }} size={12}>
                <ActionButton
                  order={$state.order}
                  state={$state.state}
                  reconnect={$state.progress.reconnect}
                  onDisconnect={disconnect}
                  onConnect={connect}
                  onReconnect={reconnect}
                />
              </Grid>
              <Grid sx={{ textAlign: "right" }} size={12}>
                <Link
                  variant="body2"
                  color="textSecondary"
                  href="#!"
                  onClick={handleProcessDetails}
                  className={classes.link}
                >
                  <Trans>Process details</Trans>
                </Link>
                <Link
                  variant="body2"
                  color="textSecondary"
                  href="#!"
                  onClick={handleProcessDebug}
                  className={classes.link}
                >
                  <Trans>Process report</Trans>
                </Link>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 12,
            md: 4,
          }}
        >
          <Publication restreamer={props.restreamer} channelid={_channelid} />
        </Grid>
      </Grid>
      <ProcessModal
        open={$processDetails.open}
        onClose={handleProcessDetails}
        title={<Trans>Process details</Trans>}
        progress={$state.progress}
        logdata={$processDetails.data}
        onHelp={handleHelp("process-details")}
      />
      <DebugModal
        open={$processDebug.open}
        onClose={handleProcessDebug}
        title={<Trans>Process report</Trans>}
        data={$processDebug.data}
        onHelp={handleHelp("process-report")}
      />
    </Root>
  );
}

Main.defaultProps = {
  restreamer: null,
};
