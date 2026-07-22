import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import LoginPage from '../LoginPage';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper function to render with all providers
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('LoginPage', () => {
  it('renders login form', () => {
    renderWithProviders(<LoginPage />);
    
    expect(screen.getByText(/anmeldung für patienten und praxis/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /anmelden/i })).toBeInTheDocument();
  });

  it('renders email and password fields', () => {
    renderWithProviders(<LoginPage />);
    
    // Suche nach dem Label-Element (nicht nur Text)
    const emailLabel = screen.getByText('E-Mail');
    expect(emailLabel).toBeInTheDocument();
    
    // Suche nach Password-Input direkt
    const passwordInput = document.querySelector('input[type="password"]');
    expect(passwordInput).toBeInTheDocument();
  });

  it('renders forgot password link', () => {
    renderWithProviders(<LoginPage />);
    
    // Suche nach dem kompletten Link-Text
    expect(screen.getByText('Passwort vergessen?')).toBeInTheDocument();
  });
});