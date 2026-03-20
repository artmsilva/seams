import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import seams from "@artmsilva/seams-vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    seams({
      useScope: true,
      useLayers: true,
    }),
  ],
});
