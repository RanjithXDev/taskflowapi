import { errorHandler } from '../src/middleware/errorhandler';
import { AppError } from '../src/utils/AppError';

describe('Error Handler Unit Tests', () => {

  it('should preserve custom error status code', () => {
    const error = new AppError('Custom error', 400);

    const req: any = {};
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    errorHandler(error, req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 500 for unknown errors', () => {
    const error = new Error('Unknown error');

    const req: any = {};
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    errorHandler(error, req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
  });

});