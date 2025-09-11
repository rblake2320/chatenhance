// Sample test file for chatenhance
// This demonstrates the testing setup and provides examples

describe('Utility Functions', () => {
  describe('String helpers', () => {
    test('should capitalize first letter', () => {
      const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
      
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
      expect(capitalize('')).toBe('');
    });

    test('should format user display name', () => {
      const formatDisplayName = (firstName: string, lastName: string) => {
        if (!firstName && !lastName) {
          return 'Anonymous User';
        }
        if (!lastName) {
          return firstName;
        }
        return `${firstName} ${lastName}`;
      };

      expect(formatDisplayName('John', 'Doe')).toBe('John Doe');
      expect(formatDisplayName('John', '')).toBe('John');
      expect(formatDisplayName('', '')).toBe('Anonymous User');
    });
  });

  describe('Array helpers', () => {
    test('should remove duplicates from array', () => {
      const removeDuplicates = <T>(arr: T[]): T[] => Array.from(new Set(arr));
      
      expect(removeDuplicates([1, 2, 2, 3, 3, 4])).toEqual([1, 2, 3, 4]);
      expect(removeDuplicates(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
      expect(removeDuplicates([])).toEqual([]);
    });

    test('should chunk array into smaller arrays', () => {
      const chunk = <T>(arr: T[], size: number): T[][] => {
        const chunks: T[][] = [];
        for (let i = 0; i < arr.length; i += size) {
          chunks.push(arr.slice(i, i + size));
        }
        return chunks;
      };

      expect(chunk([1, 2, 3, 4, 5, 6], 2)).toEqual([[1, 2], [3, 4], [5, 6]]);
      expect(chunk([1, 2, 3, 4, 5], 3)).toEqual([[1, 2, 3], [4, 5]]);
      expect(chunk([], 2)).toEqual([]);
    });
  });

  describe('Async helpers', () => {
    test('should handle async operations', async () => {
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
      const start = Date.now();
      await delay(100);
      const end = Date.now();
      
      expect(end - start).toBeGreaterThanOrEqual(90); // Allow for some timing variance
    });

    test('should handle promise rejection', async () => {
      const failingFunction = async () => {
        throw new Error('Test error');
      };

      await expect(failingFunction()).rejects.toThrow('Test error');
    });
  });

  describe('Mock examples', () => {
    test('should mock external dependencies', () => {
      const mockApiCall = jest.fn().mockResolvedValue({ data: 'test' });
      
      expect(mockApiCall).not.toHaveBeenCalled();
      
      return mockApiCall().then((result: any) => {
        expect(mockApiCall).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ data: 'test' });
      });
    });

    test('should use test utilities', () => {
      const mockUser = global.testUtils.createMockUser();
      const mockRequest = global.testUtils.createMockRequest({ 
        body: { name: 'Test' }, 
      });
      const mockResponse = global.testUtils.createMockResponse();

      expect(mockUser.email).toBe('test@example.com');
      expect(mockRequest.body.name).toBe('Test');
      expect(typeof mockResponse.json).toBe('function');
    });
  });
});
