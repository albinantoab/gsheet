import { put, select, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";


import { EVALUATE_CELL, REDO_ACTION, UNDO_ACTION, UPDATE_CELL_VALUE } from "../ReduxTypes";
import { getCell, getRedoStack, getUndoStack } from "../selectors/sheetSelectors";
import { 
    evaluateCell,
    removeLastRedoItem,
    removeLastUndoItem,
    replaceCell,
    updateCellValue,
} from "../actions/sheetActions";

function* notifySubscribers(action: PayloadAction<{ id: string, value: string }>): Generator<any, void, any> {
    try {
        const cellID = action.payload.id;

        const cell = yield select(getCell(cellID));

        const subscribers = cell.subscribers;
        if(!subscribers) return;

        for (const subscriber of subscribers) {
            const cid = subscriber.toUpperCase();
            // don evaluate if cool id is coming as number
            // this happen if user do c1+10
            if(isNaN(Number(cid)) && cid !== cellID) {
                yield put(evaluateCell(cid));
            }
        }
    } catch (error) {
        console.error("Error notifying subscribers", error);
    }
}

function* undoAction(): Generator<any, void, any> {
    try {
        const undoStack = yield select(getUndoStack);
        if (undoStack.length === 0) return;
        
        const lastItem = undoStack[undoStack.length - 1];
        yield put(removeLastUndoItem());
        yield put(replaceCell(lastItem));

    } catch (error) {
        console.error("Error undoing action", error);
    }
}

function* redoAction(): Generator<any, void, any> {
    try {
        const redoStack = yield select(getRedoStack);
        if (redoStack.length === 0) return;
        
        const lastItem = redoStack[redoStack.length - 1];
        yield put(removeLastRedoItem());
        yield put(replaceCell(lastItem));

    } catch (error) {
        console.error("Error redoing action", error);
    }
}

function* sheetSaga() {
    yield takeEvery(UPDATE_CELL_VALUE, notifySubscribers);
    yield takeEvery(EVALUATE_CELL, notifySubscribers); // trigger subscribers notification for evaluate cell
    yield takeEvery(UNDO_ACTION, undoAction);
    yield takeEvery(REDO_ACTION, redoAction);
}

export default sheetSaga;