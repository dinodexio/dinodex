import { useRef, useState, useEffect, useCallback, useMemo } from "react";
// import { Loader } from "../ui/Loader";
import "../style.css";
import styles from "../css/table.module.css";
// import { ScrollToTopButton } from "../scrollToTopButton/scrollToTopButton";
import { SkeletonLoading } from "../detail/SkeletonLoading";

export interface TokenProps {
  data: Array<any>;
  column: Array<any>;
  onClickTr: (data: any) => void;
  classTable?: string;
  loading?: boolean;
  onScrollEnd?: () => void;
  isHeightFull?: boolean;
}

export function Table({
  data = [],
  column,
  onClickTr,
  classTable,
  loading,
  onScrollEnd,
  isHeightFull = true,
}: TokenProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  const rowHeight = 56;
  const buffer = 5;
  const [scrollTop, setScrollTop] = useState(0);
  // const [visibleItems, setVisibleItems] = useState(15);

  const handleScroll = useCallback(() => {
    if (tableRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
      setScrollTop(scrollTop);

      if (scrollTop + clientHeight >= scrollHeight - 500) {
        onScrollEnd && onScrollEnd();
      }
    }
  }, [onScrollEnd]);

  useEffect(() => {
    const currentRef = tableRef.current;
    currentRef?.addEventListener("scroll", handleScroll);
    return () => {
      currentRef?.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
  const endIndex = Math.min(
    data.length,
    Math.floor((scrollTop + 1100) / rowHeight) + buffer,
  );
  const visibleData = loading
    ? [{}, {}, {}, {}, {}, {}]
    : data.slice(startIndex, endIndex);
  const paddingTop = useMemo(() => {
    return startIndex * rowHeight;
  }, [startIndex]);
  const paddingBottom = useMemo(() => {
    return (data.length - endIndex) * rowHeight;
  }, [data, endIndex]);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollTop = scrollTop;
    }
  }, [paddingTop]);

  const renderTableHeader = () => {
    return (
      <tr className={styles["table-head-row"]}>
        {column.map((col, index) => (
          <th
            key={col.id}
            className={styles[col.key]}
            data-hide-swap={col.hideSwap || false}
            style={{ width: col.width }}
          >
            <div
              className={`text-[20px] font-[400] text-textBlack opacity-40 ${styles[`text-header-${col.key}`]}`}
            >
              {col.title}
            </div>
          </th>
        ))}
      </tr>
    );
  };

  const renderTableBody = () => {
    return visibleData.map((record, index) => (
      <tr
        key={index}
        className={styles["table-tr"]}
        onClick={() => onClickTr && onClickTr(record)}
      >
        {column.map((col) => (
          <td
            key={col.id}
            className={`${styles["table-td"]} ${styles[`table-td-${col.key}`]}`}
            data-hide-swap={col.hideSwap || false}
          >
            {loading ? (
              <SkeletonLoading loading={loading} className="h-[20px] w-[98%]" />
            ) : (
              <div>{col.render(record)}</div>
            )}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <>
      <div
        className={`${styles["table-container"]} ${styles[classTable || ""]} ${!isHeightFull ? "max-h-[600px]" : null}`}
        ref={tableRef}
        style={{ scrollbarWidth: "none", overflowY: "auto" }}
      >
        <table id="dataTable" className={styles["container-table"]}>
          <thead className={styles["table-head"]}>{renderTableHeader()}</thead>
          <tbody className={styles["table-body"]}>
            {/* <tr style={{ height: `${paddingTop}px` }} /> */}
            {/* {loading ? renderLoading() : renderTableBody()} */}
            {renderTableBody()}
            {/* <tr style={{ height: `${paddingBottom}px` }} /> */}
          </tbody>
        </table>
      </div>
      {/* {scrollTop > 50 && <ScrollToTopButton onClick={() => setScrollTop(0)}/>} */}
    </>
  );
}
