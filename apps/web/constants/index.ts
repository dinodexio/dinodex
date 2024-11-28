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
    logo: "/images/swap/logo-token-default.svg",
    name: "ethereum",
    slug: "ethereum",
    ticker: "ETH",
    price: 1000,
    change1h: "0.1",
    fdv: 7100000000,
    volume: 300000000,
  },
  {
    id: 2,
    logo: "/images/swap/logo-token-default.svg",
    name: "bitcoin",
    slug: "bitcoin",
    ticker: "BTC",
    price: 1000,
    change1h: "0.1",
    change1d: "-0.2",
    fdv: 7100000000,
    volume: 300000000,
  },
  {
    id: 3,
    logo: "/images/swap/logo-token-default.svg",
    name: "wrapped bitcoin",
    slug: "wrapped-bitcoin",
    ticker: "WBTC",
    price: 1000,
    change1h: "0.1",
    fdv: 7100000000,
    volume: 300000000,
  },
  {
    id: 4,
    logo: "/images/swap/logo-token-default.svg",
    name: "Ton coin",
    slug: "ton-coin",
    ticker: "TON",
    price: 1000,
    change1h: "0.1",
    change1d: "-0.2",
    fdv: 7100000000,
    volume: 300000000,
  },
  {
    id: 5,
    logo: "/images/swap/logo-token-default.svg",
    name: "Worldcoin",
    slug: "worldcoin",
    ticker: "WLD",
    price: 1000,
    change1d: "-0.2",
    fdv: 7100000000,
    volume: 300000000,
  },
  {
    id: 6,
    logo: "/images/swap/logo-token-default.svg",
    name: "Aave",
    ticker: "AAVE",
    slug: "aave",
    price: 1000,
    fdv: 7100000000,
    volume: 300000000,
  },
  {
    id: 7,
    logo: "/images/swap/logo-token-default.svg",
    name: "Solana",
    slug: "solana",
    ticker: "SOL",
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
        ticker: "ETH",
      },
      second: {
        logo: "images/swap/logo-token-dummy.svg",
        name: "Wrapped Bitcoin",
        ticker: "WBTC",
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
        ticker: "ETH",
      },
      second: {
        logo: "images/swap/logo-token-dummy.svg",
        name: "Wrapped Bitcoin",
        ticker: "WBTC",
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
        ticker: "ETH",
      },
      second: {
        logo: "images/swap/logo-token-dummy.svg",
        name: "Wrapped Bitcoin",
        ticker: "WBTC",
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
        ticker: "ETH",
      },
      second: {
        logo: "images/swap/logo-token-dummy.svg",
        name: "Wrapped Bitcoin",
        ticker: "WBTC",
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
        ticker: "ETH",
      },
      second: {
        logo: "images/swap/logo-token-dummy.svg",
        name: "Wrapped Bitcoin",
        ticker: "WBTC",
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
        ticker: "ETH",
      },
      second: {
        logo: "images/swap/logo-token-dummy.svg",
        name: "Wrapped Bitcoin",
        ticker: "WBTC",
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
        ticker: "ETH",
      },
      second: {
        logo: "images/swap/logo-token-dummy.svg",
        name: "Wrapped Bitcoin",
        ticker: "WBTC",
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
  // { value: 100, label: "Off" },
  { value: 0.1, label: "0.1%" },
  // { value: 0.2, label: "0.2%" },
  { value: 0.5, label: "0.5%" },
  // { value: 1, label: "1%" },
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
export const CREATEPOOL = "createPool";
export const SELLPATH = "swap";
export const ADDLIQUIDITY = "addLiquidity";
export const TRANSFER = "transferSigned";
export const REMOVELIQUIDITY = "removeLiquidity";
export const EMPTY_DATA = "--";
export const PRICE_USDT = 25.395;
export const PRICE_USD = 1.01;
export const PRICE_MINA = 0.569;
export const BLOCK_TIME = 5

export const MENU_WALLET = [
  {
    value: "deposit",
    icon_default: "/images/wallet/withdraw_default.svg",
    icon_hover: "/images/wallet/withdraw_hover.svg",
    icon_active: "/images/wallet/withdraw_active.svg",
    label: "Deposit",
  },
  {
    value: "withdraw",
    icon_default: "/images/wallet/deposit_default.svg",
    icon_hover: "/images/wallet/deposit_hover.svg",
    icon_active: "/images/wallet/deposit_active.svg",
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
  change: "change",
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

export const TOKEN_PRICES: any = {
  BTC:  88068.7, // Assuming 1 BTC = $30,000
  ETH: 3062.91,  // Assuming 1 ETH = $2,000
  MINA: 0.6044,       // Assuming the price is already defined
  DAI: 1.01,         // Assuming 1 DAI = $1
  BNB: 618.56,   // Assuming 1 BNB = $350
  USDC: 0.99905, // Assuming 1 USDC = $0.25
  USDT: 1, // Assuming 1 USDT = $0.25
  TUSD: 1,      // Assuming 1 TUSD = $1
  BUSD: 1,      // Assuming 1 BUSD = $1
  WBTC: 87802.7, // Assuming 1 WBTC = $30,000
};

export const DATA_DUMMY_CHART = [
  {
    date: new Date('2007-04-23'),
    value2: 100,
    value1: 93.24,
  },
  {
    date: new Date('2007-04-24'),
    value2: 100,
    value1: 95.35,
  },
  {
    date: new Date('2007-04-25'),
    value2: 100,
    value1: 98.84,
  },
  {
    date: new Date('2007-04-26'),
    value2: 100,
    value1: 99.92,
  },
  {
    date: new Date('2007-04-29'),
    value2: 100,
    value1: 99.8,
  },
  {
    date: new Date('2007-05-01'),
    value2: 100,
    value1: 99.47,
  },
  {
    date: new Date('2007-05-02'),
    value2: 100,
    value1: 100.39,
  },
  {
    date: new Date('2007-05-03'),
    value2: 100,
    value1: 100.4,
  },
  {
    date: new Date('2007-05-04'),
    value2: 100,
    value1: 100.81,
  },
  {
    date: new Date('2007-05-07'),
    value2: 100,
    value1: 103.92,
  },
  {
    date: new Date('2007-05-08'),
    value2: 100,
    value1: 105.06,
  },
  {
    date: new Date('2007-05-09'),
    value2: 100,
    value1: 106.88,
  },
  {
    date: new Date('2007-05-09'),
    value2: 100,
    value1: 107.34,
  },
  {
    date: new Date('2007-05-10'),
    value2: 100,
    value1: 108.74,
  },
  {
    date: new Date('2007-05-13'),
    value2: 100,
    value1: 109.36,
  },
  {
    date: new Date('2007-05-14'),
    value2: 100,
    value1: 107.52,
  },
  {
    date: new Date('2007-05-15'),
    value2: 100,
    value1: 107.34,
  },
  {
    date: new Date('2007-05-16'),
    value2: 100,
    value1: 109.44,
  },
  {
    date: new Date('2007-05-17'),
    value2: 100,
    value1: 110.02,
  },
  {
    date: new Date('2007-05-20'),
    value2: 100,
    value1: 111.98,
  },
  {
    date: new Date('2007-05-21'),
    value2: 100,
    value1: 113.54,
  },
  {
    date: new Date('2007-05-22'),
    value2: 100,
    value1: 112.89,
  },
  {
    date: new Date('2007-05-23'),
    value2: 100,
    value1: 110.69,
  },
  {
    date: new Date('2007-05-24'),
    value2: 100,
    value1: 113.62,
  },
  {
    date: new Date('2007-05-28'),
    value2: 100,
    value1: 114.35,
  },
  {
    date: new Date('2007-05-29'),
    value2: 100,
    value1: 118.77,
  },
  {
    date: new Date('2007-05-30'),
    value2: 100,
    value1: 121.19,
  },
  {
    date: new Date('2007-06-01'),
    value2: 100,
    value1: 118.4,
  },
  {
    date: new Date('2007-06-04'),
    value2: 100,
    value1: 121.33,
  },
  {
    date: new Date('2007-06-05'),
    value2: 100,
    value1: 122.67,
  },
  {
    date: new Date('2007-06-06'),
    value2: 100,
    value1: 123.64,
  },
  {
    date: new Date('2007-06-07'),
    value2: 100,
    value1: 124.07,
  },
  {
    date: new Date('2007-06-08'),
    value2: 100,
    value1: 124.49,
  },
  {
    date: new Date('2007-06-10'),
    value2: 100,
    value1: 120.19,
  },
  {
    date: new Date('2007-06-11'),
    value2: 100,
    value1: 120.38,
  },
  {
    date: new Date('2007-06-12'),
    value2: 100,
    value1: 117.5,
  },
  {
    date: new Date('2007-06-13'),
    value2: 100,
    value1: 118.75,
  },
  {
    date: new Date('2007-06-14'),
    value2: 100,
    value1: 120.5,
  },
  {
    date: new Date('2007-06-17'),
    value2: 100,
    value1: 125.09,
  },
  {
    date: new Date('2007-06-18'),
    value2: 100,
    value1: 123.66,
  },
  {
    date: new Date('2007-06-19'),
    value2: 100,
    value1: 121.55,
  },
  {
    date: new Date('2007-06-20'),
    value2: 100,
    value1: 123.9,
  },
  {
    date: new Date('2007-06-21'),
    value2: 100,
    value1: 123,
  },
  {
    date: new Date('2007-06-24'),
    value2: 100,
    value1: 122.34,
  },
  {
    date: new Date('2007-06-25'),
    value2: 100,
    value1: 119.65,
  },
  {
    date: new Date('2007-06-26'),
    value2: 100,
    value1: 121.89,
  },
  {
    date: new Date('2007-06-27'),
    value2: 100,
    value1: 120.56,
  },
  {
    date: new Date('2007-06-28'),
    value2: 100,
    value1: 122.04,
  },
  {
    date: new Date('2007-07-02'),
    value2: 100,
    value1: 121.26,
  },
  {
    date: new Date('2007-07-03'),
    value2: 100,
    value1: 127.17,
  },
  {
    date: new Date('2007-07-05'),
    value2: 100,
    value1: 132.75,
  },
  {
    date: new Date('2007-07-06'),
    value2: 100,
    value1: 132.3,
  },
  {
    date: new Date('2007-07-09'),
    value2: 100,
    value1: 130.33,
  },
  {
    date: new Date('2007-07-09'),
    value2: 100,
    value1: 132.35,
  },
  {
    date: new Date('2007-07-10'),
    value2: 100,
    value1: 132.39,
  },
  {
    date: new Date('2007-07-11'),
    value2: 100,
    value1: 134.07,
  },
  {
    date: new Date('2007-07-12'),
    value2: 100,
    value1: 137.73,
  },
  {
    date: new Date('2007-07-15'),
    value2: 100,
    value1: 138.1,
  },
  {
    date: new Date('2007-07-16'),
    value2: 100,
    value1: 138.91,
  },
  {
    date: new Date('2007-07-17'),
    value2: 100,
    value1: 138.12,
  },
  {
    date: new Date('2007-07-18'),
    value2: 100,
    value1: 140,
  },
  {
    date: new Date('2007-07-19'),
    value2: 100,
    value1: 143.75,
  },
  {
    date: new Date('2007-07-22'),
    value2: 100,
    value1: 143.7,
  },
  {
    date: new Date('2007-07-23'),
    value2: 100,
    value1: 134.89,
  },
  {
    date: new Date('2007-07-24'),
    value2: 100,
    value1: 137.26,
  },
  {
    date: new Date('2007-07-25'),
    value2: 100,
    value1: 146,
  },
  {
    date: new Date('2007-07-26'),
    value2: 100,
    value1: 143.85,
  },
  {
    date: new Date('2007-07-29'),
    value2: 100,
    value1: 141.43,
  },
  {
    date: new Date('2007-07-30'),
    value2: 100,
    value1: 131.76,
  },
  {
    date: new Date('2007-08-01'),
    value2: 100,
    value1: 135,
  },
  {
    date: new Date('2007-08-02'),
    value2: 100,
    value1: 136.49,
  },
  {
    date: new Date('2007-08-03'),
    value2: 100,
    value1: 131.85,
  },
  {
    date: new Date('2007-08-06'),
    value2: 100,
    value1: 135.25,
  },
  {
    date: new Date('2007-08-07'),
    value2: 100,
    value1: 135.03,
  },
  {
    date: new Date('2007-08-08'),
    value2: 100,
    value1: 134.01,
  },
  {
    date: new Date('2007-08-09'),
    value2: 100,
    value1: 126.39,
  },
  {
    date: new Date('2007-08-09'),
    value2: 100,
    value1: 125,
  },
  {
    date: new Date('2007-08-12'),
    value2: 100,
    value1: 127.79,
  },
  {
    date: new Date('2007-08-13'),
    value2: 100,
    value1: 124.03,
  },
  {
    date: new Date('2007-08-14'),
    value2: 100,
    value1: 119.9,
  },
  {
    date: new Date('2007-08-15'),
    value2: 100,
    value1: 117.05,
  },
  {
    date: new Date('2007-08-16'),
    value2: 100,
    value1: 122.06,
  },
  {
    date: new Date('2007-08-19'),
    value2: 100,
    value1: 122.22,
  },
  {
    date: new Date('2007-08-20'),
    value2: 100,
    value1: 127.57,
  },
  {
    date: new Date('2007-08-21'),
    value2: 100,
    value1: 132.51,
  },
  {
    date: new Date('2007-08-22'),
    value2: 100,
    value1: 131.07,
  },
  {
    date: new Date('2007-08-23'),
    value2: 100,
    value1: 135.3,
  },
  {
    date: new Date('2007-08-26'),
    value2: 100,
    value1: 132.25,
  },
  {
    date: new Date('2007-08-27'),
    value2: 100,
    value1: 126.82,
  },
  {
    date: new Date('2007-08-28'),
    value2: 100,
    value1: 134.08,
  },
  {
    date: new Date('2007-08-29'),
    value2: 100,
    value1: 136.25,
  },
  {
    date: new Date('2007-08-30'),
    value2: 100,
    value1: 138.48,
  },
  {
    date: new Date('2007-09-04'),
    value2: 100,
    value1: 144.16,
  },
  {
    date: new Date('2007-09-05'),
    value2: 100,
    value1: 136.76,
  },
  {
    date: new Date('2007-09-06'),
    value2: 100,
    value1: 135.01,
  },
  {
    date: new Date('2007-09-07'),
    value2: 100,
    value1: 131.77,
  },
  {
    date: new Date('2007-09-09'),
    value2: 100,
    value1: 136.71,
  },
  {
    date: new Date('2007-09-10'),
    value2: 100,
    value1: 135.49,
  },
  {
    date: new Date('2007-09-11'),
    value2: 100,
    value1: 136.85,
  },
  {
    date: new Date('2007-09-12'),
    value2: 100,
    value1: 137.2,
  },
  {
    date: new Date('2007-09-13'),
    value2: 100,
    value1: 138.81,
  },
  {
    date: new Date('2007-09-16'),
    value2: 100,
    value1: 138.41,
  },
  {
    date: new Date('2007-09-17'),
    value2: 100,
    value1: 140.92,
  },
  {
    date: new Date('2007-09-18'),
    value2: 100,
    value1: 140.77,
  },
  {
    date: new Date('2007-09-19'),
    value2: 100,
    value1: 140.31,
  },
  {
    date: new Date('2007-09-20'),
    value2: 100,
    value1: 144.15,
  },
  {
    date: new Date('2007-09-23'),
    value2: 100,
    value1: 148.28,
  },
  {
    date: new Date('2007-09-24'),
    value2: 100,
    value1: 153.18,
  },
  {
    date: new Date('2007-09-25'),
    value2: 100,
    value1: 152.77,
  },
  {
    date: new Date('2007-09-26'),
    value2: 100,
    value1: 154.5,
  },
  {
    date: new Date('2007-09-27'),
    value2: 100,
    value1: 153.47,
  },
  {
    date: new Date('2007-10-01'),
    value2: 100,
    value1: 156.34,
  },
  {
    date: new Date('2007-10-02'),
    value2: 100,
    value1: 158.45,
  },
  {
    date: new Date('2007-10-03'),
    value2: 100,
    value1: 157.92,
  },
  {
    date: new Date('2007-10-04'),
    value2: 100,
    value1: 156.24,
  },
  {
    date: new Date('2007-10-05'),
    value2: 100,
    value1: 161.45,
  },
  {
    date: new Date('2007-10-08'),
    value2: 100,
    value1: 167.91,
  },
  {
    date: new Date('2007-10-09'),
    value2: 100,
    value1: 167.86,
  },
  {
    date: new Date('2007-10-09'),
    value2: 100,
    value1: 166.79,
  },
  {
    date: new Date('2007-10-10'),
    value2: 100,
    value1: 162.23,
  },
  {
    date: new Date('2007-10-11'),
    value2: 100,
    value1: 167.25,
  },
  {
    date: new Date('2007-10-14'),
    value2: 100,
    value1: 166.98,
  },
  {
    date: new Date('2007-10-15'),
    value2: 100,
    value1: 169.58,
  },
  {
    date: new Date('2007-10-16'),
    value2: 100,
    value1: 172.75,
  },
  {
    date: new Date('2007-10-17'),
    value2: 100,
    value1: 173.5,
  },
  {
    date: new Date('2007-10-18'),
    value2: 100,
    value1: 170.42,
  },
  {
    date: new Date('2007-10-21'),
    value2: 100,
    value1: 174.36,
  },
  {
    date: new Date('2007-10-22'),
    value2: 100,
    value1: 186.16,
  },
  {
    date: new Date('2007-10-23'),
    value2: 100,
    value1: 185.93,
  },
  {
    date: new Date('2007-10-24'),
    value2: 100,
    value1: 182.78,
  },
  {
    date: new Date('2007-10-25'),
    value2: 100,
    value1: 184.7,
  },
  {
    date: new Date('2007-10-28'),
    value2: 100,
    value1: 185.09,
  },
  {
    date: new Date('2007-10-29'),
    value2: 100,
    value1: 187,
  },
  {
    date: new Date('2007-10-30'),
    value2: 100,
    value1: 189.95,
  },
  {
    date: new Date('2007-11-01'),
    value2: 100,
    value1: 187.44,
  },
  {
    date: new Date('2007-11-02'),
    value2: 100,
    value1: 187.87,
  },
  {
    date: new Date('2007-11-05'),
    value2: 100,
    value1: 186.18,
  },
  {
    date: new Date('2007-11-06'),
    value2: 100,
    value1: 191.79,
  },
  {
    date: new Date('2007-11-07'),
    value2: 100,
    value1: 186.3,
  },
  {
    date: new Date('2007-11-08'),
    value2: 100,
    value1: 175.47,
  },
  {
    date: new Date('2007-11-09'),
    value2: 100,
    value1: 165.37,
  },
  {
    date: new Date('2007-11-11'),
    value2: 100,
    value1: 153.76,
  },
  {
    date: new Date('2007-11-12'),
    value2: 100,
    value1: 169.96,
  },
  {
    date: new Date('2007-11-13'),
    value2: 100,
    value1: 166.11,
  },
  {
    date: new Date('2007-11-14'),
    value2: 100,
    value1: 164.3,
  },
  {
    date: new Date('2007-11-15'),
    value2: 100,
    value1: 166.39,
  },
  {
    date: new Date('2007-11-18'),
    value2: 100,
    value1: 163.95,
  },
  {
    date: new Date('2007-11-19'),
    value2: 100,
    value1: 168.85,
  },
  {
    date: new Date('2007-11-20'),
    value2: 100,
    value1: 168.46,
  },
  {
    date: new Date('2007-11-22'),
    value2: 100,
    value1: 171.54,
  },
  {
    date: new Date('2007-11-25'),
    value2: 100,
    value1: 172.54,
  },
  {
    date: new Date('2007-11-26'),
    value2: 100,
    value1: 174.81,
  },
  {
    date: new Date('2007-11-27'),
    value2: 100,
    value1: 180.22,
  },
  {
    date: new Date('2007-11-28'),
    value2: 100,
    value1: 184.29,
  },
  {
    date: new Date('2007-11-29'),
    value2: 100,
    value1: 182.22,
  },
  {
    date: new Date('2007-12-03'),
    value2: 100,
    value1: 178.86,
  },
  {
    date: new Date('2007-12-04'),
    value2: 100,
    value1: 179.81,
  },
  {
    date: new Date('2007-12-05'),
    value2: 100,
    value1: 185.5,
  },
  {
    date: new Date('2007-12-06'),
    value2: 100,
    value1: 189.95,
  },
  {
    date: new Date('2007-12-07'),
    value2: 100,
    value1: 194.3,
  },
  {
    date: new Date('2007-12-09'),
    value2: 100,
    value1: 194.21,
  },
  {
    date: new Date('2007-12-10'),
    value2: 100,
    value1: 188.54,
  },
  {
    date: new Date('2007-12-11'),
    value2: 100,
    value1: 190.86,
  },
  {
    date: new Date('2007-12-12'),
    value2: 100,
    value1: 191.83,
  },
  {
    date: new Date('2007-12-13'),
    value2: 100,
    value1: 190.39,
  },
  {
    date: new Date('2007-12-16'),
    value2: 100,
    value1: 184.4,
  },
  {
    date: new Date('2007-12-17'),
    value2: 100,
    value1: 182.98,
  },
  {
    date: new Date('2007-12-18'),
    value2: 100,
    value1: 183.12,
  },
  {
    date: new Date('2007-12-19'),
    value2: 100,
    value1: 187.21,
  },
  {
    date: new Date('2007-12-20'),
    value2: 100,
    value1: 193.91,
  },
  {
    date: new Date('2007-12-23'),
    value2: 100,
    value1: 198.8,
  },
  {
    date: new Date('2007-12-25'),
    value2: 100,
    value1: 198.95,
  },
  {
    date: new Date('2007-12-26'),
    value2: 100,
    value1: 198.57,
  },
  {
    date: new Date('2007-12-27'),
    value2: 100,
    value1: 199.83,
  },
  {
    date: new Date('2007-12-30'),
    value2: 100,
    value1: 198.08,
  },
  {
    date: new Date('2008-01-02'),
    value2: 100,
    value1: 194.84,
  },
  {
    date: new Date('2008-01-03'),
    value2: 100,
    value1: 194.93,
  },
  {
    date: new Date('2008-01-04'),
    value2: 100,
    value1: 180.05,
  },
  {
    date: new Date('2008-01-07'),
    value2: 100,
    value1: 177.64,
  },
  {
    date: new Date('2008-01-08'),
    value2: 100,
    value1: 171.25,
  },
  {
    date: new Date('2008-01-09'),
    value2: 100,
    value1: 179.4,
  },
  {
    date: new Date('2008-01-09'),
    value2: 100,
    value1: 178.02,
  },
  {
    date: new Date('2008-01-10'),
    value2: 100,
    value1: 172.69,
  },
  {
    date: new Date('2008-01-13'),
    value2: 100,
    value1: 178.78,
  },
  {
    date: new Date('2008-01-14'),
    value2: 100,
    value1: 169.04,
  },
  {
    date: new Date('2008-01-15'),
    value2: 100,
    value1: 159.64,
  },
  {
    date: new Date('2008-01-16'),
    value2: 100,
    value1: 160.89,
  },
  {
    date: new Date('2008-01-17'),
    value2: 100,
    value1: 161.36,
  },
  {
    date: new Date('2008-01-21'),
    value2: 100,
    value1: 155.64,
  },
  {
    date: new Date('2008-01-22'),
    value2: 100,
    value1: 139.07,
  },
  {
    date: new Date('2008-01-23'),
    value2: 100,
    value1: 135.6,
  },
  {
    date: new Date('2008-01-24'),
    value2: 100,
    value1: 130.01,
  },
  {
    date: new Date('2008-01-27'),
    value2: 100,
    value1: 130.01,
  },
  {
    date: new Date('2008-01-28'),
    value2: 100,
    value1: 131.54,
  },
  {
    date: new Date('2008-01-29'),
    value2: 100,
    value1: 132.18,
  },
  {
    date: new Date('2008-01-30'),
    value2: 100,
    value1: 135.36,
  },
  {
    date: new Date('2008-02-01'),
    value2: 100,
    value1: 133.75,
  },
  {
    date: new Date('2008-02-04'),
    value2: 100,
    value1: 131.65,
  },
  {
    date: new Date('2008-02-05'),
    value2: 100,
    value1: 129.36,
  },
  {
    date: new Date('2008-02-06'),
    value2: 100,
    value1: 122,
  },
  {
    date: new Date('2008-02-07'),
    value2: 100,
    value1: 121.24,
  },
  {
    date: new Date('2008-02-08'),
    value2: 100,
    value1: 125.48,
  },
  {
    date: new Date('2008-02-10'),
    value2: 100,
    value1: 129.45,
  },
  {
    date: new Date('2008-02-11'),
    value2: 100,
    value1: 124.86,
  },
  {
    date: new Date('2008-02-12'),
    value2: 100,
    value1: 129.4,
  },
  {
    date: new Date('2008-02-13'),
    value2: 100,
    value1: 127.46,
  },
  {
    date: new Date('2008-02-14'),
    value2: 100,
    value1: 124.63,
  },
  {
    date: new Date('2008-02-18'),
    value2: 100,
    value1: 122.18,
  },
  {
    date: new Date('2008-02-19'),
    value2: 100,
    value1: 123.82,
  },
  {
    date: new Date('2008-02-20'),
    value2: 100,
    value1: 121.54,
  },
  {
    date: new Date('2008-02-21'),
    value2: 100,
    value1: 119.46,
  },
  {
    date: new Date('2008-02-24'),
    value2: 100,
    value1: 119.74,
  },
  {
    date: new Date('2008-02-25'),
    value2: 100,
    value1: 119.15,
  },
  {
    date: new Date('2008-02-26'),
    value2: 100,
    value1: 122.96,
  },
  {
    date: new Date('2008-02-27'),
    value2: 100,
    value1: 129.91,
  },
  {
    date: new Date('2008-02-28'),
    value2: 100,
    value1: 125.02,
  },
  {
    date: new Date('2008-03-03'),
    value2: 100,
    value1: 121.73,
  },
  {
    date: new Date('2008-03-04'),
    value2: 100,
    value1: 124.62,
  },
  {
    date: new Date('2008-03-05'),
    value2: 100,
    value1: 124.49,
  },
  {
    date: new Date('2008-03-06'),
    value2: 100,
    value1: 120.93,
  },
  {
    date: new Date('2008-03-07'),
    value2: 100,
    value1: 122.25,
  },
  {
    date: new Date('2008-03-09'),
    value2: 100,
    value1: 119.69,
  },
  {
    date: new Date('2008-03-10'),
    value2: 100,
    value1: 127.35,
  },
  {
    date: new Date('2008-03-11'),
    value2: 100,
    value1: 126.03,
  },
  {
    date: new Date('2008-03-12'),
    value2: 100,
    value1: 127.94,
  },
  {
    date: new Date('2008-03-13'),
    value2: 100,
    value1: 126.61,
  },
  {
    date: new Date('2008-03-16'),
    value2: 100,
    value1: 126.73,
  },
  {
    date: new Date('2008-03-17'),
    value2: 100,
    value1: 132.82,
  },
  {
    date: new Date('2008-03-18'),
    value2: 100,
    value1: 129.67,
  },
  {
    date: new Date('2008-03-19'),
    value2: 100,
    value1: 133.27,
  },
  {
    date: new Date('2008-03-23'),
    value2: 100,
    value1: 139.53,
  },
  {
    date: new Date('2008-03-24'),
    value2: 100,
    value1: 140.98,
  },
  {
    date: new Date('2008-03-25'),
    value2: 100,
    value1: 145.06,
  },
  {
    date: new Date('2008-03-26'),
    value2: 100,
    value1: 140.25,
  },
  {
    date: new Date('2008-03-27'),
    value2: 100,
    value1: 143.01,
  },
  {
    date: new Date('2008-03-30'),
    value2: 100,
    value1: 143.5,
  },
  {
    date: new Date('2008-04-01'),
    value2: 100,
    value1: 149.53,
  },
  {
    date: new Date('2008-04-02'),
    value2: 100,
    value1: 147.49,
  },
  {
    date: new Date('2008-04-03'),
    value2: 100,
    value1: 151.61,
  },
  {
    date: new Date('2008-04-04'),
    value2: 100,
    value1: 153.08,
  },
  {
    date: new Date('2008-04-07'),
    value2: 100,
    value1: 155.89,
  },
  {
    date: new Date('2008-04-08'),
    value2: 100,
    value1: 152.84,
  },
  {
    date: new Date('2008-04-09'),
    value2: 100,
    value1: 151.44,
  },
  {
    date: new Date('2008-04-09'),
    value2: 100,
    value1: 154.55,
  },
  {
    date: new Date('2008-04-10'),
    value2: 100,
    value1: 147.14,
  },
  {
    date: new Date('2008-04-13'),
    value2: 100,
    value1: 147.78,
  },
  {
    date: new Date('2008-04-14'),
    value2: 100,
    value1: 148.38,
  },
  {
    date: new Date('2008-04-15'),
    value2: 100,
    value1: 153.7,
  },
  {
    date: new Date('2008-04-16'),
    value2: 100,
    value1: 154.49,
  },
  {
    date: new Date('2008-04-17'),
    value2: 100,
    value1: 161.04,
  },
  {
    date: new Date('2008-04-20'),
    value2: 100,
    value1: 168.16,
  },
  {
    date: new Date('2008-04-21'),
    value2: 100,
    value1: 160.2,
  },
  {
    date: new Date('2008-04-22'),
    value2: 100,
    value1: 162.89,
  },
  {
    date: new Date('2008-04-23'),
    value2: 100,
    value1: 168.94,
  },
  {
    date: new Date('2008-04-24'),
    value2: 100,
    value1: 169.73,
  },
  {
    date: new Date('2008-04-27'),
    value2: 100,
    value1: 172.24,
  },
  {
    date: new Date('2008-04-28'),
    value2: 100,
    value1: 175.05,
  },
  {
    date: new Date('2008-04-29'),
    value2: 100,
    value1: 173.95,
  },
  {
    date: new Date('2008-05-01'),
    value2: 100,
    value1: 180,
  },
  {
    date: new Date('2008-05-02'),
    value2: 100,
    value1: 180.94,
  },
  {
    date: new Date('2008-05-05'),
    value2: 100,
    value1: 184.73,
  },
  {
    date: new Date('2008-05-06'),
    value2: 100,
    value1: 186.66,
  },
  {
    date: new Date('2008-05-07'),
    value2: 100,
    value1: 182.59,
  },
  {
    date: new Date('2008-05-08'),
    value2: 100,
    value1: 185.06,
  },
  {
    date: new Date('2008-05-09'),
    value2: 100,
    value1: 183.45,
  },
  {
    date: new Date('2008-05-11'),
    value2: 100,
    value1: 188.16,
  },
  {
    date: new Date('2008-05-12'),
    value2: 100,
    value1: 189.96,
  },
  {
    date: new Date('2008-05-13'),
    value2: 100,
    value1: 186.26,
  },
  {
    date: new Date('2008-05-14'),
    value2: 100,
    value1: 189.73,
  },
  {
    date: new Date('2008-05-15'),
    value2: 100,
    value1: 187.62,
  },
  {
    date: new Date('2008-05-18'),
    value2: 100,
    value1: 183.6,
  },
  {
    date: new Date('2008-05-19'),
    value2: 100,
    value1: 185.9,
  },
  {
    date: new Date('2008-05-20'),
    value2: 100,
    value1: 178.19,
  },
  {
    date: new Date('2008-05-21'),
    value2: 100,
    value1: 177.05,
  },
  {
    date: new Date('2008-05-22'),
    value2: 100,
    value1: 181.17,
  },
  {
    date: new Date('2008-05-26'),
    value2: 100,
    value1: 186.43,
  },
  {
    date: new Date('2008-05-27'),
    value2: 100,
    value1: 187.01,
  },
  {
    date: new Date('2008-05-28'),
    value2: 100,
    value1: 186.69,
  },
  {
    date: new Date('2008-05-29'),
    value2: 100,
    value1: 188.75,
  },
  {
    date: new Date('2008-06-02'),
    value2: 100,
    value1: 186.1,
  },
  {
    date: new Date('2008-06-03'),
    value2: 100,
    value1: 185.37,
  },
  {
    date: new Date('2008-06-04'),
    value2: 100,
    value1: 185.19,
  },
  {
    date: new Date('2008-06-05'),
    value2: 100,
    value1: 189.43,
  },
  {
    date: new Date('2008-06-06'),
    value2: 100,
    value1: 185.64,
  },
  {
    date: new Date('2008-06-09'),
    value2: 100,
    value1: 181.61,
  },
  {
    date: new Date('2008-06-09'),
    value2: 100,
    value1: 185.64,
  },
  {
    date: new Date('2008-06-10'),
    value2: 100,
    value1: 180.81,
  },
  {
    date: new Date('2008-06-11'),
    value2: 100,
    value1: 173.26,
  },
  {
    date: new Date('2008-06-12'),
    value2: 100,
    value1: 172.37,
  },
  {
    date: new Date('2008-06-15'),
    value2: 100,
    value1: 176.84,
  },
  {
    date: new Date('2008-06-16'),
    value2: 100,
    value1: 181.43,
  },
  {
    date: new Date('2008-06-17'),
    value2: 100,
    value1: 178.75,
  },
  {
    date: new Date('2008-06-18'),
    value2: 100,
    value1: 180.9,
  },
  {
    date: new Date('2008-06-19'),
    value2: 100,
    value1: 175.27,
  },
  {
    date: new Date('2008-06-22'),
    value2: 100,
    value1: 173.16,
  },
  {
    date: new Date('2008-06-23'),
    value2: 100,
    value1: 173.25,
  },
  {
    date: new Date('2008-06-24'),
    value2: 100,
    value1: 177.39,
  },
  {
    date: new Date('2008-06-25'),
    value2: 100,
    value1: 168.26,
  },
  {
    date: new Date('2008-06-26'),
    value2: 100,
    value1: 170.09,
  },
  {
    date: new Date('2008-06-29'),
    value2: 100,
    value1: 167.44,
  },
  {
    date: new Date('2008-07-01'),
    value2: 100,
    value1: 174.68,
  },
  {
    date: new Date('2008-07-02'),
    value2: 100,
    value1: 168.18,
  },
  {
    date: new Date('2008-07-03'),
    value2: 100,
    value1: 170.12,
  },
  {
    date: new Date('2008-07-07'),
    value2: 100,
    value1: 175.16,
  },
  {
    date: new Date('2008-07-08'),
    value2: 100,
    value1: 179.55,
  },
  {
    date: new Date('2008-07-09'),
    value2: 100,
    value1: 174.25,
  },
  {
    date: new Date('2008-07-09'),
    value2: 100,
    value1: 176.63,
  },
  {
    date: new Date('2008-07-10'),
    value2: 100,
    value1: 172.58,
  },
  {
    date: new Date('2008-07-13'),
    value2: 100,
    value1: 173.88,
  },
  {
    date: new Date('2008-07-14'),
    value2: 100,
    value1: 169.64,
  },
  {
    date: new Date('2008-07-15'),
    value2: 100,
    value1: 172.81,
  },
  {
    date: new Date('2008-07-16'),
    value2: 100,
    value1: 171.81,
  },
  {
    date: new Date('2008-07-17'),
    value2: 100,
    value1: 165.15,
  },
  {
    date: new Date('2008-07-20'),
    value2: 100,
    value1: 166.29,
  },
  {
    date: new Date('2008-07-21'),
    value2: 100,
    value1: 162.02,
  },
  {
    date: new Date('2008-07-22'),
    value2: 100,
    value1: 166.26,
  },
  {
    date: new Date('2008-07-23'),
    value2: 100,
    value1: 159.03,
  },
  {
    date: new Date('2008-07-24'),
    value2: 100,
    value1: 162.12,
  },
  {
    date: new Date('2008-07-27'),
    value2: 100,
    value1: 154.4,
  },
  {
    date: new Date('2008-07-28'),
    value2: 100,
    value1: 157.08,
  },
  {
    date: new Date('2008-07-29'),
    value2: 100,
    value1: 159.88,
  },
  {
    date: new Date('2008-07-30'),
    value2: 100,
    value1: 158.95,
  },
  {
    date: new Date('2008-08-01'),
    value2: 100,
    value1: 156.66,
  },
  {
    date: new Date('2008-08-04'),
    value2: 100,
    value1: 153.23,
  },
  {
    date: new Date('2008-08-05'),
    value2: 100,
    value1: 160.64,
  },
  {
    date: new Date('2008-08-06'),
    value2: 100,
    value1: 164.19,
  },
  {
    date: new Date('2008-08-07'),
    value2: 100,
    value1: 163.57,
  },
  {
    date: new Date('2008-08-08'),
    value2: 100,
    value1: 169.55,
  },
  {
    date: new Date('2008-08-10'),
    value2: 100,
    value1: 173.56,
  },
  {
    date: new Date('2008-08-11'),
    value2: 100,
    value1: 176.73,
  },
  {
    date: new Date('2008-08-12'),
    value2: 100,
    value1: 179.3,
  },
  {
    date: new Date('2008-08-13'),
    value2: 100,
    value1: 179.32,
  },
  {
    date: new Date('2008-08-14'),
    value2: 100,
    value1: 175.74,
  },
  {
    date: new Date('2008-08-17'),
    value2: 100,
    value1: 175.39,
  },
  {
    date: new Date('2008-08-18'),
    value2: 100,
    value1: 173.53,
  },
  {
    date: new Date('2008-08-19'),
    value2: 100,
    value1: 175.84,
  },
  {
    date: new Date('2008-08-20'),
    value2: 100,
    value1: 174.29,
  },
  {
    date: new Date('2008-08-21'),
    value2: 100,
    value1: 176.79,
  },
  {
    date: new Date('2008-08-24'),
    value2: 100,
    value1: 172.55,
  },
  {
    date: new Date('2008-08-25'),
    value2: 100,
    value1: 173.64,
  },
  {
    date: new Date('2008-08-26'),
    value2: 100,
    value1: 174.67,
  },
  {
    date: new Date('2008-08-27'),
    value2: 100,
    value1: 173.74,
  },
  {
    date: new Date('2008-08-28'),
    value2: 100,
    value1: 169.53,
  },
  {
    date: new Date('2008-09-02'),
    value2: 100,
    value1: 166.19,
  },
  {
    date: new Date('2008-09-03'),
    value2: 100,
    value1: 166.96,
  },
  {
    date: new Date('2008-09-04'),
    value2: 100,
    value1: 161.22,
  },
  {
    date: new Date('2008-09-05'),
    value2: 100,
    value1: 160.18,
  },
  {
    date: new Date('2008-09-08'),
    value2: 100,
    value1: 157.92,
  },
  {
    date: new Date('2008-09-09'),
    value2: 100,
    value1: 151.68,
  },
  {
    date: new Date('2008-09-09'),
    value2: 100,
    value1: 151.61,
  },
  {
    date: new Date('2008-09-10'),
    value2: 100,
    value1: 152.65,
  },
  {
    date: new Date('2008-09-11'),
    value2: 100,
    value1: 148.94,
  },
  {
    date: new Date('2008-09-14'),
    value2: 100,
    value1: 140.36,
  },
  {
    date: new Date('2008-09-15'),
    value2: 100,
    value1: 139.88,
  },
  {
    date: new Date('2008-09-16'),
    value2: 100,
    value1: 127.83,
  },
  {
    date: new Date('2008-09-17'),
    value2: 100,
    value1: 134.09,
  },
  {
    date: new Date('2008-09-18'),
    value2: 100,
    value1: 140.91,
  },
  {
    date: new Date('2008-09-21'),
    value2: 100,
    value1: 131.05,
  },
  {
    date: new Date('2008-09-22'),
    value2: 100,
    value1: 126.84,
  },
  {
    date: new Date('2008-09-23'),
    value2: 100,
    value1: 128.71,
  },
  {
    date: new Date('2008-09-24'),
    value2: 100,
    value1: 131.93,
  },
  {
    date: new Date('2008-09-25'),
    value2: 100,
    value1: 128.24,
  },
  {
    date: new Date('2008-09-28'),
    value2: 100,
    value1: 105.26,
  },
  {
    date: new Date('2008-09-29'),
    value2: 100,
    value1: 113.66,
  },
  {
    date: new Date('2008-10-01'),
    value2: 100,
    value1: 109.12,
  },
  {
    date: new Date('2008-10-02'),
    value2: 100,
    value1: 100.1,
  },
  {
    date: new Date('2008-10-03'),
    value2: 100,
    value1: 97.07,
  },
  {
    date: new Date('2008-10-06'),
    value2: 100,
    value1: 98.14,
  },
  {
    date: new Date('2008-10-07'),
    value2: 100,
    value1: 89.16,
  },
  {
    date: new Date('2008-10-08'),
    value2: 100,
    value1: 89.79,
  },
  {
    date: new Date('2008-10-09'),
    value2: 100,
    value1: 88.74,
  },
  {
    date: new Date('2008-10-09'),
    value2: 100,
    value1: 96.8,
  },
  {
    date: new Date('2008-10-12'),
    value2: 100,
    value1: 110.26,
  },
  {
    date: new Date('2008-10-13'),
    value2: 100,
    value1: 104.08,
  },
  {
    date: new Date('2008-10-14'),
    value2: 100,
    value1: 97.95,
  },
  {
    date: new Date('2008-10-15'),
    value2: 100,
    value1: 101.89,
  },
  {
    date: new Date('2008-10-16'),
    value2: 100,
    value1: 97.4,
  },
  {
    date: new Date('2008-10-19'),
    value2: 100,
    value1: 98.44,
  },
  {
    date: new Date('2008-10-20'),
    value2: 100,
    value1: 91.49,
  },
  {
    date: new Date('2008-10-21'),
    value2: 100,
    value1: 96.87,
  },
  {
    date: new Date('2008-10-22'),
    value2: 100,
    value1: 98.23,
  },
  {
    date: new Date('2008-10-23'),
    value2: 100,
    value1: 96.38,
  },
  {
    date: new Date('2008-10-26'),
    value2: 100,
    value1: 92.09,
  },
  {
    date: new Date('2008-10-27'),
    value2: 100,
    value1: 99.91,
  },
  {
    date: new Date('2008-10-28'),
    value2: 100,
    value1: 104.55,
  },
  {
    date: new Date('2008-10-29'),
    value2: 100,
    value1: 111.04,
  },
  {
    date: new Date('2008-10-30'),
    value2: 100,
    value1: 107.59,
  },
  {
    date: new Date('2008-11-03'),
    value2: 100,
    value1: 106.96,
  },
  {
    date: new Date('2008-11-04'),
    value2: 100,
    value1: 110.99,
  },
  {
    date: new Date('2008-11-05'),
    value2: 100,
    value1: 103.3,
  },
  {
    date: new Date('2008-11-06'),
    value2: 100,
    value1: 99.1,
  },
  {
    date: new Date('2008-11-07'),
    value2: 100,
    value1: 98.24,
  },
  {
    date: new Date('2008-11-09'),
    value2: 100,
    value1: 95.88,
  },
  {
    date: new Date('2008-11-10'),
    value2: 100,
    value1: 94.77,
  },
  {
    date: new Date('2008-11-11'),
    value2: 100,
    value1: 90.12,
  },
  {
    date: new Date('2008-11-12'),
    value2: 100,
    value1: 96.44,
  },
  {
    date: new Date('2008-11-13'),
    value2: 100,
    value1: 90.24,
  },
  {
    date: new Date('2008-11-16'),
    value2: 100,
    value1: 88.14,
  },
  {
    date: new Date('2008-11-17'),
    value2: 100,
    value1: 89.91,
  },
  {
    date: new Date('2008-11-18'),
    value2: 100,
    value1: 86.29,
  },
  {
    date: new Date('2008-11-19'),
    value2: 100,
    value1: 80.49,
  },
  {
    date: new Date('2008-11-20'),
    value2: 100,
    value1: 82.58,
  },
  {
    date: new Date('2008-11-23'),
    value2: 100,
    value1: 92.95,
  },
  {
    date: new Date('2008-11-24'),
    value2: 100,
    value1: 90.8,
  },
  {
    date: new Date('2008-11-25'),
    value2: 100,
    value1: 95,
  },
  {
    date: new Date('2008-11-26'),
    value2: 100,
    value1: 95,
  },
  {
    date: new Date('2008-11-27'),
    value2: 100,
    value1: 92.67,
  },
  {
    date: new Date('2008-12-01'),
    value2: 100,
    value1: 88.93,
  },
  {
    date: new Date('2008-12-02'),
    value2: 100,
    value1: 92.47,
  },
  {
    date: new Date('2008-12-03'),
    value2: 100,
    value1: 95.9,
  },
  {
    date: new Date('2008-12-04'),
    value2: 100,
    value1: 91.41,
  },
  {
    date: new Date('2008-12-05'),
    value2: 100,
    value1: 94,
  },
  {
    date: new Date('2008-12-08'),
    value2: 100,
    value1: 99.72,
  },
  {
    date: new Date('2008-12-09'),
    value2: 100,
    value1: 100.06,
  },
  {
    date: new Date('2008-12-09'),
    value2: 100,
    value1: 98.21,
  },
  {
    date: new Date('2008-12-10'),
    value2: 100,
    value1: 95,
  },
  {
    date: new Date('2008-12-11'),
    value2: 100,
    value1: 98.27,
  },
  {
    date: new Date('2008-12-14'),
    value2: 100,
    value1: 94.75,
  },
  {
    date: new Date('2008-12-15'),
    value2: 100,
    value1: 95.43,
  },
  {
    date: new Date('2008-12-16'),
    value2: 100,
    value1: 89.16,
  },
  {
    date: new Date('2008-12-17'),
    value2: 100,
    value1: 89.43,
  },
  {
    date: new Date('2008-12-18'),
    value2: 100,
    value1: 90,
  },
  {
    date: new Date('2008-12-21'),
    value2: 100,
    value1: 85.74,
  },
  {
    date: new Date('2008-12-22'),
    value2: 100,
    value1: 86.38,
  },
  {
    date: new Date('2008-12-23'),
    value2: 100,
    value1: 85.04,
  },
  {
    date: new Date('2008-12-24'),
    value2: 100,
    value1: 85.04,
  },
  {
    date: new Date('2008-12-25'),
    value2: 100,
    value1: 85.81,
  },
  {
    date: new Date('2008-12-28'),
    value2: 100,
    value1: 86.61,
  },
  {
    date: new Date('2008-12-29'),
    value2: 100,
    value1: 86.29,
  },
  {
    date: new Date('2008-12-30'),
    value2: 100,
    value1: 85.35,
  },
  {
    date: new Date('2009-01-01'),
    value2: 100,
    value1: 85.35,
  },
  {
    date: new Date('2009-01-02'),
    value2: 100,
    value1: 90.75,
  },
  {
    date: new Date('2009-01-05'),
    value2: 100,
    value1: 94.58,
  },
  {
    date: new Date('2009-01-06'),
    value2: 100,
    value1: 93.02,
  },
  {
    date: new Date('2009-01-07'),
    value2: 100,
    value1: 91.01,
  },
  {
    date: new Date('2009-01-08'),
    value2: 100,
    value1: 92.7,
  },
  {
    date: new Date('2009-01-09'),
    value2: 100,
    value1: 90.58,
  },
  {
    date: new Date('2009-01-11'),
    value2: 100,
    value1: 88.66,
  },
  {
    date: new Date('2009-01-12'),
    value2: 100,
    value1: 87.71,
  },
  {
    date: new Date('2009-01-13'),
    value2: 100,
    value1: 85.33,
  },
  {
    date: new Date('2009-01-14'),
    value2: 100,
    value1: 83.38,
  },
  {
    date: new Date('2009-01-15'),
    value2: 100,
    value1: 82.33,
  },
  {
    date: new Date('2009-01-19'),
    value2: 100,
    value1: 78.2,
  },
  {
    date: new Date('2009-01-20'),
    value2: 100,
    value1: 82.83,
  },
  {
    date: new Date('2009-01-21'),
    value2: 100,
    value1: 88.36,
  },
  {
    date: new Date('2009-01-22'),
    value2: 100,
    value1: 88.36,
  },
  {
    date: new Date('2009-01-25'),
    value2: 100,
    value1: 89.64,
  },
  {
    date: new Date('2009-01-26'),
    value2: 100,
    value1: 90.73,
  },
  {
    date: new Date('2009-01-27'),
    value2: 100,
    value1: 94.2,
  },
  {
    date: new Date('2009-01-28'),
    value2: 100,
    value1: 93,
  },
  {
    date: new Date('2009-01-29'),
    value2: 100,
    value1: 90.13,
  },
  {
    date: new Date('2009-02-02'),
    value2: 100,
    value1: 91.51,
  },
  {
    date: new Date('2009-02-03'),
    value2: 100,
    value1: 92.98,
  },
  {
    date: new Date('2009-02-04'),
    value2: 100,
    value1: 93.55,
  },
  {
    date: new Date('2009-02-05'),
    value2: 100,
    value1: 96.46,
  },
  {
    date: new Date('2009-02-06'),
    value2: 100,
    value1: 99.72,
  },
  {
    date: new Date('2009-02-09'),
    value2: 100,
    value1: 102.51,
  },
  {
    date: new Date('2009-02-09'),
    value2: 100,
    value1: 97.83,
  },
  {
    date: new Date('2009-02-10'),
    value2: 100,
    value1: 96.82,
  },
  {
    date: new Date('2009-02-11'),
    value2: 100,
    value1: 99.27,
  },
  {
    date: new Date('2009-02-12'),
    value2: 100,
    value1: 99.16,
  },
  {
    date: new Date('2009-02-16'),
    value2: 100,
    value1: 94.53,
  },
  {
    date: new Date('2009-02-17'),
    value2: 100,
    value1: 94.37,
  },
  {
    date: new Date('2009-02-18'),
    value2: 100,
    value1: 90.64,
  },
  {
    date: new Date('2009-02-19'),
    value2: 100,
    value1: 91.2,
  },
  {
    date: new Date('2009-02-22'),
    value2: 100,
    value1: 86.95,
  },
  {
    date: new Date('2009-02-23'),
    value2: 100,
    value1: 90.25,
  },
  {
    date: new Date('2009-02-24'),
    value2: 100,
    value1: 91.16,
  },
  {
    date: new Date('2009-02-25'),
    value2: 100,
    value1: 89.19,
  },
  {
    date: new Date('2009-02-26'),
    value2: 100,
    value1: 89.31,
  },
  {
    date: new Date('2009-03-02'),
    value2: 100,
    value1: 87.94,
  },
  {
    date: new Date('2009-03-03'),
    value2: 100,
    value1: 88.37,
  },
  {
    date: new Date('2009-03-04'),
    value2: 100,
    value1: 91.17,
  },
  {
    date: new Date('2009-03-05'),
    value2: 100,
    value1: 88.84,
  },
  {
    date: new Date('2009-03-06'),
    value2: 100,
    value1: 85.3,
  },
  {
    date: new Date('2009-03-09'),
    value2: 100,
    value1: 83.11,
  },
  {
    date: new Date('2009-03-09'),
    value2: 100,
    value1: 88.63,
  },
  {
    date: new Date('2009-03-10'),
    value2: 100,
    value1: 92.68,
  },
  {
    date: new Date('2009-03-11'),
    value2: 100,
    value1: 96.35,
  },
  {
    date: new Date('2009-03-12'),
    value2: 100,
    value1: 95.93,
  },
  {
    date: new Date('2009-03-15'),
    value2: 100,
    value1: 95.42,
  },
  {
    date: new Date('2009-03-16'),
    value2: 100,
    value1: 99.66,
  },
  {
    date: new Date('2009-03-17'),
    value2: 100,
    value1: 101.52,
  },
  {
    date: new Date('2009-03-18'),
    value2: 100,
    value1: 101.62,
  },
  {
    date: new Date('2009-03-19'),
    value2: 100,
    value1: 101.59,
  },
  {
    date: new Date('2009-03-22'),
    value2: 100,
    value1: 107.66,
  },
  {
    date: new Date('2009-03-23'),
    value2: 100,
    value1: 106.5,
  },
  {
    date: new Date('2009-03-24'),
    value2: 100,
    value1: 106.49,
  },
  {
    date: new Date('2009-03-25'),
    value2: 100,
    value1: 109.87,
  },
  {
    date: new Date('2009-03-26'),
    value2: 100,
    value1: 106.85,
  },
  {
    date: new Date('2009-03-29'),
    value2: 100,
    value1: 104.49,
  },
  {
    date: new Date('2009-03-30'),
    value2: 100,
    value1: 105.12,
  },
  {
    date: new Date('2009-04-01'),
    value2: 100,
    value1: 108.69,
  },
  {
    date: new Date('2009-04-02'),
    value2: 100,
    value1: 112.71,
  },
  {
    date: new Date('2009-04-03'),
    value2: 100,
    value1: 115.99,
  },
  {
    date: new Date('2009-04-06'),
    value2: 100,
    value1: 118.45,
  },
  {
    date: new Date('2009-04-07'),
    value2: 100,
    value1: 115,
  },
  {
    date: new Date('2009-04-08'),
    value2: 100,
    value1: 116.32,
  },
  {
    date: new Date('2009-04-09'),
    value2: 100,
    value1: 119.57,
  },
  {
    date: new Date('2009-04-09'),
    value2: 100,
    value1: 119.57,
  },
  {
    date: new Date('2009-04-12'),
    value2: 100,
    value1: 120.22,
  },
  {
    date: new Date('2009-04-13'),
    value2: 100,
    value1: 118.31,
  },
  {
    date: new Date('2009-04-14'),
    value2: 100,
    value1: 117.64,
  },
  {
    date: new Date('2009-04-15'),
    value2: 100,
    value1: 121.45,
  },
  {
    date: new Date('2009-04-16'),
    value2: 100,
    value1: 123.42,
  },
  {
    date: new Date('2009-04-19'),
    value2: 100,
    value1: 120.5,
  },
  {
    date: new Date('2009-04-20'),
    value2: 100,
    value1: 121.76,
  },
  {
    date: new Date('2009-04-21'),
    value2: 100,
    value1: 121.51,
  },
  {
    date: new Date('2009-04-22'),
    value2: 100,
    value1: 125.4,
  },
  {
    date: new Date('2009-04-23'),
    value2: 100,
    value1: 123.9,
  },
  {
    date: new Date('2009-04-26'),
    value2: 100,
    value1: 124.73,
  },
  {
    date: new Date('2009-04-27'),
    value2: 100,
    value1: 123.9,
  },
  {
    date: new Date('2009-04-28'),
    value2: 100,
    value1: 125.14,
  },
  {
    date: new Date('2009-04-29'),
    value2: 100,
    value1: 125.83,
  },
  {
    date: new Date('2009-05-01'),
    value2: 100,
    value1: 127.24,
  },
  {
    date: new Date('2009-05-04'),
    value2: 100,
    value1: 132.07,
  },
  {
    date: new Date('2009-05-05'),
    value2: 100,
    value1: 132.71,
  },
  {
    date: new Date('2009-05-06'),
    value2: 100,
    value1: 132.5,
  },
  {
    date: new Date('2009-05-07'),
    value2: 100,
    value1: 129.06,
  },
  {
    date: new Date('2009-05-08'),
    value2: 100,
    value1: 129.19,
  },
  {
    date: new Date('2009-05-10'),
    value2: 100,
    value1: 129.57,
  },
  {
    date: new Date('2009-05-11'),
    value2: 100,
    value1: 124.42,
  },
  {
    date: new Date('2009-05-12'),
    value2: 100,
    value1: 119.49,
  },
  {
    date: new Date('2009-05-13'),
    value2: 100,
    value1: 122.95,
  },
  {
    date: new Date('2009-05-14'),
    value2: 100,
    value1: 122.42,
  },
  {
    date: new Date('2009-05-17'),
    value2: 100,
    value1: 126.65,
  },
  {
    date: new Date('2009-05-18'),
    value2: 100,
    value1: 127.45,
  },
  {
    date: new Date('2009-05-19'),
    value2: 100,
    value1: 125.87,
  },
  {
    date: new Date('2009-05-20'),
    value2: 100,
    value1: 124.18,
  },
  {
    date: new Date('2009-05-21'),
    value2: 100,
    value1: 122.5,
  },
  {
    date: new Date('2009-05-25'),
    value2: 100,
    value1: 130.78,
  },
  {
    date: new Date('2009-05-26'),
    value2: 100,
    value1: 133.05,
  },
  {
    date: new Date('2009-05-27'),
    value2: 100,
    value1: 135.07,
  },
  {
    date: new Date('2009-05-28'),
    value2: 100,
    value1: 135.81,
  },
  {
    date: new Date('2009-06-01'),
    value2: 100,
    value1: 139.35,
  },
  {
    date: new Date('2009-06-02'),
    value2: 100,
    value1: 139.49,
  },
  {
    date: new Date('2009-06-03'),
    value2: 100,
    value1: 140.95,
  },
  {
    date: new Date('2009-06-04'),
    value2: 100,
    value1: 143.74,
  },
  {
    date: new Date('2009-06-05'),
    value2: 100,
    value1: 144.67,
  },
  {
    date: new Date('2009-06-08'),
    value2: 100,
    value1: 143.85,
  },
  {
    date: new Date('2009-06-09'),
    value2: 100,
    value1: 142.72,
  },
  {
    date: new Date('2009-06-09'),
    value2: 100,
    value1: 140.25,
  },
  {
    date: new Date('2009-06-10'),
    value2: 100,
    value1: 139.95,
  },
  {
    date: new Date('2009-06-11'),
    value2: 100,
    value1: 136.97,
  },
  {
    date: new Date('2009-06-14'),
    value2: 100,
    value1: 136.09,
  },
  {
    date: new Date('2009-06-15'),
    value2: 100,
    value1: 136.35,
  },
  {
    date: new Date('2009-06-16'),
    value2: 100,
    value1: 135.58,
  },
  {
    date: new Date('2009-06-17'),
    value2: 100,
    value1: 135.88,
  },
  {
    date: new Date('2009-06-18'),
    value2: 100,
    value1: 139.48,
  },
  {
    date: new Date('2009-06-21'),
    value2: 100,
    value1: 137.37,
  },
  {
    date: new Date('2009-06-22'),
    value2: 100,
    value1: 134.01,
  },
  {
    date: new Date('2009-06-23'),
    value2: 100,
    value1: 136.22,
  },
  {
    date: new Date('2009-06-24'),
    value2: 100,
    value1: 139.86,
  },
  {
    date: new Date('2009-06-25'),
    value2: 100,
    value1: 142.44,
  },
  {
    date: new Date('2009-06-28'),
    value2: 100,
    value1: 141.97,
  },
  {
    date: new Date('2009-06-29'),
    value2: 100,
    value1: 142.43,
  },
  {
    date: new Date('2009-07-01'),
    value2: 100,
    value1: 142.83,
  },
  {
    date: new Date('2009-07-02'),
    value2: 100,
    value1: 140.02,
  },
  {
    date: new Date('2009-07-03'),
    value2: 100,
    value1: 140.02,
  },
  {
    date: new Date('2009-07-06'),
    value2: 100,
    value1: 138.61,
  },
  {
    date: new Date('2009-07-07'),
    value2: 100,
    value1: 135.4,
  },
  {
    date: new Date('2009-07-08'),
    value2: 100,
    value1: 137.22,
  },
  {
    date: new Date('2009-07-09'),
    value2: 100,
    value1: 136.36,
  },
  {
    date: new Date('2009-07-09'),
    value2: 100,
    value1: 138.52,
  },
  {
    date: new Date('2009-07-12'),
    value2: 100,
    value1: 142.34,
  },
  {
    date: new Date('2009-07-13'),
    value2: 100,
    value1: 142.27,
  },
  {
    date: new Date('2009-07-14'),
    value2: 100,
    value1: 146.88,
  },
  {
    date: new Date('2009-07-15'),
    value2: 100,
    value1: 147.52,
  },
  {
    date: new Date('2009-07-16'),
    value2: 100,
    value1: 151.75,
  },
  {
    date: new Date('2009-07-19'),
    value2: 100,
    value1: 152.91,
  },
  {
    date: new Date('2009-07-20'),
    value2: 100,
    value1: 151.51,
  },
  {
    date: new Date('2009-07-21'),
    value2: 100,
    value1: 156.74,
  },
  {
    date: new Date('2009-07-22'),
    value2: 100,
    value1: 157.82,
  },
  {
    date: new Date('2009-07-23'),
    value2: 100,
    value1: 159.99,
  },
  {
    date: new Date('2009-07-26'),
    value2: 100,
    value1: 160.1,
  },
  {
    date: new Date('2009-07-27'),
    value2: 100,
    value1: 160,
  },
  {
    date: new Date('2009-07-28'),
    value2: 100,
    value1: 160.03,
  },
  {
    date: new Date('2009-07-29'),
    value2: 100,
    value1: 162.79,
  },
  {
    date: new Date('2009-07-30'),
    value2: 100,
    value1: 163.39,
  },
  {
    date: new Date('2009-08-03'),
    value2: 100,
    value1: 166.43,
  },
  {
    date: new Date('2009-08-04'),
    value2: 100,
    value1: 165.55,
  },
  {
    date: new Date('2009-08-05'),
    value2: 100,
    value1: 165.11,
  },
  {
    date: new Date('2009-08-06'),
    value2: 100,
    value1: 163.91,
  },
  {
    date: new Date('2009-08-07'),
    value2: 100,
    value1: 165.51,
  },
  {
    date: new Date('2009-08-09'),
    value2: 100,
    value1: 164.72,
  },
  {
    date: new Date('2009-08-11'),
    value2: 100,
    value1: 165.31,
  },
  {
    date: new Date('2009-08-12'),
    value2: 100,
    value1: 168.42,
  },
  {
    date: new Date('2009-08-13'),
    value2: 100,
    value1: 166.78,
  },
  {
    date: new Date('2009-08-16'),
    value2: 100,
    value1: 159.59,
  },
  {
    date: new Date('2009-08-17'),
    value2: 100,
    value1: 164,
  },
  {
    date: new Date('2009-08-18'),
    value2: 100,
    value1: 164.6,
  },
  {
    date: new Date('2009-08-19'),
    value2: 100,
    value1: 166.33,
  },
  {
    date: new Date('2009-08-20'),
    value2: 100,
    value1: 169.22,
  },
  {
    date: new Date('2009-08-23'),
    value2: 100,
    value1: 169.06,
  },
  {
    date: new Date('2009-08-24'),
    value2: 100,
    value1: 169.4,
  },
  {
    date: new Date('2009-08-25'),
    value2: 100,
    value1: 167.41,
  },
  {
    date: new Date('2009-08-26'),
    value2: 100,
    value1: 169.45,
  },
  {
    date: new Date('2009-08-27'),
    value2: 100,
    value1: 170.05,
  },
  {
    date: new Date('2009-08-30'),
    value2: 100,
    value1: 168.21,
  },
  {
    date: new Date('2009-09-01'),
    value2: 100,
    value1: 165.3,
  },
  {
    date: new Date('2009-09-02'),
    value2: 100,
    value1: 165.18,
  },
  {
    date: new Date('2009-09-03'),
    value2: 100,
    value1: 166.55,
  },
  {
    date: new Date('2009-09-04'),
    value2: 100,
    value1: 170.31,
  },
  {
    date: new Date('2009-09-08'),
    value2: 100,
    value1: 172.93,
  },
  {
    date: new Date('2009-09-09'),
    value2: 100,
    value1: 171.14,
  },
  {
    date: new Date('2009-09-09'),
    value2: 100,
    value1: 172.56,
  },
  {
    date: new Date('2009-09-10'),
    value2: 100,
    value1: 172.16,
  },
  {
    date: new Date('2009-09-13'),
    value2: 100,
    value1: 173.72,
  },
  {
    date: new Date('2009-09-14'),
    value2: 100,
    value1: 175.16,
  },
  {
    date: new Date('2009-09-15'),
    value2: 100,
    value1: 181.87,
  },
  {
    date: new Date('2009-09-16'),
    value2: 100,
    value1: 184.55,
  },
  {
    date: new Date('2009-09-17'),
    value2: 100,
    value1: 185.02,
  },
  {
    date: new Date('2009-09-20'),
    value2: 100,
    value1: 184.02,
  },
  {
    date: new Date('2009-09-21'),
    value2: 100,
    value1: 184.48,
  },
  {
    date: new Date('2009-09-22'),
    value2: 100,
    value1: 185.5,
  },
  {
    date: new Date('2009-09-23'),
    value2: 100,
    value1: 183.82,
  },
  {
    date: new Date('2009-09-24'),
    value2: 100,
    value1: 182.37,
  },
  {
    date: new Date('2009-09-27'),
    value2: 100,
    value1: 186.15,
  },
  {
    date: new Date('2009-09-28'),
    value2: 100,
    value1: 185.38,
  },
  {
    date: new Date('2009-09-29'),
    value2: 100,
    value1: 185.35,
  },
  {
    date: new Date('2009-10-01'),
    value2: 100,
    value1: 180.86,
  },
  {
    date: new Date('2009-10-02'),
    value2: 100,
    value1: 184.9,
  },
  {
    date: new Date('2009-10-05'),
    value2: 100,
    value1: 186.02,
  },
  {
    date: new Date('2009-10-06'),
    value2: 100,
    value1: 190.01,
  },
  {
    date: new Date('2009-10-07'),
    value2: 100,
    value1: 190.25,
  },
  {
    date: new Date('2009-10-08'),
    value2: 100,
    value1: 189.27,
  },
  {
    date: new Date('2009-10-09'),
    value2: 100,
    value1: 190.47,
  },
  {
    date: new Date('2009-10-11'),
    value2: 100,
    value1: 190.81,
  },
  {
    date: new Date('2009-10-12'),
    value2: 100,
    value1: 190.02,
  },
  {
    date: new Date('2009-10-13'),
    value2: 100,
    value1: 191.29,
  },
  {
    date: new Date('2009-10-14'),
    value2: 100,
    value1: 190.56,
  },
  {
    date: new Date('2009-10-15'),
    value2: 100,
    value1: 188.05,
  },
  {
    date: new Date('2009-10-18'),
    value2: 100,
    value1: 189.86,
  },
  {
    date: new Date('2009-10-19'),
    value2: 100,
    value1: 198.76,
  },
  {
    date: new Date('2009-10-20'),
    value2: 100,
    value1: 204.92,
  },
  {
    date: new Date('2009-10-21'),
    value2: 100,
    value1: 205.2,
  },
  {
    date: new Date('2009-10-22'),
    value2: 100,
    value1: 203.94,
  },
  {
    date: new Date('2009-10-25'),
    value2: 100,
    value1: 202.48,
  },
  {
    date: new Date('2009-10-26'),
    value2: 100,
    value1: 197.37,
  },
  {
    date: new Date('2009-10-27'),
    value2: 100,
    value1: 192.4,
  },
  {
    date: new Date('2009-10-28'),
    value2: 100,
    value1: 196.35,
  },
  {
    date: new Date('2009-10-29'),
    value2: 100,
    value1: 188.5,
  },
  {
    date: new Date('2009-11-02'),
    value2: 100,
    value1: 189.31,
  },
  {
    date: new Date('2009-11-03'),
    value2: 100,
    value1: 188.75,
  },
  {
    date: new Date('2009-11-04'),
    value2: 100,
    value1: 190.81,
  },
  {
    date: new Date('2009-11-05'),
    value2: 100,
    value1: 194.03,
  },
  {
    date: new Date('2009-11-06'),
    value2: 100,
    value1: 194.34,
  },
  {
    date: new Date('2009-11-09'),
    value2: 100,
    value1: 201.46,
  },
  {
    date: new Date('2009-11-09'),
    value2: 100,
    value1: 202.98,
  },
  {
    date: new Date('2009-11-10'),
    value2: 100,
    value1: 203.25,
  },
  {
    date: new Date('2009-11-11'),
    value2: 100,
    value1: 201.99,
  },
  {
    date: new Date('2009-11-12'),
    value2: 100,
    value1: 204.45,
  },
  {
    date: new Date('2009-11-15'),
    value2: 100,
    value1: 206.63,
  },
  {
    date: new Date('2009-11-16'),
    value2: 100,
    value1: 207,
  },
  {
    date: new Date('2009-11-17'),
    value2: 100,
    value1: 205.96,
  },
  {
    date: new Date('2009-11-18'),
    value2: 100,
    value1: 200.51,
  },
  {
    date: new Date('2009-11-19'),
    value2: 100,
    value1: 199.92,
  },
  {
    date: new Date('2009-11-22'),
    value2: 100,
    value1: 205.88,
  },
  {
    date: new Date('2009-11-23'),
    value2: 100,
    value1: 204.44,
  },
  {
    date: new Date('2009-11-24'),
    value2: 100,
    value1: 204.19,
  },
  {
    date: new Date('2009-11-25'),
    value2: 100,
    value1: 204.19,
  },
  {
    date: new Date('2009-11-26'),
    value2: 100,
    value1: 200.59,
  },
  {
    date: new Date('2009-11-29'),
    value2: 100,
    value1: 199.91,
  },
  {
    date: new Date('2009-12-01'),
    value2: 100,
    value1: 196.97,
  },
  {
    date: new Date('2009-12-02'),
    value2: 100,
    value1: 196.23,
  },
  {
    date: new Date('2009-12-03'),
    value2: 100,
    value1: 196.48,
  },
  {
    date: new Date('2009-12-04'),
    value2: 100,
    value1: 193.32,
  },
  {
    date: new Date('2009-12-07'),
    value2: 100,
    value1: 188.95,
  },
  {
    date: new Date('2009-12-08'),
    value2: 100,
    value1: 189.87,
  },
  {
    date: new Date('2009-12-09'),
    value2: 100,
    value1: 197.8,
  },
  {
    date: new Date('2009-12-09'),
    value2: 100,
    value1: 196.43,
  },
  {
    date: new Date('2009-12-10'),
    value2: 100,
    value1: 194.67,
  },
  {
    date: new Date('2009-12-13'),
    value2: 100,
    value1: 196.98,
  },
  {
    date: new Date('2009-12-14'),
    value2: 100,
    value1: 194.17,
  },
  {
    date: new Date('2009-12-15'),
    value2: 100,
    value1: 195.03,
  },
  {
    date: new Date('2009-12-16'),
    value2: 100,
    value1: 191.86,
  },
  {
    date: new Date('2009-12-17'),
    value2: 100,
    value1: 195.43,
  },
  {
    date: new Date('2009-12-20'),
    value2: 100,
    value1: 198.23,
  },
  {
    date: new Date('2009-12-21'),
    value2: 100,
    value1: 200.36,
  },
  {
    date: new Date('2009-12-22'),
    value2: 100,
    value1: 202.1,
  },
  {
    date: new Date('2009-12-23'),
    value2: 100,
    value1: 209.04,
  },
  {
    date: new Date('2009-12-24'),
    value2: 100,
    value1: 209.04,
  },
  {
    date: new Date('2009-12-27'),
    value2: 100,
    value1: 211.61,
  },
  {
    date: new Date('2009-12-28'),
    value2: 100,
    value1: 209.1,
  },
  {
    date: new Date('2009-12-29'),
    value2: 100,
    value1: 211.64,
  },
  {
    date: new Date('2009-12-30'),
    value2: 100,
    value1: 210.73,
  },
  {
    date: new Date('2010-01-01'),
    value2: 100,
    value1: 210.73,
  },
  {
    date: new Date('2010-01-04'),
    value2: 100,
    value1: 214.01,
  },
  {
    date: new Date('2010-01-05'),
    value2: 100,
    value1: 214.38,
  },
  {
    date: new Date('2010-01-06'),
    value2: 100,
    value1: 210.97,
  },
  {
    date: new Date('2010-01-07'),
    value2: 100,
    value1: 210.58,
  },
  {
    date: new Date('2010-01-08'),
    value2: 100,
    value1: 211.98,
  },
  {
    date: new Date('2010-01-10'),
    value2: 100,
    value1: 210.11,
  },
  {
    date: new Date('2010-01-11'),
    value2: 100,
    value1: 207.72,
  },
  {
    date: new Date('2010-01-12'),
    value2: 100,
    value1: 210.65,
  },
  {
    date: new Date('2010-01-13'),
    value2: 100,
    value1: 209.43,
  },
  {
    date: new Date('2010-01-14'),
    value2: 100,
    value1: 205.93,
  },
  {
    date: new Date('2010-01-17'),
    value2: 100,
    value1: 205.93,
  },
  {
    date: new Date('2010-01-18'),
    value2: 100,
    value1: 215.04,
  },
  {
    date: new Date('2010-01-19'),
    value2: 100,
    value1: 211.72,
  },
  {
    date: new Date('2010-01-20'),
    value2: 100,
    value1: 208.07,
  },
  {
    date: new Date('2010-01-21'),
    value2: 100,
    value1: 197.75,
  },
  {
    date: new Date('2010-01-24'),
    value2: 100,
    value1: 203.08,
  },
  {
    date: new Date('2010-01-25'),
    value2: 100,
    value1: 205.94,
  },
  {
    date: new Date('2010-01-26'),
    value2: 100,
    value1: 207.88,
  },
  {
    date: new Date('2010-01-27'),
    value2: 100,
    value1: 199.29,
  },
  {
    date: new Date('2010-01-28'),
    value2: 100,
    value1: 192.06,
  },
  {
    date: new Date('2010-02-01'),
    value2: 100,
    value1: 194.73,
  },
  {
    date: new Date('2010-02-02'),
    value2: 100,
    value1: 195.86,
  },
  {
    date: new Date('2010-02-03'),
    value2: 100,
    value1: 199.23,
  },
  {
    date: new Date('2010-02-04'),
    value2: 100,
    value1: 192.05,
  },
  {
    date: new Date('2010-02-05'),
    value2: 100,
    value1: 195.46,
  },
  {
    date: new Date('2010-02-08'),
    value2: 100,
    value1: 194.12,
  },
  {
    date: new Date('2010-02-09'),
    value2: 100,
    value1: 196.19,
  },
  {
    date: new Date('2010-02-09'),
    value2: 100,
    value1: 195.12,
  },
  {
    date: new Date('2010-02-10'),
    value2: 100,
    value1: 198.67,
  },
  {
    date: new Date('2010-02-11'),
    value2: 100,
    value1: 200.38,
  },
  {
    date: new Date('2010-02-14'),
    value2: 100,
    value1: 200.38,
  },
  {
    date: new Date('2010-02-15'),
    value2: 100,
    value1: 203.4,
  },
  {
    date: new Date('2010-02-16'),
    value2: 100,
    value1: 202.55,
  },
  {
    date: new Date('2010-02-17'),
    value2: 100,
    value1: 202.93,
  },
  {
    date: new Date('2010-02-18'),
    value2: 100,
    value1: 201.67,
  },
  {
    date: new Date('2010-02-21'),
    value2: 100,
    value1: 200.42,
  },
  {
    date: new Date('2010-02-22'),
    value2: 100,
    value1: 197.06,
  },
  {
    date: new Date('2010-02-23'),
    value2: 100,
    value1: 200.66,
  },
  {
    date: new Date('2010-02-24'),
    value2: 100,
    value1: 202,
  },
  {
    date: new Date('2010-02-25'),
    value2: 100,
    value1: 204.62,
  },
  {
    date: new Date('2010-03-01'),
    value2: 100,
    value1: 208.99,
  },
  {
    date: new Date('2010-03-02'),
    value2: 100,
    value1: 208.85,
  },
  {
    date: new Date('2010-03-03'),
    value2: 100,
    value1: 209.33,
  },
  {
    date: new Date('2010-03-04'),
    value2: 100,
    value1: 210.71,
  },
  {
    date: new Date('2010-03-05'),
    value2: 100,
    value1: 218.95,
  },
  {
    date: new Date('2010-03-08'),
    value2: 100,
    value1: 219.08,
  },
  {
    date: new Date('2010-03-09'),
    value2: 100,
    value1: 223.02,
  },
  {
    date: new Date('2010-03-09'),
    value2: 100,
    value1: 224.84,
  },
  {
    date: new Date('2010-03-10'),
    value2: 100,
    value1: 225.5,
  },
  {
    date: new Date('2010-03-11'),
    value2: 100,
    value1: 226.6,
  },
  {
    date: new Date('2010-03-14'),
    value2: 100,
    value1: 223.84,
  },
  {
    date: new Date('2010-03-15'),
    value2: 100,
    value1: 224.45,
  },
  {
    date: new Date('2010-03-16'),
    value2: 100,
    value1: 224.12,
  },
  {
    date: new Date('2010-03-17'),
    value2: 100,
    value1: 224.65,
  },
  {
    date: new Date('2010-03-18'),
    value2: 100,
    value1: 222.25,
  },
  {
    date: new Date('2010-03-21'),
    value2: 100,
    value1: 224.75,
  },
  {
    date: new Date('2010-03-22'),
    value2: 100,
    value1: 228.36,
  },
  {
    date: new Date('2010-03-23'),
    value2: 100,
    value1: 229.37,
  },
  {
    date: new Date('2010-03-24'),
    value2: 100,
    value1: 226.65,
  },
  {
    date: new Date('2010-03-25'),
    value2: 100,
    value1: 230.9,
  },
  {
    date: new Date('2010-03-28'),
    value2: 100,
    value1: 232.39,
  },
  {
    date: new Date('2010-03-29'),
    value2: 100,
    value1: 235.84,
  },
  {
    date: new Date('2010-03-30'),
    value2: 100,
    value1: 235,
  },
  {
    date: new Date('2010-04-01'),
    value2: 100,
    value1: 235.97,
  },
  {
    date: new Date('2010-04-02'),
    value2: 100,
    value1: 235.97,
  },
  {
    date: new Date('2010-04-05'),
    value2: 100,
    value1: 238.49,
  },
  {
    date: new Date('2010-04-06'),
    value2: 100,
    value1: 239.54,
  },
  {
    date: new Date('2010-04-07'),
    value2: 100,
    value1: 240.6,
  },
  {
    date: new Date('2010-04-08'),
    value2: 100,
    value1: 239.95,
  },
  {
    date: new Date('2010-04-09'),
    value2: 100,
    value1: 241.79,
  },
  {
    date: new Date('2010-04-11'),
    value2: 100,
    value1: 242.29,
  },
  {
    date: new Date('2010-04-12'),
    value2: 100,
    value1: 242.43,
  },
  {
    date: new Date('2010-04-13'),
    value2: 100,
    value1: 245.69,
  },
  {
    date: new Date('2010-04-14'),
    value2: 100,
    value1: 248.92,
  },
  {
    date: new Date('2010-04-15'),
    value2: 100,
    value1: 247.4,
  },
  {
    date: new Date('2010-04-18'),
    value2: 100,
    value1: 247.07,
  },
  {
    date: new Date('2010-04-19'),
    value2: 100,
    value1: 244.59,
  },
  {
    date: new Date('2010-04-20'),
    value2: 100,
    value1: 259.22,
  },
  {
    date: new Date('2010-04-21'),
    value2: 100,
    value1: 266.47,
  },
  {
    date: new Date('2010-04-22'),
    value2: 100,
    value1: 270.83,
  },
  {
    date: new Date('2010-04-25'),
    value2: 100,
    value1: 269.5,
  },
  {
    date: new Date('2010-04-26'),
    value2: 100,
    value1: 262.04,
  },
  {
    date: new Date('2010-04-27'),
    value2: 100,
    value1: 261.6,
  },
  {
    date: new Date('2010-04-28'),
    value2: 100,
    value1: 268.64,
  },
  {
    date: new Date('2010-04-29'),
    value2: 100,
    value1: 261.09,
  },
  {
    date: new Date('2010-05-03'),
    value2: 100,
    value1: 266.35,
  },
  {
    date: new Date('2010-05-04'),
    value2: 100,
    value1: 258.68,
  },
  {
    date: new Date('2010-05-05'),
    value2: 100,
    value1: 255.98,
  },
  {
    date: new Date('2010-05-06'),
    value2: 100,
    value1: 246.25,
  },
  {
    date: new Date('2010-05-07'),
    value2: 100,
    value1: 235.86,
  },
  {
    date: new Date('2010-05-09'),
    value2: 100,
    value1: 253.99,
  },
  {
    date: new Date('2010-05-10'),
    value2: 100,
    value1: 256.52,
  },
  {
    date: new Date('2010-05-11'),
    value2: 100,
    value1: 262.09,
  },
  {
    date: new Date('2010-05-12'),
    value2: 100,
    value1: 258.36,
  },
  {
    date: new Date('2010-05-13'),
    value2: 100,
    value1: 253.82,
  },
  {
    date: new Date('2010-05-16'),
    value2: 100,
    value1: 254.22,
  },
  {
    date: new Date('2010-05-17'),
    value2: 100,
    value1: 252.36,
  },
  {
    date: new Date('2010-05-18'),
    value2: 100,
    value1: 248.34,
  },
  {
    date: new Date('2010-05-19'),
    value2: 100,
    value1: 237.76,
  },
  {
    date: new Date('2010-05-20'),
    value2: 100,
    value1: 242.32,
  },
  {
    date: new Date('2010-05-23'),
    value2: 100,
    value1: 246.76,
  },
  {
    date: new Date('2010-05-24'),
    value2: 100,
    value1: 245.22,
  },
  {
    date: new Date('2010-05-25'),
    value2: 100,
    value1: 244.11,
  },
  {
    date: new Date('2010-05-26'),
    value2: 100,
    value1: 253.35,
  },
  {
    date: new Date('2010-05-27'),
    value2: 100,
    value1: 256.88,
  },
  {
    date: new Date('2010-05-30'),
    value2: 100,
    value1: 256.88,
  },
  {
    date: new Date('2010-06-01'),
    value2: 100,
    value1: 260.83,
  },
  {
    date: new Date('2010-06-02'),
    value2: 100,
    value1: 263.95,
  },
  {
    date: new Date('2010-06-03'),
    value2: 100,
    value1: 263.12,
  },
  {
    date: new Date('2010-06-04'),
    value2: 100,
    value1: 255.96,
  },
  {
    date: new Date('2010-06-07'),
    value2: 100,
    value1: 250.94,
  },
  {
    date: new Date('2010-06-08'),
    value2: 100,
    value1: 249.33,
  },
  {
    date: new Date('2010-06-09'),
    value2: 100,
    value1: 243.2,
  },
  {
    date: new Date('2010-06-09'),
    value2: 100,
    value1: 250.51,
  },
  {
    date: new Date('2010-06-10'),
    value2: 100,
    value1: 253.51,
  },
  {
    date: new Date('2010-06-13'),
    value2: 100,
    value1: 254.28,
  },
  {
    date: new Date('2010-06-14'),
    value2: 100,
    value1: 259.69,
  },
  {
    date: new Date('2010-06-15'),
    value2: 100,
    value1: 267.25,
  },
  {
    date: new Date('2010-06-16'),
    value2: 100,
    value1: 271.87,
  },
  {
    date: new Date('2010-06-17'),
    value2: 100,
    value1: 274.07,
  },
  {
    date: new Date('2010-06-20'),
    value2: 100,
    value1: 270.17,
  },
  {
    date: new Date('2010-06-21'),
    value2: 100,
    value1: 273.85,
  },
  {
    date: new Date('2010-06-22'),
    value2: 100,
    value1: 270.97,
  },
  {
    date: new Date('2010-06-23'),
    value2: 100,
    value1: 269,
  },
  {
    date: new Date('2010-06-24'),
    value2: 100,
    value1: 266.7,
  },
  {
    date: new Date('2010-06-27'),
    value2: 100,
    value1: 268.3,
  },
  {
    date: new Date('2010-06-28'),
    value2: 100,
    value1: 256.17,
  },
  {
    date: new Date('2010-06-29'),
    value2: 100,
    value1: 251.53,
  },
  {
    date: new Date('2010-07-01'),
    value2: 100,
    value1: 248.48,
  },
  {
    date: new Date('2010-07-02'),
    value2: 100,
    value1: 246.94,
  },
  {
    date: new Date('2010-07-05'),
    value2: 100,
    value1: 246.94,
  },
  {
    date: new Date('2010-07-06'),
    value2: 100,
    value1: 248.63,
  },
  {
    date: new Date('2010-07-07'),
    value2: 100,
    value1: 258.66,
  },
  {
    date: new Date('2010-07-08'),
    value2: 100,
    value1: 258.09,
  },
  {
    date: new Date('2010-07-09'),
    value2: 100,
    value1: 259.62,
  },
  {
    date: new Date('2010-07-11'),
    value2: 100,
    value1: 257.28,
  },
  {
    date: new Date('2010-07-12'),
    value2: 100,
    value1: 251.8,
  },
  {
    date: new Date('2010-07-13'),
    value2: 100,
    value1: 252.73,
  },
  {
    date: new Date('2010-07-14'),
    value2: 100,
    value1: 251.45,
  },
  {
    date: new Date('2010-07-15'),
    value2: 100,
    value1: 249.9,
  },
  {
    date: new Date('2010-07-18'),
    value2: 100,
    value1: 245.58,
  },
  {
    date: new Date('2010-07-19'),
    value2: 100,
    value1: 251.89,
  },
  {
    date: new Date('2010-07-20'),
    value2: 100,
    value1: 254.24,
  },
  {
    date: new Date('2010-07-21'),
    value2: 100,
    value1: 259.02,
  },
  {
    date: new Date('2010-07-22'),
    value2: 100,
    value1: 259.94,
  },
  {
    date: new Date('2010-07-25'),
    value2: 100,
    value1: 259.28,
  },
  {
    date: new Date('2010-07-26'),
    value2: 100,
    value1: 264.08,
  },
  {
    date: new Date('2010-07-27'),
    value2: 100,
    value1: 260.96,
  },
  {
    date: new Date('2010-07-28'),
    value2: 100,
    value1: 258.11,
  },
  {
    date: new Date('2010-07-29'),
    value2: 100,
    value1: 257.25,
  },
  {
    date: new Date('2010-08-02'),
    value2: 100,
    value1: 261.85,
  },
  {
    date: new Date('2010-08-03'),
    value2: 100,
    value1: 261.93,
  },
  {
    date: new Date('2010-08-04'),
    value2: 100,
    value1: 262.98,
  },
  {
    date: new Date('2010-08-05'),
    value2: 100,
    value1: 261.7,
  },
  {
    date: new Date('2010-08-06'),
    value2: 100,
    value1: 260.09,
  },
  {
    date: new Date('2010-08-09'),
    value2: 100,
    value1: 261.75,
  },
  {
    date: new Date('2010-08-09'),
    value2: 100,
    value1: 259.41,
  },
  {
    date: new Date('2010-08-10'),
    value2: 100,
    value1: 250.19,
  },
  {
    date: new Date('2010-08-11'),
    value2: 100,
    value1: 251.79,
  },
  {
    date: new Date('2010-08-12'),
    value2: 100,
    value1: 249.1,
  },
  {
    date: new Date('2010-08-15'),
    value2: 100,
    value1: 247.64,
  },
  {
    date: new Date('2010-08-16'),
    value2: 100,
    value1: 251.97,
  },
  {
    date: new Date('2010-08-17'),
    value2: 100,
    value1: 253.07,
  },
  {
    date: new Date('2010-08-18'),
    value2: 100,
    value1: 249.88,
  },
  {
    date: new Date('2010-08-19'),
    value2: 100,
    value1: 249.64,
  },
  {
    date: new Date('2010-08-22'),
    value2: 100,
    value1: 245.8,
  },
  {
    date: new Date('2010-08-23'),
    value2: 100,
    value1: 239.93,
  },
  {
    date: new Date('2010-08-24'),
    value2: 100,
    value1: 242.89,
  },
  {
    date: new Date('2010-08-25'),
    value2: 100,
    value1: 240.28,
  },
  {
    date: new Date('2010-08-26'),
    value2: 100,
    value1: 241.62,
  },
  {
    date: new Date('2010-08-29'),
    value2: 100,
    value1: 242.5,
  },
  {
    date: new Date('2010-08-30'),
    value2: 100,
    value1: 243.1,
  },
  {
    date: new Date('2010-09-01'),
    value2: 100,
    value1: 250.33,
  },
  {
    date: new Date('2010-09-02'),
    value2: 100,
    value1: 252.17,
  },
  {
    date: new Date('2010-09-03'),
    value2: 100,
    value1: 258.77,
  },
  {
    date: new Date('2010-09-06'),
    value2: 100,
    value1: 258.77,
  },
  {
    date: new Date('2010-09-07'),
    value2: 100,
    value1: 257.81,
  },
  {
    date: new Date('2010-09-08'),
    value2: 100,
    value1: 262.92,
  },
  {
    date: new Date('2010-09-09'),
    value2: 100,
    value1: 263.07,
  },
  {
    date: new Date('2010-09-09'),
    value2: 100,
    value1: 263.41,
  },
  {
    date: new Date('2010-09-12'),
    value2: 100,
    value1: 267.04,
  },
  {
    date: new Date('2010-09-13'),
    value2: 100,
    value1: 268.06,
  },
  {
    date: new Date('2010-09-14'),
    value2: 100,
    value1: 270.22,
  },
  {
    date: new Date('2010-09-15'),
    value2: 100,
    value1: 276.57,
  },
  {
    date: new Date('2010-09-16'),
    value2: 100,
    value1: 275.37,
  },
  {
    date: new Date('2010-09-19'),
    value2: 100,
    value1: 283.23,
  },
  {
    date: new Date('2010-09-20'),
    value2: 100,
    value1: 283.77,
  },
  {
    date: new Date('2010-09-21'),
    value2: 100,
    value1: 287.75,
  },
  {
    date: new Date('2010-09-22'),
    value2: 100,
    value1: 288.92,
  },
  {
    date: new Date('2010-09-23'),
    value2: 100,
    value1: 292.32,
  },
  {
    date: new Date('2010-09-26'),
    value2: 100,
    value1: 291.16,
  },
  {
    date: new Date('2010-09-27'),
    value2: 100,
    value1: 286.86,
  },
  {
    date: new Date('2010-09-28'),
    value2: 100,
    value1: 287.37,
  },
  {
    date: new Date('2010-09-29'),
    value2: 100,
    value1: 283.75,
  },
  {
    date: new Date('2010-10-01'),
    value2: 100,
    value1: 282.52,
  },
  {
    date: new Date('2010-10-04'),
    value2: 100,
    value1: 278.64,
  },
  {
    date: new Date('2010-10-05'),
    value2: 100,
    value1: 288.94,
  },
  {
    date: new Date('2010-10-06'),
    value2: 100,
    value1: 289.19,
  },
  {
    date: new Date('2010-10-07'),
    value2: 100,
    value1: 289.22,
  },
  {
    date: new Date('2010-10-08'),
    value2: 100,
    value1: 294.07,
  },
  {
    date: new Date('2010-10-10'),
    value2: 100,
    value1: 295.36,
  },
  {
    date: new Date('2010-10-11'),
    value2: 100,
    value1: 298.54,
  },
  {
    date: new Date('2010-10-12'),
    value2: 100,
    value1: 300.14,
  },
  {
    date: new Date('2010-10-13'),
    value2: 100,
    value1: 302.31,
  },
  {
    date: new Date('2010-10-14'),
    value2: 100,
    value1: 314.74,
  },
  {
    date: new Date('2010-10-17'),
    value2: 100,
    value1: 318,
  },
  {
    date: new Date('2010-10-18'),
    value2: 100,
    value1: 309.49,
  },
  {
    date: new Date('2010-10-19'),
    value2: 100,
    value1: 310.53,
  },
  {
    date: new Date('2010-10-20'),
    value2: 100,
    value1: 309.52,
  },
  {
    date: new Date('2010-10-21'),
    value2: 100,
    value1: 307.47,
  },
  {
    date: new Date('2010-10-24'),
    value2: 100,
    value1: 308.84,
  },
  {
    date: new Date('2010-10-25'),
    value2: 100,
    value1: 308.05,
  },
  {
    date: new Date('2010-10-26'),
    value2: 100,
    value1: 307.83,
  },
  {
    date: new Date('2010-10-27'),
    value2: 100,
    value1: 305.24,
  },
  {
    date: new Date('2010-10-28'),
    value2: 100,
    value1: 300.98,
  },
  {
    date: new Date('2010-11-01'),
    value2: 100,
    value1: 304.18,
  },
  {
    date: new Date('2010-11-02'),
    value2: 100,
    value1: 309.36,
  },
  {
    date: new Date('2010-11-03'),
    value2: 100,
    value1: 312.8,
  },
  {
    date: new Date('2010-11-04'),
    value2: 100,
    value1: 318.27,
  },
  {
    date: new Date('2010-11-05'),
    value2: 100,
    value1: 317.13,
  },
  {
    date: new Date('2010-11-08'),
    value2: 100,
    value1: 318.62,
  },
  {
    date: new Date('2010-11-09'),
    value2: 100,
    value1: 316.08,
  },
  {
    date: new Date('2010-11-09'),
    value2: 100,
    value1: 318.03,
  },
  {
    date: new Date('2010-11-10'),
    value2: 100,
    value1: 316.66,
  },
  {
    date: new Date('2010-11-11'),
    value2: 100,
    value1: 308.03,
  },
  {
    date: new Date('2010-11-14'),
    value2: 100,
    value1: 307.04,
  },
  {
    date: new Date('2010-11-15'),
    value2: 100,
    value1: 301.59,
  },
  {
    date: new Date('2010-11-16'),
    value2: 100,
    value1: 300.5,
  },
  {
    date: new Date('2010-11-17'),
    value2: 100,
    value1: 308.43,
  },
  {
    date: new Date('2010-11-18'),
    value2: 100,
    value1: 306.73,
  },
  {
    date: new Date('2010-11-21'),
    value2: 100,
    value1: 313.36,
  },
  {
    date: new Date('2010-11-22'),
    value2: 100,
    value1: 308.73,
  },
  {
    date: new Date('2010-11-23'),
    value2: 100,
    value1: 314.8,
  },
  {
    date: new Date('2010-11-25'),
    value2: 100,
    value1: 315,
  },
  {
    date: new Date('2010-11-28'),
    value2: 100,
    value1: 316.87,
  },
  {
    date: new Date('2010-11-29'),
    value2: 100,
    value1: 311.15,
  },
  {
    date: new Date('2010-12-01'),
    value2: 100,
    value1: 316.4,
  },
  {
    date: new Date('2010-12-02'),
    value2: 100,
    value1: 318.15,
  },
  {
    date: new Date('2010-12-03'),
    value2: 100,
    value1: 317.44,
  },
  {
    date: new Date('2010-12-06'),
    value2: 100,
    value1: 320.15,
  },
  {
    date: new Date('2010-12-07'),
    value2: 100,
    value1: 318.21,
  },
  {
    date: new Date('2010-12-08'),
    value2: 100,
    value1: 321.01,
  },
  {
    date: new Date('2010-12-09'),
    value2: 100,
    value1: 319.76,
  },
  {
    date: new Date('2010-12-09'),
    value2: 100,
    value1: 320.56,
  },
  {
    date: new Date('2010-12-12'),
    value2: 100,
    value1: 321.67,
  },
  {
    date: new Date('2010-12-13'),
    value2: 100,
    value1: 320.29,
  },
  {
    date: new Date('2010-12-14'),
    value2: 100,
    value1: 320.36,
  },
  {
    date: new Date('2010-12-15'),
    value2: 100,
    value1: 321.25,
  },
  {
    date: new Date('2010-12-16'),
    value2: 100,
    value1: 320.61,
  },
  {
    date: new Date('2010-12-19'),
    value2: 100,
    value1: 322.21,
  },
  {
    date: new Date('2010-12-20'),
    value2: 100,
    value1: 324.2,
  },
  {
    date: new Date('2010-12-21'),
    value2: 100,
    value1: 325.16,
  },
  {
    date: new Date('2010-12-22'),
    value2: 100,
    value1: 323.6,
  },
  {
    date: new Date('2010-12-26'),
    value2: 100,
    value1: 324.68,
  },
  {
    date: new Date('2010-12-27'),
    value2: 100,
    value1: 325.47,
  },
  {
    date: new Date('2010-12-28'),
    value2: 100,
    value1: 325.29,
  },
  {
    date: new Date('2010-12-29'),
    value2: 100,
    value1: 323.66,
  },
  {
    date: new Date('2010-12-30'),
    value2: 100,
    value1: 322.56,
  },
  {
    date: new Date('2011-01-03'),
    value2: 100,
    value1: 329.57,
  },
  {
    date: new Date('2011-01-04'),
    value2: 100,
    value1: 331.29,
  },
  {
    date: new Date('2011-01-05'),
    value2: 100,
    value1: 334,
  },
  {
    date: new Date('2011-01-06'),
    value2: 100,
    value1: 333.73,
  },
  {
    date: new Date('2011-01-07'),
    value2: 100,
    value1: 336.12,
  },
  {
    date: new Date('2011-01-09'),
    value2: 100,
    value1: 342.46,
  },
  {
    date: new Date('2011-01-10'),
    value2: 100,
    value1: 341.64,
  },
  {
    date: new Date('2011-01-11'),
    value2: 100,
    value1: 344.42,
  },
  {
    date: new Date('2011-01-12'),
    value2: 100,
    value1: 345.68,
  },
  {
    date: new Date('2011-01-13'),
    value2: 100,
    value1: 348.48,
  },
  {
    date: new Date('2011-01-17'),
    value2: 100,
    value1: 340.65,
  },
  {
    date: new Date('2011-01-18'),
    value2: 100,
    value1: 338.84,
  },
  {
    date: new Date('2011-01-19'),
    value2: 100,
    value1: 332.68,
  },
  {
    date: new Date('2011-01-20'),
    value2: 100,
    value1: 326.72,
  },
  {
    date: new Date('2011-01-23'),
    value2: 100,
    value1: 337.45,
  },
  {
    date: new Date('2011-01-24'),
    value2: 100,
    value1: 341.4,
  },
  {
    date: new Date('2011-01-25'),
    value2: 100,
    value1: 343.85,
  },
  {
    date: new Date('2011-01-26'),
    value2: 100,
    value1: 343.21,
  },
  {
    date: new Date('2011-01-27'),
    value2: 100,
    value1: 336.1,
  },
  {
    date: new Date('2011-01-30'),
    value2: 100,
    value1: 339.32,
  },
  {
    date: new Date('2011-02-01'),
    value2: 100,
    value1: 345.03,
  },
  {
    date: new Date('2011-02-02'),
    value2: 100,
    value1: 344.32,
  },
  {
    date: new Date('2011-02-03'),
    value2: 100,
    value1: 343.44,
  },
  {
    date: new Date('2011-02-04'),
    value2: 100,
    value1: 346.5,
  },
  {
    date: new Date('2011-02-07'),
    value2: 100,
    value1: 351.88,
  },
  {
    date: new Date('2011-02-08'),
    value2: 100,
    value1: 355.2,
  },
  {
    date: new Date('2011-02-09'),
    value2: 100,
    value1: 358.16,
  },
  {
    date: new Date('2011-02-09'),
    value2: 100,
    value1: 354.54,
  },
  {
    date: new Date('2011-02-10'),
    value2: 100,
    value1: 356.85,
  },
  {
    date: new Date('2011-02-13'),
    value2: 100,
    value1: 359.18,
  },
  {
    date: new Date('2011-02-14'),
    value2: 100,
    value1: 359.9,
  },
  {
    date: new Date('2011-02-15'),
    value2: 100,
    value1: 363.13,
  },
  {
    date: new Date('2011-02-16'),
    value2: 100,
    value1: 358.3,
  },
  {
    date: new Date('2011-02-17'),
    value2: 100,
    value1: 350.56,
  },
  {
    date: new Date('2011-02-21'),
    value2: 100,
    value1: 338.61,
  },
  {
    date: new Date('2011-02-22'),
    value2: 100,
    value1: 342.62,
  },
  {
    date: new Date('2011-02-23'),
    value2: 100,
    value1: 342.88,
  },
  {
    date: new Date('2011-02-24'),
    value2: 100,
    value1: 348.16,
  },
  {
    date: new Date('2011-02-27'),
    value2: 100,
    value1: 353.21,
  },
  {
    date: new Date('2011-03-01'),
    value2: 100,
    value1: 349.31,
  },
  {
    date: new Date('2011-03-02'),
    value2: 100,
    value1: 352.12,
  },
  {
    date: new Date('2011-03-03'),
    value2: 100,
    value1: 359.56,
  },
  {
    date: new Date('2011-03-04'),
    value2: 100,
    value1: 360,
  },
  {
    date: new Date('2011-03-07'),
    value2: 100,
    value1: 355.36,
  },
  {
    date: new Date('2011-03-08'),
    value2: 100,
    value1: 355.76,
  },
  {
    date: new Date('2011-03-09'),
    value2: 100,
    value1: 352.47,
  },
  {
    date: new Date('2011-03-09'),
    value2: 100,
    value1: 346.67,
  },
  {
    date: new Date('2011-03-10'),
    value2: 100,
    value1: 351.99,
  },
  {
    date: new Date('2011-03-13'),
    value2: 100,
    value1: 353.56,
  },
  {
    date: new Date('2011-03-14'),
    value2: 100,
    value1: 345.43,
  },
  {
    date: new Date('2011-03-15'),
    value2: 100,
    value1: 330.01,
  },
  {
    date: new Date('2011-03-16'),
    value2: 100,
    value1: 334.64,
  },
  {
    date: new Date('2011-03-17'),
    value2: 100,
    value1: 330.67,
  },
  {
    date: new Date('2011-03-20'),
    value2: 100,
    value1: 339.3,
  },
  {
    date: new Date('2011-03-21'),
    value2: 100,
    value1: 341.2,
  },
  {
    date: new Date('2011-03-22'),
    value2: 100,
    value1: 339.19,
  },
  {
    date: new Date('2011-03-23'),
    value2: 100,
    value1: 344.97,
  },
  {
    date: new Date('2011-03-24'),
    value2: 100,
    value1: 351.54,
  },
  {
    date: new Date('2011-03-27'),
    value2: 100,
    value1: 350.44,
  },
  {
    date: new Date('2011-03-28'),
    value2: 100,
    value1: 350.96,
  },
  {
    date: new Date('2011-03-29'),
    value2: 100,
    value1: 348.63,
  },
  {
    date: new Date('2011-03-30'),
    value2: 100,
    value1: 348.51,
  },
  {
    date: new Date('2011-04-01'),
    value2: 100,
    value1: 344.56,
  },
  {
    date: new Date('2011-04-04'),
    value2: 100,
    value1: 341.19,
  },
  {
    date: new Date('2011-04-05'),
    value2: 100,
    value1: 338.89,
  },
  {
    date: new Date('2011-04-06'),
    value2: 100,
    value1: 338.04,
  },
  {
    date: new Date('2011-04-07'),
    value2: 100,
    value1: 338.08,
  },
  {
    date: new Date('2011-04-08'),
    value2: 100,
    value1: 335.06,
  },
  {
    date: new Date('2011-04-10'),
    value2: 100,
    value1: 330.8,
  },
  {
    date: new Date('2011-04-11'),
    value2: 100,
    value1: 332.4,
  },
  {
    date: new Date('2011-04-12'),
    value2: 100,
    value1: 336.13,
  },
  {
    date: new Date('2011-04-13'),
    value2: 100,
    value1: 332.42,
  },
  {
    date: new Date('2011-04-14'),
    value2: 100,
    value1: 327.46,
  },
  {
    date: new Date('2011-04-17'),
    value2: 100,
    value1: 331.85,
  },
  {
    date: new Date('2011-04-18'),
    value2: 100,
    value1: 337.86,
  },
  {
    date: new Date('2011-04-19'),
    value2: 100,
    value1: 342.41,
  },
  {
    date: new Date('2011-04-20'),
    value2: 100,
    value1: 350.7,
  },
  {
    date: new Date('2011-04-24'),
    value2: 100,
    value1: 353.01,
  },
  {
    date: new Date('2011-04-25'),
    value2: 100,
    value1: 350.42,
  },
  {
    date: new Date('2011-04-26'),
    value2: 100,
    value1: 350.15,
  },
  {
    date: new Date('2011-04-27'),
    value2: 100,
    value1: 346.75,
  },
  {
    date: new Date('2011-04-28'),
    value2: 100,
    value1: 350.13,
  },
  {
    date: new Date('2011-05-02'),
    value2: 100,
    value1: 346.28,
  },
  {
    date: new Date('2011-05-03'),
    value2: 100,
    value1: 348.2,
  },
  {
    date: new Date('2011-05-04'),
    value2: 100,
    value1: 349.57,
  },
  {
    date: new Date('2011-05-05'),
    value2: 100,
    value1: 346.75,
  },
  {
    date: new Date('2011-05-06'),
    value2: 100,
    value1: 346.66,
  },
  {
    date: new Date('2011-05-09'),
    value2: 100,
    value1: 347.6,
  },
  {
    date: new Date('2011-05-09'),
    value2: 100,
    value1: 349.45,
  },
  {
    date: new Date('2011-05-10'),
    value2: 100,
    value1: 347.23,
  },
  {
    date: new Date('2011-05-11'),
    value2: 100,
    value1: 346.57,
  },
  {
    date: new Date('2011-05-12'),
    value2: 100,
    value1: 340.5,
  },
  {
    date: new Date('2011-05-15'),
    value2: 100,
    value1: 333.3,
  },
  {
    date: new Date('2011-05-16'),
    value2: 100,
    value1: 336.14,
  },
  {
    date: new Date('2011-05-17'),
    value2: 100,
    value1: 339.87,
  },
  {
    date: new Date('2011-05-18'),
    value2: 100,
    value1: 340.53,
  },
  {
    date: new Date('2011-05-19'),
    value2: 100,
    value1: 335.22,
  },
  {
    date: new Date('2011-05-22'),
    value2: 100,
    value1: 334.4,
  },
  {
    date: new Date('2011-05-23'),
    value2: 100,
    value1: 332.19,
  },
  {
    date: new Date('2011-05-24'),
    value2: 100,
    value1: 336.78,
  },
  {
    date: new Date('2011-05-25'),
    value2: 100,
    value1: 335,
  },
  {
    date: new Date('2011-05-26'),
    value2: 100,
    value1: 337.41,
  },
  {
    date: new Date('2011-05-30'),
    value2: 100,
    value1: 347.83,
  },
  {
    date: new Date('2011-06-01'),
    value2: 100,
    value1: 345.51,
  },
  {
    date: new Date('2011-06-02'),
    value2: 100,
    value1: 346.1,
  },
  {
    date: new Date('2011-06-03'),
    value2: 100,
    value1: 343.44,
  },
  {
    date: new Date('2011-06-06'),
    value2: 100,
    value1: 338.04,
  },
  {
    date: new Date('2011-06-07'),
    value2: 100,
    value1: 332.04,
  },
  {
    date: new Date('2011-06-08'),
    value2: 100,
    value1: 332.24,
  },
  {
    date: new Date('2011-06-09'),
    value2: 100,
    value1: 331.49,
  },
  {
    date: new Date('2011-06-09'),
    value2: 100,
    value1: 325.9,
  },
  {
    date: new Date('2011-06-12'),
    value2: 100,
    value1: 326.6,
  },
  {
    date: new Date('2011-06-13'),
    value2: 100,
    value1: 332.44,
  },
  {
    date: new Date('2011-06-14'),
    value2: 100,
    value1: 326.75,
  },
  {
    date: new Date('2011-06-15'),
    value2: 100,
    value1: 325.16,
  },
  {
    date: new Date('2011-06-16'),
    value2: 100,
    value1: 320.26,
  },
  {
    date: new Date('2011-06-19'),
    value2: 100,
    value1: 315.32,
  },
  {
    date: new Date('2011-06-20'),
    value2: 100,
    value1: 325.3,
  },
  {
    date: new Date('2011-06-21'),
    value2: 100,
    value1: 322.61,
  },
  {
    date: new Date('2011-06-22'),
    value2: 100,
    value1: 331.23,
  },
  {
    date: new Date('2011-06-23'),
    value2: 100,
    value1: 326.35,
  },
  {
    date: new Date('2011-06-26'),
    value2: 100,
    value1: 332.04,
  },
  {
    date: new Date('2011-06-27'),
    value2: 100,
    value1: 335.26,
  },
  {
    date: new Date('2011-06-28'),
    value2: 100,
    value1: 334.04,
  },
  {
    date: new Date('2011-06-29'),
    value2: 100,
    value1: 335.67,
  },
  {
    date: new Date('2011-07-01'),
    value2: 100,
    value1: 343.26,
  },
  {
    date: new Date('2011-07-05'),
    value2: 100,
    value1: 349.43,
  },
  {
    date: new Date('2011-07-06'),
    value2: 100,
    value1: 351.76,
  },
  {
    date: new Date('2011-07-07'),
    value2: 100,
    value1: 357.2,
  },
  {
    date: new Date('2011-07-08'),
    value2: 100,
    value1: 359.71,
  },
  {
    date: new Date('2011-07-10'),
    value2: 100,
    value1: 354,
  },
  {
    date: new Date('2011-07-11'),
    value2: 100,
    value1: 353.75,
  },
  {
    date: new Date('2011-07-12'),
    value2: 100,
    value1: 358.02,
  },
  {
    date: new Date('2011-07-13'),
    value2: 100,
    value1: 357.77,
  },
  {
    date: new Date('2011-07-14'),
    value2: 100,
    value1: 364.92,
  },
  {
    date: new Date('2011-07-17'),
    value2: 100,
    value1: 373.8,
  },
  {
    date: new Date('2011-07-18'),
    value2: 100,
    value1: 376.85,
  },
  {
    date: new Date('2011-07-19'),
    value2: 100,
    value1: 386.9,
  },
  {
    date: new Date('2011-07-20'),
    value2: 100,
    value1: 387.29,
  },
  {
    date: new Date('2011-07-21'),
    value2: 100,
    value1: 393.3,
  },
  {
    date: new Date('2011-07-24'),
    value2: 100,
    value1: 398.5,
  },
  {
    date: new Date('2011-07-25'),
    value2: 100,
    value1: 403.41,
  },
  {
    date: new Date('2011-07-26'),
    value2: 100,
    value1: 392.59,
  },
  {
    date: new Date('2011-07-27'),
    value2: 100,
    value1: 391.82,
  },
  {
    date: new Date('2011-07-28'),
    value2: 100,
    value1: 390.48,
  },
  {
    date: new Date('2011-08-01'),
    value2: 100,
    value1: 396.75,
  },
  {
    date: new Date('2011-08-02'),
    value2: 100,
    value1: 388.91,
  },
  {
    date: new Date('2011-08-03'),
    value2: 100,
    value1: 392.57,
  },
  {
    date: new Date('2011-08-04'),
    value2: 100,
    value1: 377.37,
  },
  {
    date: new Date('2011-08-05'),
    value2: 100,
    value1: 373.62,
  },
  {
    date: new Date('2011-08-08'),
    value2: 100,
    value1: 353.21,
  },
  {
    date: new Date('2011-08-09'),
    value2: 100,
    value1: 374.01,
  },
  {
    date: new Date('2011-08-09'),
    value2: 100,
    value1: 363.69,
  },
  {
    date: new Date('2011-08-10'),
    value2: 100,
    value1: 373.7,
  },
  {
    date: new Date('2011-08-11'),
    value2: 100,
    value1: 376.99,
  },
  {
    date: new Date('2011-08-14'),
    value2: 100,
    value1: 383.41,
  },
  {
    date: new Date('2011-08-15'),
    value2: 100,
    value1: 380.48,
  },
  {
    date: new Date('2011-08-16'),
    value2: 100,
    value1: 380.44,
  },
  {
    date: new Date('2011-08-17'),
    value2: 100,
    value1: 366.05,
  },
  {
    date: new Date('2011-08-18'),
    value2: 100,
    value1: 356.03,
  },
  {
    date: new Date('2011-08-21'),
    value2: 100,
    value1: 356.44,
  },
  {
    date: new Date('2011-08-22'),
    value2: 100,
    value1: 373.6,
  },
  {
    date: new Date('2011-08-23'),
    value2: 100,
    value1: 376.18,
  },
  {
    date: new Date('2011-08-24'),
    value2: 100,
    value1: 373.72,
  },
  {
    date: new Date('2011-08-25'),
    value2: 100,
    value1: 383.58,
  },
  {
    date: new Date('2011-08-28'),
    value2: 100,
    value1: 389.97,
  },
  {
    date: new Date('2011-08-29'),
    value2: 100,
    value1: 389.99,
  },
  {
    date: new Date('2011-08-30'),
    value2: 100,
    value1: 384.83,
  },
  {
    date: new Date('2011-09-01'),
    value2: 100,
    value1: 381.03,
  },
  {
    date: new Date('2011-09-02'),
    value2: 100,
    value1: 374.05,
  },
  {
    date: new Date('2011-09-06'),
    value2: 100,
    value1: 379.74,
  },
  {
    date: new Date('2011-09-07'),
    value2: 100,
    value1: 383.93,
  },
  {
    date: new Date('2011-09-08'),
    value2: 100,
    value1: 384.14,
  },
  {
    date: new Date('2011-09-09'),
    value2: 100,
    value1: 377.48,
  },
  {
    date: new Date('2011-09-11'),
    value2: 100,
    value1: 379.94,
  },
  {
    date: new Date('2011-09-12'),
    value2: 100,
    value1: 384.62,
  },
  {
    date: new Date('2011-09-13'),
    value2: 100,
    value1: 389.3,
  },
  {
    date: new Date('2011-09-14'),
    value2: 100,
    value1: 392.96,
  },
  {
    date: new Date('2011-09-15'),
    value2: 100,
    value1: 400.5,
  },
  {
    date: new Date('2011-09-18'),
    value2: 100,
    value1: 411.63,
  },
  {
    date: new Date('2011-09-19'),
    value2: 100,
    value1: 413.45,
  },
  {
    date: new Date('2011-09-20'),
    value2: 100,
    value1: 412.14,
  },
  {
    date: new Date('2011-09-21'),
    value2: 100,
    value1: 401.82,
  },
  {
    date: new Date('2011-09-22'),
    value2: 100,
    value1: 404.3,
  },
  {
    date: new Date('2011-09-25'),
    value2: 100,
    value1: 403.17,
  },
  {
    date: new Date('2011-09-26'),
    value2: 100,
    value1: 399.26,
  },
  {
    date: new Date('2011-09-27'),
    value2: 100,
    value1: 397.01,
  },
  {
    date: new Date('2011-09-28'),
    value2: 100,
    value1: 390.57,
  },
  {
    date: new Date('2011-09-29'),
    value2: 100,
    value1: 381.32,
  },
  {
    date: new Date('2011-10-03'),
    value2: 100,
    value1: 374.6,
  },
  {
    date: new Date('2011-10-04'),
    value2: 100,
    value1: 372.5,
  },
  {
    date: new Date('2011-10-05'),
    value2: 100,
    value1: 378.25,
  },
  {
    date: new Date('2011-10-06'),
    value2: 100,
    value1: 377.37,
  },
  {
    date: new Date('2011-10-07'),
    value2: 100,
    value1: 369.8,
  },
  {
    date: new Date('2011-10-09'),
    value2: 100,
    value1: 388.81,
  },
  {
    date: new Date('2011-10-10'),
    value2: 100,
    value1: 400.29,
  },
  {
    date: new Date('2011-10-11'),
    value2: 100,
    value1: 402.19,
  },
  {
    date: new Date('2011-10-12'),
    value2: 100,
    value1: 408.43,
  },
  {
    date: new Date('2011-10-13'),
    value2: 100,
    value1: 422,
  },
  {
    date: new Date('2011-10-16'),
    value2: 100,
    value1: 419.99,
  },
  {
    date: new Date('2011-10-17'),
    value2: 100,
    value1: 422.24,
  },
  {
    date: new Date('2011-10-18'),
    value2: 100,
    value1: 398.62,
  },
  {
    date: new Date('2011-10-19'),
    value2: 100,
    value1: 395.31,
  },
  {
    date: new Date('2011-10-20'),
    value2: 100,
    value1: 392.87,
  },
  {
    date: new Date('2011-10-23'),
    value2: 100,
    value1: 405.77,
  },
  {
    date: new Date('2011-10-24'),
    value2: 100,
    value1: 397.77,
  },
  {
    date: new Date('2011-10-25'),
    value2: 100,
    value1: 400.6,
  },
  {
    date: new Date('2011-10-26'),
    value2: 100,
    value1: 404.69,
  },
  {
    date: new Date('2011-10-27'),
    value2: 100,
    value1: 404.95,
  },
  {
    date: new Date('2011-10-30'),
    value2: 100,
    value1: 404.78,
  },
  {
    date: new Date('2011-11-01'),
    value2: 100,
    value1: 396.51,
  },
  {
    date: new Date('2011-11-02'),
    value2: 100,
    value1: 397.41,
  },
  {
    date: new Date('2011-11-03'),
    value2: 100,
    value1: 403.07,
  },
  {
    date: new Date('2011-11-04'),
    value2: 100,
    value1: 400.24,
  },
  {
    date: new Date('2011-11-07'),
    value2: 100,
    value1: 399.73,
  },
  {
    date: new Date('2011-11-08'),
    value2: 100,
    value1: 406.23,
  },
  {
    date: new Date('2011-11-09'),
    value2: 100,
    value1: 395.28,
  },
  {
    date: new Date('2011-11-09'),
    value2: 100,
    value1: 385.22,
  },
  {
    date: new Date('2011-11-10'),
    value2: 100,
    value1: 384.62,
  },
  {
    date: new Date('2011-11-13'),
    value2: 100,
    value1: 379.26,
  },
  {
    date: new Date('2011-11-14'),
    value2: 100,
    value1: 388.83,
  },
  {
    date: new Date('2011-11-15'),
    value2: 100,
    value1: 384.77,
  },
  {
    date: new Date('2011-11-16'),
    value2: 100,
    value1: 377.41,
  },
  {
    date: new Date('2011-11-17'),
    value2: 100,
    value1: 374.94,
  },
  {
    date: new Date('2011-11-20'),
    value2: 100,
    value1: 369.01,
  },
  {
    date: new Date('2011-11-21'),
    value2: 100,
    value1: 376.51,
  },
  {
    date: new Date('2011-11-22'),
    value2: 100,
    value1: 366.99,
  },
  {
    date: new Date('2011-11-24'),
    value2: 100,
    value1: 363.57,
  },
  {
    date: new Date('2011-11-27'),
    value2: 100,
    value1: 376.12,
  },
  {
    date: new Date('2011-11-28'),
    value2: 100,
    value1: 373.2,
  },
  {
    date: new Date('2011-11-29'),
    value2: 100,
    value1: 382.2,
  },
  {
    date: new Date('2011-12-01'),
    value2: 100,
    value1: 387.93,
  },
  {
    date: new Date('2011-12-02'),
    value2: 100,
    value1: 389.7,
  },
  {
    date: new Date('2011-12-05'),
    value2: 100,
    value1: 393.01,
  },
  {
    date: new Date('2011-12-06'),
    value2: 100,
    value1: 390.95,
  },
  {
    date: new Date('2011-12-07'),
    value2: 100,
    value1: 389.09,
  },
  {
    date: new Date('2011-12-08'),
    value2: 100,
    value1: 390.66,
  },
  {
    date: new Date('2011-12-09'),
    value2: 100,
    value1: 393.62,
  },
  {
    date: new Date('2011-12-11'),
    value2: 100,
    value1: 391.84,
  },
  {
    date: new Date('2011-12-12'),
    value2: 100,
    value1: 388.81,
  },
  {
    date: new Date('2011-12-13'),
    value2: 100,
    value1: 380.19,
  },
  {
    date: new Date('2011-12-14'),
    value2: 100,
    value1: 378.94,
  },
  {
    date: new Date('2011-12-15'),
    value2: 100,
    value1: 381.02,
  },
  {
    date: new Date('2011-12-18'),
    value2: 100,
    value1: 382.21,
  },
  {
    date: new Date('2011-12-19'),
    value2: 100,
    value1: 395.95,
  },
  {
    date: new Date('2011-12-20'),
    value2: 100,
    value1: 396.44,
  },
  {
    date: new Date('2011-12-21'),
    value2: 100,
    value1: 398.55,
  },
  {
    date: new Date('2011-12-22'),
    value2: 100,
    value1: 403.43,
  },
  {
    date: new Date('2011-12-26'),
    value2: 100,
    value1: 406.53,
  },
  {
    date: new Date('2011-12-27'),
    value2: 100,
    value1: 402.64,
  },
  {
    date: new Date('2011-12-28'),
    value2: 100,
    value1: 405.12,
  },
  {
    date: new Date('2011-12-29'),
    value2: 100,
    value1: 405,
  },
  {
    date: new Date('2012-01-03'),
    value2: 100,
    value1: 411.23,
  },
  {
    date: new Date('2012-01-04'),
    value2: 100,
    value1: 413.44,
  },
  {
    date: new Date('2012-01-05'),
    value2: 100,
    value1: 418.03,
  },
  {
    date: new Date('2012-01-06'),
    value2: 100,
    value1: 422.4,
  },
  {
    date: new Date('2012-01-09'),
    value2: 100,
    value1: 421.73,
  },
  {
    date: new Date('2012-01-09'),
    value2: 100,
    value1: 423.24,
  },
  {
    date: new Date('2012-01-10'),
    value2: 100,
    value1: 422.55,
  },
  {
    date: new Date('2012-01-11'),
    value2: 100,
    value1: 421.39,
  },
  {
    date: new Date('2012-01-12'),
    value2: 100,
    value1: 419.81,
  },
  {
    date: new Date('2012-01-16'),
    value2: 100,
    value1: 424.7,
  },
  {
    date: new Date('2012-01-17'),
    value2: 100,
    value1: 429.11,
  },
  {
    date: new Date('2012-01-18'),
    value2: 100,
    value1: 427.75,
  },
  {
    date: new Date('2012-01-19'),
    value2: 100,
    value1: 420.3,
  },
  {
    date: new Date('2012-01-22'),
    value2: 100,
    value1: 427.41,
  },
  {
    date: new Date('2012-01-23'),
    value2: 100,
    value1: 420.41,
  },
  {
    date: new Date('2012-01-24'),
    value2: 100,
    value1: 446.66,
  },
  {
    date: new Date('2012-01-25'),
    value2: 100,
    value1: 444.63,
  },
  {
    date: new Date('2012-01-26'),
    value2: 100,
    value1: 447.28,
  },
  {
    date: new Date('2012-01-29'),
    value2: 100,
    value1: 453.01,
  },
  {
    date: new Date('2012-01-30'),
    value2: 100,
    value1: 456.48,
  },
  {
    date: new Date('2012-02-01'),
    value2: 100,
    value1: 456.19,
  },
  {
    date: new Date('2012-02-02'),
    value2: 100,
    value1: 455.12,
  },
  {
    date: new Date('2012-02-03'),
    value2: 100,
    value1: 459.68,
  },
  {
    date: new Date('2012-02-06'),
    value2: 100,
    value1: 463.97,
  },
  {
    date: new Date('2012-02-07'),
    value2: 100,
    value1: 468.83,
  },
  {
    date: new Date('2012-02-08'),
    value2: 100,
    value1: 476.68,
  },
  {
    date: new Date('2012-02-09'),
    value2: 100,
    value1: 493.17,
  },
  {
    date: new Date('2012-02-09'),
    value2: 100,
    value1: 493.42,
  },
  {
    date: new Date('2012-02-12'),
    value2: 100,
    value1: 502.6,
  },
  {
    date: new Date('2012-02-13'),
    value2: 100,
    value1: 509.46,
  },
  {
    date: new Date('2012-02-14'),
    value2: 100,
    value1: 497.67,
  },
  {
    date: new Date('2012-02-15'),
    value2: 100,
    value1: 502.21,
  },
  {
    date: new Date('2012-02-16'),
    value2: 100,
    value1: 502.12,
  },
  {
    date: new Date('2012-02-20'),
    value2: 100,
    value1: 514.85,
  },
  {
    date: new Date('2012-02-21'),
    value2: 100,
    value1: 513.04,
  },
  {
    date: new Date('2012-02-22'),
    value2: 100,
    value1: 516.39,
  },
  {
    date: new Date('2012-02-23'),
    value2: 100,
    value1: 522.41,
  },
  {
    date: new Date('2012-02-26'),
    value2: 100,
    value1: 525.76,
  },
  {
    date: new Date('2012-02-27'),
    value2: 100,
    value1: 535.41,
  },
  {
    date: new Date('2012-02-28'),
    value2: 100,
    value1: 542.44,
  },
  {
    date: new Date('2012-03-01'),
    value2: 100,
    value1: 544.47,
  },
  {
    date: new Date('2012-03-02'),
    value2: 100,
    value1: 545.18,
  },
  {
    date: new Date('2012-03-05'),
    value2: 100,
    value1: 533.16,
  },
  {
    date: new Date('2012-03-06'),
    value2: 100,
    value1: 530.26,
  },
  {
    date: new Date('2012-03-07'),
    value2: 100,
    value1: 530.69,
  },
  {
    date: new Date('2012-03-08'),
    value2: 100,
    value1: 541.99,
  },
  {
    date: new Date('2012-03-09'),
    value2: 100,
    value1: 545.17,
  },
  {
    date: new Date('2012-03-11'),
    value2: 100,
    value1: 552,
  },
  {
    date: new Date('2012-03-12'),
    value2: 100,
    value1: 568.1,
  },
  {
    date: new Date('2012-03-13'),
    value2: 100,
    value1: 589.58,
  },
  {
    date: new Date('2012-03-14'),
    value2: 100,
    value1: 585.56,
  },
  {
    date: new Date('2012-03-15'),
    value2: 100,
    value1: 585.57,
  },
  {
    date: new Date('2012-03-18'),
    value2: 100,
    value1: 601.1,
  },
  {
    date: new Date('2012-03-19'),
    value2: 100,
    value1: 605.96,
  },
  {
    date: new Date('2012-03-20'),
    value2: 100,
    value1: 602.5,
  },
  {
    date: new Date('2012-03-21'),
    value2: 100,
    value1: 599.34,
  },
  {
    date: new Date('2012-03-22'),
    value2: 100,
    value1: 596.05,
  },
  {
    date: new Date('2012-03-25'),
    value2: 100,
    value1: 606.98,
  },
  {
    date: new Date('2012-03-26'),
    value2: 100,
    value1: 614.48,
  },
  {
    date: new Date('2012-03-27'),
    value2: 100,
    value1: 617.62,
  },
  {
    date: new Date('2012-03-28'),
    value2: 100,
    value1: 609.86,
  },
  {
    date: new Date('2012-03-29'),
    value2: 100,
    value1: 599.55,
  },
  {
    date: new Date('2012-04-02'),
    value2: 100,
    value1: 618.63,
  },
  {
    date: new Date('2012-04-03'),
    value2: 100,
    value1: 629.32,
  },
  {
    date: new Date('2012-04-04'),
    value2: 100,
    value1: 624.31,
  },
  {
    date: new Date('2012-04-05'),
    value2: 100,
    value1: 633.68,
  },
  {
    date: new Date('2012-04-09'),
    value2: 100,
    value1: 636.23,
  },
  {
    date: new Date('2012-04-09'),
    value2: 100,
    value1: 628.44,
  },
  {
    date: new Date('2012-04-10'),
    value2: 100,
    value1: 626.2,
  },
  {
    date: new Date('2012-04-11'),
    value2: 100,
    value1: 622.77,
  },
  {
    date: new Date('2012-04-12'),
    value2: 100,
    value1: 605.23,
  },
  {
    date: new Date('2012-04-15'),
    value2: 100,
    value1: 580.13,
  },
  {
    date: new Date('2012-04-16'),
    value2: 100,
    value1: 609.7,
  },
  {
    date: new Date('2012-04-17'),
    value2: 100,
    value1: 608.34,
  },
  {
    date: new Date('2012-04-18'),
    value2: 100,
    value1: 587.44,
  },
  {
    date: new Date('2012-04-19'),
    value2: 100,
    value1: 572.98,
  },
  {
    date: new Date('2012-04-22'),
    value2: 100,
    value1: 571.7,
  },
  {
    date: new Date('2012-04-23'),
    value2: 100,
    value1: 560.28,
  },
  {
    date: new Date('2012-04-24'),
    value2: 100,
    value1: 610,
  },
  {
    date: new Date('2012-04-25'),
    value2: 100,
    value1: 607.7,
  },
  {
    date: new Date('2012-04-26'),
    value2: 100,
    value1: 603,
  },
  {
    date: new Date('2012-04-29'),
    value2: 100,
    value1: 583.98,
  },
  {
    date: new Date('2012-05-01'),
    value2: 100,
    value1: 582.13,
  },
];

export const DATA_DUMMY_PRICE_TOKEN = [
  [1711411200000, 3588.493402189288],
  [1711497600000, 3591.5485279028403],
  [1711584000000, 3505.2181161826984],
  [1711670400000, 3560.26151146781],
  [1711756800000, 3516.096057627979],
  [1711843200000, 3507.6606559474685],
  [1711929600000, 3644.767598784896],
  [1712016000000, 3508.2477201085417],
  [1712102400000, 3274.901203544406],
  [1712188800000, 3316.6829546775257],
  [1712275200000, 3332.089836615912],
  [1712361600000, 3320.2815889834437],
  [1712448000000, 3362.838907503287],
  [1712534400000, 3453.4361261792887],
  [1712620800000, 3695.239391141908],
  [1712707200000, 3503.6535996841044],
  [1712793600000, 3539.7630640649413],
  [1712880000000, 3508.5784984486436],
  [1712966400000, 3245.5005926983195],
  [1713052800000, 3022.0057852476043],
  [1713139200000, 3157.683765827796],
  [1713225600000, 3101.190735674771],
  [1713312000000, 3083.7060147660673],
  [1713398400000, 2982.6157347097997],
  [1713484800000, 3064.9115922294277],
  [1713571200000, 3065.682561565907],
  [1713657600000, 3152.1915066519473],
  [1713744000000, 3147.13775429932],
  [1713830400000, 3199.769589894069],
  [1713916800000, 3218.9672686428075],
  [1714003200000, 3138.814357009402],
  [1714089600000, 3157.6193174815944],
  [1714176000000, 3131.4192197400516],
  [1714262400000, 3259.2522227654413],
  [1714348800000, 3259.503404256033],
  [1714435200000, 3213.6890004948136],
  [1714521600000, 3018.549635877818],
  [1714608000000, 2976.0902075157046],
  [1714694400000, 2988.5486490452654],
  [1714780800000, 3102.1512923656555],
  [1714867200000, 3115.0233215730136],
  [1714953600000, 3136.57511039041],
  [1715040000000, 3064.5913995603364],
  [1715126400000, 3015.1597696166846],
  [1715212800000, 2975.72696606529],
  [1715299200000, 3038.3447046668207],
  [1715385600000, 2910.684500017475],
  [1715472000000, 2908.9827849031903],
  [1715558400000, 2931.3106669139133],
  [1715644800000, 2948.3034552659406],
  [1715731200000, 2881.7959916152945],
  [1715817600000, 3035.758955126304],
  [1715904000000, 2943.5851283842208],
  [1715990400000, 3095.9968442929658],
  [1716076800000, 3120.5493782541066],
  [1716163200000, 3071.324418093757],
  [1716249600000, 3656.390090299324],
  [1716336000000, 3792.486220211773],
  [1716422400000, 3741.897740560911],
  [1716508800000, 3766.398091341944],
  [1716595200000, 3727.065981583209],
  [1716681600000, 3750.077159389676],
  [1716768000000, 3825.277957577714],
  [1716854400000, 3893.3921058941055],
  [1716940800000, 3840.68886040005],
  [1717027200000, 3765.3025567780796],
  [1717113600000, 3748.6391523334596],
  [1717200000000, 3761.0692456476336],
  [1717286400000, 3813.452441559934],
  [1717372800000, 3780.7119847349145],
  [1717459200000, 3766.6376499412618],
  [1717545600000, 3814.932030146498],
  [1717632000000, 3871.0820906216727],
  [1717718400000, 3812.701856549199],
  [1717804800000, 3679.3766523741783],
  [1717891200000, 3683.0253801346485],
  [1717977600000, 3705.8998844045504],
  [1718064000000, 3666.8276647258203],
  [1718150400000, 3498.5559542215797],
  [1718236800000, 3559.4475336257624],
  [1718323200000, 3465.316584199481],
  [1718409600000, 3478.7748349889234],
  [1718496000000, 3565.1232591862595],
  [1718582400000, 3618.508652976102],
  [1718668800000, 3510.3586935289036],
  [1718755200000, 3480.4713384276088],
  [1718841600000, 3555.9658395535403],
  [1718928000000, 3511.28482815368],
  [1719014400000, 3516.88098000528],
  [1719100800000, 3494.7985621731755],
  [1719187200000, 3417.7971372978254],
  [1719273600000, 3357.1006400727606],
  [1719360000000, 3395.304687339692],
  [1719446400000, 3365.9446697083863],
  [1719532800000, 3442.910158110125],
  [1719619200000, 3374.6051303067916],
  [1719705600000, 3371.278227967461],
  [1719792000000, 3435.3183276337395],
  [1719878400000, 3438.009078999906],
  [1719964800000, 3417.8984255478363],
  [1720051200000, 3295.808464429979],
  [1720137600000, 3069.0434008340803],
  [1720224000000, 2984.398102498264],
  [1720310400000, 3066.247437954064],
  [1720396800000, 2928.6012310061665],
  [1720483200000, 3016.0833537946064],
  [1720569600000, 3064.0923605197886],
  [1720656000000, 3099.7101861313545],
  [1720742400000, 3102.0902302291074],
  [1720828800000, 3132.980838609695],
  [1720915200000, 3173.5042341380185],
  [1721001600000, 3252.654184707363],
  [1721088000000, 3488.5387580277174],
  [1721174400000, 3446.7658893041003],
  [1721260800000, 3389.441287038116],
  [1721347200000, 3428.5520187667257],
  [1721433600000, 3505.222536388452],
  [1721520000000, 3522.8013028122487],
  [1721606400000, 3533.118349531153],
  [1721692800000, 3443.073350817144],
  [1721779200000, 3482.9837705931927],
  [1721865600000, 3336.3802530382436],
  [1721952000000, 3173.7633983274727],
  [1722038400000, 3278.1869575279507],
  [1722124800000, 3254.611672582785],
  [1722211200000, 3272.8501306701373],
  [1722297600000, 3316.942188773212],
  [1722384000000, 3276.981779516743],
  [1722470400000, 3233.076804863122],
  [1722556800000, 3204.2465237463616],
  [1722643200000, 2983.300976694291],
  [1722729600000, 2906.7150241765007],
  [1722816000000, 2682.4373928187924],
  [1722902400000, 2415.6311394312143],
  [1722988800000, 2455.51137665051],
  [1723075200000, 2341.590346028249],
  [1723161600000, 2685.012750687489],
  [1723248000000, 2602.1840712761878],
  [1723334400000, 2608.0357436286963],
  [1723420800000, 2558.790870730736],
  [1723507200000, 2726.777988551933],
  [1723593600000, 2703.5505587641255],
  [1723680000000, 2662.780395092489],
  [1723766400000, 2569.8604812159274],
  [1723852800000, 2592.249006212312],
  [1723939200000, 2613.139261446099],
  [1724025600000, 2614.6012806263716],
  [1724112000000, 2640.5904207330605],
  [1724198400000, 2575.643435503567],
  [1724284800000, 2630.2988017642488],
  [1724371200000, 2623.289171364539],
  [1724457600000, 2763.2554073640704],
  [1724544000000, 2767.840733546234],
  [1724630400000, 2745.164671605207],
  [1724716800000, 2683.0801154902983],
  [1724803200000, 2457.2773517547434],
  [1724889600000, 2527.0269814017706],
  [1724976000000, 2526.7383553003406],
  [1725062400000, 2527.690204915795],
  [1725148800000, 2513.3643501004462],
  [1725235200000, 2430.0202661439344],
  [1725321600000, 2534.9048168403706],
  [1725408000000, 2437.1471557556497],
  [1725494400000, 2448.30785784089],
  [1725580800000, 2367.7700509506026],
  [1725667200000, 2223.780428382685],
  [1725753600000, 2272.6972849951912],
  [1725840000000, 2296.4029520764498],
  [1725926400000, 2359.565766831627],
  [1726012800000, 2389.4740111256497],
  [1726099200000, 2342.9639236941434],
  [1726185600000, 2362.300238174588],
  [1726272000000, 2445.08621032297],
  [1726358400000, 2418.0828083179904],
  [1726444800000, 2322.6433317480564],
  [1726531200000, 2295.1348386540835],
  [1726617600000, 2341.0924132597524],
  [1726704000000, 2361.960992100706],
  [1726790400000, 2465.2347833172967],
  [1726876800000, 2557.6218555442515],
  [1726963200000, 2614.599604753501],
  [1727049600000, 2582.847683741262],
  [1727136000000, 2647.9931622033255],
  [1727222400000, 2653.844345308008],
  [1727308800000, 2578.566359563475],
  [1727395200000, 2630.94983700893],
  [1727481600000, 2698.1928212346033],
  [1727568000000, 2680.218702062471],
  [1727654400000, 2659.611211611689],
  [1727740800000, 2597.3411516834435],
  [1727827200000, 2451.631522589772],
  [1727913600000, 2365.231040243019],
  [1728000000000, 2348.0048369247393],
  [1728086400000, 2416.9184055552637],
  [1728172800000, 2415.4038137445546],
  [1728259200000, 2438.030912544012],
  [1728345600000, 2422.7506412955013],
  [1728432000000, 2441.4651696200294],
  [1728518400000, 2367.615096789395],
  [1728520799000, 2370.2129627641916],
];

export const TRANSACTION_TYPES = {
  SWAP: "Swap",
  ADD: "Added Liquidity",
  REMOVE: "Remove Liquidity",
  TRANSFER: "Transfer",
  DEPOSIT: "Deposit",
  WITHDRAW: "Withdraw",
  CREATE: "Add Pool",
}