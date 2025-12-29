/// <reference types="vite/client" />

type ViteEnv = {
  readonly VITE_API_URL?: string
}

interface ImportMetaEnv extends ViteEnv {}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
