import { OPERATIONS_REGEX } from "../constants";

export const extractDependencies = (formula: string): string[] => {
  const withoutEquals = formula.startsWith('=') ? formula.slice(1) : formula;
  
  return withoutEquals.split(OPERATIONS_REGEX).map(cell => cell.trim()).filter(Boolean);
};
