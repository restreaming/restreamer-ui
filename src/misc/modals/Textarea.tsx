import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";

import ModalContent from "../ModalContent";
import Textarea from "../Textarea";

const Component = function (props: Any) {
  const { children, sx, ...other } = props;

  return (
    <Modal open={props.open} onClose={props.onClose} className="modal">
      <ModalContent
        title={props.title}
        onClose={props.onClose}
        onHelp={props.onHelp}
        style={{ overflow: "hidden" }}
      >
        <Grid container spacing={1}>
          <Grid size={12}>
            <Stack
              direction="column"
              spacing={1}
              sx={[
                {
                  backgroundColor: "background.modalbox",
                  borderRadius: 1,
                  p: "0em 1em 1em 1em",
                },
                {
                  justifyContent: "center",
                  alignItems: "center",
                },
                sx,
              ]}
            >
              <Textarea {...other}>{children}</Textarea>
            </Stack>
          </Grid>
        </Grid>
      </ModalContent>
    </Modal>
  );
};

export default Component;

Component.defaultProps = {
  open: false,
  title: "",
  onClose: null,
  onHelp: null,
};
