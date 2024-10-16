import { Key } from "react";
import { Loader } from "../ui/Loader";
import "../style.css";

export interface TokenProps {
  data: Array<any>;
  column: Array<any>;
  onClickTr: (data: any) => void;
  classTable?: string;
  loading: boolean;
}

export function Table({
  data,
  column,
  onClickTr,
  classTable,
  loading,
}: TokenProps) {
  const renderTableHeader = () => {
    return (
      <tr className="table-head-row">
        {column.map((col) => (
          <th
            key={col.id}
            className={col.key}
            data-hide-swap={col.hideSwap || false}
            style={{ width: col.width }}
          >
            <div className={`text-header text-header-${col.key}`}>
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
        className="table-tr"
        onClick={() => onClickTr && onClickTr(record)}
      >
        {column.map((col) => (
          <td
            key={col.id}
            className={`table-td table-td-${col.key}`}
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
          <div className="loading-container">
            <Loader w={8} h={8} />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className={`table-container ${classTable}`}>
        <table id="dataTable" className="container-table">
          <thead className="table-head">{renderTableHeader()}</thead>
          <tbody className="table-body">
            {loading ? renderLoading() : renderTableBody()}
          </tbody>
        </table>
      </div>
    </>
  );
}
