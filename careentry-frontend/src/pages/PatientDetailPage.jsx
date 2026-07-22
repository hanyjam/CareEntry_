import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { mockPatienten, mockLaborwerte } from '../utils/mockData';

function PatientDetailPage() {
  const { id } = useParams(); // URL Parameter: /patienten/:id
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState(null);
  const [showTerminDialog, setShowTerminDialog] = useState(false);
  const [showAnamneseDialog, setShowAnamneseDialog] = useState(false);
  const [showDokumenteDialog, setShowDokumenteDialog] = useState(false);
  const [showNachrichtDialog, setShowNachrichtDialog] = useState(false);
  const [showVerlaufDialog, setShowVerlaufDialog] = useState(false);

  useEffect(() => {
    const savedPatients = localStorage.getItem('patienten_list');
    const patientsList = savedPatients ? JSON.parse(savedPatients) : mockPatienten;
    const foundPatient = patientsList.find(p => p.id === parseInt(id));
    
    if (foundPatient) {
      setPatient(foundPatient);
      setEditedPatient(foundPatient);
    }
    setLoading(false);
  }, [id]);

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

    const handleSave = () => {
    const savedPatients = localStorage.getItem('patienten_list');
    const patientsList = savedPatients ? JSON.parse(savedPatients) : mockPatienten;
    const updatedList = patientsList.map(p => 
      p.id === patient.id ? editedPatient : p
    );
    localStorage.setItem('patienten_list', JSON.stringify(updatedList));
    
    setPatient(editedPatient);
    setIsEditing(false);
    alert('Änderungen gespeichert!');
    };

    const handleCancel = () => {
      setEditedPatient(patient);
      setIsEditing(false);
    };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Lädt...</div>
        </div>
      </Layout>
    );
  }

  if (!patient) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Patient nicht gefunden</p>
          <Link to="/patienten" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
            Zurück zur Übersicht
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-4 text-sm text-gray-600">
        <Link to="/patienten" className="hover:text-primary-600">Patienten</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{patient.vorname} {patient.nachname}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {patient.vorname} {patient.nachname}
            </h1>
            <p className="text-gray-600 mt-1">
              {calculateAge(patient.geburtsdatum)} Jahre • {patient.geschlecht}
            </p>
          </div>
          <div className="flex space-x-3">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Bearbeiten
                </button>
                <button
                  onClick={() => setShowTerminDialog(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Termin buchen
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Speichern
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Linke Spalte - Hauptinfo */}
        <div className="lg:col-span-2 space-y-6">
          {/* Persönliche Daten */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Persönliche Daten
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Geburtsdatum</p>
                <p className="text-gray-900 font-medium">
                  {new Date(patient.geburtsdatum).toLocaleDateString('de-DE')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefon</p>
                <p className="text-gray-900 font-medium">{patient.telefon}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">E-Mail</p>
                <p className="text-gray-900 font-medium">{patient.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  patient.status === 'aktiv' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {patient.status}
                </span>
              </div>
            </div>
          </div>

          {/* Medizinische Angaben */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Medizinische Angaben
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Vorerkrankungen</p>
                <p className="text-gray-900">{patient.vorerkrankungen || 'Keine angegeben'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Allergien</p>
                <p className="text-gray-900">{patient.allergien || 'Keine bekannt'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Aktuelle Medikamente</p>
                <p className="text-gray-900">{patient.medikamente || 'Keine'}</p>
              </div>
            </div>
          </div>

          {/* Laborwerte */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Aktuelle Laborwerte
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Datum
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Typ
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Wert
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Normalbereich
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockLaborwerte.slice(0, 5).map((wert, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(wert.datum).toLocaleDateString('de-DE')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{wert.typ}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {wert.wert} {wert.einheit}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {wert.normalbereich}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Rechte Spalte - Sidebar */}
        <div className="space-y-6">
          {/* Letzte Besuche */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Letzter Besuch
            </h3>
            <p className="text-2xl font-bold text-primary-600">
              {new Date(patient.letzterBesuch).toLocaleDateString('de-DE')}
            </p>
          </div>

          {/* Schnellaktionen */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Aktionen
            </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowAnamneseDialog(true)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  📋 Anamnese ansehen
                </button>
                <button
                  onClick={() => setShowDokumenteDialog(true)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  📄 Dokumente
                </button>
                <button
                  onClick={() => setShowNachrichtDialog(true)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  💬 Nachricht senden
                </button>
                <button
                  onClick={() => setShowVerlaufDialog(true)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  📊 Verlauf
                </button>
              </div>
          </div>
        </div>
    </div>
      {/* Dialoge */}
      {showTerminDialog && <TerminDialog patient={patient} onClose={() => setShowTerminDialog(false)} />}
      {showAnamneseDialog && <AnamneseDialog patient={patient} onClose={() => setShowAnamneseDialog(false)} />}
      {showDokumenteDialog && <DokumenteDialog patient={patient} onClose={() => setShowDokumenteDialog(false)} />}
      {showNachrichtDialog && <NachrichtDialog patient={patient} onClose={() => setShowNachrichtDialog(false)} />}
      {showVerlaufDialog && <VerlaufDialog patient={patient} onClose={() => setShowVerlaufDialog(false)} />}
    </Layout>
  );
}

// Dialog-Komponenten
function TerminDialog({ patient, onClose }) {
  const [datum, setDatum] = useState('');
  const [uhrzeit, setUhrzeit] = useState('');
  const [grund, setGrund] = useState('');

  const handleBuchen = () => {
    if (!datum || !uhrzeit || !grund) {
      alert('Bitte alle Felder ausfüllen.');
      return;
    }
    alert(`Termin gebucht für ${patient.vorname} ${patient.nachname}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">Termin buchen</h3>
          <button onClick={onClose} className="text-gray-400">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Datum</label>
            <input
              type="date"
              value={datum}
              onChange={(e) => setDatum(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Uhrzeit</label>
            <input
              type="time"
              value={uhrzeit}
              onChange={(e) => setUhrzeit(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Grund</label>
            <select
              value={grund}
              onChange={(e) => setGrund(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Bitte wählen</option>
              <option value="Routineuntersuchung">Routineuntersuchung</option>
              <option value="Nachkontrolle">Nachkontrolle</option>
            </select>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Abbrechen</button>
          <button onClick={handleBuchen} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Buchen</button>
        </div>
      </div>
    </div>
  );
}

function AnamneseDialog({ patient, onClose }) {
  const [anamneseData, setAnamneseData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(`anamnese_patient_${patient.id}`);
    if (saved) setAnamneseData(JSON.parse(saved));
  }, [patient.id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between">
          <h3 className="text-2xl font-bold">Anamnese: {patient.vorname} {patient.nachname}</h3>
          <button onClick={onClose} className="text-gray-400">×</button>
        </div>
        <div className="p-6">
          {anamneseData ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Persönliche Daten</h4>
                <p>Name: {anamneseData.vorname} {anamneseData.nachname}</p>
                <p>Email: {anamneseData.email}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Medizinische Daten</h4>
                <p>Allergien: {anamneseData.allergien || 'Keine'}</p>
                <p>Medikamente: {anamneseData.medikamente || 'Keine'}</p>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">Keine Anamnese-Daten vorhanden</p>
          )}
        </div>
        <div className="sticky bottom-0 bg-gray-50 p-6 border-t">
          <button onClick={onClose} className="w-full px-6 py-2 bg-primary-600 text-white rounded-lg">Schließen</button>
        </div>
      </div>
    </div>
  );
}

function DokumenteDialog({ patient, onClose }) {
  const [dokumente, setDokumente] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(`dokumente_patient_${patient.id}`);
    if (saved) setDokumente(JSON.parse(saved));
  }, [patient.id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6 border-b flex justify-between">
          <h3 className="text-xl font-bold">Dokumente</h3>
          <button onClick={onClose} className="text-gray-400">×</button>
        </div>
        <div className="p-6">
          {dokumente.length > 0 ? (
            <div className="space-y-2">
              {dokumente.map(doc => (
                <div key={doc.id} className="border p-3 rounded-lg">
                  <p className="font-medium">{doc.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Keine Dokumente</p>
          )}
        </div>
        <div className="p-6 bg-gray-50 border-t">
          <button onClick={onClose} className="w-full px-6 py-2 bg-primary-600 text-white rounded-lg">Schließen</button>
        </div>
      </div>
    </div>
  );
}

function NachrichtDialog({ patient, onClose }) {
  const [betreff, setBetreff] = useState('');
  const [nachricht, setNachricht] = useState('');

  const handleSend = () => {
    if (!betreff || !nachricht) {
      alert('Bitte alle Felder ausfüllen.');
      return;
    }
    alert('Nachricht gesendet!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="p-6 border-b flex justify-between">
          <h3 className="text-xl font-bold">Nachricht an {patient.vorname}</h3>
          <button onClick={onClose} className="text-gray-400">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Betreff</label>
            <input
              type="text"
              value={betreff}
              onChange={(e) => setBetreff(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nachricht</label>
            <textarea
              value={nachricht}
              onChange={(e) => setNachricht(e.target.value)}
              rows="6"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Abbrechen</button>
          <button onClick={handleSend} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Senden</button>
        </div>
      </div>
    </div>
  );
}

function VerlaufDialog({onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6 border-b flex justify-between">
          <h3 className="text-xl font-bold">Verlauf</h3>
          <button onClick={onClose} className="text-gray-400">×</button>
        </div>
        <div className="p-6">
          <p className="text-center text-gray-500">Verlaufsdaten werden hier angezeigt</p>
        </div>
        <div className="p-6 bg-gray-50 border-t">
          <button onClick={onClose} className="w-full px-6 py-2 bg-primary-600 text-white rounded-lg">Schließen</button>
        </div>
      </div>
    </div>
  );
}

export default PatientDetailPage;