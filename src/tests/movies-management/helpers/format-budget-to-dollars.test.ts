import { formatBudgetToDollars } from '../../../movies-management/helpers/format-budget-to-dollars';

describe('formatBudgetToDollars', () => {
  it('should format whole numbers correctly', () => {
    expect(formatBudgetToDollars(1000)).toBe('$1,000.00');
    expect(formatBudgetToDollars(1_000_000)).toBe('$1,000,000.00');
  });

  it('should format decimal numbers correctly', () => {
    expect(formatBudgetToDollars(1000.50)).toBe('$1,000.50');
    expect(formatBudgetToDollars(1.99)).toBe('$1.99');
  });

  it('should handle zero correctly', () => {
    expect(formatBudgetToDollars(0)).toBe('$0.00');
  });

  it('should handle negative numbers correctly', () => {
    expect(formatBudgetToDollars(-1000)).toBe('-$1,000.00');
    expect(formatBudgetToDollars(-1000.50)).toBe('-$1,000.50');
  });
});
