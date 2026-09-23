import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Durante o desenvolvimento, qualquer requisição feita pelo front-end
    // para um endereço que comece com "/api" é redirecionada para a API
    // (petshop-api), que roda em outra porta (3001).
    //
    // Assim, no código do React podemos usar só fetch('/api/clientes'),
    // sem escrever o endereço completo e sem se preocupar com CORS.
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
