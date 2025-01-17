import { LeaderboardData } from "@/types";
import styleLeaderboard from "./leaderboard.module.css";
import { useEffect, useMemo, useState } from "react";
import { SkeletonLoading } from "@/components/detail/SkeletonLoading";
import { DATALEADER } from "@/constants";
import { useLeaderBoard } from "@/lib/stores/aggregator";
import { formatNumber } from "@/lib/utils";
export interface LeaderboardProps {}
export function Leaderboard({}: LeaderboardProps) {
  const [filter, setFilter] = useState<"pnl" | "total_vol">("total_vol");

  const { data, loading, getLeaderBoard } = useLeaderBoard();

  const dataLeaderBoard = useMemo(() => {
    if (loading) {
      return DATALEADER;
    } else {
      return data.map((item, index) => {
        return {
          ...item,
          index: index + 1,
        };
      });
    }
  }, [data, loading, filter]);

  let columnTableLeaderBoard = [
    {
      id: 1,
      title: "Wallet Address",
      key: "wallet-address",
      width: 250,
      render: (data: LeaderboardData) => {
        let changeRank = data.preRank
          ? Number(data.rank) - Number(data.preRank)
          : 0;
        return (
          <div className={styleLeaderboard["wallet-content"]}>
            {filter === "pnl" ? (
              <>
                {data.index === 1 || data.index === 2 || data.index === 3 ? (
                  <img
                    src={
                      data.index === 1
                        ? "/images/campaign/rank-1.svg"
                        : data.index === 2
                          ? "/images/campaign/rank-2.svg"
                          : "/images/campaign/rank-3.svg"
                    }
                    className={styleLeaderboard[`rank-${data.index}-img`]}
                  />
                ) : (
                  <span className={styleLeaderboard["rank-user"]}>
                    {data.index}
                  </span>
                )}
              </>
            ) : (
              <>
                {data.rank === 1 || data.rank === 2 || data.rank === 3 ? (
                  <img
                    src={
                      data.rank === 1
                        ? "/images/campaign/rank-1.svg"
                        : data.rank === 2
                          ? "/images/campaign/rank-2.svg"
                          : "/images/campaign/rank-3.svg"
                    }
                    className={styleLeaderboard[`rank-${data.rank}-img`]}
                  />
                ) : (
                  <span className={styleLeaderboard["rank-user"]}>
                    {data.rank}
                  </span>
                )}
              </>
            )}
            <div className={styleLeaderboard["change-rank"]}>
              <img
                src={
                  changeRank > 0
                    ? "/images/campaign/sort-down.svg"
                    : "/images/campaign/sort-up.svg"
                }
                alt="change-rank"
              />
              <span
                className={`${styleLeaderboard["change-rank"]} ${styleLeaderboard["poppins-semibold-italic"]} ${styleLeaderboard[(changeRank ?? 0) > 0 ? "red-text" : "green-text"]}`}
              >
                {(changeRank ?? 0) < 0
                  ? `+${changeRank.toString().slice(1)}`
                  : (changeRank ?? 0) > 0
                    ? `-${changeRank}`
                    : 0}
              </span>
            </div>
            <span className={styleLeaderboard["address-wallet"]}>
              {data.walletAddress.slice(0, 6)}...{data.walletAddress.slice(-6)}
            </span>
          </div>
        );
      },
    },
    {
      id: 2,
      title: "Total Volume",
      key: "total-volume",
      width: 135,
      render: (data: LeaderboardData) => {
        const totalVolumeChange =
          Math.round(Number(data.totalVolumeChange) * 100) / 100;
        return (
          <div
            className={`${styleLeaderboard["total-vol"]} ${styleLeaderboard["pnl"]}`}
          >
            <span className={styleLeaderboard["text-total-vol"]}>
              {formatNumber(data.totalVolume)}
            </span>
            {/* <span
              className={`${styleLeaderboard["change-vol"]} ${styleLeaderboard[totalVolumeChange < 0 ? "red-text" : "green-text"]}`}
            >
              {totalVolumeChange < 0
                ? totalVolumeChange
                : `+${totalVolumeChange}`}
              %
            </span> */}
          </div>
        );
      },
    },
    {
      id: 3,
      title: "PnL",
      key: "pnl",
      width: 135,
      render: (data: LeaderboardData) => {
        const pnlChange = Math.round(Number(data.pnlChange) * 100) / 100;
        return (
          <div
            className={`${styleLeaderboard["total-vol"]} ${styleLeaderboard["pnl"]}`}
          >
            <span className={styleLeaderboard["text-total-vol"]}>
              {formatNumber(data.pnl || 0)}
            </span>
            <span
              className={`${styleLeaderboard["change-vol"]} ${styleLeaderboard[pnlChange < 0 ? "red-text" : "green-text"]}`}
            >
              {pnlChange < 0 ? pnlChange : `+${pnlChange}`}%
            </span>
          </div>
        );
      },
    },
  ];

  const renderTableHeader = () => {
    return (
      <tr className={styleLeaderboard["table-head-rowsss"]}>
        {columnTableLeaderBoard.map((col, index) => (
          <th
            key={col.id}
            className={styleLeaderboard[col.key]}
            style={{ minWidth: col.width }}
          >
            {col.title}
          </th>
        ))}
      </tr>
    );
  };

  const renderTableBody = () => {
    return dataLeaderBoard.map((record, index) => (
      <tr key={index} className={styleLeaderboard["table-tr"]}>
        {columnTableLeaderBoard.map((col) => (
          <td
            key={col.id}
            className={`${styleLeaderboard["table-td"]} ${styleLeaderboard[`table-td-${col.key}`]}`}
          >
            {loading ? (
              <SkeletonLoading
                loading={loading}
                className={`ml-[8px] h-[30px] w-[95%]`}
              />
            ) : (
              <div>{col.render(record)}</div>
            )}
          </td>
        ))}
      </tr>
    ));
  };

  const filterLeaderBoard: { value: "total_vol" | "pnl"; label: string }[] = [
    {
      value: "total_vol",
      label: "Top Volume",
    },
    {
      value: "pnl",
      label: "Top PnL",
    },
  ];

  useEffect(() => {
    getLeaderBoard(filter);
  }, [filter]);

  return (
    <div className={styleLeaderboard["leader-board-content-campaign"]}>
      <div className={styleLeaderboard["header-leader-board"]}>
        <span className={styleLeaderboard["title-leader-board"]}>
          LeaderBoard
        </span>
        <div className={styleLeaderboard["filter-leader-board"]}>
          {filterLeaderBoard?.map((item, index) => (
            <div
              key={index}
              className={`${styleLeaderboard["item-filter-leader-board"]} 
                         ${item.value === filter ? styleLeaderboard["active-item-filter-leader-board"] : ""}`}
              onClick={() => {
                if (item.value !== filter) {
                  setFilter(item.value);
                }
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
      <div className={styleLeaderboard["table-container"]} id="tableWrapper">
        <table id="dataTable" className={styleLeaderboard["container-table"]}>
          <thead className={styleLeaderboard["table-head"]}>
            {renderTableHeader()}
          </thead>
          <tbody className={styleLeaderboard["table-body"]}>
            {renderTableBody()}
          </tbody>
        </table>
      </div>
    </div>
  );
}
