import { Trans } from "@lingui/react/macro";
import Button from "@mui/material/Button";

export default function ActionButton(props) {
  const button = (() => {
    if (props.state === "connecting") {
      return (
        <Button variant="outlined" fullWidth disabled>
          <Trans>Connecting ...</Trans>
        </Button>
      );
    }

    if (props.state === "disconnecting") {
      return (
        <Button variant="outlined" fullWidth disabled>
          <Trans>Disconnecting ...</Trans>
        </Button>
      );
    }

    if (props.state === "connected") {
      return (
        <Button
          variant="outlined"
          fullWidth
          color="secondary"
          disabled={props.disabled}
          onClick={props.onDisconnect}
        >
          <Trans>Disconnect</Trans>
        </Button>
      );
    }

    if (props.state === "disconnected") {
      if (props.reconnect < 0) {
        if (props.order === "start") {
          return (
            <Button
              variant="outlined"
              fullWidth
              color="primary"
              disabled={props.disabled}
              onClick={props.onReconnect}
            >
              <Trans>Reconnect</Trans>
            </Button>
          );
        }

        return (
          <Button
            variant="outlined"
            fullWidth
            color="primary"
            disabled={props.disabled}
            onClick={props.onConnect}
          >
            <Trans>Connect</Trans>
          </Button>
        );
      }

      return (
        <Button
          variant="outlined"
          fullWidth
          color="secondary"
          disabled={props.disabled}
          onClick={props.onDisconnect}
        >
          <Trans>Disconnect</Trans>
        </Button>
      );
    }

    if (props.state === "error") {
      if (props.reconnect < 0) {
        return (
          <Button
            variant="outlined"
            fullWidth
            color="primary"
            disabled={props.disabled}
            onClick={props.onReconnect}
          >
            <Trans>Reconnect</Trans>
          </Button>
        );
      }

      return (
        <Button
          variant="outlined"
          fullWidth
          color="secondary"
          disabled={props.disabled}
          onClick={props.onDisconnect}
        >
          <Trans>Disconnect</Trans>
        </Button>
      );
    }

    return null;
  })();

  return button;
}

ActionButton.defaultProps = {
  order: "stop",
  state: "disconnected",
  reconnect: -1,
  disabled: false,
  onDisconnect: function () {},
  onConnect: function () {},
  onReconnect: function () {},
};
