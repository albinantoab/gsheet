export const getColumnLetter = (column: number): string => {
    let result = '';

    while (column >= 0) {
        result = String.fromCharCode((column % 26) + 65) + result;
        column = Math.floor(column / 26) - 1;
    }
    
    return result;
};
