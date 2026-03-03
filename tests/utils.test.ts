import { formatUptime } from '../src/utils/calculateUptime';

describe('Utility Function Tests', () => {

  it('should format seconds correctly', () => {
    expect(formatUptime(30)).toBe('30s');
    expect(formatUptime(120)).toBe('2m');
    expect(formatUptime(7200)).toBe('2h');
  });

});