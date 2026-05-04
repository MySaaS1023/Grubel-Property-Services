import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0B1F3A",
        charcoal: "#1F2933",
        stonewash: "#F4F6F8",
        accent: "#C58A4B",
        accentDark: "#9A6632",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(11, 31, 58, 0.09)",
      },
    },
  },
  plugins: [],
};

export default config;
