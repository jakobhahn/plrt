# Vercel Umgebungsvariablen

Diese Datei listet alle Umgebungsvariablen auf, die in Vercel gesetzt werden müssen.

## 📋 Vollständige Liste

### 1. **DATABASE_URL** (Erforderlich)
```
postgresql://user:password@host:5432/database?schema=public
```
- **Beschreibung**: PostgreSQL Verbindungs-URL
- **Beispiel (Supabase)**: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`
- **Beispiel (Neon)**: `postgresql://user:[PASSWORD]@[HOST].neon.tech/plrt?sslmode=require`
- **Wo verwendet**: Prisma Client, Datenbankverbindung

---

### 2. **NEXTAUTH_SECRET** (Erforderlich)
```
[32+ Zeichen zufälliger String]
```
- **Beschreibung**: Geheimer Schlüssel für NextAuth JWT-Verschlüsselung
- **Generierung**: 
  ```bash
  openssl rand -base64 32
  ```
- **Wo verwendet**: NextAuth Session-Verschlüsselung, Middleware

---

### 3. **NEXTAUTH_URL** (Erforderlich)
```
https://plrt-ruby.vercel.app
```
- **Beschreibung**: Öffentliche URL deiner Anwendung
- **Aktuell**: `https://plrt-ruby.vercel.app`
- **Hinweis**: Vercel setzt dies automatisch, aber du kannst es manuell überschreiben
- **Wo verwendet**: NextAuth Callback URLs

---

### 4. **STRAVA_CLIENT_ID** (Erforderlich für Strava-Funktionen)
```
[Deine Strava Client ID]
```
- **Beschreibung**: Client ID von deiner Strava App
- **Wo zu finden**: https://www.strava.com/settings/api
- **Wo verwendet**: Strava OAuth, API-Aufrufe

---

### 5. **STRAVA_CLIENT_SECRET** (Erforderlich für Strava-Funktionen)
```
[Dein Strava Client Secret]
```
- **Beschreibung**: Client Secret von deiner Strava App
- **Wo zu finden**: https://www.strava.com/settings/api
- **Wo verwendet**: Strava OAuth Token Exchange

---

### 6. **STRAVA_REDIRECT_URI** (Optional, wird automatisch generiert)
```
https://plrt-ruby.vercel.app/api/auth/callback/strava
```
- **Beschreibung**: Redirect URI für Strava OAuth
- **Aktuell**: `https://plrt-ruby.vercel.app/api/auth/callback/strava`
- **WICHTIG**: Diese URL muss auch in deiner Strava App konfiguriert werden!
- **Wo verwendet**: Strava OAuth Callback

---

### 7. **ENCRYPTION_KEY** (Erforderlich für Strava-Funktionen)
```
[32 Zeichen Hex-String]
```
- **Beschreibung**: Schlüssel für AES-Verschlüsselung der Strava Tokens
- **Generierung**: 
  ```bash
  openssl rand -hex 16
  ```
- **Wichtig**: Muss genau 32 Zeichen lang sein (16 Bytes als Hex)
- **Wo verwendet**: Verschlüsselung/Entschlüsselung von Strava Access/Refresh Tokens

---

### 8. **CRON_SECRET** (Erforderlich für automatische Strava-Sync)
```
[32+ Zeichen zufälliger String]
```
- **Beschreibung**: Secret für den Cron Job Endpoint (Strava Sync)
- **Generierung**: 
  ```bash
  openssl rand -base64 32
  ```
- **Wo verwendet**: `/api/cron/sync-strava` Route
- **Hinweis**: Wird benötigt, wenn du Vercel Cron Jobs oder externe Cron Services verwendest

---

## 🚀 Vercel Setup Anleitung

### Schritt 1: Vercel Dashboard öffnen
1. Gehe zu https://vercel.com/dashboard
2. Wähle dein Projekt aus (oder erstelle ein neues)

### Schritt 2: Environment Variables hinzufügen
1. Gehe zu **Settings** → **Environment Variables**
2. Füge jede Variable einzeln hinzu:

#### Für alle Umgebungen (Production, Preview, Development):
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (oder lasse Vercel automatisch setzen)
- `STRAVA_CLIENT_ID`
- `STRAVA_CLIENT_SECRET`
- `ENCRYPTION_KEY`
- `CRON_SECRET`

### Schritt 3: Secrets generieren

Führe diese Befehle lokal aus, um sichere Secrets zu generieren:

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# ENCRYPTION_KEY (32 Zeichen Hex)
openssl rand -hex 16

# CRON_SECRET
openssl rand -base64 32
```

### Schritt 4: Vercel Build Settings

Stelle sicher, dass in **Settings** → **Build & Development Settings**:

**Build Command**: (leer lassen oder `npm run build`)
**Output Directory**: `.next`
**Install Command**: `npm install`

**Wichtig**: Füge ein **Postinstall Script** hinzu:

In `package.json` sollte bereits stehen:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Schritt 5: Vercel Cron Job (Optional)

Für automatische Strava-Synchronisation:

1. Erstelle `vercel.json` im Root:
```json
{
  "crons": [{
    "path": "/api/cron/sync-strava",
    "schedule": "0 */6 * * *"
  }]
}
```

2. Der Cron Job ruft die Route mit Header auf:
```
Authorization: Bearer [CRON_SECRET]
```

---

## ⚠️ Wichtige Hinweise

1. **NEXTAUTH_URL**: 
   - Für Production: `https://deine-domain.vercel.app`
   - Vercel setzt automatisch `VERCEL_URL`, aber `NEXTAUTH_URL` sollte explizit gesetzt werden

2. **STRAVA_REDIRECT_URI**:
   - Muss in der Strava App auf deine Produktions-URL gesetzt werden
   - Format: `https://deine-domain.vercel.app/api/auth/callback/strava`

3. **DATABASE_URL**:
   - Verwende SSL für Production: `?sslmode=require`
   - Stelle sicher, dass die Datenbank von Vercel aus erreichbar ist

4. **Secrets niemals committen**:
   - Alle diese Werte sind bereits in `.gitignore`
   - Nur in Vercel Environment Variables setzen

---

## 🔍 Prüfen ob alles funktioniert

Nach dem Deployment:

1. **Datenbank**: Prüfe ob Migrationen ausgeführt wurden
2. **Login**: Teste die Login-Funktion
3. **Strava**: Teste die Strava-Verbindung
4. **Cron**: Prüfe ob der Sync-Job läuft (in Vercel Logs)

---

## 📝 Beispiel-Konfiguration für dein Projekt

```
DATABASE_URL=postgresql://user:pass@host:5432/plrt?sslmode=require
NEXTAUTH_SECRET=abc123xyz789... (32+ Zeichen)
NEXTAUTH_URL=https://plrt-ruby.vercel.app
STRAVA_CLIENT_ID=12345
STRAVA_CLIENT_SECRET=abcdef123456...
ENCRYPTION_KEY=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
CRON_SECRET=xyz789abc123... (32+ Zeichen)
STRAVA_REDIRECT_URI=https://plrt-ruby.vercel.app/api/auth/callback/strava
```

**Wichtig für Strava Setup:**
1. Gehe zu https://www.strava.com/settings/api
2. Setze die **Authorization Callback Domain** auf: `plrt-ruby.vercel.app`
3. Die **Redirect URI** in der Strava App sollte sein: `https://plrt-ruby.vercel.app/api/auth/callback/strava`
