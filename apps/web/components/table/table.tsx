import { Key, useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Loader } from "../ui/Loader";
import "../style.css";
import styles from "../css/table.module.css";
import { ScrollToTopButton } from "../scrollToTopButton/scrollToTopButton";
import { SkeletonLoading } from "../detail/SkeletonLoading";

export interface TokenProps {
  data: Array<any>;
  column: Array<any>;
  onClickTr: (data: any) => void;
  classTable?: string;
  loading?: boolean;
  onScrollEnd?: () => void; // Thêm prop để xử lý sự kiện cuộn
}

export function Table({
  data = [],
  column,
  onClickTr,
  classTable,
  loading,
  onScrollEnd,
}: TokenProps) {
  const tableRef = useRef<HTMLDivElement>(null); // Tạo ref cho phần tử chứa bảng
  const rowHeight = 56; // Chiều cao mỗi hàng
  const buffer = 5; // Số hàng thêm để render
  const [scrollTop, setScrollTop] = useState(0);
  const [visibleItems, setVisibleItems] = useState(15); // Số lượng item hiển thị

  const handleScroll = useCallback(() => {
    if (tableRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
      setScrollTop(scrollTop);

      // Kiểm tra nếu người dùng cuộn gần đến đáy
      if (scrollTop + clientHeight >= scrollHeight - 500) {
        onScrollEnd && onScrollEnd(); // Gọi hàm khi cuộn đến đáy
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
  const endIndex = Math.min(data.length, Math.floor((scrollTop + 500) / rowHeight) + buffer);
  const visibleData = loading ? [{},{},{},{},{},{}] : data.slice(startIndex, endIndex);
  const paddingTop = useMemo(() => {
    return startIndex * rowHeight
  }, [startIndex])
  const paddingBottom = useMemo(() => {
    return (data.length - endIndex) * rowHeight
  }, [data, endIndex])

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
            <div className={`text-[20px] font-[400] text-textBlack opacity-40 ${styles[`text-header-${col.key}`]}`}>
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
            {loading ? <SkeletonLoading loading={loading} className="w-[98%] h-[20px]" /> : <div>{col.render(record)}</div>}
          </td>
        ))}
      </tr>
    ));
  };

  // Custom render loading

  return (
    <>
      <div className={`${styles["table-container"]} ${styles[classTable || '']}`} ref={tableRef}>
        <table id="dataTable" className={styles["container-table"]}>
          <thead className={styles["table-head"]}>{renderTableHeader()}</thead>
          <tbody className={styles["table-body"]}>
            <tr style={{ height: `${paddingTop}px` }} />
            {/* {loading ? renderLoading() : renderTableBody()} */}
            {renderTableBody()}
            <tr style={{ height: `${paddingBottom}px` }} />
          </tbody>
        </table>
      </div>
      {/* {scrollTop > 50 && <ScrollToTopButton onClick={() => setScrollTop(0)}/>} */}
    </>
  );
}