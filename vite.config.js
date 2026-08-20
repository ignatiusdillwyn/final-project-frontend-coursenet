import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  // TAMBAHKAN BARIS INI:
  base: '/final-project/dist/', 
  
  plugins: [
    react(),
    tailwindcss(),
  ],
})