import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LabValueChart from '../components/LabValueChart';
import { mockPatienten, mockLaborwerteVerlauf } from '../utils/mockData';
import { useAuth } from '../contexts/AuthContext';
import { measurementsService } from '../services/api';

function LabValuesPage() {
  const { user } = useAuth();
  const isArzt = user?.role === 'arzt';

  const [selectedPatientId, setSelectedPatientId] = useState(isArzt ? mockPatienten[0]?.id : user?.id || 1);
  const [selectedCategory, setSelectedCategory] = useState('blutzucker');
  const [laborwerte, setLaborwerte] = useState(mockLaborwerteVerlauf);
  const [loading, setLoading] = useState(false);

  const categories = {
    blutzucker: 'Blutzucker',
    cholesterin: 'Cholesterin',
    blutdruck_systolisch: 'Blutdruck (systolisch)'
  };

  // Finde den aktuell ausgewählten Patienten
  const selectedPatient = mockPatienten.find(p => p.id === selectedPatientId);

  useEffect(() => {
    const fetchLaborwerte = async () => {
      if (!selectedPatientId) return;

      try {
        setLoading(true);
        const data = await measurementsService.getByUserId(selectedPatientId);
        
        // Gruppiere Daten nach Typ (wie mockLaborwerteVerlauf)
        const grouped = {
          blutzucker: data.filter(m => m.typ === 'blutzucker'),
          cholesterin: data.filter(m => m.typ === 'cholesterin'),
          blutdruck_systolisch: data.filter(m => m.typ === 'blutdruck_systolisch')
        };
        
        setLaborwerte(grouped);
      } catch (error) {
        console.error('Fehler beim Laden der Laborwerte:', error);
        // Fallback zu Mock-Daten
        setLaborwerte(mockLaborwerteVerlauf);
      } finally {
        setLoading(false);
      }
    };

    fetchLaborwerte();
  }, [selectedPatientId]);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Laborwerte
        </h1>
        <p className="text-gray-600">
          Verlauf der Messwerte über die letzten Monate
        </p>
      </div>

      {/* Patienten-Auswahl (nur für Ärzte) */}
      {isArzt && (
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Patient auswählen
          </label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(parseInt(e.target.value))}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {mockPatienten.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.vorname} {patient.nachname} ({new Date(patient.geburtsdatum).toLocaleDateString('de-DE')})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Patient Info Card */}
      {selectedPatient && (
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedPatient.vorname} {selectedPatient.nachname}
              </h2>
              <p className="text-gray-600 mt-1">
                {new Date().getFullYear() - new Date(selectedPatient.geburtsdatum).getFullYear()} Jahre • {selectedPatient.geschlecht}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Letzter Besuch</p>
              <p className="text-lg font-medium text-gray-900">
                {new Date(selectedPatient.letzterBesuch).toLocaleDateString('de-DE')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Kategorie-Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          {Object.entries(categories).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedCategory === key
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Chart */}
          <div className="mb-6">
            <LabValueChart
              data={laborwerte[selectedCategory]}
              title={`Verlauf: ${categories[selectedCategory]}`}
              yAxisLabel={laborwerte[selectedCategory][0]?.einheit || ''}
            />
          </div>

          {/* Statistiken */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-500 mb-1">Aktueller Wert</p>
              <p className="text-3xl font-bold text-primary-600">
                {laborwerte[selectedCategory][laborwerte[selectedCategory].length - 1]?.wert || 0}
                <span className="text-lg ml-2 text-gray-600">
                  {laborwerte[selectedCategory][0]?.einheit || ''}
                </span>
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-500 mb-1">Durchschnitt (3 Monate)</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round(
                  laborwerte[selectedCategory].reduce((sum, item) => sum + item.wert, 0) / 
                  laborwerte[selectedCategory].length
                )}
                <span className="text-lg ml-2 text-gray-600">
                  {laborwerte[selectedCategory][0]?.einheit || ''}
                </span>
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-500 mb-1">Trend</p>
              <div className="flex items-center">
                {laborwerte[selectedCategory][0]?.wert > 
                 laborwerte[selectedCategory][laborwerte[selectedCategory].length - 1]?.wert ? (
                  <>
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-2xl font-bold text-green-600 ml-2">Sinkend</span>
                  </>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-2xl font-bold text-red-600 ml-2">Steigend</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tabelle */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Alle Messwerte</h3>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Datum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Wert
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Normalbereich
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {laborwerte[selectedCategory].map((wert, index) => {
                  const isNormal = selectedCategory === 'cholesterin' 
                    ? wert.wert < 200 
                    : wert.wert >= 70 && wert.wert <= 100;
                  
                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(wert.datum).toLocaleDateString('de-DE')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {wert.wert} {wert.einheit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {wert.normalbereich} {wert.einheit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          isNormal 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {isNormal ? 'Normal' : 'Erhöht'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Layout>
  );
}

export default LabValuesPage;