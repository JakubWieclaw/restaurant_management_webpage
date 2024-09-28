import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vitePluginRequire from "vite-plugin-require";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // plugins: [react()],
  // resolve: {
  //   alias: {
  //     util: "util/",
  //     stream: "stream/",
  //     crypto: "crypto/",
  //     fs: "fs/",
  //   },
  // },
});
