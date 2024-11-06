declare var mina:
  | {
      requestAccounts: () => Promise<string[]>;
      getAccounts: () => Promise<string[]>;
      on: (event: "accountsChanged" | "disconnect", handler: (event: any) => void) => void;
    }
  | undefined;
