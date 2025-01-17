import HeaderV2 from "../headerv2";
import { Footer } from "../footerv2";
import styles from "../css/transaction.module.css";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  DataTableType,
  TableTransaction,
  ValueCellType,
} from "../tableTransaction/tableTransaction";

const FAKE_DATA: DataTableType[] = [
  {
    type: "Payment",
    transfer: {
      sender: {
        avt: "asda",
        name: "MinaStake.com",
        address: "B62gm•••hYLszT",
      },
      recipient: {
        address: "B62gm•••hYLszT",
      },
    },
    status: "Pending",
    age: "12s",
    amount: { value: "0.000085", memo: "Paribu" },
    currency: "MINA",
    fee: { value: "0.0001" },
    block: {
      nonce: "787479",
    },
    details: {
      transactionType: "Payment",
      transactionHash: "5Ju...vDfnQx",
      block: "408,904",
      confirmations: "7 blocks after",
      created: "30.11.2024 UTC 09:15",
      nonce: "236776",
      blockStateHash: "5Ju...vDfnQx",
      transfer: {
        sender: {
          name: "DexHeim",
          address: "5Ju...vDfnQx",
          memo: "ukr svin, oink oink",
          fee: "0.007003",
          feeCurrency: "MINA",
        },
        recipient: {
          address: "5Ju...vDfnQx",
        },
      },
      balanceChange: [
        {
          account: "MinaStake.com",
          change: "0.000085",
          balanceBefore: "777.572171893",
          balanceAfter: "777.572171893",
          currency: "MINA",
        },
        {
          account: "MinaStake.com",
          change: "0.000085",
          balanceBefore: "3,878.038079566",
          balanceAfter: "3,878.038079566",
          currency: "MINA",
        },
      ],
    },
  },
  {
    type: "Payment",
    transfer: {
      sender: {
        avt: "asda",
        name: "MinaStake.com",
        address: "B62gm•••hYLszT",
      },
      recipient: {
        address: "B62gm•••hYLszT",
      },
    },
    status: "Pending",
    age: "12s",
    amount: { value: "0.000085", memo: "Paribu" },
    currency: "MINA",
    fee: { value: "0.0001" },
    block: {
      nonce: "787479",
    },
    details: {
      transactionType: "Payment",
      transactionHash: "5Ju...vDfnQx",
      block: "408,904",
      confirmations: "7 blocks after",
      created: "30.11.2024 UTC 09:15",
      nonce: "236776",
      blockStateHash: "5Ju...vDfnQx",
      transfer: {
        sender: {
          name: "DexHeim",
          address: "5Ju...vDfnQx",
          memo: "ukr svin, oink oink",
          fee: "0.007003",
          feeCurrency: "MINA",
        },
        recipient: {
          address: "5Ju...vDfnQx",
        },
      },
      balanceChange: [
        {
          account: "MinaStake.com",
          change: "0.000085",
          balanceBefore: "777.572171893",
          balanceAfter: "777.572171893",
          currency: "MINA",
        },
        {
          account: "MinaStake.com",
          change: "0.000085",
          balanceBefore: "3,878.038079566",
          balanceAfter: "3,878.038079566",
          currency: "MINA",
        },
      ],
    },
  },
  {
    type: "Payment",
    transfer: {
      sender: {
        name: "MinaStake.com",
        address: "B62gm•••hYLszT",
      },
      recipient: {
        address: "B62gm•••hYLszT",
      },
    },
    status: "Pending",
    age: "12s",
    amount: { value: "0.000085", memo: "Paribu" },
    currency: "MINA",
    fee: { value: "0.0001" },
    block: {
      nonce: "787479",
    },
    details: {
      transactionType: "Payment",
      transactionHash: "5Ju...vDfnQx",
      block: "408,904",
      confirmations: "7 blocks after",
      created: "30.11.2024 UTC 09:15",
      nonce: "236776",
      blockStateHash: "5Ju...vDfnQx",
      transfer: {
        sender: {
          name: "DexHeim",
          address: "5Ju...vDfnQx",
          memo: "ukr svin, oink oink",
          fee: "0.007003",
          feeCurrency: "MINA",
        },
        recipient: {
          address: "5Ju...vDfnQx",
        },
      },
      balanceChange: [
        {
          account: "MinaStake.com",
          change: "0.000085",
          balanceBefore: "777.572171893",
          balanceAfter: "777.572171893",
          currency: "MINA",
        },
        {
          account: "MinaStake.com",
          change: "0.000085",
          balanceBefore: "3,878.038079566",
          balanceAfter: "3,878.038079566",
          currency: "MINA",
        },
      ],
    },
  },
  {
    type: "Payment",
    transfer: {
      sender: {
        name: "MinaStake.com",
        address: "B62gm•••hYLszT",
      },
      recipient: {
        address: "B62gm•••hYLszT",
      },
    },
    status: "Pending",
    age: "12s",
    amount: { value: "0.000085", memo: "Paribu" },
    currency: "MINA",
    fee: { value: "0.0001" },
    block: {
      nonce: "787479",
    },
    details: {
      transactionType: "Payment",
      transactionHash: "5Ju...vDfnQx",
      block: "408,904",
      confirmations: "7 blocks after",
      created: "30.11.2024 UTC 09:15",
      nonce: "236776",
      blockStateHash: "5Ju...vDfnQx",
      transfer: {
        sender: {
          name: "DexHeim",
          address: "5Ju...vDfnQx",
          memo: "ukr svin, oink oink",
          fee: "0.007003",
          feeCurrency: "MINA",
        },
        recipient: {
          address: "5Ju...vDfnQx",
        },
      },
      balanceChange: [
        {
          account: "MinaStake.com",
          change: "0.000085",
          balanceBefore: "777.572171893",
          balanceAfter: "777.572171893",
          currency: "MINA",
        },
        {
          account: "MinaStake.com",
          change: "0.000085",
          balanceBefore: "3,878.038079566",
          balanceAfter: "3,878.038079566",
          currency: "MINA",
        },
      ],
    },
  },
  {
    type: "Payment",
    transfer: {
      sender: {
        name: "MinaStake.com",
        address: "B62gm•••hYLszT",
      },
      recipient: {
        address: "B62gm•••hYLszT",
      },
    },
    status: "Pending",
    age: "12s",
    amount: { value: "0.000085", memo: "Paribu" },
    currency: "MINA",
    fee: { value: "0.0001" },
    block: {
      nonce: "787479",
    },
    details: {
      transactionType: "Payment",
      transactionHash: "5Ju...vDfnQx",
      block: "408,904",
      confirmations: "7 blocks after",
      created: "30.11.2024 UTC 09:15",
      nonce: "236776",
      blockStateHash: "5Ju...vDfnQx",
      transfer: {
        sender: {
          name: "DexHeim",
          address: "5Ju...vDfnQx",
          memo: "ukr svin, oink oink",
          fee: "0.007003",
          feeCurrency: "MINA",
        },
        recipient: {
          address: "5Ju...vDfnQx",
        },
      },
      balanceChange: [
        {
          account: "MinaStake.com",
          change: "0.000085",
          balanceBefore: "777.572171893",
          balanceAfter: "777.572171893",
          currency: "MINA",
        },
        {
          account: "MinaStake.com",
          change: "0.000085",
          balanceBefore: "3,878.038079566",
          balanceAfter: "3,878.038079566",
          currency: "MINA",
        },
      ],
    },
  },
];

