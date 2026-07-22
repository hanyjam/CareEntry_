import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

function DashboardPage() {
  const { user, isArzt } = useAuth();

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Willkommen, {user?.vorname}!
        </h1>
        <p className="text-gray-600">
          {isArzt() ? 'Ihre Praxis-Übersicht' : 'Ihre persönliche Übersicht'}
        </p>
      </div>

      {/* Arzt Dashboard */}
      {isArzt() && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Offene Anamnesen
            </h3>
            <p className="text-4xl font-bold text-primary-600">12</p>
            <Link 
              to="/patienten" 
              className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block"
            >
              Alle anzeigen →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Heutige Termine
            </h3>
            <p className="text-4xl font-bold text-primary-600">5</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Aktive Patienten
            </h3>
            <p className="text-4xl font-bold text-primary-600">247</p>
            <Link 
              to="/patienten" 
              className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block"
            >
              Übersicht →
            </Link>
          </div>
        </div>
      )}

      {/* Patienten Dashboard */}
      {!isArzt() && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Anamnese ausfüllen
            </h3>
            <p className="text-gray-600 mb-4">
              Füllen Sie Ihre Anamnese aus, um Ihren Arzt optimal vorzubereiten.
            </p>
            <Link
              to="/anamnese"
              className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Jetzt ausfüllen
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ihre Laborwerte
            </h3>
            <p className="text-gray-600 mb-4">
              Sehen Sie Ihre aktuellen Laborwerte und deren Verlauf.
            </p>
            <Link
              to="/laborwerte"
              className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Werte ansehen
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Nachrichten
            </h3>
            <p className="text-gray-600 mb-4">
              2 ungelesene Nachrichten von Ihrem Arzt.
            </p>
            <Link
              to="/nachrichten"
              className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Nachrichten lesen
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Nächster Termin
            </h3>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Datum:</span> 15.01.2025, 10:00 Uhr
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Arzt:</span> Dr. Müller
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default DashboardPage;