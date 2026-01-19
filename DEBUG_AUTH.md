# Debug: Login-Probleme beheben

## Problem: CredentialsSignin Fehler

Der Fehler `CredentialsSignin` bedeutet, dass der Credentials Provider `null` zurückgibt.

## Mögliche Ursachen:

### 1. Keine User in der Datenbank

**Lösung:** Seed-Daten laden

```bash
# Stelle sicher, dass DATABASE_URL in .env gesetzt ist
npm run db:seed
```

Dies erstellt:
- `admin@plrt.de` (ADMIN)
- `member@plrt.de` (MEMBER)

**Wichtig:** Aktuell funktioniert der Login **ohne Passwort-Prüfung** (Demo-Modus). Jeder existierende User kann sich anmelden.

### 2. Falsche Email-Adresse

Versuche mit:
- `admin@plrt.de`
- `member@plrt.de`

### 3. Datenbank-Verbindungsproblem

Prüfe in Vercel:
- `DATABASE_URL` ist gesetzt
- Die URL ist korrekt (mit `sslmode=verify-full`)

### 4. NextAuth Konfiguration

Prüfe in Vercel:
- `NEXTAUTH_SECRET` ist gesetzt
- `NEXTAUTH_URL` ist `https://plrt-ruby.vercel.app`

## Test-Login

Nach dem Laden der Seed-Daten:
1. Gehe zu `/login`
2. Email: `admin@plrt.de`
3. Passwort: (beliebig, wird aktuell nicht geprüft)
4. Klicke "Anmelden"

## Strava Login

Für Strava Login prüfe:
1. `STRAVA_CLIENT_ID` ist in Vercel gesetzt
2. `STRAVA_CLIENT_SECRET` ist in Vercel gesetzt
3. Callback URL in Strava App: `https://plrt-ruby.vercel.app/api/auth/callback/strava`

## Nächste Schritte

1. **Sofort:** Seed-Daten laden (`npm run db:seed`)
2. **Später:** Passwort-Feld zum User-Modell hinzufügen und echte Passwort-Prüfung implementieren
