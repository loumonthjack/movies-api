export const calculateAverageRating = (ratings: { rating: number }[]) => {
  if (!ratings.length) return '0%';
  const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
  const average = sum / ratings.length;
  return `${((average / 5) * 100).toFixed(0)}%`;
};
