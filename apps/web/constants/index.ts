import { Label } from "@radix-ui/react-label";

export const FILTER_NETWORK = [
  {
    key: "mina",
    logo: "/images/token/mina-token.svg",
    name: "Mina",
  },
  {
    key: "ethereum",
    logo: "/images/token/eth-logo.svg",
    name: "Ethereum",
  },
  {
    key: "optimism",
    logo: "/images/token/op-token.svg",
    name: "Optimism",
  },
  {
    key: "polygon",
    logo: "/images/token/polygon-token.svg",
    name: "Polygon",
  },
  {
    key: "zksync",
    logo: "/images/token/zksync-token.svg",
    name: "Zksync",
  },
];

export const FILTER_VOL = [
  {
    key: "1h",
    label: "1H volume",
  },
  {
    key: "1d",
    label: "1D volume",
  },
  {
    key: "1w",
    label: "1W volume",
  },
  {
    key: "1m",
    label: "1M volume",
  },
  {
    key: "1y",
    label: "1Y volume",
  },
];

export const DATA_TOKENS = [
  {
    id: 1,
    logo: "images/swap/logo-token-default.svg",
    name: "ethereum",
    slug: "ethereum",
    symbol: "ETH",
    price: 1000,
    change1h: "0.1",
    fdv: 7100000000,
    volume: 300000000,
  },
  {
    id: 2,
    logo: "images/swap/logo-token-default.svg",
    name: "bitcoin",
    slug: "bitcoin",
    symbol: "BTC",
    price: 1000,
    change1h: "0.1",
    change1d: "-0.2",
    fdv: 7100000000,
    volume: 300000000,
  },
  {
    id: 3,
    logo: "images/swap/logo-token-default.svg",
    name: "wrapped bitcoin",
    slug: "wrapped-bitcoin",
    symbol: "WBTC",
    price: 1000,
    change1h: "0.1",
    fdv: 7100000000,
    volume: 300000000,
  },
  {
    id: 4,
    logo: "images/swap/logo-token-default.svg",
    name: "Ton coin",
    slug: "ton-coin",
    symbol: "TON",
    price: 1000,
    change1h: "0.1",
    change1d: "-0.2",
    fdv: 7100000000,
    volume: 300000000,
  },
  {
    id: 5,
    logo: "images/swap/logo-token-default.svg",
    name: "Worldcoin",
    slug: "worldcoin",
    symbol: "WLD",
    price: 1000,
    change1d: "-0.2",
    fdv: 7100000000,
    volume: 300000000,
  },
  {
    id: 6,
    logo: "images/swap/logo-token-default.svg",
    name: "Aave",
    symbol: "AAVE",
    slug: "aave",
    price: 1000,
    fdv: 7100000000,
    volume: 300000000,
  },
  {
    id: 7,
    logo: "images/swap/logo-token-default.svg",
    name: "Solana",
    slug: "solana",
    symbol: "SOL",
    price: 1000,
    change1h: "0.1",
    change1d: "-0.2",
    fdv: 7100000000,
    volume: 300000000,
  },
];

export const DATA_POOL = [
  {
    id: 1,
    tokenselected: {
      first: {
        logo: "images/swap/logo-token-default.svg",
        name: "ethereum",
        symbol: "ETH",
      },
      second: {
        logo: "images/swap/logo-token-dummy.svg",
        name: "Wrapped Bitcoin",
        symbol: "WBTC",
      },
    },
    feeTier: 0.03,
    tvl: 193000000,
    apr: 1.23,
    volume1d: 123456,
    volume7d: 500000000,
  },
  {
    id: 2,
    tokenselected: {
      first: {
        logo: "images/swap/logo-token-default.svg",
        name: "ethereum",
        symbol: "ETH",
      },
      second: {
        logo: "images/swap/logo-token-dummy.svg",
        name: "Wrapped Bitcoin",
        symbol: "WBTC",
      },
    },
    feeTier: 0.03,
    tvl: 193000000,
    apr: 1.23,
    volume1d: 123456,
    volume7d: 500000000,
  },
  {
    id: 3,
    tokenselected: {
      first: {
        logo: "images/swap/logo-token-default.svg",
        name: "ethereum",
        symbol: "ETH",
      },
      second: {
        logo: "images/swap/logo-token-dummy.svg",
        name: "Wrapped Bitcoin",
        symbol: "WBTC",
      },
    },
    feeTier: 0.03,
    tvl: 193000000,
    apr: 1.23,
    volume1d: 123456,
    volume7d: 500000000,
  },
  {
    id: 4,
    tokenselected: {
      first: {
        logo: "images/swap/logo-token-default.svg",
        name: "ethereum",
        symbol: "ETH",
      },
      second: {
        logo: "images/swap/logo-token-dummy.svg",
        name: "Wrapped Bitcoin",
        symbol: "WBTC",
      },
    },
    feeTier: 0.03,
    tvl: 193000000,
    apr: 1.23,
    volume1d: 123456,
    volume7d: 500000000,
  },
  {
    id: 5,
    tokenselected: {
      first: {
        logo: "images/swap/logo-token-default.svg",
        name: "ethereum",
        symbol: "ETH",
      },
      second: {
        logo: "images/swap/logo-token-dummy.svg",
        name: "Wrapped Bitcoin",
        symbol: "WBTC",
      },
    },
    feeTier: 0.03,
    tvl: 193000000,
    apr: 1.23,
    volume1d: 123456,
    volume7d: 500000000,
  },
  {
    id: 6,
    tokenselected: {
      first: {
        logo: "images/swap/logo-token-default.svg",
        name: "ethereum",
        symbol: "ETH",
      },
      second: {
        logo: "images/swap/logo-token-dummy.svg",
        name: "Wrapped Bitcoin",
        symbol: "WBTC",
      },
    },
    feeTier: 0.03,
    tvl: 193000000,
    apr: 1.23,
    volume1d: 123456,
    volume7d: 500000000,
  },
  {
    id: 7,
    tokenselected: {
      first: {
        logo: "images/swap/logo-token-default.svg",
        name: "ethereum",
        symbol: "ETH",
      },
      second: {
        logo: "images/swap/logo-token-dummy.svg",
        name: "Wrapped Bitcoin",
        symbol: "WBTC",
      },
    },
    feeTier: 0.03,
    tvl: 193000000,
    apr: 1.23,
    volume1d: 123456,
    volume7d: 500000000,
  },
];

