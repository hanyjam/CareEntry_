import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import logo from '../assets/care-entry.png';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Bitte alle Felder ausfüllen');
      return;
    }
    
    setLoading(true);

      // MOCK LOGINS mit verschiedenen Rollen
if (email === 'arzt@test.de' && password === 'test123') {
  const mockArzt = {
    id: 2, 
    email: 'arzt@test.de',
    vorname: 'Dr.',
    nachname: 'Müller',
    role: 'arzt'
  };

  const mockToken = createMockJWT(mockArzt);

  login(mockArzt, mockToken);
  navigate('/dashboard');
  setLoading(false);
  return;
}

if (email === 'patient@test.de' && password === 'test123') {
  const mockPatient = {
    id: 1,  
    email: 'patient@test.de',
    vorname: 'Anna',
    nachname: 'Schmidt',
    role: 'patient'
  };

  const mockToken = createMockJWT(mockPatient);

  login(mockPatient, mockToken);
  navigate('/dashboard');
  setLoading(false);
  return;
}

function createMockJWT(user) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24h gültig
  };
  
  // Base64-Encode (wie echter JWT, aber nicht signiert)
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  
  return `${encodedHeader}.${encodedPayload}.mock-signature`;
}

  try {
    const response = await authService.login(email, password);
    login(response.user, response.token);
    navigate('/dashboard');
  } catch (err) {
    setError(err.message || 'Login fehlgeschlagen. Test-Logins: arzt@test.de oder patient@test.de (beide: test123)');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <img 
          src={logo} 
          alt="CareEntry Logo" 
          className="h-12 mx-auto mb-6"
        />
        <p className="text-gray-600 text-center mb-6">
          Anmeldung für Patienten und Praxis
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-Mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="ihre.email@beispiel.de"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Passwort
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Wird angemeldet...' : 'Anmelden'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
            Passwort vergessen?
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;