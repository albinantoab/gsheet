import { 
    DEFAULT_COLUMNS,
    DEFAULT_ROWS,
    MAX_COLUMNS,
    MAX_ROWS
} from "../constants";
import { 
    ADD_COLUMN,
    ADD_ROW,
    EVALUATE_CELL,
    INITIALIZE_CELLS,
    REDO_ACTION,
    REMOVE_LAST_REDO_ITEM,
    REMOVE_LAST_UNDO_ITEM,
    REPLACE_CELL,
    SET_UNSET_CURRENT_CELL,
    UNDO_ACTION,
    UPDATE_CELL_FORMAT,
    UPDATE_CELL_VALUE
} from "../ReduxTypes";
import { evaluateFormula } from "../utils/evaluateFormula";
import { extractDependencies } from "../utils/extractDependencies";
import { getCellID } from "../utils/getCellID";

export interface CellState {
    value: string;
    formula: string;
    subscribers: string[];
    isBold?: boolean;
    isItalic?: boolean;
    isUnderline?: boolean;
}

export interface Cells {
    [id: string]: CellState;
}

export type UndoRedoStack = {
    [id: string]: Partial<CellState>;
}

export interface SpreadsheetState {
    cells: Cells;
    rows: number;
    columns: number;
    currentCell: string;
    undoStack: UndoRedoStack[];
    redoStack: UndoRedoStack[];
}

const initialState: SpreadsheetState = {
    cells: {},
    rows: DEFAULT_ROWS,
    columns: DEFAULT_COLUMNS,
    currentCell: '',
    undoStack: [],
    redoStack: [],
};

export default function sheetReducer(state: SpreadsheetState = initialState, action: any) {
    switch (action.type) {
        case INITIALIZE_CELLS: {
            const { rows, columns } = action.payload;
            const newCells: { [key: string]: CellState } = {};

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    const id = getCellID(i + 1, j);
                    if (!state.cells[id]) {
                        newCells[id] = {
                            value: '',
                            formula: '',
                            subscribers: [],
                            isBold: false,
                            isItalic: false,
                            isUnderline: false,
                        };
                    }
                }
            }

            return {
                ...state,
                cells: { ...state.cells, ...newCells }
            };
        }
        case UPDATE_CELL_VALUE: {
            const { id, value } = action.payload;

            const updateFormula = value.startsWith("=") ? value : "";

            const dependencies = updateFormula ? extractDependencies(updateFormula) : undefined;

            const cellsToUpdate = { ...state.cells };

            // update the subscribers of the cells that depend on this cell
            if (dependencies) {
                dependencies.forEach(dependency => {
                    const cid = dependency.toUpperCase();

                    if (cellsToUpdate[cid] && !cellsToUpdate[cid].subscribers.includes(id)) {
                        cellsToUpdate[cid] = {
                            ...cellsToUpdate[cid],
                            subscribers: [
                                ...cellsToUpdate[cid].subscribers,
                                id,
                            ]
                        };
                    }
                });
            }

            cellsToUpdate[id] = {
                ...cellsToUpdate[id],
                value,
                formula: updateFormula,
            };

            return {
                ...state,
                cells: cellsToUpdate,
                undoStack: [...state.undoStack, { [id]: {
                    value: state.cells[id].value,
                    formula: state.cells[id].formula,
                } }]
            };
        }
        case EVALUATE_CELL: {
            const { id: cellId } = action.payload;
            const evalFormula = state.cells[cellId]?.formula;

            if (!evalFormula) return {
                ...state,
                // undoStack: [...state.undoStack, { [cellId]: state.cells[cellId] }]
            };

            const evaluatedCells = { ...state.cells };
            const evaluatedValue = evaluateFormula(evalFormula, evaluatedCells);
            const newValue = evaluatedValue ? evaluatedValue.toString() : evaluatedCells[cellId].value;

            if(newValue === state.cells[cellId].value) return state;

            evaluatedCells[cellId] = {
                ...evaluatedCells[cellId],
                value: newValue
            };

            return {
                ...state,
                cells: evaluatedCells,
            };
        }
        case ADD_ROW: {
            return {
                ...state,
                rows: Math.min(state.rows + 1, MAX_ROWS)
            };
        }
        case ADD_COLUMN: {
            return {
                ...state,
                columns: Math.min(state.columns + 1, MAX_COLUMNS)
            };
        }
        case UPDATE_CELL_FORMAT: {
            //push current cell to undo stack
            const currentCell = state.cells[state.currentCell];

            return {
                ...state,
                cells: {
                    ...state.cells,
                    [state.currentCell]: {
                        ...state.cells[state.currentCell],
                        ...action.payload
                    }
                },
                undoStack: [...state.undoStack, { [state.currentCell]: {
                    isBold: currentCell.isBold,
                    isItalic: currentCell.isItalic,
                    isUnderline: currentCell.isUnderline,
                } }]
            };
        }
        case SET_UNSET_CURRENT_CELL: {
            const { id } = action.payload;
            return {
                ...state,
                currentCell: id ? id : ""
            };
        }
        case REMOVE_LAST_UNDO_ITEM: {
            const undoStack = [...state.undoStack];
            const lastItem = undoStack.pop();

            if(!lastItem) return state;

            const cellID = Object.keys(lastItem)[0];

            return {
                ...state,
                undoStack,
                redoStack: [...state.redoStack, { [cellID]: {
                    ...state.cells[cellID],
                } }]
            };
        }
        case REMOVE_LAST_REDO_ITEM: {
            const redoStack = [...state.redoStack];
            const lastItem = redoStack.pop();

            if(!lastItem) return state;

            const cellID = Object.keys(lastItem)[0];

            return {
                ...state,
                redoStack,
                undoStack: [...state.undoStack, { [cellID]: {
                    ...state.cells[cellID],
                } }]
            };
        }
        case REPLACE_CELL: {
            const cellID = Object.keys(action.payload.cell)[0];
            const cell = action.payload.cell[cellID];

            return {
                ...state,
                cells: {
                    ...state.cells,
                    [cellID]: { 
                        ...state.cells[cellID],
                        ...cell
                    } 
                }
            };
        }

        default:
            return state;
    }
}