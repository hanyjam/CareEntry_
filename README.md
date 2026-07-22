# CareEntry — Digitale Patienten- & Praxisverwaltung

Ein modernes Full-Stack-Webprojekt zur Digitalisierung von Arztpraxen.
Entwickelt als Studienprojekt im Bereich Medical Informatics.

🔗 **Live-Demo:** https://careentry.ageisel.de
📚 **API-Dokumentation:** https://api.careentry.ageisel.de/doc

---

## Features

**Patienten-Ansicht**
- Persönliches Dashboard mit Terminübersicht
- Mehrstufiges Anamnese-Formular mit PDF-Export (jsPDF)
- Eigene Laborwerte als interaktive Charts (Recharts)
- Nachrichten vom Arzt lesen
- Dokumente einsehen

**Arzt-Ansicht**
- Dashboard mit Patientenübersicht & Nachrichten
- Patientenliste mit Suche & Filter
- Detailansicht: Anamnese, Laborwerte, Dokumente, Notizen
- Drag & Drop Dokumenten-Upload

**Technische Highlights**
- JWT-basierte Authentifizierung mit Rollen (Arzt / Patient)
- Protected Routes & Context API für globalen Auth-State
- Zentraler API-Service-Layer mit Fallback zu Mock-Daten
- Vollständig responsive (ab 320px)
- Unit-Tests mit Vitest & React Testing Library

---

## Tech Stack

| Frontend | Backend |
|----------|---------|
| React 18, Vite | Symfony, PHP |
| Tailwind CSS | MySQL |
| React Router | JWT Auth |
| Recharts, jsPDF | Swagger / OpenAPI |

---

## 📦 Installation

```bash
git clone [repo-url]
cd careentry-frontend
npm install
npm run dev
```

`.env` erstellen:
VITE_API_URL=https://api.careentry.ageisel.de

---

## 🧪 Test-Zugänge

| Rolle | Email |
|-------|-------|
| Arzt | test-arzt@ageisel.de |
| Patient | test-patient@ageisel.de |

*(Passwörter auf Anfrage)*

---

## 👥 Team

- **Frontend:** Hana Jamal
- **Backend:** Arne Geisel
- **Datenschutz/QA:** Daniel Lentz

---

Privates Studienprojekt – keine kommerzielle Nutzung vorgesehen.
