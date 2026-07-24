import base from "../base";

export default {
  styleOverrides: {
    root: {
      color: base.palette.text.primary,
      backgroundColor: base.palette.background.paper,
      padding: "1.25rem 1.5rem",
      border: `1px solid ${base.palette.background.light1}`,
      borderRadius: 16,
      boxShadow: "0 16px 40px rgba(0, 0, 0, .18)",
    },
  },
  variants: [
    {
      props: { variant: "modal" },
      style: {
        padding: "1em 1.5em 1.3em 1.5em",
        maxHeight: "95%",
        overflow: "scroll",
        backgroundColor: base.palette.background.modal,
        color: base.palette.text.primary,
      },
    },
    {
      props: { variant: "select" },
      style: {
        padding: 0,
        overflow: "scroll",
        backgroundColor: base.palette.background.modal,
        color: base.palette.text.primary,
      },
    },
  ],
};
