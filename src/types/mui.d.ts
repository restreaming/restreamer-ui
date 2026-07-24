import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeBackground {
    accordion: string;
    accordion_border: string;
    box_default: string;
    box_danger: string;
    button_disabled: string;
    dark1: string;
    dark2: string;
    darker1: string;
    darker2: string;
    footer1: string;
    footer2: string;
    light1: string;
    modal: string;
    modalbox: string;
    paper: string;
  }

  interface Palette {
    service: PaletteColor;
    selected: PaletteColor;
  }

  interface PaletteOptions {
    service?: PaletteColorOptions;
    selected?: PaletteColorOptions;
  }

  interface TypographyVariants {
    body3: React.CSSProperties;
    pagetitle: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    body3?: React.CSSProperties;
    subheading?: React.CSSProperties;
    pagetitle?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    body3: true;
    subheading: true;
    pagetitle: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    service: true;
  }
}

declare module "@mui/material/SvgIcon" {
  interface SvgIconPropsColorOverrides {
    service: true;
  }
}

declare module "@mui/material/Alert" {
  interface AlertPropsColorOverrides {
    service: true;
    default: true;
  }
}

declare module "@mui/material/TextField" {
  interface BaseTextFieldProps {
    min?: string | number;
    max?: string | number;
    step?: string | number;
    readOnly?: boolean;
  }

  interface TextFieldPropsColorOverrides {
    default: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    default: true;
  }
  interface ButtonPropsVariantOverrides {
    big: true;
    bigSelected: true;
  }
}

declare module "@mui/material/Switch" {
  interface SwitchPropsColorOverrides {
    default: true;
  }
}
