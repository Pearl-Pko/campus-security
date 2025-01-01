type ModalRefProps = {
    open: () => void;
    close: () => void;
}

declare module '@env' {
    export const GOOGLE_MAP_API_KEY: string;
    export const WEB_CLIENT_ID: string
  }
  