const columns = [
  {
    title: "Type",
    dataIndex: "type",
    width: 112,
    render: (value: ValueCellType) => (
      <span
        className={cn(styles.bodyCell, styles.typeValue)}
      >{`${value}`}</span>
    ),
  },

  {
    title: "",
    dataIndex: "",
    width: 112,
    render: () => (
      <div className={styles.bodyCell}>
        <div className={styles.detailsBtn}>Details</div>
      </div>
    ),
  },
  {
    title: "Transfer",
    dataIndex: "transfer",
    width: 374,
    hasInfo: true,
    render: (value: ValueCellType) => (
      <div className={styles.transferInfo}>
        <div className={styles.transferSender}>
          <div className={styles.sender}>
            {typeof value === "object" && value?.sender?.avt && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <circle cx="9" cy="9" r="9" fill="#D9D9D9" />
              </svg>
            )}
            <div className={styles.senderName}>
              {typeof value === "object" && value.sender.name}
            </div>
          </div>
          <div className={styles.transactionAddress}>
            <span className={styles.transactionValue}>
              {typeof value === "object" && value.sender.address}
            </span>
            <span style={{ cursor: "pointer" }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_113_292)">
                  <path
                    d="M3.33301 9.99999H2.66634C2.31272 9.99999 1.97358 9.85952 1.72353 9.60947C1.47348 9.35942 1.33301 9.02028 1.33301 8.66666V2.66666C1.33301 2.31304 1.47348 1.9739 1.72353 1.72385C1.97358 1.4738 2.31272 1.33333 2.66634 1.33333H8.66634C9.01996 1.33333 9.3591 1.4738 9.60915 1.72385C9.8592 1.9739 9.99967 2.31304 9.99967 2.66666V3.33333M7.33301 5.99999H13.333C14.0694 5.99999 14.6663 6.59695 14.6663 7.33333V13.3333C14.6663 14.0697 14.0694 14.6667 13.333 14.6667H7.33301C6.59663 14.6667 5.99967 14.0697 5.99967 13.3333V7.33333C5.99967 6.59695 6.59663 5.99999 7.33301 5.99999Z"
                    stroke="#FF8366"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_113_292">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
          </div>
        </div>

        <div className={styles.arrowIcon}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.16699 10H15.8337M15.8337 10L10.0003 4.16667M15.8337 10L10.0003 15.8333"
              stroke="#828A99"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <div className={styles.transactionAddress}>
          <span className={styles.transactionValue}>
            {typeof value === "object" && value.recipient.address}
          </span>
          <span style={{ cursor: "pointer" }}>
            {" "}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_113_292)">
                <path
                  d="M3.33301 9.99999H2.66634C2.31272 9.99999 1.97358 9.85952 1.72353 9.60947C1.47348 9.35942 1.33301 9.02028 1.33301 8.66666V2.66666C1.33301 2.31304 1.47348 1.9739 1.72353 1.72385C1.97358 1.4738 2.31272 1.33333 2.66634 1.33333H8.66634C9.01996 1.33333 9.3591 1.4738 9.60915 1.72385C9.8592 1.9739 9.99967 2.31304 9.99967 2.66666V3.33333M7.33301 5.99999H13.333C14.0694 5.99999 14.6663 6.59695 14.6663 7.33333V13.3333C14.6663 14.0697 14.0694 14.6667 13.333 14.6667H7.33301C6.59663 14.6667 5.99967 14.0697 5.99967 13.3333V7.33333C5.99967 6.59695 6.59663 5.99999 7.33301 5.99999Z"
                  stroke="#FF8366"
                  stroke-width="1.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_113_292">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
        </div>
      </div>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    width: 112,
    render: () => (
      <div className={styles.pendingCell}>
        <div className={styles.pendingTag}>
          <div className={styles.pendingIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M6 3V6L8 7M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z"
                stroke="#D1923F"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          Pending
        </div>
      </div>
    ),
  },
  {
    title: "Age",
    dataIndex: "age",
    width: 112,
    render: (value: ValueCellType) => (
      <div
        className={cn(styles.bodyCell, styles.ageCell)}
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        {`${value}`}
      </div>
    ),
  },
  {
    title: "Amount",
    dataIndex: "amount",
    width: 192,
    render: (value: ValueCellType, record: DataTableType) => (
      <div className={cn(styles.bodyCell, styles.amountCell)}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div className={styles.amountValue}>
            <span style={{ fontSize: "14px" }}>
              {typeof value === "object" &&
                value.value.toString().split(".")[0]}
            </span>
            .
            <span className={styles.tableDecimalText}>
              {typeof value === "object" &&
                value.value.toString().split(".")[1]}
            </span>
          </div>

          <span className={styles.currencyName}>{`${record.currency}`}</span>
        </div>
        <div
          className={styles.memoText}
          style={{ display: "flex", alignItems: "center", gap: "2px" }}
        >
          MEMO :
          <span className={styles.memoName}>
            {typeof value === "object" && value.memo}
          </span>
        </div>
      </div>
    ),
  },
  {
    title: "Fee",
    dataIndex: "fee",
    width: 152,
    render: (value: ValueCellType, record: DataTableType) => (
      <div
        className={styles.bodyCell}
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        <div className={styles.amountValue}>
          <span style={{ fontSize: "14px" }}>
            {typeof value === "object" && value.value.toString().split(".")[0]}
          </span>
          .
          <span className={styles.tableDecimalText}>
            {typeof value === "object" && value.value.toString().split(".")[1]}
          </span>
        </div>

        <span className={styles.currencyName}>{`${record.currency}`}</span>
      </div>
    ),
  },
  {
    title: "Block",
    dataIndex: "block",
    width: 192,
    render: () => (
      <div
        className={cn(styles.bodyCell, styles.blockCell)}
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        NONCE:<span>787479</span>
      </div>
    ),
  },
];

