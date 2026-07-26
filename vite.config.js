import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Jika di-deploy ke GitHub Pages sebagai project site (username.github.io/nama-repo),
// ganti base di bawah ini menjadi "/nama-repo/". Jika pakai domain sendiri atau
// Vercel/Netlify, biarkan "/".
export default defineConfig({
  plugins: [react()],
  base: "/",
});
