import React from "react";

import { Trans } from "@lingui/react/macro";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import CloseIcon from "@mui/icons-material/Close";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import LensIcon from "@mui/icons-material/Lens";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Stack from "@mui/material/Stack";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import Dialog from "./modals/Dialog";

const ImageButton = styled(ButtonBase)(() => ({
  "&:hover, &.Mui-focusVisible": {
    zIndex: 1,
    "& .MuiImageBackdrop-root": {
      opacity: 0.2,
    },
  },
  "&:disabled": {
    "& .MuiImageBackdrop-root": {
      opacity: 0.2,
    },
    "& .MuiTypography-root": {
      color: "white",
    },
  },
}));

const Image = styled("span")(() => ({
  position: "relative",
}));

const ImageSrc = styled("span")(({ theme }: Any) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundPosition: "center 40%",
  borderRadius: 4,
  border: `2px solid ${theme.palette.primary.dark}`,
}));

const ImageAlt = styled("span")(({ theme }: Any) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled("span")(({ theme }: Any) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.5,
  transition: theme.transitions.create("opacity"),
  borderRadius: 4,
  border: `2px solid ${theme.palette.primary.dark}`,
}));

function ChannelButton(props: Any, largeChannelList: Any = false) {
  const theme = useTheme();

  let color = theme.palette.primary.main;
  switch (props.state) {
    case "disconnected":
      color = theme.palette.primary.main;
      break;
    case "connected":
      color = theme.palette.secondary.main;
      break;
    case "disconnecting":
    case "connecting":
      color = theme.palette.warning.main;
      break;
    case "error":
      color = theme.palette.error.main;
      break;
    default:
      color = theme.palette.primary.main;
      break;
  }

  let color_active = theme.palette.primary.main;
  switch (props.disabled) {
    case true:
      color_active = theme.palette.primary.light;
      break;
    default:
      color_active = theme.palette.primary.dark;
      break;
  }

  return (
    <Grid
      sx={{ paddingBottom: largeChannelList ? "10px" : "auto" }}
      size={{
        xs: 12,
        sm: 6,
        md: 4,
        lg: 3,
      }}
    >
      <ImageButton
        focusRipple
        disabled={props.disabled}
        onClick={props.onClick}
        sx={{ width: props.width }}
      >
        <Stack direction="column" spacing={0.5}>
          <Image
            sx={{
              width: props.width,
              height: Math.floor((props.width / 16) * 9),
            }}
          >
            <ImageAlt>
              <DoNotDisturbAltIcon fontSize="large" />
            </ImageAlt>
            <ImageSrc
              sx={{
                backgroundImage: `url(${props.url})`,
                borderColor: color_active,
              }}
            />
            <ImageBackdrop
              className="MuiImageBackdrop-root"
              sx={{ borderColor: color_active }}
            />
          </Image>
          <Stack
            direction="row"
            sx={{
              alignItems: "flex-start",
              justifyContent: "space-between",
              textAlign: "initial",
              padding: ".5em 0em 0em .1em",
            }}
          >
            <Typography variant="body2" color="inherit">
              {props.title}
            </Typography>
            <Typography variant="body2" color="inherit">
              <LensIcon fontSize="small" style={{ color: color }} />
            </Typography>
          </Stack>
        </Stack>
      </ImageButton>
    </Grid>
  );
}

ChannelButton.defaultProps = {
  url: "",
  width: 200,
  title: "",
  state: "",
  disabled: false,
  onClick: (...args: Any[]) => {
    void args;
  },
};

const calculateColumnsPerRow = (
  breakpointSmall: Any,
  breakpointMedium: Any,
  breakpointLarge: Any,
) => {
  if (breakpointLarge) {
    return 4;
  } else if (breakpointMedium) {
    return 3;
  } else if (breakpointSmall) {
    return 2;
  }
  return 1;
};

const calculateRowsToFit = (
  windowHeight: Any,
  thumbnailHeight: Any,
  otherUIHeight: Any,
) => {
  return Math.floor((windowHeight - otherUIHeight) / thumbnailHeight);
};

