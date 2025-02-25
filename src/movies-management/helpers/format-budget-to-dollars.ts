export const formatBudgetToDollars = (budget: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(budget);
  };
