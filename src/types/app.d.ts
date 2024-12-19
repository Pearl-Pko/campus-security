type ModalRefProps = {
    open: () => void;
    close: () => void;
}

declare module '@env' {
    export const GOOGLE_MAP_API_KEY: string;
  }
  