/**
 * @jest-environment node
 */
import { withErrorHandler } from '@/lib/utils/api-handler';

describe('withErrorHandler', () => {
  it('returns a function', () => {
    const handler = withErrorHandler(() => ({ foo: 'bar' }));
    expect(typeof handler).toBe('function');
  });

  it('returns 200 with JSON data on success', async () => {
    const handler = withErrorHandler(() => ({ foo: 'bar' }));
    const response = handler();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ foo: 'bar' });
  });

  it('returns 500 with error message when handler throws', async () => {
    const handler = withErrorHandler(() => {
      throw new Error('Something broke');
    });
    const response = handler();
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Internal server error');
  });

  it('does not leak error details in response', async () => {
    const handler = withErrorHandler(() => {
      throw new Error('secret database credentials');
    });
    const response = handler();
    const data = await response.json();
    expect(JSON.stringify(data)).not.toContain('secret');
    expect(JSON.stringify(data)).not.toContain('database');
  });

  it('handles non-Error throws', async () => {
    const handler = withErrorHandler(() => {
      throw 'string error';
    });
    const response = handler();
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Internal server error');
  });
});
