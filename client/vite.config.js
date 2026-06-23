import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Chuyển tiếp API requests tới backend
      "/api": {
        target: "http://localhost:5065",
        changeOrigin: true,
      },
      // Chuyển tiếp ảnh sản phẩm tới backend
      "/images": {
        target: "http://localhost:5065",
        changeOrigin: true,
      },
    },
  },
});
