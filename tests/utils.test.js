"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculateUptime_1 = require("../src/utils/calculateUptime");
describe('Utility Function Tests', () => {
    it('should format seconds correctly', () => {
        expect((0, calculateUptime_1.formatUptime)(30)).toBe('30s');
        expect((0, calculateUptime_1.formatUptime)(120)).toBe('2m');
        expect((0, calculateUptime_1.formatUptime)(7200)).toBe('2h');
    });
});
