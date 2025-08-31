/// <reference types="vite/client" />
 
interface ImportMetaEnv {
  readonly VITE_BASE_PATH?: string
  // add other env vars as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}