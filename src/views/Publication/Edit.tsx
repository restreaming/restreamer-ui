import React from "react";
import { styled } from "@mui/material/styles";
import { useRouter, useParams } from "next/navigation";
import PropTypes from "prop-types";

import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import * as helper from "./helper";
import * as M from "../../utils/metadata";
import useInterval from "../../hooks/useInterval";
import BoxText from "../../components/misc/BoxText";
import DebugModal from "../../components/misc/modals/Debug";
import Dialog from "../../components/misc/modals/Dialog";
import EncodingSelect from "../../components/misc/EncodingSelect";
import FilterSelect from "../../components/misc/FilterSelect";
import H from "../../utils/help";
import LimitsControl from "../../components/misc/controls/Limits";
import NotifyContext from "../../contexts/Notify";
import Paper from "../../components/misc/Paper";
import PaperHeader from "../../components/misc/PaperHeader";
import PaperFooter from "../../components/misc/PaperFooter";
import Process from "./Process";
import ProcessControl from "../../components/misc/controls/Process";
import ProcessModal from "../../components/misc/modals/Process";
import Services from "./Services";
import SourceControl from "../../components/misc/controls/Source";
import TabContent from "./TabContent";
import TabPanel from "../../components/misc/TabPanel";
import TabsVerticalGrid from "../../components/misc/TabsVerticalGrid";

const PREFIX = "Edit";

