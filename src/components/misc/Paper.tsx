import React from "react";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import type { ReactNode } from "react";

interface PaperProps {
  marginBottom?: string;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  className?: string;
  children?: ReactNode;
}

const Component = React.forwardRef<HTMLDivElement, PaperProps>(
  (props: Any, ref: Any) => {
    const variant = props.className?.toLowerCase();
    const paperSx =
      variant === "paperm"
        ? {
            p: { xs: 2, sm: 3 },
          }
        : variant === "paperl"
          ? {
              p: { xs: 2.5, sm: 4 },
            }
          : variant === "paperservice"
            ? {
                p: { xs: 2.5, sm: 4 },
                border: "1px solid",
                borderColor: "background.light1",
                bgcolor: "service.contrastText",
              }
            : {};

    return (
      <Grid
        container
        spacing={{ xs: 1.5, sm: 2 }}
        sx={{ justifyContent: "center", width: "100%", minWidth: 0 }}
        style={{ marginBottom: props.marginBottom }}
      >
        <Grid
          size={{
            xs: props.xs,
            sm: props.sm,
            md: props.md,
            lg: props.lg,
          }}
          sx={{ width: "100%", minWidth: 0 }}
        >
          <Paper elevation={0} ref={ref} sx={paperSx}>
            {props.children}
          </Paper>
        </Grid>
      </Grid>
    );
  },
);

export default Component;
