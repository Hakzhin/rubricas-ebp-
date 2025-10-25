/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  // Añade aquí más variables de entorno si las necesitas
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
