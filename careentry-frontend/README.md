# CareEntry - Praxis-Verwaltungssystem

Modernes Frontend für Arztpraxis-Management mit React, Tailwind CSS und Vite.

## Features

**Authentifizierung**
- Login für Ärzte und Patienten
- Rollen-basierte Zugriffskontrolle
- JWT Token Management

**Patientenmanagement**
- Patientenliste mit Suchfunktion
- Detailansicht mit medizinischen Daten
- Anamnese-Verwaltung
- Dokumenten-Upload

**Laborwerte**
- Interaktive Charts (Blutzucker, Cholesterin, Blutdruck)
- Verlaufsanzeige über Monate
- Statistiken und Trends

**Nachrichten-System**
- Inbox/Outbox Trennung
- Ungelesene Nachrichten Highlighting
- Antworten-Funktion

**Mobile-Responsive**
- Hamburger-Menü für Mobile
- Touch-optimierte Bedienung
- Responsive Tables und Charts

## Tech Stack

- **React 18** - UI Framework
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Recharts** - Datenvisualisierung
- **jsPDF** - PDF-Generierung

## Installation
```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview
```

## Umgebungsvariablen

Erstelle eine `.env` Datei:
```env
VITE_API_URL=https://api.careentry.ageisel.de
```

## Test-Logins

**Arzt:**
- Email: `arzt@test.de`
- Passwort: `test123`

**Patient:**
- Email: `patient@test.de`
- Passwort: `test123`

## Projekt-Struktur
```
src/
├── components/       # Wiederverwendbare Komponenten
├── contexts/         # React Context (Auth)
├── pages/            # Seiten-Komponenten
├── services/         # API Services
├── utils/            # Helper-Funktionen & Mock-Daten
└── App.jsx           # Haupt-App-Komponente
```

## Backend-Integration

Das Frontend ist vorbereitet für Backend-Integration:
- API-Services in `src/services/api.js`
- Automatischer Fallback zu Mock-Daten
- localStorage als Zwischen-Persistierung

## Development
```bash
# Tests ausführen (wenn vorhanden)
npm test

# Linting
npm run lint
```

## Deployment

Das Frontend ist deployed auf: `https://careentry.ageisel.de`