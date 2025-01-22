import React from "react";
import styles from "./styles.module.css";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";

import {
    addColumn,
    updateCellBold,
    updateCellItalic,
    updateCellUnderline
} from "../../actions/sheetActions";
import { addRow } from "../../actions/sheetActions";
import { getCurrentCell } from "../../selectors/sheetSelectors";
import { getCell } from "../../selectors/sheetSelectors";

const Toolbar = () => {
    const dispatch = useDispatch();
    const currentCell = useSelector(getCurrentCell);
    const cell = useSelector(getCell(currentCell));
    const { isBold = false, isItalic = false, isUnderline = false } = cell || {};

    const handleAddRow = () => {
        dispatch(addRow());
    };

    const handleAddColumn = () => {
        dispatch(addColumn());
    };

    const handleBold = () => {
        dispatch(updateCellBold(!isBold));
    };

    const handleItalic = () => {
        dispatch(updateCellItalic(!isItalic));
    };

    const handleUnderline = () => {
        dispatch(updateCellUnderline(!isUnderline));
    };

    return (
        <div className={styles.Toolbar}>
            <div className={clsx(styles.Pill, isBold && styles.Active)} onClick={handleBold}>
                B
            </div>
            <div className={clsx(styles.Pill, isItalic && styles.Active)} onClick={handleItalic}>
                I
            </div>
            <div className={clsx(styles.Pill, isUnderline && styles.Active)} onClick={handleUnderline}>U</div>

            <div className={styles.Pill} onClick={handleAddRow}>Add row</div>
            <div className={styles.Pill} onClick={handleAddColumn}>Add column</div>
        </div>
    );
};

export { Toolbar };
