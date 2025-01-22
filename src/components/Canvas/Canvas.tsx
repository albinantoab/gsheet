import React, { useEffect } from "react";
import { Row } from "../Row";
import styles from "./styles.module.css";
import { initializeCells } from "../../actions/sheetActions";
import { useDispatch, useSelector } from "react-redux";
import { Toolbar } from "../Toolbar";
import { getRows, getColumns } from "../../selectors/sheetSelectors";
import { useUndoRedo } from "../../hooks";

const Canvas = () => {
  const dispatch = useDispatch();
  const rows = useSelector(getRows);
  const columns = useSelector(getColumns);

  useUndoRedo();

  useEffect(() => {
    dispatch(initializeCells(rows, columns));
  }, [dispatch, rows, columns]);

  return (
    <div className={styles.Canvas}>
      <Toolbar />
      <div className={styles.Table}>
        {/* render header rows */}
        <Row rowId={0} columns={columns} isHeader={true} />
        {Array.from({ length: rows }, (_, index) => (
          <Row
            key={index}
            rowId={index + 1}
            columns={columns}
          />
        ))}
      </div>
    </div>
  );
};

export { Canvas };
