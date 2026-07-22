import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authService, patientenService } from '../api';

// eslint-disable-next-line no-undef
global.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('authService', () => {
    it('calls login endpoint with correct data', async () => {
      const mockResponse = { 
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
            + 'eyJqdGkiOiIxIiwidXNlcm5hbWUiOiJ0ZXN0QHRlc3QuZGUiLCJmaXJzdE5hbWUiOiJUZXN0IiwibGFzdE5hbWUiOiJVc2VyIiwicm9sZXMiOltdLCJwZXJzb24iOjEsImlzUGF0aWVudCI6dHJ1ZX0.'
            + 'signature'
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await authService.login('test@test.de', 'password');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'test@test.de', password: 'password' }),
        })
      );
      
      expect(result.token).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
            + 'eyJqdGkiOiIxIiwidXNlcm5hbWUiOiJ0ZXN0QHRlc3QuZGUiLCJmaXJzdE5hbWUiOiJUZXN0IiwibGFzdE5hbWUiOiJVc2VyIiwicm9sZXMiOltdLCJwZXJzb24iOjEsImlzUGF0aWVudCI6dHJ1ZX0.'
            + 'signature');
    });

    it('throws error on failed login', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid credentials' }),
      });

      await expect(authService.login('wrong@test.de', 'wrong')).rejects.toThrow();
    });
  });

  describe('patientenService', () => {
    it('fetches all patients', async () => {
      const mockPatients = [
        { id: 1, vorname: 'Anna', nachname: 'Schmidt' },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPatients,
      });

      const result = await patientenService.getAll();
      
      expect(result).toEqual(mockPatients);
    });
  });
});