export default function ChannelList(props: Any) {
  const theme = useTheme();
  const breakpointSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const breakpointMedium = useMediaQuery(theme.breakpoints.up("md"));
  const breakpointLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const [$pos, setPos] = React.useState(-1);
  const [$nChannels, setNChannels] = React.useState(
    breakpointSmall ? (breakpointMedium ? (breakpointLarge ? 4 : 3) : 2) : 1,
  );
  const [$channels, setChannels] = React.useState<Any[]>([]);
  const [$addChannel, setAddChannel] = React.useState({
    open: false,
    name: "",
  });
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = React.useState(window.innerHeight);

  const { channels: allChannels, channelid, onClick, onClose, onState } = props;

  const [$largeChannelList, setLargeChannelList] = React.useState(false);

  React.useEffect((...args: Any[]) => {
    void args;
    (async (...args: Any[]) => {
      void args;
      await onMount();
    })();
  }, []);

  React.useEffect(
    (...args: Any[]) => {
      void args;
      setNChannels(
        breakpointSmall
          ? breakpointMedium
            ? breakpointLarge
              ? 4
              : 3
            : 2
          : 1,
      );
    },
    [breakpointSmall, breakpointMedium, breakpointLarge],
  );

  React.useEffect(
    (...args: Any[]) => {
      void args;
      (async (...args: Any[]) => {
        void args;
        if (allChannels.length === 0) {
          return;
        }

        let channels = allChannels
          .sort((a: Any, b: Any) => {
            const aname = a.name.toUpperCase();
            const bname = b.name.toUpperCase();
            return aname < bname ? -1 : aname > bname ? 1 : 0;
          })
          .slice($pos, $pos + $nChannels);

        const states = await onState(
          channels.map((channel: Any) => channel.id),
        );

        channels = channels.map((channel: Any) => {
          return (
            <ChannelButton
              key={channel.channelid}
              url={channel.thumbnail}
              width={200}
              title={channel.name}
              state={states[channel.id]}
              disabled={channelid === channel.channelid}
              onClick={(...args: Any[]) => {
                void args;
                onClick(channel.channelid);
                if ($largeChannelList) {
                  onClose();
                }
              }}
              largeChannelList={$largeChannelList}
            />
          );
        });

        setChannels(channels);
      })();
    },
    [$pos, allChannels, $nChannels, channelid, onClick, onState],
  );

  const onMount = async (...args: Any[]) => {
    void args;
    setPos(0);
  };

  React.useEffect((...args: Any[]) => {
    void args;
    const handleResize = (...args: Any[]) => {
      void args;
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(
    (...args: Any[]) => {
      void args;
      const columns = calculateColumnsPerRow(
        breakpointSmall,
        breakpointMedium,
        breakpointLarge,
      );
      const rows = $largeChannelList
        ? calculateRowsToFit(windowHeight, 200, 60)
        : 1;
      setNChannels(rows * columns);
    },
    [
      breakpointSmall,
      breakpointMedium,
      breakpointLarge,
      windowHeight,
      windowWidth,
      $largeChannelList,
    ],
  );

  const handleAddChannelDialog = (...args: Any[]) => {
    void args;
    setAddChannel({
      ...$addChannel,
      open: !$addChannel.open,
      name: "",
    });
  };

  const handleAddChannelChange = (event: Any) => {
    setAddChannel({
      ...$addChannel,
      name: event.target.value,
    });
  };

  if (props.open === false) {
    return null;
  }

  if ($pos < 0) {
    return null;
  }

  const handleLargeChannelList = (...args: Any[]) => {
    void args;
    setLargeChannelList(!$largeChannelList);
    setPos(0);
  };

  return (
    <React.Fragment>
      <SwipeableDrawer
        anchor="bottom"
        open={props.open}
        onOpen={(...args: Any[]) => {
          void args;
        }}
        onClose={props.onClose}
        sx={{
          "& .MuiDrawer-paper": {
            marginBottom: "60px",
            boxShadow:
              "0px -20px 10px -14px rgb(0 0 0 / 25%), 0px -20px 10px -10px rgb(0 0 0 / 10%)",
            paddingLeft: "50px",
            paddingRight: "50px",
            top: $largeChannelList ? "0px!important" : "auto!important",
            height: $largeChannelList ? "100vh" : "auto",
          },
        }}
        disableScrollLock
        slotProps={{
          backdrop: { invisible: true },
        }}
      >
        <React.Fragment>
          <Grid
            container
            spacing={2}
            sx={{ marginBottom: "1em", justifyContent: "center" }}
          >
            <Grid size={12}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ justifyContent: "space-between" }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ justifyContent: "flex-start" }}
                >
                  <Typography variant="h2">Channels</Typography>
                </Stack>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    justifyContent: "flex-end",
                    mr: "-15px",
                  }}
                >
                  <IconButton
                    color="inherit"
                    size="large"
                    onClick={handleAddChannelDialog}
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    color="inherit"
                    size="large"
                    onClick={handleLargeChannelList}
                  >
                    {$largeChannelList ? (
                      <FullscreenExitIcon />
                    ) : (
                      <FullscreenIcon />
                    )}
                  </IconButton>
                  <IconButton
                    color="inherit"
                    size="large"
                    onClick={props.onClose}
                  >
                    <CloseIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </Grid>
            <Grid sx={{ textAlign: "center" }} size={12}>
              <Stack
                direction="row"
                spacing={0}
                sx={{ justifyContent: "space-between" }}
              >
                <Stack
                  direction="row"
                  spacing={0}
                  sx={{
                    alignItems: "center",
                    ml: "-1.5em",
                    pb: "1em",
                  }}
                >
                  <IconButton
                    onClick={(...args: Any[]) => {
                      void args;
                      setPos($pos - 1);
                    }}
                    disabled={$pos === 0}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: "2.5em",
                      },
                    }}
                  >
                    <NavigateBeforeIcon />
                  </IconButton>
                </Stack>
                <Stack
                  direction="row"
                  spacing={0}
                  sx={{ width: "100%", maxWidth: "980px" }}
                >
                  <Grid
                    container
                    spacing={0}
                    sx={{
                      justifyContent: $largeChannelList
                        ? "flex-start"
                        : "center",
                    }}
                  >
                    {$channels}
                  </Grid>
                </Stack>
                <Stack
                  direction="row"
                  spacing={0}
                  sx={{
                    alignItems: "center",
                    mr: "-1.5em",
                    pb: "1em",
                  }}
                >
                  <IconButton
                    onClick={(...args: Any[]) => {
                      void args;
                      setPos($pos + 1);
                    }}
                    disabled={$pos + $nChannels >= allChannels.length}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: "2.5em",
                      },
                    }}
                  >
                    <NavigateNextIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </React.Fragment>
      </SwipeableDrawer>
      <Dialog
        open={$addChannel.open}
        onClose={handleAddChannelDialog}
        title={<Trans>Add new channel</Trans>}
        buttonsLeft={
          <Button
            variant="outlined"
            color="default"
            onClick={handleAddChannelDialog}
          >
            <Trans>Abort</Trans>
          </Button>
        }
        buttonsRight={
          <Button
            variant="outlined"
            color="primary"
            disabled={$addChannel.name.length === 0}
            onClick={(...args: Any[]) => {
              void args;
              handleAddChannelDialog();
              props.onAdd($addChannel.name);
            }}
          >
            <Trans>Add</Trans>
          </Button>
        }
      >
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography>
              <Trans>Enter a name for the new channel.</Trans>
            </Typography>
          </Grid>
          <Grid size={12}>
            <TextField
              variant="outlined"
              fullWidth
              label={<Trans>Name</Trans>}
              value={$addChannel.name}
              onChange={handleAddChannelChange}
            />
          </Grid>
        </Grid>
      </Dialog>
    </React.Fragment>
  );
}

ChannelList.defaultProps = {
  open: false,
  channelid: "",
  channels: [],
  onClose: (...args: Any[]) => {
    void args;
  },
  onClick: (...args: Any[]) => {
    void args;
  },
  onAdd: (...args: Any[]) => {
    void args;
  },
  onState: (channelids: Any) => {
    const states: DynamicObject = {};
    for (const channelid of channelids) {
      states[channelid] = "";
    }

    return states;
  },
};
