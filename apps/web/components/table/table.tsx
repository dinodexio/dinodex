import { Key, useRef } from "react";
import { Loader } from "../ui/Loader";
import "../style.css";
import styles from "../css/table.module.css";
export interface TokenProps {
  data: Array<any>;
  column: Array<any>;
  onClickTr: (data: any) => void;
  classTable?: string;
  loading?: boolean;
}

export function Table({
  data = [],
  column,
  onClickTr,
  classTable,
  loading,
}: TokenProps) {
  const tableRef = useRef<HTMLDivElement>(null); // Tạo ref cho phần tử chứa bảng

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tableRef.current) return; // Kiểm tra nếu ref không tồn tại
    const startX = e.pageX - tableRef.current.offsetLeft;
    const scrollLeft = tableRef.current.scrollLeft;

    const handleMouseMove = (e: MouseEvent) => {
      if (!tableRef.current) return;
      const x = e.pageX - tableRef.current.offsetLeft;
      const walk = (x - startX) * 2; // scroll-fast
      tableRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      tableRef.current?.removeEventListener("mousemove", handleMouseMove);
      tableRef.current?.removeEventListener("mouseup", handleMouseUp);
    };

    tableRef.current.addEventListener("mousemove", handleMouseMove);
    tableRef.current.addEventListener("mouseup", handleMouseUp);
  };
  const renderTableHeader = () => {
    return (
      <tr className={styles["table-head-row"]}>
        {column.map((col,index) => (
          <th
            key={col.id}
            className={styles[col.key]}
            data-hide-swap={col.hideSwap || false}
            style={{ width: col.width, borderBottomLeftRadius: index === 0 && (!data || data.length < 1) ? "12px" : "0px", borderBottomRightRadius: index === column.length - 1 && (!data || data.length < 1) ? "12px" : "0px" }}
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
    return data.map((record, index) => (
      <tr
        key={index}
        className={styles["table-tr"]}
        onClick={() => onClickTr && onClickTr(record)}
      >
        {column.map((col) => (
          <td
            key={col.id}
            className={`${styles["table-td"]}} ${styles[`table-td-${col.key}`]}`}
            data-hide-swap={col.hideSwap || false}
          >
            <div>{col.render(record)}</div>
          </td>
        ))}
      </tr>
    ));
  };

  // Custom render loading
  const renderLoading = () => {
    return (
      <tr>
        <td colSpan={column.length}>
          <div className={styles["loading-container"]}>
            <Loader w={8} h={8} />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className={`${styles["table-container"]} ${styles[classTable || '']}`} onMouseDown={handleMouseDown} ref={tableRef}>
        <table id="dataTable" className={styles["container-table"]}>
          <thead className={styles["table-head"]}>{renderTableHeader()}</thead>
          <tbody className={styles["table-body"]}>
            {loading ? renderLoading() : renderTableBody()}
          </tbody>
        </table>
      </div>
    </>
  );
}