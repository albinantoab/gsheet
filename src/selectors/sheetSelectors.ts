import { RootState } from "../store/store";
import { createSelector } from "reselect";

export const getCells = (state: RootState) => state.sheet.cells;

export const getCell = (id: string) => (state: RootState) => state.sheet.cells[id];

export const getRows = (state: RootState) => state.sheet.rows;
export const getColumns = (state: RootState) => state.sheet.columns;


export const getCurrentCell = (state: RootState) => state.sheet.currentCell;

export const getUndoStack = (state: RootState) => state.sheet.undoStack;

export const getRedoStack = (state: RootState) => state.sheet.redoStack;