import { OPERATIONS_REGEX_WITH_OPERATORS } from "../constants";
import { CellState } from "../reducers/sheetReducer";

export const evaluateFormula = (formula: string, cells: {[key: string]: CellState}) => {
    const _formula = formula.startsWith('=') ? formula.slice(1) : formula;

    if(!_formula) return null;

    const splitFormula = _formula.match(OPERATIONS_REGEX_WITH_OPERATORS);

    if(!splitFormula) return null;

    const values = splitFormula.map(cell => {
        let _cell = cell.toUpperCase();

        if(cells[_cell]) {
            return cells[_cell].value;
        }
        return cell;
    });

    const expression = values.join("");
    
    try {
        //for safety, we use Function to evaluate the expression
        const result = Function(`"use strict"; return (${expression})`)();
        return result;
    } catch (error) {
        return null;
    }
}
