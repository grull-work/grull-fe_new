import * as React from "react";
import { createTheme, ThemeOptions, TypographyVariantsOptions } from "@mui/material/styles";
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    font_64_800: true;
    font_60_800: true;
    font_48_900: true;
    font_48_800: true;
    font_44_800: true;
    font_32_700: true;
    font_32_600: true;
    font_28_800: true;
    font_28_700: true;
    font_28_500: true;
    font_26_600: true;
    font_24_800: true;
    font_24_700: true;
    font_24_600: true;
    font_24_500: true;
    font_20_700: true;
    font_20_500: true;
    font_20_400: true;
    font_20_600: true;
    font_18_800: true;
    font_18_600: true;
    font_18_500: true;
    font_12_900: true;
    font_12_800: true;
    font_12_600: true;
    font_12_500: true;
    font_10_500: true;
    font_10_700: true;
    font_12_400: true;
    font_14_400: true;
    font_14_500: true;
    font_14_700: true;
    font_16_900: true;
    font_16_700: true;
    font_16_600: true;
    font_16_500: true;
    font_16_400: true;
    font_14_600: true;
  }
}
interface ExtendedTypographyOptions extends TypographyVariantsOptions {
  font_64_800: React.CSSProperties;
  font_60_800: React.CSSProperties;
  font_48_900: React.CSSProperties;
  font_48_800: React.CSSProperties;
  font_44_800: React.CSSProperties;
  font_32_700: React.CSSProperties;
  font_32_600: React.CSSProperties;
  font_28_800: React.CSSProperties;
  font_28_700: React.CSSProperties;
  font_28_500: React.CSSProperties;
  font_26_600: React.CSSProperties;
  font_24_800: React.CSSProperties;
  font_24_700: React.CSSProperties;
  font_24_600: React.CSSProperties;
  font_24_500: React.CSSProperties;
  font_20_700: React.CSSProperties;
  font_20_600: React.CSSProperties;
  font_20_500: React.CSSProperties;
  font_20_400: React.CSSProperties;
  font_18_800: React.CSSProperties;
  font_18_600: React.CSSProperties;
  font_18_500: React.CSSProperties;
  font_12_900: React.CSSProperties;
  font_12_800: React.CSSProperties;
  font_12_600: React.CSSProperties;
  font_12_500: React.CSSProperties;
  font_10_500: React.CSSProperties;
  font_10_700: React.CSSProperties;
  font_12_400: React.CSSProperties;
  font_14_400: React.CSSProperties;
  font_14_500: React.CSSProperties;
  font_14_700: React.CSSProperties;
  font_16_900: React.CSSProperties;
  font_16_700: React.CSSProperties;
  font_16_600: React.CSSProperties;
  font_16_500: React.CSSProperties;
  font_16_400: React.CSSProperties;
  font_14_600: React.CSSProperties;
}

export const grullCustomTheme = createTheme({
  typography: {
    fontFamily: ["Figtree", "sans-serif"].join(","),
    button: {
      textTransform: "none",
      ":disabled": {
        backgroundColor: "#E6EBF0 !important",
        color: "#99A6B2 !important",
      },
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
      },
    },
    font_64_800: {
      fontWeight: 800,
      fontSize: "4rem",
      margin: "8px 0",
    },
    font_60_800: {
      fontWeight: 800,
      fontSize: "3.75rem",
      margin: "8px 0",
    },
    font_48_900: {
      fontWeight: 900,
      fontSize: "3rem",
      margin: "8px 0",
    },
    font_48_800: {
      fontWeight: 800,
      fontSize: "3rem",
      lineHeight:"3.6rem",
      margin: "8px 0",
    },
    font_44_800: {
      fontWeight: 800,
      fontSize: "2.75rem",
      margin: "8px 0",
    },
    font_32_700: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: "2.2rem",
    },
    font_32_600: {
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight:"2.2rem"
    },
    font_28_800: {
      fontWeight: 800,
      fontSize: "1.75rem",
      margin: "8px 0",
    },
    font_28_700: {
      fontWeight: 700,
      fontSize: "1.75rem",
      margin: "8px 0",
    },
    font_28_500: {
      fontWeight: 500,
      fontSize: "1.75rem",
      margin: "8px 0",
    },
    font_26_600: {
      fontWeight: 600,
      fontSize: "1.625rem",
      margin: "8px 0",
    },
    font_24_800: {
      fontWeight: 800,
      fontSize: "1.5rem",
    },
    font_24_700: {
      fontWeight: 700,
      fontSize: "1.5rem",
      margin: "8px 0",
    },
    font_24_600: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    font_24_500: {
      fontWeight: 500,
      fontSize: "1.5rem",
      margin: "8px 0",
    },
    font_20_500: {
      fontWeight: 500,
      fontSize: "1.25rem",
      lineHeight: "1.75rem",
    },

    font_20_600: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: "1.75rem",
    },
    font_20_400: {
      fontWeight: 400,
      fontSize: "1.25rem",
      lineHeight: "1.75rem",
    },
    font_18_800: {
      fontWeight: 800,
      fontSize: "1.125rem",
      lineHeight: "1.75rem",
    },
    font_18_600: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: "1.75rem",
    },
    font_18_500: {
      fontWeight: 500,
      fontSize: "1.125rem",
      lineHeight: "1.75rem",
    },
    font_20_700: {
      fontWeight: 700,
      fontSize: "1.25rem",
      lineHeight: "1.75rem",


    },
    font_12_500: {
      fontWeight: 500,
      fontSize: "0.75rem",
      lineHeight: "1rem",
    },
    font_12_900: {
      fontWeight: 900,
      fontSize: "0.75rem",
      lineHeight: "1rem",
    },
    font_10_500: {
      fontWeight: 500,
      fontSize: "0.6rem",
      lineHeight: "1rem",

    },
    font_10_700: {
      fontWeight: 700,
      fontSize: "0.6rem",
      lineHeight: "1rem",

    },
    font_12_800: {
      fontWeight: 800,
      fontSize: "0.75rem",
      lineHeight: "1rem",
      display: "block",
      margin: "4px 0",
    },
    font_12_600: {
      fontWeight: 600,
      fontSize: "0.75rem",
      lineHeight: "1rem",

    },
    font_12_400: {
      fontWeight: 400,
      fontSize: "0.75rem",
      lineHeight: "1rem",
      display: "block",
      margin: "4px 0",
    },
    font_14_400: {
      fontWeight: 400,
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
    },
    font_14_500: {
      fontWeight: 500,
      fontSize: "0.875rem",
      lineHeight: "1.313rem",
    },
    font_14_700: {
      fontWeight: 700,
      fontSize: "0.875rem",
      lineHeight: "1.313rem",
    },
    font_16_700: {
      fontWeight: 700,
      fontSize: "1rem",
      lineHeight: "1.5rem",
      display: "block",
    },
    font_16_600: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: "1.5rem",
      display: "block",
    },
    font_16_900: {
      fontWeight: 900,
      fontSize: "1rem",
      lineHeight: "1.5rem",
      display: "block",
    },
    font_16_500: {
      fontWeight: 500,
      fontSize: "1rem",
      lineHeight: "1.5rem",
      display: "block",
    },
    font_16_400: {
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: "1.5rem",
      display: "block",
    },
    font_14_600: {
      fontWeight: 600,
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
    },
  } as ExtendedTypographyOptions,
  palette: {
    action: {
      disabled: "#ffffff",
      disabledBackground: "#C0C9D1",
    },
  },
} as ThemeOptions);
