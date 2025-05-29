// Importaciones necesarias
import { defineConfig } from 'vite'
import { resolve } from 'path'

// Exportamos la configuración de Vite
export default defineConfig({
  // Configuración básica del proyecto
  root: 'public',        // Carpeta raíz del proyecto
  publicDir: 'public',   // Carpeta de archivos estáticos

  // Configuración de construcción
  build: {
    outDir: '../dist',   // Carpeta de salida para archivos compilados
    emptyOutDir: true    // Limpia la carpeta antes de construir
  },

  // Configuración del servidor de desarrollo
  server: {
    port: 3000,          // Puerto del servidor
    open: true           // Abre el navegador automáticamente
  },

  // Configuración de rutas y alias
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),     // Alias para importaciones con @
      '/src': resolve(__dirname, 'src')   // Alias para rutas absolutas
    }
  }
}) 