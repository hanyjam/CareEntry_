# Backend API Dokumentation

Basis-URL: `http://localhost:8000/api`

Alle Requests außer Login/Register benötigen `Authorization: Bearer {token}` Header.

## Authentifizierung

### POST /auth/login
Login eines Benutzers.

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "patient",
    "vorname": "Anna",
    "nachname": "Schmidt"
  }
}
Response (401):
{
  "success": false,
  "message": "Ungültige Anmeldedaten"
}

## POST /auth/register
Registrierung eines neuen Benutzers.
Request:
{
  "email": "neu@example.com",
  "password": "password123",
  "vorname": "Max",
  "nachname": "Mustermann",
  "role": "patient"
}
Response (201):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "email": "neu@example.com",
    "role": "patient"
  }
}

Anamnese
POST /anamnese**
Anamnese-Formular speichern.
Request:
{
  "vorname": "Anna",
  "nachname": "Schmidt",
  "geburtsdatum": "1985-03-15",
  "geschlecht": "weiblich",
  "telefon": "0176 12345678",
  "email": "anna@example.com",
  "vorerkrankungen": "Diabetes Typ 2",
  "medikamente": "Metformin 500mg",
  "allergien": "Penicillin",
  "aktuelle_beschwerden": "Kopfschmerzen seit 3 Tagen",
  "datenschutz_akzeptiert": true
}
Response(201)
{
  "success": true,
  "data": {
    "id": 123,
    "patient_id": 1,
    "created_at": "2025-01-10T15:30:00Z"
  }
}

GET /anamnese/:id
Anamnese-Formular abrufen.
Response (200):
{
  "success": true,
  "data": {
    "id": 123,
    "vorname": "Anna",
    "nachname": "Schmidt",
    "geburtsdatum": "1985-03-15",
    "geschlecht": "weiblich",
    "vorerkrankungen": "Diabetes Typ 2",
    "created_at": "2025-01-10T15:30:00Z",
    "updated_at": "2025-01-10T15:30:00Z"
  }
}

Patienten
GET /patients
Liste aller Patienten (für Ärzte).
Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "vorname": "Anna",
      "nachname": "Schmidt",
      "geburtsdatum": "1985-03-15",
      "geschlecht": "weiblich",
      "telefon": "0176 12345678",
      "email": "anna@example.com",
      "status": "aktiv",
      "letzterBesuch": "2025-01-15"
    }
  ],
  "total": 247
}

GET /patients/:id
Details eines Patienten.
Response (200):
{
  "success": true,
  "data": {
    "id": 1,
    "vorname": "Anna",
    "nachname": "Schmidt",
    "geburtsdatum": "1985-03-15",
    "geschlecht": "weiblich",
    "telefon": "0176 12345678",
    "email": "anna@example.com",
    "status": "aktiv",
    "vorerkrankungen": "Diabetes Typ 2",
    "allergien": "Penicillin",
    "medikamente": "Metformin 500mg",
    "letzterBesuch": "2025-01-15"
  }
}

Laborwerte
GET /patients/:id/laborwerte
Laborwerte eines Patienten.
Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "patient_id": 1,
      "typ": "Blutzucker",
      "wert": 105,
      "einheit": "mg/dl",
      "normalbereich": "70-100",
      "datum": "2024-12-01",
      "freigegeben": true
    }
  ]
}

POST /patients/:id/laborwerte
Laborwert hinzufügen (nur Arzt).
Request:
{
  "typ": "Blutzucker",
  "wert": 105,
  "einheit": "mg/dl",
  "normalbereich": "70-100",
  "datum": "2024-12-01",
  "freigegeben": false
}
Response(201)
{
  "success": true,
  "data": {
    "id": 42,
    "created_at": "2025-01-10T15:30:00Z"
  }
}

Nachrichten
GET /messages
Nachrichten des eingeloggten Users.
Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "sender_id": 2,
      "sender_name": "Dr. Müller",
      "receiver_id": 1,
      "subject": "Re: Terminanfrage",
      "body": "Ihr Termin ist bestätigt für 15.01.2025",
      "read": false,
      "created_at": "2025-01-10T10:30:00Z"
    }
  ]
}

POST /messages
Nachricht senden.
Request:
{
  "receiver_id": 2,
  "subject": "Terminanfrage",
  "body": "Ich hätte gerne einen Termin nächste Woche."
}
Response(201)
{
  "success": true,
  "data": {
    "id": 5,
    "created_at": "2025-01-10T15:30:00Z"
  }
}

File Upload
POST /upload
Datei hochladen.
Request (FormData):
file: [Binary File Data]
patient_id: 1
type: "befund" | "bild" | "dokument"
description: "MRT-Befund vom 10.01.2025"
Response (201):
{
  "success": true,
  "data": {
    "id": 15,
    "filename": "befund_20250110.pdf",
    "url": "/uploads/befund_20250110.pdf",
    "size": 245678,
    "mime_type": "application/pdf",
    "created_at": "2025-01-10T15:30:00Z"
  }
}


Fehlerbehandlung
Alle Fehler-Responses folgen diesem Format:
Response (4xx/5xx):
{
  "success": false,
  "message": "Fehlerbeschreibung",
  "errors": {
    "email": ["E-Mail ist ungültig"],
    "password": ["Passwort muss mindestens 8 Zeichen haben"]
  }
}

Authentifizierung
Bei allen geschützten Endpoints muss ein Bearer-Token mitgesendet werden:

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Bei fehlendem oder ungültigem Token:

Response (401):
{
  "success": false,
  "message": "Nicht authentifiziert"
}

CORS
Backend muss CORS für http://localhost:5173 erlauben.