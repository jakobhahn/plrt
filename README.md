# PLRT - Triathlon & Laufverein Website

Eine moderne Full-Stack-Webanwendung für einen Triathlon- und Laufverein mit Fokus auf interne Nutzung. Die Anwendung bietet Athleten-Verwaltung, Terminplanung, Downloads und Strava-Integration.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js v5
- **Database**: PostgreSQL mit Prisma ORM
- **External API**: Strava OAuth 2.0 + Strava API
- **Form Handling**: react-hook-form + zod
- **State Management**: TanStack Query

## Features

### Öffentliche Bereiche
- Startseite mit Vereinsprofil
- Über uns Seite
- Kontaktseite
- Termine-Übersicht
- Downloads

### Interne Bereiche (Login erforderlich)
- **Athleten-Verzeichnis**: Übersicht aller Athleten mit Filter- und Suchfunktion
- **Athleten-Detailseiten**: Profil, Erfolge, Strava-Status, Jahresstatistiken
- **Statistiken**: Vereins-Gesamtwerte und Leaderboards
- **Profil**: Eigenes Profil verwalten, Strava verbinden

### Admin-Bereich
- CRUD für Athleten
- CRUD für Termine
- CRUD für Downloads
- Zugriff auf alle Statistiken

### Strava Integration
- OAuth 2.0 Verbindung
- Automatische Synchronisation von Aktivitäten
- Jahresstatistiken (Lauf-km, Rad-km)
- Verschlüsselte Token-Speicherung
- Cron Job für regelmäßige Synchronisation

## Setup

### Voraussetzungen

- Node.js 18+ und npm
- PostgreSQL Datenbank (lokal oder Cloud)
- Strava App (für OAuth)

### 1. Repository klonen und Dependencies installieren

```bash
npm install
```

### 2. Umgebungsvariablen konfigurieren

Erstelle eine `.env` Datei im Root-Verzeichnis:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/plrt?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Strava OAuth
STRAVA_CLIENT_ID="your-strava-client-id"
STRAVA_CLIENT_SECRET="your-strava-client-secret"
STRAVA_REDIRECT_URI="http://localhost:3000/api/auth/callback/strava"

# Encryption for Strava tokens
ENCRYPTION_KEY="your-32-character-encryption-key"

# Cron job secret for Strava sync
CRON_SECRET="your-cron-secret-key"
```

**Wichtig**: Generiere sichere Secrets:
```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# ENCRYPTION_KEY (32 Zeichen)
openssl rand -hex 16

# CRON_SECRET
openssl rand -base64 32
```

### 3. Strava App Setup

1. Gehe zu https://www.strava.com/settings/api
2. Erstelle eine neue App
3. Setze die **Authorization Callback Domain** auf `localhost` (für Entwicklung)
4. Kopiere **Client ID** und **Client Secret** in die `.env` Datei
5. Setze die **Redirect URI** in der Strava App auf: `http://localhost:3000/api/auth/callback/strava`

### 4. Datenbank Setup

```bash
# Prisma Client generieren
npm run db:generate

# Migration erstellen und ausführen
npm run db:migrate

# Seed-Daten laden (3 Athleten, 5 Termine, 2 Downloads)
npm run db:seed
```

### 5. Entwicklungsserver starten

```bash
npm run dev
```

Die Anwendung läuft nun auf [http://localhost:3000](http://localhost:3000)

## Seed-Daten

Das Seed-Script erstellt:

- **2 Benutzer**:
  - `admin@plrt.de` (Admin)
  - `member@plrt.de` (Member)
- **3 Athleten**: Max Mustermann, Anna Schmidt, Thomas Weber
- **5 Termine**: Trainings, Wettkämpfe, Meetings
- **2 Downloads**: Mitgliedsantrag, Vereinsordnung
- **Beispiel-Statistiken** für das aktuelle Jahr

**Hinweis**: Die Seed-Benutzer haben aktuell kein Passwort. Für die Produktion sollte ein Passwort-Hashing implementiert werden.

## Deployment

### Vercel

1. Verbinde dein Repository mit Vercel
2. Setze alle Umgebungsvariablen in den Vercel Settings
3. Vercel führt automatisch `npm run build` aus

### Datenbank (Supabase/Prisma)

Für Produktion empfohlen:
- **Supabase**: PostgreSQL-Hosting mit automatischen Backups
- Oder: Eigenes PostgreSQL auf Railway, Render, etc.

### Strava Redirect URI für Produktion

In der Strava App die Redirect URI auf deine Produktions-URL setzen:
```
https://your-domain.com/api/auth/callback/strava
```

### Cron Job Setup

Für die automatische Strava-Synchronisation:

**Vercel Cron Jobs** (empfohlen):
1. Erstelle `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/sync-strava",
    "schedule": "0 */6 * * *"
  }]
}
```

2. Setze `CRON_SECRET` in Vercel Environment Variables

**Alternative**: Externer Cron Service (z.B. cron-job.org) der regelmäßig die Route aufruft.

## Projektstruktur

```
plrt/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # NextAuth Routes
│   │   ├── admin/         # Admin CRUD APIs
│   │   └── cron/          # Cron Jobs
│   ├── admin/             # Admin-Bereich
│   ├── athleten/          # Athleten-Seiten
│   ├── termine/           # Termine-Seiten
│   ├── downloads/         # Downloads-Seiten
│   └── ...
├── components/            # React Komponenten
│   ├── admin/            # Admin-Komponenten
│   └── ...
├── lib/                   # Utility-Funktionen
│   ├── auth.ts           # NextAuth Config
│   ├── prisma.ts         # Prisma Client
│   ├── strava.ts         # Strava API
│   └── encryption.ts     # Token-Verschlüsselung
├── prisma/               # Prisma Schema & Migrations
│   ├── schema.prisma     # Datenbank-Schema
│   └── seed.ts          # Seed-Script
└── middleware.ts         # NextAuth Middleware
```

## Wichtige Hinweise

### Sicherheit

- **Passwörter**: Die aktuelle Credentials-Provider-Implementierung ist vereinfacht. Für Produktion sollte Passwort-Hashing (bcrypt) implementiert werden.
- **Token-Verschlüsselung**: Strava-Tokens werden mit AES verschlüsselt gespeichert.
- **Rate Limiting**: Strava API hat Limits (600 requests/15min). Der Sync-Job berücksichtigt dies.

### Strava Rate Limits

- **600 requests pro 15 Minuten** pro App
- Der Sync-Job fügt 2 Sekunden Delay zwischen Syncs ein
- Für viele Nutzer: Sync in Batches oder seltener ausführen

### Mobile-First Design

Die Anwendung ist vollständig responsive und mobile-optimiert:
- Touch-freundliche Buttons
- Mobile Navigation (Drawer)
- Optimierte Bilder mit `next/image`

## Entwicklung

### Nützliche Commands

```bash
# Entwicklung
npm run dev

# Build
npm run build

# Production Start
npm start

# Prisma Studio (DB GUI)
npm run db:studio

# Linting
npm run lint
```

### Datenbank-Migrationen

```bash
# Neue Migration erstellen
npm run db:migrate

# Prisma Client neu generieren
npm run db:generate
```

## Lizenz

Privat - Nur für interne Nutzung

## Support

Bei Fragen oder Problemen, kontaktiere den Administrator.
