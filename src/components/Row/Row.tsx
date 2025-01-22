import React from "react";
import { Cell } from "../Cell";
import styles from "./styles.module.css";
import { getCellID, getColumnLetter } from "../../utils";

interface RowProps {
  rowId: number;
  columns: number;
  isHeader?: boolean;
}

const Row: React.FC<RowProps> = ({ rowId, columns, isHeader = false }) => {
  return (
    <div className={styles.Row} data-row-id={rowId}>
      <Cell cellId={`${rowId}`} isHeader={true} />
      {
        isHeader && (
          Array.from({ length: columns }, (_, index) => (
            <Cell key={index} cellId={getColumnLetter(index)} isHeader={true} />
          ))
        )
      }
      {!isHeader && Array.from({ length: columns }, (_, index) => (
        <Cell
          key={index}
          cellId={getCellID(rowId, index)}
        />
      ))}
    </div>
  );
};

export { Row };