export interface transactionComponent {}
export function TransactionComponent({}: transactionComponent) {
  return (
    <div className={styles.containerFluid}>
      <HeaderV2 />
      <div className={styles.transactionBody}>
        <div className={styles.transactionOverview}>
          <div className={styles.transactionOverviewHeader}>
            <div
              className={cn(
                styles.transactionOverviewHeaderTag,
                styles.overviewHeaderText,
              )}
            >
              <div>
                <span className={styles.overviewHeaderTextTitle}>
                  Market Cap
                </span>
                <div className={styles.iconInfo}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="4"
                    height="10"
                    viewBox="0 0 4 10"
                    fill="currentColor"
                  >
                    <path
                      d="M2.43159 2.48602C2.21559 2.48602 2.04359 2.42602 1.91559 2.30602C1.78759 2.17802 1.72359 2.01402 1.72359 1.81402C1.72359 1.76602 1.73159 1.69402 1.74759 1.59802C1.80359 1.33402 1.92359 1.12202 2.10759 0.962022C2.29959 0.794022 2.52759 0.710022 2.79159 0.710022C3.01559 0.710022 3.19159 0.774022 3.31959 0.902022C3.45559 1.03002 3.52359 1.19802 3.52359 1.40602C3.52359 1.70202 3.41559 1.95802 3.19959 2.17402C2.98359 2.38202 2.72759 2.48602 2.43159 2.48602ZM1.45959 9.29002C1.19559 9.29002 0.963586 9.24202 0.763586 9.14602C0.571586 9.05002 0.475586 8.89402 0.475586 8.67802C0.475586 8.61402 0.479586 8.56602 0.487586 8.53402L1.25559 4.77802C1.26359 4.75402 1.26759 4.72202 1.26759 4.68202C1.26759 4.51402 1.17559 4.43002 0.991586 4.43002C0.975586 4.43002 0.879586 4.45002 0.703586 4.49002L0.691586 4.11802L2.87559 3.43402H3.21159L2.21559 8.28202C2.20759 8.32202 2.20359 8.37802 2.20359 8.45002C2.20359 8.61002 2.28359 8.69002 2.44359 8.69002C2.51559 8.69002 2.60359 8.67802 2.70759 8.65402C2.81959 8.62202 2.89159 8.60202 2.92359 8.59402L2.85159 8.89402C2.67559 9.02202 2.45959 9.11802 2.20359 9.18202C1.95559 9.25402 1.70759 9.29002 1.45959 9.29002Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>

              <span
                className={cn(styles.overviewHeaderTextValue, styles.redText)}
              >
                $998,038,007
              </span>

              <span className={styles.plusText}> +5.33% </span>
            </div>

            <div className={styles.overviewDivider}></div>

            <div
              className={cn(
                styles.transactionOverviewHeaderTag,
                styles.overviewHeaderText,
              )}
            >
              <div>
                <span className={styles.overviewHeaderTextTitle}>
                  Circulating Supply
                </span>
                <div className={styles.iconInfo}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="4"
                    height="10"
                    viewBox="0 0 4 10"
                    fill="currentColor"
                  >
                    <path
                      d="M2.43159 2.48602C2.21559 2.48602 2.04359 2.42602 1.91559 2.30602C1.78759 2.17802 1.72359 2.01402 1.72359 1.81402C1.72359 1.76602 1.73159 1.69402 1.74759 1.59802C1.80359 1.33402 1.92359 1.12202 2.10759 0.962022C2.29959 0.794022 2.52759 0.710022 2.79159 0.710022C3.01559 0.710022 3.19159 0.774022 3.31959 0.902022C3.45559 1.03002 3.52359 1.19802 3.52359 1.40602C3.52359 1.70202 3.41559 1.95802 3.19959 2.17402C2.98359 2.38202 2.72759 2.48602 2.43159 2.48602ZM1.45959 9.29002C1.19559 9.29002 0.963586 9.24202 0.763586 9.14602C0.571586 9.05002 0.475586 8.89402 0.475586 8.67802C0.475586 8.61402 0.479586 8.56602 0.487586 8.53402L1.25559 4.77802C1.26359 4.75402 1.26759 4.72202 1.26759 4.68202C1.26759 4.51402 1.17559 4.43002 0.991586 4.43002C0.975586 4.43002 0.879586 4.45002 0.703586 4.49002L0.691586 4.11802L2.87559 3.43402H3.21159L2.21559 8.28202C2.20759 8.32202 2.20359 8.37802 2.20359 8.45002C2.20359 8.61002 2.28359 8.69002 2.44359 8.69002C2.51559 8.69002 2.60359 8.67802 2.70759 8.65402C2.81959 8.62202 2.89159 8.60202 2.92359 8.59402L2.85159 8.89402C2.67559 9.02202 2.45959 9.11802 2.20359 9.18202C1.95559 9.25402 1.70759 9.29002 1.45959 9.29002Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>

              <span className={styles.overviewHeaderTextValue}> 7,920.14 </span>
            </div>

            <div className={styles.overviewDivider}></div>

            <div
              className={cn(
                styles.transactionOverviewHeaderTag,
                styles.overviewHeaderText,
              )}
            >
              <div>
                <span className={styles.overviewHeaderTextTitle}>
                  Dominance
                </span>
                <div className={styles.iconInfo}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="4"
                    height="10"
                    viewBox="0 0 4 10"
                    fill="currentColor"
                  >
                    <path
                      d="M2.43159 2.48602C2.21559 2.48602 2.04359 2.42602 1.91559 2.30602C1.78759 2.17802 1.72359 2.01402 1.72359 1.81402C1.72359 1.76602 1.73159 1.69402 1.74759 1.59802C1.80359 1.33402 1.92359 1.12202 2.10759 0.962022C2.29959 0.794022 2.52759 0.710022 2.79159 0.710022C3.01559 0.710022 3.19159 0.774022 3.31959 0.902022C3.45559 1.03002 3.52359 1.19802 3.52359 1.40602C3.52359 1.70202 3.41559 1.95802 3.19959 2.17402C2.98359 2.38202 2.72759 2.48602 2.43159 2.48602ZM1.45959 9.29002C1.19559 9.29002 0.963586 9.24202 0.763586 9.14602C0.571586 9.05002 0.475586 8.89402 0.475586 8.67802C0.475586 8.61402 0.479586 8.56602 0.487586 8.53402L1.25559 4.77802C1.26359 4.75402 1.26759 4.72202 1.26759 4.68202C1.26759 4.51402 1.17559 4.43002 0.991586 4.43002C0.975586 4.43002 0.879586 4.45002 0.703586 4.49002L0.691586 4.11802L2.87559 3.43402H3.21159L2.21559 8.28202C2.20759 8.32202 2.20359 8.37802 2.20359 8.45002C2.20359 8.61002 2.28359 8.69002 2.44359 8.69002C2.51559 8.69002 2.60359 8.67802 2.70759 8.65402C2.81959 8.62202 2.89159 8.60202 2.92359 8.59402L2.85159 8.89402C2.67559 9.02202 2.45959 9.11802 2.20359 9.18202C1.95559 9.25402 1.70759 9.29002 1.45959 9.29002Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>

              <span className={styles.overviewHeaderTextValue}> 0.02 % </span>
            </div>

            <div className={styles.overviewDivider}></div>

            <div
              className={cn(
                styles.transactionOverviewHeaderTag,
                styles.overviewHeaderText,
              )}
            >
              <div>
                <span className={styles.overviewHeaderTextTitle}>Supply</span>
                <div className={styles.iconInfo}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="4"
                    height="10"
                    viewBox="0 0 4 10"
                    fill="currentColor"
                  >
                    <path
                      d="M2.43159 2.48602C2.21559 2.48602 2.04359 2.42602 1.91559 2.30602C1.78759 2.17802 1.72359 2.01402 1.72359 1.81402C1.72359 1.76602 1.73159 1.69402 1.74759 1.59802C1.80359 1.33402 1.92359 1.12202 2.10759 0.962022C2.29959 0.794022 2.52759 0.710022 2.79159 0.710022C3.01559 0.710022 3.19159 0.774022 3.31959 0.902022C3.45559 1.03002 3.52359 1.19802 3.52359 1.40602C3.52359 1.70202 3.41559 1.95802 3.19959 2.17402C2.98359 2.38202 2.72759 2.48602 2.43159 2.48602ZM1.45959 9.29002C1.19559 9.29002 0.963586 9.24202 0.763586 9.14602C0.571586 9.05002 0.475586 8.89402 0.475586 8.67802C0.475586 8.61402 0.479586 8.56602 0.487586 8.53402L1.25559 4.77802C1.26359 4.75402 1.26759 4.72202 1.26759 4.68202C1.26759 4.51402 1.17559 4.43002 0.991586 4.43002C0.975586 4.43002 0.879586 4.45002 0.703586 4.49002L0.691586 4.11802L2.87559 3.43402H3.21159L2.21559 8.28202C2.20759 8.32202 2.20359 8.37802 2.20359 8.45002C2.20359 8.61002 2.28359 8.69002 2.44359 8.69002C2.51559 8.69002 2.60359 8.67802 2.70759 8.65402C2.81959 8.62202 2.89159 8.60202 2.92359 8.59402L2.85159 8.89402C2.67559 9.02202 2.45959 9.11802 2.20359 9.18202C1.95559 9.25402 1.70759 9.29002 1.45959 9.29002Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>

              <span className={styles.overviewHeaderTextValue}>
                1,198,709,700 DEX
              </span>

              <span className={styles.overviewHeaderGrayText}>
                {" "}
                $773,089,840{" "}
              </span>
            </div>

            <div className={styles.overviewDivider}></div>

            <div
              className={cn(
                styles.transactionOverviewHeaderTag,
                styles.overviewHeaderText,
              )}
            >
              <div>
                <span className={styles.overviewHeaderTextTitle}>
                  Total Stake
                </span>
                <div className={styles.iconInfo}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="4"
                    height="10"
                    viewBox="0 0 4 10"
                    fill="currentColor"
                  >
                    <path
                      d="M2.43159 2.48602C2.21559 2.48602 2.04359 2.42602 1.91559 2.30602C1.78759 2.17802 1.72359 2.01402 1.72359 1.81402C1.72359 1.76602 1.73159 1.69402 1.74759 1.59802C1.80359 1.33402 1.92359 1.12202 2.10759 0.962022C2.29959 0.794022 2.52759 0.710022 2.79159 0.710022C3.01559 0.710022 3.19159 0.774022 3.31959 0.902022C3.45559 1.03002 3.52359 1.19802 3.52359 1.40602C3.52359 1.70202 3.41559 1.95802 3.19959 2.17402C2.98359 2.38202 2.72759 2.48602 2.43159 2.48602ZM1.45959 9.29002C1.19559 9.29002 0.963586 9.24202 0.763586 9.14602C0.571586 9.05002 0.475586 8.89402 0.475586 8.67802C0.475586 8.61402 0.479586 8.56602 0.487586 8.53402L1.25559 4.77802C1.26359 4.75402 1.26759 4.72202 1.26759 4.68202C1.26759 4.51402 1.17559 4.43002 0.991586 4.43002C0.975586 4.43002 0.879586 4.45002 0.703586 4.49002L0.691586 4.11802L2.87559 3.43402H3.21159L2.21559 8.28202C2.20759 8.32202 2.20359 8.37802 2.20359 8.45002C2.20359 8.61002 2.28359 8.69002 2.44359 8.69002C2.51559 8.69002 2.60359 8.67802 2.70759 8.65402C2.81959 8.62202 2.89159 8.60202 2.92359 8.59402L2.85159 8.89402C2.67559 9.02202 2.45959 9.11802 2.20359 9.18202C1.95559 9.25402 1.70759 9.29002 1.45959 9.29002Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>

              <span className={styles.overviewHeaderTextValue}>
                1,198,709,700 DEX
              </span>

              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span className={styles.overviewHeaderGrayText}>
                  {" "}
                  $773,089,840{" "}
                </span>

                <span className={styles.plusText}>+5.33%</span>
              </div>
            </div>

            <div className={styles.overviewDivider}></div>

            <div className={styles.minaPriceHeaderTagWrapper}>
              <div
                className={cn(
                  styles.transactionOverviewHeaderTag,
                  styles.minaPriceHeaderTag,
                  styles.overviewHeaderText,
                )}
              >
                <div>
                  <span className={styles.overviewHeaderTextTitle}>
                    Mina Price
                  </span>
                </div>

                <span className={styles.overviewHeaderTextValue}>
                  {" "}
                  7,920.14{" "}
                </span>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div className={styles.overviewTag}>24h</div>

                  <span className={styles.plusText}>+0.4%</span>
                </div>
              </div>

              <div className={styles.chartWrapper}>
                <Image
                  src="/images/transaction/Chart.png"
                  alt="Chart"
                  width={100}
                  height={100}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>

            <div className={styles.showLessBtn}>
              <span className={styles.showLessText}>Show Less</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="7"
                viewBox="0 0 10 7"
                fill="none"
              >
                <path d="M1 6L5 2L9 6" stroke="#FF603B" stroke-width="1.6" />
              </svg>
            </div>
          </div>

          <div
            className={cn(styles.transactionCardsList, styles.cardsListText)}
          >
            <div className={styles.transactionCard}>
              <div className={styles.transactionCardContent}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  Epoch
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_7795_208)">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM5.5 9.375C5.15482 9.375 4.875 9.65482 4.875 10C4.875 10.3452 5.15482 10.625 5.5 10.625H8.5C8.84518 10.625 9.125 10.3452 9.125 10C9.125 9.65482 8.84518 9.375 8.5 9.375H7.625V6.5C7.625 6.15482 7.34518 5.875 7 5.875H6C5.65482 5.875 5.375 6.15482 5.375 6.5C5.375 6.84518 5.65482 7.125 6 7.125H6.375V9.375H5.5ZM8 4C8 4.55228 7.55228 5 7 5C6.44772 5 6 4.55228 6 4C6 3.44772 6.44772 3 7 3C7.55228 3 8 3.44772 8 4Z"
                          fill="black"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_7795_208">
                          <rect width="14" height="14" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>

                <div className={styles.epochValue}>11</div>

                <div className={styles.overviewTag}>new: 6h left</div>
              </div>

              <div className={styles.epochPercentageWrapper}>
                <div className={styles.epochPercentageBox}>
                  <span className={styles.epochGreenPercentage}>35%</span>
                  <div className={styles.percentageBar}>
                    <div
                      className={styles.percentageBarGreenFill}
                      style={{ width: "35%" }}
                    ></div>
                  </div>
                </div>

                <div className={styles.epochPercentageBox}>
                  <div className={styles.epochSlots}>
                    <span className={styles.echoRedSlots}>2692</span>/ 7140
                    slots
                  </div>
                  <div className={styles.percentageBar}>
                    <div
                      className={styles.percentageBarRedFill}
                      style={{ width: "calc(2692 / 7140 * 100%)" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.transactionCard}>
              <div className={styles.transactionCardContent}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    gap: "6px",
                  }}
                >
                  <div>Total User Transactions</div>
                  <div className={styles.transactionCardRedValue}>
                    7,251,242
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div className={styles.overviewTag}>new: 6h left</div>
                  <div className={styles.plusText}>+1,345,861</div>
                </div>
              </div>

              <div className={styles.transactionCardIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 7.25H22"
                    stroke="#FF8366"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="bevel"
                  />
                  <path
                    d="M18.25 3.5L22 7.25L18.25 11"
                    stroke="#FF8366"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="bevel"
                  />
                  <path
                    d="M22 16.75H2"
                    stroke="#FF8366"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="bevel"
                  />
                  <path
                    d="M5.75 13L2 16.75L5.75 20.5"
                    stroke="#FF8366"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="bevel"
                  />
                </svg>
              </div>
            </div>

            <div className={styles.transactionCard}>
              <div className={styles.transactionCardContent}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    gap: "6px",
                  }}
                >
                  <div>Total Accounts</div>
                  <div className={styles.transactionCardRedValue}>251,242</div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div className={styles.plusText}>+45,861</div>
                </div>
              </div>

              <div className={styles.transactionCardIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="22"
                  viewBox="0 0 20 22"
                  fill="none"
                >
                  <path
                    d="M18.3716 16.0859C17.2202 14.0782 15.4071 12.9941 13.1838 12.7799C11.3178 12.6059 9.43855 12.6327 7.57254 12.6996C6.69909 12.7264 5.78593 12.9405 4.96542 13.2618C2.95383 14.0515 1.51131 15.4568 1.07458 17.692C0.849604 18.8029 1.11429 19.432 2.13331 19.9005C2.86119 20.2351 3.62877 20.476 4.39635 20.6366C6.2359 21.0515 8.11514 21.0114 9.98115 20.9846C11.8736 21.0114 13.7661 21.0248 15.6321 20.65C16.5585 20.4626 17.4584 20.2217 18.2525 19.6863C18.7686 19.3383 19.0465 18.8699 18.9936 18.214C18.9407 17.4511 18.7554 16.7417 18.3716 16.0859ZM17.9746 18.7226C17.6437 18.91 17.2996 19.1376 16.9158 19.2848C15.6586 19.78 14.3352 19.954 12.9985 19.9808C11.0134 20.0343 9.01506 20.0343 7.02994 19.9942C5.68006 19.954 4.33018 19.78 3.04647 19.2714C2.68915 19.1376 2.3583 18.91 2.02744 18.736C1.8951 17.7991 2.14655 17.0228 2.59651 16.3134C3.53613 14.8545 4.92572 14.0916 6.56675 13.7704C7.06965 13.6767 7.59901 13.6499 8.11514 13.6499C9.51796 13.6231 10.934 13.5964 12.3501 13.6499C14.3087 13.7302 16.0027 14.4262 17.2202 16.0457C17.829 16.8354 18.0672 17.6653 17.9746 18.7226Z"
                    fill="#FF8366"
                    stroke="#FF8366"
                  />
                  <path
                    d="M10.0218 1.00159C6.99116 1.00159 4.54284 3.43756 4.50314 6.50261C4.47667 9.5275 6.95145 12.0572 9.9556 12.0705C13.0127 12.0839 15.5272 9.60781 15.5007 6.54276C15.4478 2.98249 12.5495 0.934668 10.0218 1.00159ZM10.0218 11.1069C7.50729 11.1203 5.50893 9.0992 5.46923 6.55615C5.44276 4.36109 7.1235 1.97866 10.0218 1.95189C12.4966 1.92512 14.5214 3.99971 14.5346 6.47584C14.5346 9.05904 12.5495 11.0935 10.0218 11.1069Z"
                    fill="#FF8366"
                    stroke="#FF8366"
                  />
                </svg>
              </div>
            </div>

            <div className={styles.transactionCard}>
              <div className={styles.transactionCardContent}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    gap: "6px",
                  }}
                >
                  <div>Validators</div>
                  <div className={styles.transactionCardRedValue}>
                    344 / 1,488
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div className={styles.overviewTag}>Active/ Alltime</div>
                </div>
              </div>

              <div className={styles.transactionCardIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="20"
                  viewBox="0 0 22 20"
                  fill="none"
                >
                  <g clip-path="url(#clip0_7819_465)">
                    <path
                      d="M13.8432 6.11717C13.0582 5.42251 12.0611 5.04926 11.0852 5.04926H10.9898C9.84416 5.04926 8.80463 5.49508 8.05149 6.23122C7.28775 6.95698 6.81041 7.97305 6.7998 9.10317V9.13427C6.7998 11.3634 8.67734 13.1986 10.958 13.2089H10.9792C13.281 13.1986 15.1904 11.4152 15.1904 9.16538V9.12391C15.1691 7.859 14.6175 6.81183 13.8432 6.11717ZM13.4825 9.10317C13.4825 10.4821 12.4006 11.5397 11.0004 11.55H10.9898C9.6108 11.55 8.52883 10.4925 8.50762 9.13427V9.10317C8.50762 8.54329 8.74098 7.92121 9.16528 7.47538C9.58958 7.01919 10.1942 6.70815 11.011 6.69778H11.0428C12.3688 6.68741 13.4825 7.79679 13.4825 9.0928V9.10317Z"
                      fill="#FF8366"
                    />
                    <path
                      d="M22.0002 13.7584L21.6607 14.2354L19.9635 16.5993L17.6086 19.886L16.7176 19.0876L15.3811 17.8849L14.6279 17.2006L15.2962 16.4852L15.7735 15.9772L17.2798 17.3354L17.4389 17.1177L19.9635 13.6859L20.5787 12.846L21.6607 13.5407L22.0002 13.7584Z"
                      fill="#FF8366"
                    />
                    <path
                      d="M21.6606 3.93986V10.8761C21.6606 11.3427 21.2681 11.7159 20.7907 11.7159C20.3877 11.7159 20.0482 11.4463 19.9634 11.0835V3.93986C19.9634 2.68533 18.9132 1.65889 17.6297 1.65889H4.03086C2.74735 1.65889 1.6972 2.68533 1.6972 3.93986V18.704H0V3.93986C0 1.76257 1.80328 0 4.03086 0H17.6297C19.8467 0 21.6606 1.76257 21.6606 3.93986Z"
                      fill="#FF8366"
                    />
                    <path
                      d="M14.7127 14.619C14.7127 15.0855 14.3202 15.4692 13.8323 15.4692C13.6944 15.4692 13.5671 15.4381 13.461 15.3759C13.4504 15.3759 13.4398 15.3759 13.4292 15.3655C13.1534 15.3033 12.8564 15.2618 12.5381 15.2514C12.1457 15.2307 11.7532 15.2307 11.3607 15.2307C10.8303 15.2307 10.2893 15.2411 9.74837 15.2514H9.73776C9.40893 15.2514 9.0907 15.2618 8.8043 15.3136C7.80719 15.5106 7.05406 15.9254 6.51307 16.7237C6.30092 17.0451 6.19485 17.3354 6.19485 17.6879C6.32214 17.7605 6.44943 17.8331 6.54489 17.8642H6.5555C7.32985 18.1649 8.16785 18.2685 9.02706 18.2996C9.64229 18.31 10.2469 18.31 10.8622 18.31C11.5092 18.31 12.1775 18.31 12.8245 18.2893C12.8245 18.2996 12.8352 18.2996 12.8352 18.31C13.2701 18.3411 13.6095 18.6936 13.6307 19.1187V19.1498C13.6307 19.5231 13.3867 19.8341 13.0473 19.9482C12.8776 19.9585 12.7079 19.9689 12.5381 19.9689C12.3154 19.9793 12.0926 19.9793 11.8699 19.9793C11.5729 19.9793 11.2759 19.9793 10.9788 19.9689C10.65 19.9793 10.3106 19.9793 9.97112 19.9793C9.05888 19.9793 8.1042 19.9378 7.14952 19.7408C6.59793 19.6268 6.05695 19.4609 5.53718 19.2224C5.21895 19.0876 4.94316 18.9114 4.75222 18.6522C4.55068 18.393 4.46582 18.0715 4.46582 17.7605C4.46582 17.5842 4.48704 17.408 4.52947 17.2317C4.68858 16.423 5.04923 15.7387 5.55839 15.21C6.06756 14.6708 6.72522 14.2768 7.44653 13.9969C8.04056 13.7688 8.70883 13.6236 9.35589 13.6029C9.90748 13.5822 10.4697 13.5718 11.0319 13.5718C11.732 13.5718 12.4533 13.5925 13.164 13.6548C13.3867 13.6755 13.6095 13.7066 13.8323 13.7688C13.8535 13.7688 13.8641 13.7688 13.8853 13.7688C14.002 13.7792 14.1081 13.8103 14.2247 13.8517C14.3945 13.9243 14.543 14.0591 14.6172 14.2354C14.6809 14.3494 14.7127 14.4738 14.7127 14.6086V14.619Z"
                      fill="#FF8366"
                    />
                    <path
                      d="M13.0472 19.9482C12.9624 19.9793 12.8563 20 12.7608 20C12.6866 20 12.6017 20 12.5381 19.9689C12.7078 19.9689 12.8775 19.9585 13.0472 19.9482Z"
                      fill="#FF8366"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_7819_465">
                      <rect width="22" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>

            <div className={styles.transactionCard}>
              <div className={styles.transactionCardContent}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    gap: "6px",
                  }}
                >
                  <div>Block Height</div>
                  <div className={styles.transactionCardRedValue}>405,465</div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div className={styles.overviewTag}>24h</div>
                  <div className={styles.plusText}>+45,861</div>
                </div>
              </div>

              <div className={styles.transactionCardIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="22"
                  viewBox="0 0 20 22"
                  fill="none"
                >
                  <path
                    d="M1.5791 7.25192C1.5791 6.55408 1.94284 5.9067 2.53886 5.54374L8.95991 1.63348C9.59883 1.24439 10.4015 1.24439 11.0404 1.63348L17.4614 5.54374C18.0575 5.9067 18.4212 6.55408 18.4212 7.25192V15.2001C18.4212 15.9305 18.023 16.6029 17.3825 16.9539L10.9614 20.4732C10.3626 20.8014 9.63772 20.8014 9.03891 20.4732L2.61786 16.9539C1.97731 16.6029 1.5791 15.9305 1.5791 15.2001V7.25192Z"
                    stroke="#FF8366"
                    strokeWidth="2"
                    strokeLinejoin="bevel"
                  />
                  <path
                    d="M10.0002 21V11.1996L1.5791 6.78947"
                    stroke="#FF8366"
                    strokeWidth="2"
                  />
                  <path
                    d="M10 11.5263L18.4211 6.78947"
                    stroke="#FF8366"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            <div className={styles.transactionCard}>
              <div className={styles.transactionCardContent}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    gap: "6px",
                  }}
                >
                  <div>Min. Tx Fee / Max. Tx Fee</div>
                  <div
                    className={styles.minMaxFeeValue}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "end" }}>
                      <span>0</span>{" "}
                      <span className={styles.decimalText}>.0012</span>
                    </div>
                    <span>/</span>
                    <span>27,477</span>
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div className={styles.overviewTag}>Alltime</div>
                </div>
              </div>

              <div className={styles.transactionCardIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <g clipPath="url(#clip0_7819_175)">
                    <path
                      d="M14.8134 0.715454H2.71582C1.61125 0.715454 0.71582 1.61088 0.71582 2.71545V14.813C0.71582 15.9176 1.61125 16.813 2.71582 16.813H14.8134C15.918 16.813 16.8134 15.9176 16.8134 14.813V2.71545C16.8134 1.61088 15.918 0.715454 14.8134 0.715454Z"
                      stroke="#FF8366"
                      strokeWidth="1.8"
                      strokeLinejoin="bevel"
                    />
                    <path
                      d="M16.8125 5.187H19.2841C20.3887 5.187 21.2841 6.08243 21.2841 7.187V19.2846C21.2841 20.3891 20.3887 21.2846 19.2841 21.2846H7.18652C6.08195 21.2846 5.18652 20.3891 5.18652 19.2846V16.813"
                      stroke="#FF8366"
                      strokeWidth="1.8"
                      strokeLinejoin="bevel"
                    />
                    <path
                      d="M10.141 7.94369V5.63436C10.5644 5.83108 10.7253 6.19031 10.8184 6.54954L10.8777 6.78902H12.6476L12.6137 6.43835C12.5036 5.37776 11.7923 4.25731 10.141 3.98361V3H8.73524V3.9665C7.2279 4.18033 6.22017 5.22381 6.22017 6.64362C6.22017 8.18318 7.20249 8.89309 8.73524 9.38917V12.0492C8.26949 11.861 7.9477 11.4761 7.84608 10.9373L7.79527 10.6807H6L6.03387 11.0314C6.1863 12.5025 7.20249 13.4947 8.73524 13.717V15H10.141V13.717C10.9455 13.6144 11.5975 13.315 12.0548 12.8532C12.546 12.3656 12.8 11.6814 12.8 10.886C12.8 9.43193 11.9955 8.53386 10.1325 7.95225L10.141 7.94369ZM8.73524 5.55738V7.47327C8.10859 7.17391 8.04085 6.85745 8.04085 6.48967C8.04085 6.00214 8.27796 5.68567 8.73524 5.54882V5.55738ZM10.9539 11.0057C10.9539 11.4334 10.8438 11.9038 10.141 12.0919V9.85959C10.8777 10.2103 10.9539 10.5952 10.9539 11.0143V11.0057Z"
                      fill="#FF8366"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_7819_175">
                      <rect width="22" height="22" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>

            <div className={styles.transactionCard}>
              <div className={styles.transactionCardContent}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    Avg. Tx Fee
                    <div className={styles.iconInfo}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="4"
                        height="10"
                        viewBox="0 0 4 10"
                        fill="currentColor"
                      >
                        <path
                          d="M2.43159 2.48602C2.21559 2.48602 2.04359 2.42602 1.91559 2.30602C1.78759 2.17802 1.72359 2.01402 1.72359 1.81402C1.72359 1.76602 1.73159 1.69402 1.74759 1.59802C1.80359 1.33402 1.92359 1.12202 2.10759 0.962022C2.29959 0.794022 2.52759 0.710022 2.79159 0.710022C3.01559 0.710022 3.19159 0.774022 3.31959 0.902022C3.45559 1.03002 3.52359 1.19802 3.52359 1.40602C3.52359 1.70202 3.41559 1.95802 3.19959 2.17402C2.98359 2.38202 2.72759 2.48602 2.43159 2.48602ZM1.45959 9.29002C1.19559 9.29002 0.963586 9.24202 0.763586 9.14602C0.571586 9.05002 0.475586 8.89402 0.475586 8.67802C0.475586 8.61402 0.479586 8.56602 0.487586 8.53402L1.25559 4.77802C1.26359 4.75402 1.26759 4.72202 1.26759 4.68202C1.26759 4.51402 1.17559 4.43002 0.991586 4.43002C0.975586 4.43002 0.879586 4.45002 0.703586 4.49002L0.691586 4.11802L2.87559 3.43402H3.21159L2.21559 8.28202C2.20759 8.32202 2.20359 8.37802 2.20359 8.45002C2.20359 8.61002 2.28359 8.69002 2.44359 8.69002C2.51559 8.69002 2.60359 8.67802 2.70759 8.65402C2.81959 8.62202 2.89159 8.60202 2.92359 8.59402L2.85159 8.89402C2.67559 9.02202 2.45959 9.11802 2.20359 9.18202C1.95559 9.25402 1.70759 9.29002 1.45959 9.29002Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </div>
                  <div
                    className={styles.minMaxFeeValue}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "end" }}>
                      <span>0</span>{" "}
                      <span className={styles.decimalText}>.027836343</span>
                    </div>
                    {/* <!-- <span>/</span>
                    <span>27,477</span> --> */}
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div className={styles.overviewTag}>Alltime</div>
                  <span className={styles.minusText}>-0.013447771</span>
                </div>
              </div>

              <div className={styles.transactionCardIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 7.25H22"
                    stroke="#FF8366"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="bevel"
                  />
                  <path
                    d="M18.25 3.5L22 7.25L18.25 11"
                    stroke="#FF8366"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="bevel"
                  />
                  <path
                    d="M22 16.75H2"
                    stroke="#FF8366"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="bevel"
                  />
                  <path
                    d="M5.75 13L2 16.75L5.75 20.5"
                    stroke="#FF8366"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="bevel"
                  />
                </svg>
              </div>
            </div>

            <div className={styles.transactionCard}>
              <div className={styles.transactionCardContent}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    Total Payment Value
                    <div className={styles.iconInfo}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="4"
                        height="10"
                        viewBox="0 0 4 10"
                        fill="currentColor"
                      >
                        <path
                          d="M2.43159 2.48602C2.21559 2.48602 2.04359 2.42602 1.91559 2.30602C1.78759 2.17802 1.72359 2.01402 1.72359 1.81402C1.72359 1.76602 1.73159 1.69402 1.74759 1.59802C1.80359 1.33402 1.92359 1.12202 2.10759 0.962022C2.29959 0.794022 2.52759 0.710022 2.79159 0.710022C3.01559 0.710022 3.19159 0.774022 3.31959 0.902022C3.45559 1.03002 3.52359 1.19802 3.52359 1.40602C3.52359 1.70202 3.41559 1.95802 3.19959 2.17402C2.98359 2.38202 2.72759 2.48602 2.43159 2.48602ZM1.45959 9.29002C1.19559 9.29002 0.963586 9.24202 0.763586 9.14602C0.571586 9.05002 0.475586 8.89402 0.475586 8.67802C0.475586 8.61402 0.479586 8.56602 0.487586 8.53402L1.25559 4.77802C1.26359 4.75402 1.26759 4.72202 1.26759 4.68202C1.26759 4.51402 1.17559 4.43002 0.991586 4.43002C0.975586 4.43002 0.879586 4.45002 0.703586 4.49002L0.691586 4.11802L2.87559 3.43402H3.21159L2.21559 8.28202C2.20759 8.32202 2.20359 8.37802 2.20359 8.45002C2.20359 8.61002 2.28359 8.69002 2.44359 8.69002C2.51559 8.69002 2.60359 8.67802 2.70759 8.65402C2.81959 8.62202 2.89159 8.60202 2.92359 8.59402L2.85159 8.89402C2.67559 9.02202 2.45959 9.11802 2.20359 9.18202C1.95559 9.25402 1.70759 9.29002 1.45959 9.29002Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </div>
                  <div
                    className={styles.cardValue}
                    style={{ display: "flex", alignItems: "end", gap: "4px" }}
                  >
                    13,206,251,242
                    <span className={styles.tickerTag}>MINA</span>
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div className={styles.overviewTag}>24h</div>
                  <span className={styles.plusText}>+2,802,912,788.42</span>
                </div>
              </div>

              <div className={styles.transactionCardIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 7.25H22"
                    stroke="#FF8366"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="bevel"
                  />
                  <path
                    d="M18.25 3.5L22 7.25L18.25 11"
                    stroke="#FF8366"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="bevel"
                  />
                  <path
                    d="M22 16.75H2"
                    stroke="#FF8366"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="bevel"
                  />
                  <path
                    d="M5.75 13L2 16.75L5.75 20.5"
                    stroke="#FF8366"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="bevel"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className={styles.feeOverview}>
            <div className={cn(styles.feeInfoWrapper , styles.feeInfoText)}>
              <div>Avg. Tx Fee</div>
              <div className={styles.feeValueWrapper}>
                <div className={styles.feeValue}>
                  <span>0.027873014</span>
                  <span>MINA</span>
                </div>
                <div className={styles.grayFeeValue}>
                  <span>27,873,013.65</span>
                  <span>NANOMINA</span>
                </div>
              </div>
            </div>

            <div className={styles.overviewDivider}></div>

            <div className={cn(styles.feeInfoWrapper ,styles.feeInfoText)}>
              <div>Avg. Snark Fee</div>
              <div className={styles.feeValueWrapper}>
                <div className={styles.feeValue}>
                  <span>0.000881742</span>
                  <span>MINA</span>
                </div>
                <div className={styles.grayFeeValue}>
                  <span>881,741.95</span>
                  <span>NANOMINA</span>
                </div>
              </div>
            </div>

            <div className={styles.overviewDivider}></div>

            <div className={cn(styles.feeInfoWrapper , styles.feeInfoText)}>
              <div>Min. Tx Fee</div>
              <div className={styles.feeValueWrapper}>
                <div className={styles.feeValue}>
                  <span>0.001</span>
                  <span>MINA</span>
                </div>
                <div className={styles.grayFeeValue}>
                  <span>1,881,741</span>
                  <span>NANOMINA</span>
                </div>
              </div>
            </div>

            <div className={styles.overviewDivider}></div>

            <div className={cn(styles.feeInfoWrapper,styles.feeInfoText)}>
              <div>Min. Tx Fee</div>
              <div className={styles.feeValueWrapper}>
                <div className={styles.feeValue}>
                  <span>27,477</span>
                  <span>MINA</span>
                </div>
                <div className={styles.grayFeeValue}>
                  <span>24,447,000,000,000</span>
                  <span>NANOMINA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.transactionTableContainer}>
          <div className={styles.transactionTableWrapper}>
            <div className={styles.transactionTableTitle}>
              Lastest Transactions
              <div className={styles.apiBtn}>{"{ API }"}</div>
            </div>

            <div className={styles.transactionTableTabContainer}>
              <div className={styles.transactionTableTabWrapper}>
                <div
                  className={cn(styles.transactionTableTab, styles.activeTab)}
                >
                  User Transaction
                </div>
                <div className={styles.transactionTableTab}>
                  DinoDex App Transaction
                </div>
              </div>

              <span className={styles.viewAllText}>View All</span>
            </div>
            <TableTransaction
              column={columns}
              data={FAKE_DATA}
              wrapperClassName={styles.tableWrapper}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
