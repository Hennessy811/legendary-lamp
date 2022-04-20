declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        myPing(): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
        send(channel: string, ...args: unknown[]): void;

        findPokerTables(): void;
        stopFetchingTables(): void;
      };
    };
  }
}

export {};
