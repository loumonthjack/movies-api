export const safeJsonParse = <T>(data: string | null): T[] => {
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
};
