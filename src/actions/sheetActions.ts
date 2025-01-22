import { UndoRedoStack } from "../reducers/sheetReducer";
import { ADD_COLUMN, ADD_ROW, EVALUATE_CELL, INITIALIZE_CELLS, REDO_ACTION, REMOVE_LAST_REDO_ITEM, REMOVE_LAST_UNDO_ITEM, REPLACE_CELL, SET_UNSET_CURRENT_CELL, UNDO_ACTION, UPDATE_CELL_FORMAT, UPDATE_CELL_VALUE } from "../ReduxTypes";

export const initializeCells = (rows: number, columns: number) => ({
    type: INITIALIZE_CELLS,
    payload: { rows, columns },
});

export const updateCellValue = (id: string, value: string) => ({
    type: UPDATE_CELL_VALUE,
    payload: { id, value },
});

export const evaluateCell = (id: string) => ({
    type: EVALUATE_CELL,
    payload: { id },
});

export const addRow = () => ({
    type: ADD_ROW,
});

export const addColumn = () => ({
    type: ADD_COLUMN,
});

export const updateCellBold = ( isBold: boolean) => ({
    type: UPDATE_CELL_FORMAT,
    payload: { isBold },
});

export const updateCellItalic = (isItalic: boolean) => ({
    type: UPDATE_CELL_FORMAT,
    payload: { isItalic },
});

export const updateCellUnderline = (isUnderline: boolean) => ({
    type: UPDATE_CELL_FORMAT,
    payload: { isUnderline },
});

export const setUnsetCurrentCell = (id?: string) => ({
    type: SET_UNSET_CURRENT_CELL,
    payload: { id },
});

export const undoAction = () => ({
    type: UNDO_ACTION,
});

export const redoAction = () => ({
    type: REDO_ACTION,
});

export const removeLastUndoItem = () => ({
    type: REMOVE_LAST_UNDO_ITEM,
});

export const removeLastRedoItem = () => ({
    type: REMOVE_LAST_REDO_ITEM,
});

export const replaceCell = (cell: UndoRedoStack) => ({
    type: REPLACE_CELL,
    payload: { cell },
});
