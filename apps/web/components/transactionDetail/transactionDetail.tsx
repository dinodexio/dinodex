import { cn } from "@/lib/utils";
import styles from "../css/transactionDetail.module.css";
import { TableTransactionDetail } from "./tableTransactionDetail";
import HeaderV2 from "../headerv2";
import { Footer } from "../footerv2";

export function TransactionDetail() {
  return (
    <div className={styles.containerFluid}>
      <HeaderV2 />
      <div className={styles.detailBody}>
        <div className={styles.transactionDetail}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div className={styles.tranSactionDetailTitle}>
              <span className={styles.transactionText}>Transaction</span>
              <span className={styles.transactionDetailText}>
                Transaction Details
              </span>
            </div>

            <div className={styles.apiBtn}>{`{ API }`}</div>
          </div>

          <div className={styles.detailTagWrapper}>
            <div className={`${styles.detailTag} ${styles.activeTag}`}>
              <span>Overview</span>
            </div>

            <div className={styles.detailTag}>
              <span>Transfer</span>
            </div>

            <div className={styles.detailTag}>
              <span>Balance Change</span>
            </div>
          </div>

          <div className={styles.detailSummaryWrapper}>
            <div className={styles.statusIconWrapper}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="41"
                viewBox="0 0 40 41"
                fill="none"
              >
                <circle cx="20" cy="20.375" r="20" fill="#70C270" />
                <path
                  d="M10 23.875L16.1294 30.375L30 12.375"
                  stroke="#FAFAFA"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={styles.detailSummaryContent}>
              <div className={styles.detailSummary}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div className={styles.iconWrapper}>
                    <img
                      src="/images/transactionDetail/Mina.png"
                      alt=""
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                  <span className={styles.summaryAmount}>0.039968985 MINA</span>
                </div>

                <div className={styles.summaryUsdAmount}>0.034217928 USD</div>
                <div
                  className={`${styles.summaryStatus} ${styles.applyStatus}`}
                >
                  Applied
                </div>
              </div>
            </div>
          </div>

          <div
            className={cn(styles.transactionInfo, styles.transactionInfoText)}
          >
            <div className={styles.transactionInfoItem}>
              <div>Transaction Type</div>
              <div className={styles.paymentTag}>Payment</div>
            </div>

            <div className={styles.transactionInfoItem}>
              <div>Transaction Hash</div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <div className={styles.arrowIconWrapper}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="9"
                    viewBox="0 0 10 11"
                    fill="none"
                  >
                    <path
                      d="M4.53353 10.1L5.40816 9.22239L2.37123 6.14094H10V4.85905H2.37123L5.40816 1.78252L4.53353 0.899994L0 5.49999L4.53353 10.1Z"
                      fill="#FAFAFA"
                    />
                  </svg>
                </div>

                <div
                  className={styles.arrowIconWrapper}
                  style={{ transform: "rotate(180deg)" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="9"
                    viewBox="0 0 10 11"
                    fill="none"
                  >
                    <path
                      d="M4.53353 10.1L5.40816 9.22239L2.37123 6.14094H10V4.85905H2.37123L5.40816 1.78252L4.53353 0.899994L0 5.49999L4.53353 10.1Z"
                      fill="#FAFAFA"
                    />
                  </svg>
                </div>
                <div
                  className={styles.transactionAddressWrapper}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span
                    className={styles.transactionAddress}
                    style={{ color: "var(--s-text)" }}
                  >
                    5JuhbbTAAUDFwX8spXq9••MFLvDtQnx
                  </span>

                  <span
                    className={styles.copyIcon}
                    style={{ cursor: "pointer" }}
                  >
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
            </div>

            <div className={styles.transactionInfoItem}>
              <div>Bash</div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ color: "var(--primary-red-c)" }}>408,904</span>
              </div>
            </div>

            <div className={styles.transactionInfoItem}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span> Confirmations </span>
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
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div className={styles.spinner}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="11.2"
                      stroke="#E6E4E3"
                      strokeWidth="1.6"
                    />
                    <mask id="path-2-inside-1_153_2509" fill="white">
                      <path d="M18 22.3923C16.3925 23.3204 14.5917 23.8629 12.7391 23.9772C10.8864 24.0915 9.03256 23.7745 7.32318 23.0511C5.61381 22.3277 4.09555 21.2176 2.88779 19.8082C1.68003 18.3987 0.815702 16.7283 0.362763 14.9283C-0.0901768 13.1282 -0.119375 11.2477 0.277463 9.43443C0.674301 7.62121 1.48636 5.92476 2.64978 4.47848C3.8132 3.0322 5.29626 1.87552 6.98235 1.09939C8.66844 0.323271 10.5116 -0.0511375 12.3669 0.00560935L12.3302 1.20505C10.6604 1.15398 9.0016 1.49094 7.48412 2.18946C5.96663 2.88797 4.63188 3.92898 3.5848 5.23063C2.53772 6.53228 1.80687 8.05909 1.44972 9.69099C1.09256 11.3229 1.11884 13.0154 1.52649 14.6354C1.93413 16.2555 2.71203 17.7588 3.79901 19.0274C4.886 20.2959 6.25243 21.295 7.79087 21.946C9.3293 22.5971 10.9978 22.8824 12.6652 22.7795C14.3325 22.6766 15.9533 22.1883 17.4 21.3531L18 22.3923Z" />
                    </mask>
                    <path
                      d="M18 22.3923C16.3925 23.3204 14.5917 23.8629 12.7391 23.9772C10.8864 24.0915 9.03256 23.7745 7.32318 23.0511C5.61381 22.3277 4.09555 21.2176 2.88779 19.8082C1.68003 18.3987 0.815702 16.7283 0.362763 14.9283C-0.0901768 13.1282 -0.119375 11.2477 0.277463 9.43443C0.674301 7.62121 1.48636 5.92476 2.64978 4.47848C3.8132 3.0322 5.29626 1.87552 6.98235 1.09939C8.66844 0.323271 10.5116 -0.0511375 12.3669 0.00560935L12.3302 1.20505C10.6604 1.15398 9.0016 1.49094 7.48412 2.18946C5.96663 2.88797 4.63188 3.92898 3.5848 5.23063C2.53772 6.53228 1.80687 8.05909 1.44972 9.69099C1.09256 11.3229 1.11884 13.0154 1.52649 14.6354C1.93413 16.2555 2.71203 17.7588 3.79901 19.0274C4.886 20.2959 6.25243 21.295 7.79087 21.946C9.3293 22.5971 10.9978 22.8824 12.6652 22.7795C14.3325 22.6766 15.9533 22.1883 17.4 21.3531L18 22.3923Z"
                      stroke="#FF603B"
                      strokeWidth="2"
                      mask="url(#path-2-inside-1_153_2509)"
                    />
                  </svg>
                </div>

                <span style={{ color: "var(--p-text)" }}>7 blocks after</span>
              </div>
            </div>

            <div className={styles.transactionInfoItem}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span> Created </span>
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
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <span style={{ color: "var(--text-dark)" }}>
                  30.11.2024 UTC 09:15
                </span>

                <span className={styles.blockTimeText}>51 m ago</span>
              </div>
            </div>

            <div className={styles.transactionInfoItem}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span> Nonce </span>
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
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <span className={styles.pText}>236776</span>
              </div>
            </div>

            <div className={styles.transactionInfoItem}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span> Block State Hash </span>
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
                className={styles.transactionAddressWrapper}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  className={styles.transactionAddress}
                  style={{ color: "var(--primary-red-c)" }}
                >
                  5JuhbbTAAUDFwX8spXq9••MFLvDtQnx
                </span>
                <span className={styles.copyIcon} style={{ cursor: "pointer" }}>
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
          </div>
        </div>

        <div className={styles.tranferDetail}>
          <div style={{ color: "var(--p-text)", fontSize: "24px" }}>
            Transfer
          </div>

          <div className={styles.tranferContent}>
            <div className={styles.tranferContentWrapper}>
              <div className={styles.labelWrapper}>
                <div className={styles.labelIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="22"
                    viewBox="0 0 20 22"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_7898_474)">
                      <path
                        d="M12.1361 11.3025C12.5361 11.3392 12.9179 11.4125 13.2815 11.5042L12.6724 12.1367C12.2724 12.5675 12.0542 13.145 12.0724 13.7408C12.0906 14.0617 12.1724 14.3733 12.3179 14.6575H10.9452C9.75424 14.6575 8.77242 15.6475 8.77242 16.8575V17.985C8.77242 19.0575 9.54515 19.965 10.5542 20.1483H10.3088C9.88152 20.1483 9.45424 20.1483 9.03606 20.1392C8.54515 20.1483 8.05424 20.1575 7.56333 20.1575C6.26333 20.1575 4.93606 20.0933 3.61788 19.7908C2.85424 19.635 2.0997 19.3875 1.37243 19.0575C0.945153 18.865 0.599698 18.6175 0.363335 18.2875C0.11788 17.9575 0.00878906 17.5542 0.00878906 17.1417C0.00878906 16.9033 0.0451527 16.665 0.0996982 16.4083C0.31788 15.2533 0.81788 14.2908 1.4997 13.53C2.1997 12.7692 3.08152 12.21 4.09061 11.8067C4.91788 11.4858 5.82697 11.2567 6.74515 11.2292C7.53606 11.2017 8.31788 11.1833 9.12697 11.1833C10.1179 11.1833 11.1361 11.2108 12.1361 11.3025Z"
                        fill="#1E2024"
                      />
                      <path
                        d="M9.00886 10.1842H9.02704C11.7998 10.1842 14.0816 7.92917 14.0816 5.12417V5.09667C14.0543 3.50167 13.3998 2.21833 12.4725 1.3475C11.5361 0.4675 10.3361 0 9.18159 0H9.06341C6.29977 0 4.06341 2.24583 4.03613 5.05083V5.10583C4.03613 7.865 6.28159 10.1567 9.01795 10.1842H9.00886Z"
                        fill="#1E2024"
                      />
                      <path
                        d="M15.0268 12.8425L14.2541 13.6583L17.7268 16.8575H10.9541V17.9758H17.7268L14.2541 21.1842L15.0268 22L19.9996 17.4167L15.0268 12.8425Z"
                        fill="#FF4C23"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_7898_474">
                        <rect width="20" height="22" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                Sender
              </div>

              <div className={styles.tranferDetailInfo}>
                <div className={styles.tranferSenderAddress}>
                  <div className={styles.tranferSenderAvtName}>
                    <div className={styles.tranferSenderAvt}>
                      <img
                        src="/images/transactionDetail/candies.png"
                        style={{
                          width: "100%",
                          height: "100",
                          borderRadius: "28px",
                        }}
                        alt="candies"
                      />
                    </div>

                    <span className={styles.tranferSenderName}>DexHeim</span>
                  </div>

                  <div
                    className={styles.transactionAddressWrapper}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      className={styles.transactionAddress}
                      style={{ color: "var(--primary-red-c)" }}
                    >
                      5JuhbbTAAUDFwX8spXq9••MFLvDtQnx
                    </span>

                    <span
                      className={styles.copyIcon}
                      style={{ cursor: "pointer" }}
                    >
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

                <div className={styles.tranferSenderMemo}>
                  <span style={{ color: "var(--s-text)" }}>Memo:</span>
                  <span style={{ color: "var(--p-text)" }}>
                    ukr svin, oink oink
                  </span>
                </div>

                <div className={styles.tranferSenderFee}>
                  <span>Fee: 0.07003</span>
                  <div className={styles.tranferSenderFeeIcon}>
                    <img
                      src="/images/transactionDetail/Mina.png"
                      alt="mina"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "18px",
                      }}
                    />
                  </div>
                  MINA
                  <span style={{ fontWeight: "500", color: "var(--s-text)" }}>
                    0.06 USD
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.tranferContentWrapper}>
              <div className={styles.labelWrapper}>
                <div className={styles.labelIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="22"
                    viewBox="0 0 20 22"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_7898_95)">
                      <path
                        d="M20.0001 17.215C20.0001 17.5633 19.9092 17.9025 19.7456 18.1867C19.5819 18.4708 19.3547 18.7 19.091 18.8833C18.2638 19.4608 17.3365 19.6992 16.4547 19.8733C15.0729 20.1667 13.6729 20.2217 12.3092 20.2217C11.891 20.2217 11.4729 20.2217 11.0456 20.2125C10.5729 20.2217 10.0819 20.2308 9.60012 20.2308C9.4274 20.2308 9.26376 20.2308 9.09103 20.2217L10.3638 19.03C10.8092 18.6083 11.0638 18.0217 11.0638 17.3892C11.0638 16.7567 10.8092 16.1792 10.3638 15.7575L6.17285 11.8342C6.97285 11.5225 7.88194 11.2933 8.76376 11.2658C9.53649 11.2383 10.3274 11.22 11.1092 11.22C12.1001 11.22 13.091 11.2475 14.091 11.3392C16.3092 11.5592 18.1819 12.705 19.3365 14.7675C19.7274 15.4642 19.9365 16.2342 19.9819 17.0225V17.1967L20.0001 17.215Z"
                        fill="#1E2024"
                      />
                      <path
                        d="M11.0276 10.23H11.0457C13.7821 10.23 16.0276 7.96583 16.0366 5.15167V5.12417C16.0094 3.52 15.3639 2.2275 14.4457 1.35667C13.5185 0.476667 12.3366 0 11.1912 0H11.073C8.34574 0 6.14574 2.255 6.10938 5.07833V5.13333C6.10938 7.91083 8.32756 10.2025 11.0276 10.23Z"
                        fill="#1E2024"
                      />
                      <path
                        d="M4.01818 12.7967L3.26364 13.6217L6.69091 16.8392H0V17.9667H6.69091L3.26364 21.175L4.01818 22L8.92727 17.3983L4.01818 12.7967Z"
                        fill="#FF4C23"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_7898_95">
                        <rect width="20" height="22" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                Recipient
              </div>

              <div
                className={cn(
                  styles.tranferDetailInfo,
                  styles.tranferReciInfo,
                  styles.transactionAddressWrapper,
                )}
              >
                <span
                  className={styles.transactionAddress}
                  style={{ color: "var(--primary-red-c)" }}
                >
                  5JuhbbTAAUDFwX8spXq9••MFLvDtQnx
                </span>
                <span className={styles.copyIcon} style={{ cursor: "pointer" }}>
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
          </div>

          <div className={styles.transferBalance}>
            <div>Balance Change</div>

            <TableTransactionDetail />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
