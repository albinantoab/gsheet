import React, { useEffect } from "react";
import { FixedSizeGrid } from "react-window";
import { useDispatch, useSelector } from "react-redux";
import { Toolbar } from "../Toolbar";
import styles from "./styles.module.css";
import { initializeCells } from "../../actions/sheetActions";
import { getRows, getColumns } from "../../selectors/sheetSelectors";
import { useUndoRedo } from "../../hooks";
import { Cell } from "../Cell";
import { getCellID, getColumnLetter } from "../../utils";

const Canvas = () => {
  const dispatch = useDispatch();
  const rows = useSelector(getRows);
  const columns = useSelector(getColumns);

  useUndoRedo();

  useEffect(() => {
    dispatch(initializeCells(rows, columns));
  }, [dispatch, rows, columns]);

  const cellWidth = 80;
  const cellHeight = 20;
  const VirtualGrid = FixedSizeGrid as any;

  return (
    <div className={styles.Canvas}>
      <Toolbar />
      <VirtualGrid
        columnCount={columns + 1}
        columnWidth={cellWidth}
        rowCount={rows + 1}
        rowHeight={cellHeight}
        height={window.innerHeight - 16 - 48} // 16px is browser body margin, 48px is toolbar height
        width={window.innerWidth - 16} // 16px is browser body margin
      >
        {({ rowIndex, columnIndex, style }: { rowIndex: number; columnIndex: number; style: React.CSSProperties }) => {
          const isHeader = rowIndex === 0 || columnIndex === 0;
          const cellId =
            rowIndex === 0
              ? getColumnLetter(columnIndex - 1)
              : columnIndex === 0
                ? rowIndex.toString()
                : getCellID(rowIndex, columnIndex - 1);

          return (
            <div style={style}>
              <Cell cellId={cellId} isHeader={isHeader} />
            </div>
          );
        }}
      </VirtualGrid>
    </div>
  );
};

export { Canvas };
