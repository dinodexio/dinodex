import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useEffect } from "react";

type Token = {
  ticker: string;
  name: string;
  logo: string;
  [key: string]: string;
};

export type Tokens = Record<string, Token | undefined>;

export interface TokenState {
  loading: boolean;
  data: Tokens;
  base: Tokens;
  error: boolean;
  isLoadPage: boolean;
  loadTokens: () => Promise<void>;
  getTokenByTicker: (tickerSymbol: string) => Token | undefined;
  getTokenID: (
    key: string,
    value: string,
  ) => string | undefined;
  findTokenByParams: (paramsToken: string) => { label: string; value: string } | undefined
}

export const useTokenStore = create<TokenState, [["zustand/immer", never]]>(
  immer((set, get) => ({
    loading: Boolean(false),
    data: JSON.parse(localStorage.getItem("tokens") || "{}"),
    base: JSON.parse(localStorage.getItem("tokens") || "{}"),
    error: Boolean(false),
    isLoadPage: Boolean(false),
    async loadTokens() {
      set((state) => {
        state.loading = true;
      });

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_APP_HOST}/tokens/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const data = (await response.json()) as Tokens;
        const baseTokens: Tokens = Object.entries(data).reduce(
          (result: Tokens, [tokenId, token]) => {
            if (token?.name == "LP Token") {
              return result;
            }
            result[tokenId] = token;
            return result;
          },
          {},
        );
        const oldTokens = localStorage.getItem("tokens");
        const isLoadPage =
          Boolean(oldTokens) && oldTokens !== JSON.stringify(baseTokens || {});
        localStorage.setItem("tokens", JSON.stringify(baseTokens || {}));
        set((state) => {
          state.loading = false;
          state.data = data;
          state.base = baseTokens;
          state.error = false;
          state.isLoadPage = isLoadPage;
        });
      } catch (error) {
        set((state) => {
          state.loading = false;
          state.error = true;
        });
      }
    },
    getTokenByTicker: function (
      tickerSymbol: string
    ) {
      const tokens = get().data
      return Object.values(tokens).find((token) => token?.ticker === tickerSymbol);
    },
    getTokenID: function (
      key: string,
      value: string,
    ): string | undefined {
      const tokens = get().data
      for (const [id, token] of Object.entries(tokens)) {
        if (token && token[key] === value) {
          return id;
        }
      }
      return undefined; // Return undefined if no match found
    },
    findTokenByParams: function (
      paramsToken: string
    ): { label: string; value: string } | undefined {
      if (!paramsToken || typeof paramsToken !== "string") return undefined;
      const tokens = get().data
      for (const [tokenId, tokenInfo] of Object.entries(tokens)) {
        if (
          tokenInfo &&
          tokenInfo.ticker?.toLowerCase() === paramsToken.toLowerCase()
        ) {
          return {
            label: tokenInfo.ticker,
            value: tokenId,
          };
        }
      }
      return undefined;
    }
  })),
);

export const usePoolTokens = () => {
  const { isLoadPage, loadTokens } = useTokenStore();

  useEffect(() => {
    loadTokens();
    if (isLoadPage) {
      location.reload();
    }
  }, [isLoadPage]);
};
