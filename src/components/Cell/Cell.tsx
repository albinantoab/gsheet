import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import clsx from "clsx";

import styles from "./styles.module.css";

import { setUnsetCurrentCell, updateCellValue } from "../../actions/sheetActions";
import { evaluateCell } from "../../actions/sheetActions";
import { getCell, getCurrentCell } from "../../selectors/sheetSelectors";

interface CellProps {
  cellId: string;
  isHeader?: boolean;
}

const Cell: React.FC<CellProps> = ({ cellId, isHeader = false }) => {
  const dispatch = useDispatch();

  const cell = useSelector(getCell(cellId));
  const currentCell = useSelector(getCurrentCell);
  const { value = '', formula = '', isBold = false, isItalic = false, isUnderline = false } = cell || {};

  const [localValue, setLocalValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    dispatch(updateCellValue(cellId, newValue));
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (formula) {
      dispatch(evaluateCell(cellId));
      setLocalValue(value);
    }
  }

  const handleFocus = () => {
    dispatch(setUnsetCurrentCell(cellId));
    if (formula) {
      setLocalValue(formula);
    }
  }

  const handleClick = () => {
    if (!isHeader) {
      setIsEditing(true);
    }
  }

  return (
    <div
      className={clsx(
        styles.Cell,
        isHeader && styles.HeaderCell,
        isBold && styles.bold,
        isItalic && styles.italic,
        isUnderline && styles.underline,
        Number(cellId) > 0 && cellId === currentCell && styles.selected
      )}
      data-cell-id={cellId}
      onClick={handleClick}
    >
      {
        isEditing ? (
          <input
            type="text"
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            autoFocus
          />
        ) : (
          <span>{isHeader ? cellId : value}</span>
        )
      }
    </div>
  );
};

export { Cell };
