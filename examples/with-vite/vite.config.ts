import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import stitchesRSC from "@stitches-rsc/vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    stitchesRSC({
      useScope: true,
      useLayers: true,
    }),
  ],
});
