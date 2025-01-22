import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import clsx from "clsx";

import styles from "./styles.module.css";

import { setUnsetCurrentCell, updateCellValue } from "../../actions/sheetActions";
import { evaluateCell } from "../../actions/sheetActions";
import { getCell, getCurrentCell, getColumns } from "../../selectors/sheetSelectors";
import { getCellID } from "../../utils";

interface CellProps {
  cellId: string;
  isHeader?: boolean;
}

const Cell: React.FC<CellProps> = ({ cellId, isHeader = false }) => {
  const dispatch = useDispatch();
  const divRef = useRef<HTMLDivElement>(null);

  const cell = useSelector(getCell(cellId));
  const currentCell = useSelector(getCurrentCell);
  const columns = useSelector(getColumns);
  const { value = '', formula = '', isBold = false, isItalic = false, isUnderline = false } = cell || {};

  const [localValue, setLocalValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (currentCell === cellId && !isHeader) {
      setIsEditing(true);
      // Focus the input after a short delay to ensure the DOM has updated
      setTimeout(() => {
        divRef.current?.focus();
        divRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 0);
    }
  }, [currentCell, cellId, isHeader]);

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

  // ISSUE: when virtualized columns is in focus, tabbing will not work until user scrolls there
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();

      const [col, row] = cellId.match(/([A-Z]+)(\d+)/)?.slice(1) || [];

      if (col && row) {
        const colIndex = col.split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0);

        let nextColIndex = colIndex + 1;
        let nextRowIndex = parseInt(row);
        if (nextColIndex > columns) {
          nextColIndex = 1;
          nextRowIndex += 1;
        }

        if (nextColIndex <= columns) {
          const nextCellId = getCellID(nextRowIndex, nextColIndex - 1);
          dispatch(setUnsetCurrentCell(nextCellId));
        }
      }
    }
  };

  return (
    <div
      className={clsx(
        styles.Cell,
        isHeader && styles.HeaderCell,
        isBold && styles.bold,
        isItalic && styles.italic,
        isUnderline && styles.underline,
        (currentCell && cellId === currentCell) && styles.selected
      )}
      data-cell-id={cellId}
      onClick={handleClick}
      ref={divRef}
      onKeyDown={handleKeyDown}
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
