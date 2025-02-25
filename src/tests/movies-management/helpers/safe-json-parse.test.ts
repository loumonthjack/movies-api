import { safeJsonParse } from '../../../movies-management/helpers/safe-json-parse';

describe('safeJsonParse', () => {
    it('should parse valid JSON array', () => {
        const validJson = '[{"id": 1, "name": "test"}]';
        const result = safeJsonParse<{ id: number; name: string }>(validJson);
        expect(result).toEqual([{ id: 1, name: 'test' }]);
    });

    it('should return empty array for null input', () => {
        const result = safeJsonParse(null);
        expect(result).toEqual([]);
    });

    it('should return empty array for invalid JSON', () => {
        const invalidJson = '{invalid json}';
        const result = safeJsonParse(invalidJson);
        expect(result).toEqual([]);
    });

    it('should handle empty JSON array', () => {
        const emptyArray = '[]';
        const result = safeJsonParse(emptyArray);
        expect(result).toEqual([]);
    });
});
