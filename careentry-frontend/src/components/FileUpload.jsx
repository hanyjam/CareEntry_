import { useState } from 'react';

function FileUpload({ acceptedTypes = '.pdf,.jpg,.jpeg,.png', maxSizeMB = 20 }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');

    // Validierung: Dateigröße
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      setError(`Datei ist zu groß. Maximum: ${maxSizeMB}MB`);
      return;
    }

    // Validierung: Dateityp
    const allowedTypes = acceptedTypes.split(',').map(t => t.trim());
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      setError(`Dateityp nicht erlaubt. Erlaubt: ${acceptedTypes}`);
      return;
    }

    setSelectedFile(file);

    // Preview für Bilder
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) {
    handleFileSelect({ target: { files: [file] } });
  }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
  <div className="w-full">
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={(e) => e.preventDefault()}
      onDragLeave={(e) => e.preventDefault()} 
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer"
    >
      <input
        type="file"
        onChange={handleFileSelect}
        accept={acceptedTypes}
        className="hidden"
        id="file-upload"
      />
      
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex flex-col items-center">
          <svg
            className="w-12 h-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-gray-600 mb-2">
            <span className="text-primary-600 font-medium">Klicken Sie hier</span> oder ziehen Sie eine Datei hierher
          </p>
          <p className="text-sm text-gray-500">
            {acceptedTypes} (max. {maxSizeMB}MB)
          </p>
        </div>
      </label>
    </div>

    {error && (
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    )}

    {selectedFile && (
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-green-700">
              {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => {
              setSelectedFile(null);
              setPreview(null);
              setError('');
            }}
            className="ml-4 text-red-600 hover:text-red-800"
            title="Datei entfernen"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    )}

    {preview && (
      <div className="mt-4">
        <img 
          src={preview} 
          alt="Vorschau" 
          className="max-w-xs rounded-lg shadow"
        />
      </div>
    )}
  </div>
);
}

export default FileUpload;