const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      spacing: {
        0: 0,
        xs: "4px",
        s: "8px",
        m: "16px",
        l: "32px",
        xl: "64px",
        xxl: "128px",
      },
      fontSize: {
        xxl: "28.8px",
        xl: "21px",
        l: "16.8px",
        m: "15.1px",
        s: "14px",
        xs: "12.1px",
        xxs: "11px",
      },
      fontFamily: {
        sans: ["sans-serif"],
      },
      colors: {
        darkBlue: "#0645AD",
        vividBlue: "#B0D6F7",
        skyBlue: "#99C2FF",
        lightBlue: "#F2F9FF",
        darkGrey: "#a2a9b1",
        lightGrey: "#F8F9FA "
      }
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        body: {
          backgroundColor: colors.white,
        },
        hr: {
          border: "1px solid",
          borderColor: colors.black
        },
        h1: {
          fontSize: theme("fontSize.xxl"),
          fontWeight: 400,
        },
        h2: {
          fontSize: theme("fontSize.xl"),
          fontWeight: 300,
        },
        h3: {
          fontSize: theme("fontSize.l"),
          fontWeight: 900,
        },
        h4: {
          fontSize: theme("fontSize.m"),
          fontWeight: 900,
        },
        h5: {
          fontSize: theme("fontSize.xs"),
          fontWeight: 900,
        },
        p: {
          fontSize: theme("fontSize.s"),
          fontWeight: 400,
        },
        ".bold": {
          fontWeight: "bold",
        },
        ".separator": {
          marginTop: theme("spacing.s"),
          marginBottom: theme("spacing.m"),
          height: "1px",
          backgroundColor: colors.black
        },
        "code": {
          backgroundColor: colors.black,
          color: colors.white
        },
        ".editorButton": {
          fontSize: theme("fontSize.xs"),
          backgroundColor: theme("colors.lightGrey"),
          borderColor: theme("colors.darkGrey"),
          borderWidth: "1px",
          padding: theme("spacing.xs"),
          borderRadius: theme("spacing.xs"),
          marginRight: theme("spacing.s"),
          "&:hover": {
            textDecoration: "underline",
            cursor: "pointer"
          }
        }
      });
    }),
  ],
};
