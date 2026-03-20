import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import seams from "@artmsilva/seams-vite-plugin";

export default defineConfig({
  base: process.env.DEPLOY_BASE || "/",
  plugins: [
    react(),
    seams({
      useScope: true,
      useLayers: true,
    }),
  ],
});
