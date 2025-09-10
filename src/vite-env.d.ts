/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WSS_PROVIDER?: string
  // Add other env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}