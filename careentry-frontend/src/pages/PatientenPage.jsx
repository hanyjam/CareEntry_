import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { mockPatienten } from '../utils/mockData';
import { useAuth } from '../contexts/AuthContext';
import { patientenService } from '../services/api';

function PatientenPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [patienten, setPatienten] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatienten = async () => {
      try {
        setLoading(true);
        const data = await patientenService.getAll();
        
        console.log('Backend Response:', data);
        
        // Backend gibt { success: true, data: [...], total: 3 } zurück
        const rawData = data?.data || data || [];
        
        // Transformiere Backend-Daten zu Frontend-Format
        const patientenArray = rawData.map(p => ({
          id: p.id,
          vorname: p.firstName || 'Unbekannt',
          nachname: p.lastName || '',
          geburtsdatum: p.dateOfBirth || p.birthDate || '2000-01-01',
          geschlecht: p.gender || 'unbekannt',
          telefon: p.phone || p.phoneNumber || 'Keine Angabe',
          email: p.email || 'Keine Angabe',
          status: p.status || 'aktiv',
          letzterBesuch: p.lastVisit || p.lastAppointment || new Date().toISOString().split('T')[0],
          vorerkrankungen: p.preExistingConditions || p.medicalHistory || '',
          allergien: p.allergies || '',
          medikamente: p.currentMedication || p.medications || ''
        }));
        
        console.log('Transformed Data:', patientenArray);
        
        setPatienten(patientenArray);
        setError(null);
      } catch (err) {
        console.error('Fehler beim Laden der Patienten:', err);
        setError('Backend nicht erreichbar');
        setPatienten(mockPatienten);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'arzt') {
      fetchPatienten();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (user?.role !== 'arzt') {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Sie haben keine Berechtigung, diese Seite zu sehen.</p>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  const filteredPatienten = patienten.filter(patient =>
    `${patient.vorname} ${patient.nachname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Patienten
        </h1>
        <p className="text-gray-600">
          Übersicht aller Patienten
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            ⚠️ {error} - Es werden Mock-Daten angezeigt.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Patient suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-3 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Geburtsdatum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kontakt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Letzter Besuch
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatienten.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium">
                        {patient.vorname[0]}{patient.nachname[0]}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {patient.vorname} {patient.nachname}
                      </div>
                      <div className="text-sm text-gray-500">
                        {patient.geschlecht}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(patient.geburtsdatum).toLocaleDateString('de-DE')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date().getFullYear() - new Date(patient.geburtsdatum).getFullYear()} Jahre
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.telefon}</div>
                  <div className="text-sm text-gray-500">{patient.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(patient.letzterBesuch).toLocaleDateString('de-DE')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    patient.status === 'aktiv'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => navigate(`/patienten/${patient.id}`)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    Ansehen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPatienten.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Keine Patienten gefunden</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default PatientenPage;