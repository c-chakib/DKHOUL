import {
  formatDate,
  generateRandomString,
  slugify,
  generateConversationId,
  calculateServiceFee,
  formatCurrency,
  getDateRange
} from '../../utils/helpers';

describe('Helper Functions', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      
      expect(formatted).toContain('January');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });

    it('should handle different date formats', () => {
      const date = new Date('2024-12-25T10:30:00Z');
      const formatted = formatDate(date);
      
      expect(typeof formatted).toBe('string');
      expect(formatted.length).toBeGreaterThan(0);
    });
  });

  describe('generateRandomString', () => {
    it('should generate string of specified length', () => {
      const str = generateRandomString(10);
      
      expect(str).toHaveLength(10);
      expect(typeof str).toBe('string');
    });

    it('should generate default 32 character string', () => {
      const str = generateRandomString();
      
      expect(str).toHaveLength(32);
    });

    it('should generate unique strings', () => {
      const str1 = generateRandomString(20);
      const str2 = generateRandomString(20);
      
      expect(str1).not.toBe(str2);
    });

    it('should contain alphanumeric characters', () => {
      const str = generateRandomString(50);
      
      expect(/^[A-Za-z0-9]+$/.test(str)).toBe(true);
    });
  });

  describe('slugify', () => {
    it('should convert text to slug', () => {
      const slug = slugify('Hello World');
      
      expect(slug).toBe('hello-world');
    });

    it('should remove special characters', () => {
      const slug = slugify('Hello! @World #Test$');
      
      expect(slug).toBe('hello-world-test');
    });

    it('should handle multiple spaces', () => {
      const slug = slugify('Hello    World    Test');
      
      expect(slug).toBe('hello-world-test');
    });

    it('should handle accented characters', () => {
      const slug = slugify('Café Résumé');
      
      expect(slug).not.toContain('é');
      expect(slug).not.toContain(' ');
    });

    it('should trim hyphens', () => {
      const slug = slugify('  Hello World  ');
      
      expect(slug).not.toMatch(/^-/);
      expect(slug).not.toMatch(/-$/);
    });

    it('should handle empty string', () => {
      const slug = slugify('');
      
      expect(slug).toBe('');
    });
  });

  describe('generateConversationId', () => {
    it('should generate consistent conversation ID', () => {
      const userId1 = '507f1f77bcf86cd799439011';
      const userId2 = '507f191e810c19729de860ea';
      
      const conv1 = generateConversationId(userId1, userId2);
      const conv2 = generateConversationId(userId2, userId1);
      
      expect(conv1).toBe(conv2);
    });

    it('should sort user IDs alphabetically', () => {
      const userA = 'aaaaaaaaaaaaaaaaaaaaaaa';
      const userZ = 'zzzzzzzzzzzzzzzzzzzzzzz';
      
      const convId = generateConversationId(userZ, userA);
      
      expect(convId.startsWith('a')).toBe(true);
    });

    it('should use underscore separator', () => {
      const userId1 = 'user1';
      const userId2 = 'user2';
      
      const convId = generateConversationId(userId1, userId2);
      
      expect(convId).toContain('_');
    });
  });

  describe('calculateServiceFee', () => {
    it('should calculate 10% fee by default', () => {
      const fee = calculateServiceFee(100);
      
      expect(fee).toBe(10);
    });

    it('should calculate custom percentage fee', () => {
      const fee = calculateServiceFee(200, 15);
      
      expect(fee).toBe(30);
    });

    it('should handle decimal amounts', () => {
      const fee = calculateServiceFee(99.99, 10);
      
      expect(fee).toBeCloseTo(9.999, 2);
    });

    it('should handle zero amount', () => {
      const fee = calculateServiceFee(0, 10);
      
      expect(fee).toBe(0);
    });

    it('should calculate correctly for large amounts', () => {
      const fee = calculateServiceFee(10000, 5);
      
      expect(fee).toBe(500);
    });
  });

  describe('formatCurrency', () => {
    it('should format with MAD by default', () => {
      const formatted = formatCurrency(100);
      
      expect(formatted).toBe('100.00 MAD');
    });

    it('should format with custom currency', () => {
      const formatted = formatCurrency(50, 'USD');
      
      expect(formatted).toBe('50.00 USD');
    });

    it('should format decimals correctly', () => {
      const formatted = formatCurrency(99.999);
      
      expect(formatted).toBe('100.00 MAD');
    });

    it('should handle zero amount', () => {
      const formatted = formatCurrency(0);
      
      expect(formatted).toBe('0.00 MAD');
    });

    it('should handle negative amounts', () => {
      const formatted = formatCurrency(-50);
      
      expect(formatted).toBe('-50.00 MAD');
    });

    it('should handle large amounts', () => {
      const formatted = formatCurrency(1000000);
      
      expect(formatted).toBe('1000000.00 MAD');
    });
  });

  describe('getDateRange', () => {
    it('should return date range for specified days', () => {
      const { startDate, endDate } = getDateRange(7);
      
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      expect(diffDays).toBe(7);
    });

    it('should return today as end date', () => {
      const { endDate } = getDateRange(30);
      const today = new Date();
      
      expect(endDate.toDateString()).toBe(today.toDateString());
    });

    it('should handle 1 day range', () => {
      const { startDate, endDate } = getDateRange(1);
      
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      expect(diffDays).toBe(1);
    });

    it('should handle 90 day range', () => {
      const { startDate, endDate } = getDateRange(90);
      
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      expect(diffDays).toBe(90);
    });

    it('should return valid Date objects', () => {
      const { startDate, endDate } = getDateRange(7);
      
      expect(startDate instanceof Date).toBe(true);
      expect(endDate instanceof Date).toBe(true);
      expect(startDate.getTime()).toBeLessThan(endDate.getTime());
    });
  });
});
