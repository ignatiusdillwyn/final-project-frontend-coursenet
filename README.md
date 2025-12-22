
Langkah membuat react

1. npm create vite@latest react-basic
Pilih React, Javascript sisanya tinggal enter2 terus

2. npm install -D tailwindcss @tailwindcss/vite
3. vite.config.js
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})

4. src/index.css
@import "tailwindcss";


5. ubah di App.jsx

6. npm i react-icons sweetalert2 react-router-dom

ref google font
https://fonts.google.com/selection/embed

ref react icon
https://react-icons.github.io/react-icons/## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
