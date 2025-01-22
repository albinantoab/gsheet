import { getColumnLetter } from "./getColumnLetter";

export const getCellID = (row: number, column: number): string => {
    return `${getColumnLetter(column)}${row}`;
};