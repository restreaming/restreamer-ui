import Stack from "@mui/material/Stack";

export default function Component(props: Any) {
  const {
    children,
    color = "light",
    justifyContent = "center",
    alignItems = "center",
    textAlign = "left",
    sx,
    ...other
  } = props;

  const boxSx =
    color === "dark"
      ? {
          backgroundColor: "background.dark2",
          borderRadius: 1,
          p: "10px 15px",
          wordWrap: "break-word",
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }
      : color === "success"
        ? {
            color: "background.paper",
            fontWeight: 500,
            backgroundColor: "secondary.main",
            borderRadius: 1,
            p: "10px 15px",
            wordWrap: "break-word",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }
        : color === "danger"
          ? {
              backgroundColor: "error.main",
              textAlign: "center",
              borderRadius: 1,
              p: ".5em .5em .3em .5em",
              wordWrap: "break-word",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }
          : {
              backgroundColor: "background.light1",
              borderRadius: 1,
              p: "10px 15px",
              wordWrap: "break-word",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            };

  return (
    <Stack
      direction="column"
      spacing={1}
      sx={[boxSx, { justifyContent, alignItems, textAlign }, sx]}
      {...other}
    >
      {children}
    </Stack>
  );
}

Component.defaultProps = {
  color: "light",
  textAlign: "left",
  alignItems: "center",
  justifyContent: "center",
};
