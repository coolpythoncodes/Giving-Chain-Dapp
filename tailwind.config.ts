import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        space: ["var(--font-space)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
