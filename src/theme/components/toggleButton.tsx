import base from "../base";

export default {
  styleOverrides: {
    root: {
      color: base.palette.text.primary,
      border: `1px solid ${base.palette.primary.main}`,
      borderRadius: 8,
      minHeight: 40,
      padding: "0 14px",
      backgroundColor: base.palette.background.dark1,
      "&:hover": {
        backgroundColor: base.palette.secondary.main,
        border: `1px solid ${base.palette.secondary.main}`,
      },
      "&.Mui-selected": {
        color: base.palette.text.primary,
        backgroundColor: base.palette.secondary.main,
        border: `1px solid ${base.palette.secondary.main}`,
        "&:hover": {
          backgroundColor: `${base.palette.secondary.main}!important`,
        },
      },
    },
  },
};
