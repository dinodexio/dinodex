import { useRef } from "react";
import styles from "../css/tableTransaction.module.css";

export type ValueCellType = string | number | boolean | Record<string, any>;
export type DataTableType = Record<string, ValueCellType>;

export interface Column {
  title: string;
  dataIndex?: string;
  headerClass?: string;
  width?: number;
  hasInfo?: boolean;
  render?: (data: ValueCellType, record: DataTableType) => React.ReactNode;
}

export interface TableTransactionProps {
  column: Column[];
  data: DataTableType[];
  wrapperClassName?: string;
  tableClassName?: string;
  rowClassName?: string;
  bodyRowClassname?: string
}

export function TableTransaction({
  column,
  data,
  wrapperClassName,
  tableClassName,
  rowClassName,
  bodyRowClassname  
}: TableTransactionProps) {
  
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.pageX - tableWrapperRef.current!.offsetLeft;
    const scrollLeft = tableWrapperRef.current!.scrollLeft;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.pageX - tableWrapperRef.current!.offsetLeft;
      const walk = (x - startX) * 2;
      tableWrapperRef.current!.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div 
      className={wrapperClassName ? wrapperClassName : styles.tableWrapper} 
      ref={tableWrapperRef} 
      onMouseDown={handleMouseDown}
    >
      <table id="dataTable" className={tableClassName ? tableClassName : styles.containerTable}>
        <thead className={styles.tableHead}>
          <tr className={rowClassName ? rowClassName : styles.tableHeadRow}>
            {column.map((col, index) => (
              <th key={index} style={{ width: col.width }}>
                <div
                  className={`${styles.headerCell} ${col.headerClass || ""}`}
                >
                  {col.hasInfo && (
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
                  )}
                  {col.title}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {data.map((record, rowIndex) => (
            <tr key={rowIndex} className={bodyRowClassname ? bodyRowClassname : styles.tableRow}>
              {column.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.render
                    ? col.render(record[col.dataIndex || ""], record)
                    : <>{record[col.dataIndex || ""]}</>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
