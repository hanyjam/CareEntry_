import { useState } from 'react';
import Layout from '../components/Layout';
import FileUpload from '../components/FileUpload';
import { generateAnamnesePDF } from '../utils/pdfGenerator';
import dataProtection from '../assets/Datenschutzerklärung Muster.pdf'

function AnamnesePage() {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('anamnese_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      // eslint-disable-next-line no-unused-vars
      } catch (e) {
        return getEmptyFormData();
      }
    }
    return getEmptyFormData();
  });

  const [datenschutzAkzeptiert, setDatenschutzAkzeptiert] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState('');

  // Helper: Leeres Formular
  function getEmptyFormData() {
    return {
      vorname: '',
      nachname: '',
      geburtsdatum: '',
      geschlecht: '',
      email: '',
      telefon: '',
      adresse: '',
      versicherung: '',
      versicherungsnummer: '',
      hausarzt: '',
      allergien: '',
      medikamente: '',
      vorerkrankungen: '',
      operationen: '',
      familienanamnese: '',
      beschwerden: '',
      symptome: '',
      raucherstatus: '',
      alkoholkonsum: '',
      beruf: '',
    };
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveDraft = () => {
    localStorage.setItem('anamnese_draft', JSON.stringify(formData));
    alert('Entwurf gespeichert!');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.vorname) newErrors.vorname = 'Vorname ist erforderlich';
    if (!formData.nachname) newErrors.nachname = 'Nachname ist erforderlich';
    if (!formData.geburtsdatum) newErrors.geburtsdatum = 'Geburtsdatum ist erforderlich';
    if (!formData.email) newErrors.email = 'E-Mail ist erforderlich';
    if (!formData.datenschutz_akzeptiert) {
      newErrors.datenschutz_akzeptiert = 'Datenschutzerklärung muss akzeptiert werden';
    }
    
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
if (!formData.vorname || !formData.nachname || !formData.email) {
      setError('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    if (!datenschutzAkzeptiert) {
      setError('Bitte akzeptieren Sie die Datenschutzerklärung.');
      return;
    }

    if (validateForm()) {
      console.log('Formular absenden:', formData);
      
      // TODO: API-Call zum Backend
      // await api.post('/anamnese', formData);
      
      // Nach erfolgreichem Absenden: Draft löschen
      localStorage.removeItem('anamnese_draft');
      
      alert('Anamnese erfolgreich gespeichert!');
      
      // Optional: Formular zurücksetzen
      // setFormData(getEmptyFormData());
    }
  };

  const handleExportPDF = () => {
    generateAnamnesePDF(formData);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Anamnesebogen
        </h1>
        <p className="text-gray-600 mb-8">
          Bitte füllen Sie die folgenden Informationen aus
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Persönliche Daten */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Persönliche Daten
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vorname *
                </label>
                <input
                  type="text"
                  name="vorname"
                  value={formData.vorname}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nachname *
                </label>
                <input
                  type="text"
                  name="nachname"
                  value={formData.nachname}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Geburtsdatum *
                </label>
                <input
                  type="date"
                  name="geburtsdatum"
                  value={formData.geburtsdatum}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Geschlecht
                </label>
                <select
                  name="geschlecht"
                  value={formData.geschlecht}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Bitte wählen</option>
                  <option value="männlich">Männlich</option>
                  <option value="weiblich">Weiblich</option>
                  <option value="divers">Divers</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-Mail *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  name="telefon"
                  value={formData.telefon}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Medizinische Informationen */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Medizinische Informationen
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allergien
                </label>
                <textarea
                  name="allergien"
                  value={formData.allergien}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="z.B. Penicillin, Pollen..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aktuelle Medikamente
                </label>
                <textarea
                  name="medikamente"
                  value={formData.medikamente}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Name, Dosierung, Häufigkeit..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aktuelle Beschwerden
                </label>
                <textarea
                  name="beschwerden"
                  value={formData.beschwerden}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Beschreiben Sie Ihre aktuellen Beschwerden..."
                />
              </div>
            </div>
          </div>

          {/* Dokumente */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Dokumente hochladen
            </h2>
            <FileUpload
              onUpload={(fileInfo) => {
                setUploadedFiles([...uploadedFiles, fileInfo]);
              }}
              acceptedTypes=".pdf,.jpg,.jpeg,.png"
              maxSizeMB={5}
            />
          </div>

          {/* Datenschutz */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="datenschutz"
                checked={datenschutzAkzeptiert}
                onChange={(e) => setDatenschutzAkzeptiert(e.target.checked)}
                className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                required
              />
              <label htmlFor="datenschutz" className="ml-3 text-sm text-gray-700">
                Ich habe die{' '}
                <a 
                    href={dataProtection} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 underline"
                >
                  Datenschutzerklärung
                </a>{' '}
                gelesen und akzeptiere diese. *
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex-1 px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 font-medium"
            >
              Zwischenspeichern
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              PDF exportieren
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
            >
              Absenden
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default AnamnesePage;
