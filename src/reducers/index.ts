import {combineReducers} from 'redux';
import sheetReducer from './sheetReducer';

const rootReducer = combineReducers({
    sheet: sheetReducer,
});

export default rootReducer;