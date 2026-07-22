export const mockPatienten = [
  {
    id: 1,
    vorname: 'Anna',
    nachname: 'Schmidt',
    geburtsdatum: '1985-03-15',
    geschlecht: 'weiblich',
    telefon: '0176 12345678',
    email: 'anna.schmidt@email.de',
    letzterBesuch: '2025-01-15',
    status: 'aktiv',
    vorerkrankungen: 'Diabetes Typ 2',
    allergien: 'Penicillin',
    medikamente: 'Metformin 500mg'
  },
  {
    id: 2,
    vorname: 'Thomas',
    nachname: 'Müller',
    geburtsdatum: '1972-08-22',
    geschlecht: 'männlich',
    telefon: '0151 98765432',
    email: 'thomas.mueller@email.de',
    letzterBesuch: '2025-01-20',
    status: 'aktiv',
    vorerkrankungen: 'Bluthochdruck',
    allergien: 'Keine',
    medikamente: 'Ramipril 5mg'
  },
  {
    id: 3,
    vorname: 'Maria',
    nachname: 'Weber',
    geburtsdatum: '1990-11-30',
    geschlecht: 'weiblich',
    telefon: '0162 55544433',
    email: 'maria.weber@email.de',
    letzterBesuch: '2024-12-10',
    status: 'inaktiv',
    vorerkrankungen: 'Asthma',
    allergien: 'Hausstaub',
    medikamente: 'Salbutamol Spray'
  },
  {
    id: 4,
    vorname: 'Klaus',
    nachname: 'Fischer',
    geburtsdatum: '1965-05-18',
    geschlecht: 'männlich',
    telefon: '0173 11223344',
    email: 'klaus.fischer@email.de',
    letzterBesuch: '2025-01-22',
    status: 'aktiv',
    vorerkrankungen: 'Arthrose',
    allergien: 'Latex',
    medikamente: 'Ibuprofen 400mg bei Bedarf'
  },
];

export const mockLaborwerte = [
  { datum: '2024-12-01', typ: 'Blutzucker', wert: 105, einheit: 'mg/dl', normalbereich: '70-100' },
  { datum: '2024-12-15', typ: 'Blutzucker', wert: 98, einheit: 'mg/dl', normalbereich: '70-100' },
  { datum: '2025-01-05', typ: 'Blutzucker', wert: 92, einheit: 'mg/dl', normalbereich: '70-100' },
  { datum: '2024-12-01', typ: 'Cholesterin', wert: 220, einheit: 'mg/dl', normalbereich: '<200' },
  { datum: '2025-01-05', typ: 'Cholesterin', wert: 205, einheit: 'mg/dl', normalbereich: '<200' },
];

export const mockLaborwerteVerlauf = {
  blutzucker: [
    { datum: '2024-11-01', wert: 110, einheit: 'mg/dl', normalbereich: '70-100' },
    { datum: '2024-11-15', wert: 105, einheit: 'mg/dl', normalbereich: '70-100' },
    { datum: '2024-12-01', wert: 98, einheit: 'mg/dl', normalbereich: '70-100' },
    { datum: '2024-12-15', wert: 95, einheit: 'mg/dl', normalbereich: '70-100' },
    { datum: '2025-01-05', wert: 92, einheit: 'mg/dl', normalbereich: '70-100' },
    { datum: '2025-01-20', wert: 88, einheit: 'mg/dl', normalbereich: '70-100' },
  ],
  cholesterin: [
    { datum: '2024-11-01', wert: 235, einheit: 'mg/dl', normalbereich: '<200' },
    { datum: '2024-12-01', wert: 220, einheit: 'mg/dl', normalbereich: '<200' },
    { datum: '2025-01-05', wert: 205, einheit: 'mg/dl', normalbereich: '<200' },
  ],
  blutdruck_systolisch: [
    { datum: '2024-11-01', wert: 145, einheit: 'mmHg', normalbereich: '120-129' },
    { datum: '2024-11-15', wert: 140, einheit: 'mmHg', normalbereich: '120-129' },
    { datum: '2024-12-01', wert: 135, einheit: 'mmHg', normalbereich: '120-129' },
    { datum: '2024-12-15', wert: 132, einheit: 'mmHg', normalbereich: '120-129' },
    { datum: '2025-01-05', wert: 128, einheit: 'mmHg', normalbereich: '120-129' },
    { datum: '2025-01-20', wert: 125, einheit: 'mmHg', normalbereich: '120-129' },
  ]
};

export const mockNachrichten = [
  {
    id: 1,
    sender_id: 2,
    sender_name: 'Dr. Müller',
    sender_role: 'arzt',
    receiver_id: 1,
    receiver_name: 'Anna Schmidt',
    subject: 'Terminbestätigung',
    body: 'Ihr Termin am 15.01.2025 um 10:00 Uhr ist bestätigt. Bitte bringen Sie Ihre Versichertenkarte mit.',
    read: false,
    created_at: '2025-01-10T14:30:00Z',
    reply_to: null
  },
  {
    id: 2,
    sender_id: 1,
    sender_name: 'Anna Schmidt',
    sender_role: 'patient',
    receiver_id: 2,
    receiver_name: 'Dr. Müller',
    subject: 'Rezeptanfrage',
    body: 'Guten Tag, ich benötige ein Folgerezept für mein Metformin. Können Sie das ausstellen?',
    read: true,
    created_at: '2025-01-08T09:15:00Z',
    reply_to: null
  },
  {
    id: 3,
    sender_id: 2,
    sender_name: 'Dr. Müller',
    sender_role: 'arzt',
    receiver_id: 1,
    receiver_name: 'Anna Schmidt',
    subject: 'Re: Rezeptanfrage',
    body: 'Guten Tag Frau Schmidt, das Rezept liegt ab morgen zur Abholung bereit. Mit freundlichen Grüßen',
    read: false,
    created_at: '2025-01-08T11:20:00Z',
    reply_to: 2
  },
  {
    id: 4,
    sender_id: 3,
    sender_name: 'Praxis Team',
    sender_role: 'staff',
    receiver_id: 1,
    receiver_name: 'Anna Schmidt',
    subject: 'Laborergebnisse verfügbar',
    body: 'Ihre Laborergebnisse vom 05.01.2025 sind jetzt in Ihrem Profil verfügbar.',
    read: true,
    created_at: '2025-01-07T16:45:00Z',
    reply_to: null
  }
];