import { errorHandler } from '../src/middleware/errorhandler';
import { AppError } from '../src/utils/AppError';

describe('Error Handler', () => {
  it('should preserve custom error status', () => {
    const error = new AppError('Custom error', 400);

    const req: any = {};
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 500 for unknown error', () => {
    const error = new Error('Unknown');

    const req: any = {};
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});