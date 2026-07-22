# CareEntry - Digitale Patienten- & Praxisverwaltung

Ein modernes Full-Stack-Projekt zur Digitalisierung von Arztpraxen. Entwickelt als Studienprojekt mit React (Frontend) und Symfony (Backend).

🔗 **Live-Demo:** https://careentry.ageisel.de  
📚 **API-Dokumentation:** https://api.careentry.ageisel.de/doc

---

## ✅ Was funktioniert

### Authentifizierung & Sicherheit
- JWT-Token-basiertes Login
- Rollen-basierte Zugriffskontrolle (Arzt / Patient)
- Protected Routes mit Auth-Check
- Sichere Passwort-Speicherung (Backend)

### Arzt-Ansicht
- Dashboard mit Übersicht (Patientenanzahl, Nachrichten)
- Patienten-Liste mit Suche/Filter (Backend-Integration)
- Patient-Detailansicht mit:
  - Anamnese-Einsicht
  - Laborwerte-Charts (interaktiv, Recharts)
  - Dokumenten-Upload (Drag & Drop)
  - Dokumenten-Verwaltung
  - Nachrichten-Kommunikation
  - Arzt-Notizen (lokal gespeichert)

### Patienten-Ansicht
- Persönliches Dashboard
- Anamnese-Formular (mehrstufig, validiert)
- **PDF-Export** der Anamnese (jsPDF)
- Eigene Laborwerte einsehen (Charts)
- Nachrichten lesen (Backend-Integration)
- Dokumente einsehen

### Nachrichten-System
- Inbox mit Backend-Anbindung (echte Daten)
- Ungelesen/Gelesen-Status
- Konversations-basierte Struktur

### Mobile & Responsive
- Vollständig responsive ab 320px
- Hamburger-Menü für Mobile
- Adaptive Layouts (Tabellen → Cards, Dialoge → Fullscreen)
- Touch-optimierte Bedienelemente

### Technische Basis
- Single Page Application (React 18 + Vite)
- Tailwind CSS für konsistentes Design
- Zentraler API-Service-Layer mit Error-Handling
- Context API für globalen Auth-State
- Error Boundary für stabile Fehlerbehandlung
- Fallback zu Mock-Daten bei Backend-Ausfall
- Unit-Tests (Vitest + React Testing Library)

### Backend-Integration (live getestet)
- ✅ Login mit echten Accounts
- ✅ Patienten-Liste vom Backend
- ✅ Patient-Details vom Backend
- ✅ Nachrichten-Abruf vom Backend

---

## ⚠️ Was noch fehlt / bekannte Einschränkungen

### Backend-Integration (offen)
- ❌ Nachrichten **senden** (POST-Endpoint noch nicht verfügbar/geklärt)
- ❌ Laborwerte-Seite vollständige Backend-Anbindung (Endpoint-Struktur ungeklärt)
- ❌ Anamnese-Speicherung im Backend (aktuell nur localStorage)
- ❌ Dokumenten-Upload ans Backend (aktuell nur localStorage-Simulation)

---

## 🛠️ Tech-Stack

**Frontend:**
- React 18 · Vite · Tailwind CSS · React Router
- Recharts (Datenvisualisierung) · jsPDF (PDF-Export)
- Vitest + React Testing Library

**Backend:**
- Symfony · PHP · MySQL · JWT-Auth · Nelmio (Swagger/OpenAPI)

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

## 📄 Lizenz

Privates Studienprojekt – keine kommerzielle Nutzung vorgesehen.
