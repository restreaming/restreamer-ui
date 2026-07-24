
import TextareaModal from "./Textarea";

const Component = function (props: any) {
  return (
    <TextareaModal
      open={props.open}
      title={props.title}
      onClose={props.onClose}
      onHelp={props.onHelp}
      rows={18}
      value={props.data}
      readOnly
      allowCopy
    />
  );
};

export default Component;

Component.defaultProps = {
  open: false,
  data: "",
  title: "",
  onClose: null,
  onHelp: null,
};