export const SLIPPAGE = [
  { value: 100, label: "Off" },
  { value: 0.1, label: "0.1%" },
  { value: 0.2, label: "0.2%" },
  { value: 0.5, label: "0.5%" },
  { value: 1, label: "1%" },
];

export const LIST_FEE_TIER = [
  { value: 0.01, label: "0.01%" },
  { value: 0.05, label: "0.05%" },
  { value: 0.3, label: "0.3%" },
  { value: 1, label: "1%" },
];

export const LIST_STATUS: any = {
  0: {
    value: "in-range",
    label: "In Range",
  },
  1: {
    value: "closed",
    label: "Closed",
  },
};

export const DRIPBUNDLE = "dripBundle";
export const CREATEPOOL = "createPoolSigned";
export const SELLPATH = "sellPathSigned";
export const ADDLIQUIDITY = "addLiquiditySigned";
export const TRANSFER = "transferSigned";
export const REMOVELIQUIDITY = "removeLiquiditySigned";
export const EMPTY_DATA = "--";
export const PRICE_USDT = 25.395;
export const PRICE_USD = 1;
export const PRICE_MINA = 0.569;

export const MENU_WALLET = [
  {
    value: "deposit",
    icon_default: "/images/wallet/deposit_default.svg",
    icon_hover: "/images/wallet/deposit_hover.svg",
    icon_active: "/images/wallet/deposit_active.svg",
    label: "Deposit",
  },
  {
    value: "withdraw",
    icon_default: "/images/wallet/withdraw_default.svg",
    icon_hover: "/images/wallet/withdraw_hover.svg",
    icon_active: "/images/wallet/withdraw_active.svg",
    label: "Withdraw",
  },
  {
    value: "transfer",
    icon_default: "/images/wallet/transfer_default.svg",
    icon_hover: "/images/wallet/transfer_hover.svg",
    icon_active: "/images/wallet/transfer_active.svg",
    label: "Transfer",
  },
];

export const WALLET_NEMU_ACTIVE = {
  transfer: "transfer",
  withdraw: "withdraw",
  deposit: "deposit",
};

export const LIST_HISTORY = [
  {
    type: WALLET_NEMU_ACTIVE.deposit,
    address: "B62qkwMJEQSTKdJUjtgZxwC2BzPRYR8BH9VryMQa9hX7nmWYqLPBYog",
    price: 700,
    token: { label: "ETH" },
  },
  {
    type: WALLET_NEMU_ACTIVE.withdraw,
    address: "B62qkwMJEQSTKdJUjtgZxwC2BzPRYR8BH9VryMQa9hX7nmWYqLPBYog",
    price: 700,
    token: { label: "BNB" },
  },
  {
    type: WALLET_NEMU_ACTIVE.transfer,
    address: "B62qkwMJEQSTKdJUjtgZxwC2BzPRYR8BH9VryMQa9hX7nmWYqLPBYog",
    price: 700,
    token: { label: "DAI" },
  },
];

export let amout = [
  { value: 10, label: "10%" },
  { value: 20, label: "20%" },
  { value: 50, label: "50%" },
  { value: 75, label: "75%" },
  { value: 100, label: "MAX" },
];

export const TOKEN_PRICES = {
  BTC:  67920, // Assuming 1 BTC = $30,000
  ETH: 2535,  // Assuming 1 ETH = $2,000
  MINA: PRICE_MINA,       // Assuming the price is already defined
  DAI: PRICE_USD,         // Assuming 1 DAI = $1
  BNB: 591.9,   // Assuming 1 BNB = $350
  USDC: 25.374, // Assuming 1 USDC = $0.25
  USDT: 25.395, // Assuming 1 USDT = $0.25
  TUSD: 1,      // Assuming 1 TUSD = $1
  BUSD: 1,      // Assuming 1 BUSD = $1
};