const classes = {
  gridContainer: `${PREFIX}-gridContainer`,
  link: `${PREFIX}-link`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled("div")(() => ({
  [`& .${classes.gridContainer}`]: {
    marginTop: "0.5em",
    marginBottom: "1em",
  },

  [`& .${classes.link}`]: {
    marginLeft: 10,
    wordWrap: "anywhere",
  },
}));

export default function Edit(props: Any) {
  const { i18n } = useLingui();
  const {
    channelid: _channelid,
    service: _service,
    index: _index,
  } = useParams<{
    channelid: string;
    tab?: string;
    service?: string;
    index?: string;
  }>();
  const id = props.restreamer.GetEgressId(_service, _index);
  const router = useRouter();
  const notify = React.useContext(NotifyContext);
  const [$ready, setReady] = React.useState(false);
  const [$settings, setSettings] = React.useState(M.getDefaultEgressMetadata());
  const [$sources, setSources] = React.useState<DynamicObject[]>([]);
  const [$localSources, setLocalSources] = React.useState<DynamicObject[]>([]);
  const [$tab, setTab] = React.useState("general");
  const [$progress, setProgress] = React.useState<Any>({});
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
  const [$unsavedChanges, setUnsavedChanges] = React.useState(false);
  const [$skills, setSkills] = React.useState<Any>(null);
  const [$metadata, setMetadata] = React.useState({
    name: "",
    description: "",
    license: "",
  });
  const [$deleteDialog, setDeleteDialog] = React.useState(false);
  const [$saving, setSaving] = React.useState(false);
  const [$service, setService] = React.useState<Any>(null);
  const [$serviceSkills, setServiceSkills] = React.useState<Any>(null);
  const [$invalid, setInvalid] = React.useState("");

  useInterval(async (...args: Any[]) => {
    void args;
    await update(false);
  }, 1000);

  React.useEffect((...args: Any[]) => {
    void args;
    (async (...args: Any[]) => {
      void args;
      await update(true);
    })();
  }, []);

  React.useEffect(
    (...args: Any[]) => {
      void args;
      if ($invalid.length !== 0) {
        router.replace($invalid);
      }
    },
    [router, $invalid],
  );

  const update = async (isFirst: Any) => {
    const channelid = props.restreamer.SelectChannel(_channelid);
    if (channelid === "" || channelid !== _channelid) {
      setInvalid("/");
      return;
    }

    const proc = await props.restreamer.GetEgress(_channelid, id, ["state"]);
    if (proc === null) {
      notify.Dispatch(
        "warning",
        "notfound:egress:" + _service,
        i18n._(t`Publication service not found`),
      );
      setInvalid(`/${_channelid}`);
      return;
    }

    setProgress(proc.progress);

    if (isFirst === true) {
      const s = Services.Get(_service ?? "");
      if (s === null) {
        notify.Dispatch(
          "warning",
          "notfound:egress:" + _service,
          i18n._(t`Publication service not found`),
        );
        setInvalid(`/${_channelid}/`);
        return null;
      }

      setService(s);

      const skills = await props.restreamer.Skills();
      setSkills(skills);

      const serviceSkills = helper.conflateServiceSkills(s.requires, skills);
      if (serviceSkills === null) {
        return;
      }
      setServiceSkills(serviceSkills);

      const ingest = await props.restreamer.GetIngestMetadata(_channelid);
      setMetadata({
        ...$metadata,
        name: ingest.meta.name,
        description: ingest.meta.description,
        license: ingest.license,
      });

      const localSources: Any[] = [];

      localSources.push("hls+" + ingest.control.hls.storage);

      if (ingest.control.rtmp.enable) {
        localSources.push("rtmp");
      }

      if (ingest.control.srt.enable) {
        localSources.push("srt");
      }

      setLocalSources(localSources);

      const sources = helper.createSourcesFromStreams(ingest.streams);
      setSources(sources);

      const settings = await props.restreamer.GetEgressMetadata(_channelid, id);

      const profiles = settings.profiles;
      profiles[0].video = helper.preselectProfile(
        profiles[0].video,
        "video",
        ingest.streams,
        serviceSkills.codecs.video,
        skills,
      );
      profiles[0].audio = helper.preselectProfile(
        profiles[0].audio,
        "audio",
        ingest.streams,
        serviceSkills.codecs.audio,
        skills,
      );

      settings.profiles = profiles;
      settings.streams = M.createOutputStreams(sources, profiles, false);

      setSettings(settings);

      setReady(true);
    }
  };

  const handleServiceAction = async (action: Any) => {
    let state = "disconnected";

    if (action === "connect") {
      await props.restreamer.StartEgress(_channelid, id);
      state = "connecting";
    } else if (action === "disconnect") {
      await props.restreamer.StopEgress(_channelid, id);
      state = "disconnecting";
    } else if (action === "reconnect") {
      await props.restreamer.StopEgress(_channelid, id);
      await props.restreamer.StartEgress(_channelid, id);
      state = "connecting";
    }

    setProgress({
      ...$progress,
      state: state,
    });
  };

  const handleServiceChange = (outputs: Any, settings: Any) => {
    if (!Array.isArray(outputs)) {
      outputs = [outputs];
    }

    setSettings({
      ...$settings,
      outputs: outputs,
      settings: settings,
    });

    setUnsavedChanges(true);
  };

  const handleEncoding =
    (type: Any) => (encoder: Any, decoder: Any, automatic: Any) => {
      const profiles = $settings.profiles;

      profiles[0][type].encoder = encoder;
      profiles[0][type].decoder = decoder;

      const streams = M.createOutputStreams($sources, profiles, false);

      let outputs = $settings.outputs;

      if ("createOutputs" in $service) {
        outputs = $service.createOutputs(
          $settings.settings,
          $serviceSkills,
          $metadata,
          streams,
        );
      }

      setSettings({
        ...$settings,
        profiles: profiles,
        streams: streams,
        outputs: outputs,
      });

      if (!automatic) {
        setUnsavedChanges(true);
      }
    };

  const handleFilter = (type: Any) => (filter: Any, automatic: Any) => {
    const profiles = $settings.profiles;

    profiles[0][type].filter = filter;

    setSettings({
      ...$settings,
      profiles: profiles,
    });

    if (!automatic) {
      setUnsavedChanges(true);
    }
  };

  const handleServiceDone = async (...args: Any[]) => {
    void args;
    setSaving(true);

    const [global, inputs, outputs] = helper.createInputsOutputs(
      $sources,
      $settings.profiles,
      $settings.outputs,
      false,
    );
    if (inputs.length === 0 || outputs.length === 0) {
      setSaving(false);
      notify.Dispatch(
        "error",
        "save:egress:" + _service,
        i18n._(
          t`The input profile is not complete. Please define a video and audio source.`,
        ),
      );
      return;
    }

    const [, err] = await props.restreamer.UpdateEgress(
      _channelid,
      id,
      global,
      inputs,
      outputs,
      $settings.control,
    );
    if (err !== null) {
      setSaving(false);
      notify.Dispatch(
        "error",
        "save:egress:" + _service,
        i18n._(t`Failed to store publication service (${err.message})`),
      );
      return;
    }

    await props.restreamer.SetEgressMetadata(_channelid, id, $settings);

    setSaving(false);

    notify.Dispatch(
      "success",
      "save:egress:" + _service,
      i18n._(t`The settings for "${$settings.name}" have been saved`),
    );

    setUnsavedChanges(false);
  };

  const handleServiceName = (event: Any) => {
    const name = event.target.value;

    setSettings({
      ...$settings,
      name: name,
    });

    setUnsavedChanges(true);
  };

  const handleControlChange = (what: Any) => (control: Any, automatic: Any) => {
    setSettings({
      ...$settings,
      control: {
        ...$settings.control,
        [what]: control,
      },
    });

    if (automatic === false) {
      setUnsavedChanges(true);
    }
  };

  const handleServiceDeleteDialog = (...args: Any[]) => {
    void args;
    setDeleteDialog(!$deleteDialog);
  };

  const handleServiceDelete = async (...args: Any[]) => {
    void args;
    setSaving(true);

    const res = await props.restreamer.DeleteEgress(_channelid, id);
    if (res === false) {
      setSaving(false);
      notify.Dispatch(
        "warning",
        "delete:egress:" + _service,
        i18n._(
          t`The publication service "${$settings.name}" could not be deleted`,
        ),
      );
      return;
    }

    setSaving(false);

    notify.Dispatch(
      "success",
      "delete:egress:" + _service,
      i18n._(t`The publication service "${$settings.name}" has been deleted`),
    );

    router.push(`/${_channelid}`);
  };

  const handleAbort = (...args: Any[]) => {
    void args;
    router.push(`/${_channelid}/`);
  };

  const handleChangeTab = (value: Any) => {
    setTab(value);
  };

  const handleHelp =
    (topic: Any) =>
    (...args: Any[]) => {
      void args;
      if (!topic) {
        H("publication-" + $tab);
        return;
      }

      H(topic);
    };

  const handleProcessDetails = async (event: Any) => {
    event.preventDefault();

    const open = !$processDetails.open;
    let logdata = {
      prelude: [],
      log: [],
    };

    if (open === true) {
      const data = await props.restreamer.GetEgressLog(_channelid, id);
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
    const data = await props.restreamer.GetEgressLog(_channelid, id);
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

    const show = !$processDebug.open;
    let data = "";

    if (show === true) {
      const debug = await props.restreamer.GetEgressDebug(_channelid, id);
      data = JSON.stringify(debug, null, 2);
    }

    setProcessDebug({
      ...$processDebug,
      open: show,
      data: data,
    });
  };

  if ($ready === false) {
    return null;
  }

  const ServiceControl = $service.component;

  const title = $settings.name.length === 0 ? $service.name : $settings.name;

  return (
    <Root>
      <Paper xs={12} md={10}>
        <PaperHeader
          title={
            <React.Fragment>
              <Trans>Edit: {title}</Trans>
            </React.Fragment>
          }
          onAbort={handleAbort}
          onHelp={handleHelp("")}
        />
        <Grid container spacing={1}>
          <TabsVerticalGrid>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={$tab}
              onChange={handleChangeTab}
              className="tabs"
            >
              <Tab
                className="tab"
                label={<Trans>General</Trans>}
                value="general"
              />
              <Tab
                className="tab"
                label={<Trans>Source &amp; Encoding</Trans>}
                value="encoding"
              />
              <Tab
                className="tab"
                label={<Trans>Process control</Trans>}
                value="process"
              />
            </Tabs>
            <TabPanel value={$tab} index="general" className="panel">
              <TabContent service={$service}>
                <Grid sx={{ margin: "1em 0em 1em 0em" }} size={12}>
                  <Typography>{$service.description}</Typography>
                </Grid>
                <Grid size={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label={<Trans>Service name</Trans>}
                    value={$settings.name}
                    onChange={handleServiceName}
                  />
                </Grid>
                <Grid size={12}>
                  <ServiceControl
                    settings={$settings.settings}
                    skills={$serviceSkills}
                    metadata={$metadata}
                    streams={$settings.streams}
                    onChange={handleServiceChange}
                  />
                </Grid>
              </TabContent>
            </TabPanel>
            <TabPanel value={$tab} index="process" className="panel">
              <TabContent service={$service}>
                <Grid size={12}>
                  <Typography variant="h2">
                    <Trans>Process</Trans>
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <ProcessControl
                    settings={$settings.control.process}
                    onChange={handleControlChange("process")}
                  />
                </Grid>
                <Grid size={12}>
                  <Divider />
                </Grid>
                <Grid size={12}>
                  <Typography variant="h2">
                    <Trans>Limits</Trans>
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <LimitsControl
                    settings={$settings.control.limits}
                    onChange={handleControlChange("limits")}
                  />
                </Grid>
                <Grid size={12}>
                  <Grid container spacing={1} className={classes.gridContainer}>
                    {$unsavedChanges === true && (
                      <Grid size={12}>
                        <BoxText>
                          <Typography variant="body2" gutterBottom>
                            <Trans>
                              You have unsaved changes. Please save them before
                              you can control the service again.
                            </Trans>
                          </Typography>
                        </BoxText>
                      </Grid>
                    )}
                    {$unsavedChanges === false && (
                      <React.Fragment>
                        <Grid size={12}>
                          <Process
                            onAction={handleServiceAction}
                            progress={$progress}
                          />
                        </Grid>
                        <Grid sx={{ textAlign: "right" }} size={12}>
                          <Link
                            color="textSecondary"
                            href="#!"
                            onClick={handleProcessDetails}
                            className={classes.link}
                          >
                            <Trans>Process details</Trans>
                          </Link>
                          <Link
                            color="textSecondary"
                            href="#!"
                            onClick={handleProcessDebug}
                            className={classes.link}
                          >
                            <Trans>Process report</Trans>
                          </Link>
                        </Grid>
                      </React.Fragment>
                    )}
                  </Grid>
                </Grid>
              </TabContent>
            </TabPanel>
            <TabPanel value={$tab} index="encoding" className="panel">
              <TabContent service={$service}>
                <Grid size={12}>
                  <Typography variant="h2">
                    <Trans>Source &amp; Encoding</Trans>
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="h3">
                    <Trans>Source</Trans>
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="subheading">
                    <Trans>
                      Select RTMP or SRT (if enabled) for less latency.
                    </Trans>
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <SourceControl
                    settings={$settings.control.source}
                    sources={$localSources}
                    onChange={handleControlChange("source")}
                  />
                </Grid>
                <Grid size={12}>
                  <Typography variant="h3">
                    <Trans>Encoding</Trans>
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="subheading">
                    <Trans>
                      Passthrough (copy) should only be disabled if necessary.
                      Each encoding requires additional CPU/GPU resources.
                    </Trans>
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="h4">
                    <Trans>Video settings</Trans>
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <EncodingSelect
                    type="video"
                    streams={$sources[0].streams}
                    profile={$settings.profiles[0].video}
                    codecs={$serviceSkills.codecs.video}
                    skills={$skills}
                    onChange={handleEncoding("video")}
                  />
                </Grid>
                {$settings.profiles[0].video.encoder.coder !== "copy" && (
                  <Grid size={12}>
                    <FilterSelect
                      type="video"
                      profile={$settings.profiles[0].video}
                      availableFilters={$skills.filter}
                      onChange={handleFilter("video")}
                    />
                  </Grid>
                )}
                <Grid size={12}>
                  <Typography variant="h4">
                    <Trans>Audio settings</Trans>
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <EncodingSelect
                    type="audio"
                    streams={$sources[0].streams}
                    profile={$settings.profiles[0].audio}
                    codecs={$serviceSkills.codecs.audio}
                    skills={$skills}
                    onChange={handleEncoding("audio")}
                  />
                </Grid>
                {$settings.profiles[0].audio.encoder.coder !== "copy" && (
                  <Grid size={12}>
                    <FilterSelect
                      type="audio"
                      profile={$settings.profiles[0].audio}
                      availableFilters={$skills.filter}
                      onChange={handleFilter("audio")}
                    />
                  </Grid>
                )}
              </TabContent>
            </TabPanel>
          </TabsVerticalGrid>
        </Grid>
        <PaperFooter
          buttonsLeft={
            <Button variant="outlined" color="default" onClick={handleAbort}>
              <Trans>Close</Trans>
            </Button>
          }
          buttonsRight={
            <React.Fragment>
              <Button
                variant="outlined"
                color="primary"
                disabled={$unsavedChanges === false || $saving === true}
                onClick={handleServiceDone}
              >
                <Trans>Save</Trans>
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                disabled={$saving === true}
                onClick={handleServiceDeleteDialog}
              >
                <Trans>Delete</Trans>
              </Button>
            </React.Fragment>
          }
        />
      </Paper>
      <ProcessModal
        open={$processDetails.open}
        onClose={handleProcessDetails}
        title={<Trans>Process details</Trans>}
        progress={$progress}
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
      <Dialog
        open={$deleteDialog}
        onClose={handleServiceDeleteDialog}
        title={<Trans>Do you want to delete {title}?</Trans>}
        buttonsLeft={
          <Button
            variant="outlined"
            color="default"
            onClick={handleServiceDeleteDialog}
          >
            <Trans>Abort</Trans>
          </Button>
        }
        buttonsRight={
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleServiceDelete}
          >
            <Trans>Delete</Trans>
          </Button>
        }
      >
        <Typography>
          <Trans>
            Deleting a publication service cannot be reversed. The publication
            stops immediately.
          </Trans>
        </Typography>
      </Dialog>
      <Backdrop open={$saving}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Root>
  );
}

Edit.defaultProps = {
  restreamer: null,
};

Edit.propTypes = {
  restreamer: PropTypes.object.isRequired,
};
