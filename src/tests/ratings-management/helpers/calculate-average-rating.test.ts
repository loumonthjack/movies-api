import { calculateAverageRating } from '../../../ratings-management/helpers/calculate-average-rating';

describe('calculateAverageRating', () => {
  it('should return 0% for empty ratings array', () => {
    const result = calculateAverageRating([]);
    expect(result).toBe('0%');
  });

  it('should calculate correct percentage for single rating', () => {
    const ratings = [{ rating: 5 }];
    const result = calculateAverageRating(ratings);
    expect(result).toBe('100%');
  });

  it('should calculate correct percentage for multiple ratings', () => {
    const ratings = [
      { rating: 3 },
      { rating: 4 },
      { rating: 5 }
    ];
    const result = calculateAverageRating(ratings);
    expect(result).toBe('80%');
  });

  it('should handle low ratings correctly', () => {
    const ratings = [
      { rating: 1 },
      { rating: 2 }
    ];
    const result = calculateAverageRating(ratings);
    expect(result).toBe('30%');
  });
});
