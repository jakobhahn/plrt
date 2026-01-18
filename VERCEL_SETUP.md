# Vercel Setup - Schritt für Schritt

## 🎯 Ziel: Strava Client ID & Secret in Vercel eintragen

### Schritt 1: Strava Client ID & Secret holen

1. Gehe zu: https://www.strava.com/settings/api
2. Klicke auf deine App "PLRT Triathlon & Laufverein"
3. Du siehst jetzt:
   - **Client ID**: Eine Zahl (z.B. `12345`)
   - **Client Secret**: Ein langer String (z.B. `abc123def456...`)
4. **Kopiere beide Werte** (du wirst sie gleich brauchen)

---

### Schritt 2: Vercel Dashboard öffnen

1. Gehe zu: https://vercel.com/dashboard
2. Wähle dein Projekt **plrt** aus (oder das Projekt mit der URL `plrt-ruby.vercel.app`)

---

### Schritt 3: Environment Variables öffnen

1. Klicke auf **Settings** (oben im Menü)
2. Klicke auf **Environment Variables** (linke Sidebar)

---

### Schritt 4: Variablen hinzufügen

Für jede Variable:

1. Klicke auf **Add New**
2. Trage **Key** (Name) und **Value** (Wert) ein
3. Wähle alle Umgebungen: ✅ **Production**, ✅ **Preview**, ✅ **Development**
4. Klicke auf **Save**

#### Variable 1: STRAVA_CLIENT_ID
- **Key**: `STRAVA_CLIENT_ID`
- **Value**: [Deine Client ID von Strava - z.B. `12345`]
- ✅ Production, Preview, Development

#### Variable 2: STRAVA_CLIENT_SECRET
- **Key**: `STRAVA_CLIENT_SECRET`
- **Value**: [Dein Client Secret von Strava - z.B. `abc123def456...`]
- ✅ Production, Preview, Development

#### Variable 3: NEXTAUTH_URL
- **Key**: `NEXTAUTH_URL`
- **Value**: `https://plrt-ruby.vercel.app`
- ✅ Production, Preview, Development

#### Variable 4: STRAVA_REDIRECT_URI (Optional, aber empfohlen)
- **Key**: `STRAVA_REDIRECT_URI`
- **Value**: `https://plrt-ruby.vercel.app/api/auth/callback/strava`
- ✅ Production, Preview, Development

---

### Schritt 5: Weitere erforderliche Variablen

Falls noch nicht gesetzt, füge auch diese hinzu:

#### DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: `postgresql://user:password@host:5432/plrt?sslmode=require`
- ⚠️ **Wichtig**: Ersetze mit deiner echten Datenbank-URL (Supabase, Neon, etc.)

#### NEXTAUTH_SECRET
- **Key**: `NEXTAUTH_SECRET`
- **Value**: [Generiere mit: `openssl rand -base64 32`]
- ✅ Production, Preview, Development

#### ENCRYPTION_KEY
- **Key**: `ENCRYPTION_KEY`
- **Value**: [Generiere mit: `openssl rand -hex 16`]
- ✅ Production, Preview, Development

#### CRON_SECRET
- **Key**: `CRON_SECRET`
- **Value**: [Generiere mit: `openssl rand -base64 32`]
- ✅ Production, Preview, Development

---

### Schritt 6: Secrets lokal generieren (falls noch nicht geschehen)

Öffne ein Terminal und führe aus:

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# ENCRYPTION_KEY
openssl rand -hex 16

# CRON_SECRET
openssl rand -base64 32
```

Kopiere die ausgegebenen Werte und trage sie in Vercel ein.

---

### Schritt 7: Deployment neu starten

Nach dem Setzen aller Variablen:

1. Gehe zu **Deployments** (oben im Menü)
2. Klicke auf die drei Punkte (⋯) beim letzten Deployment
3. Wähle **Redeploy**
4. Oder: Mache einen kleinen Commit und pushe (Vercel deployt automatisch)

---

### Schritt 8: Testen

Nach dem Deployment:

1. Öffne: https://plrt-ruby.vercel.app
2. Gehe zu `/login` und melde dich an
3. Gehe zu `/profile`
4. Klicke auf "Mit Strava verbinden"
5. Du solltest zu Strava weitergeleitet werden
6. Nach der Autorisierung zurück zur App

---

## ✅ Checkliste

- [ ] Strava Client ID kopiert
- [ ] Strava Client Secret kopiert
- [ ] `STRAVA_CLIENT_ID` in Vercel gesetzt
- [ ] `STRAVA_CLIENT_SECRET` in Vercel gesetzt
- [ ] `NEXTAUTH_URL` in Vercel gesetzt
- [ ] `DATABASE_URL` in Vercel gesetzt
- [ ] `NEXTAUTH_SECRET` in Vercel gesetzt
- [ ] `ENCRYPTION_KEY` in Vercel gesetzt
- [ ] `CRON_SECRET` in Vercel gesetzt
- [ ] Deployment neu gestartet
- [ ] Strava-Verbindung getestet

---

## 🆘 Probleme?

### "Invalid client" Fehler
- Prüfe, ob Client ID und Secret korrekt kopiert wurden (keine Leerzeichen)
- Prüfe, ob die Callback Domain in Strava korrekt ist: `plrt-ruby.vercel.app`

### "Redirect URI mismatch"
- Prüfe in Strava: Callback Domain = `plrt-ruby.vercel.app`
- Prüfe in Vercel: `NEXTAUTH_URL` = `https://plrt-ruby.vercel.app`

### Datenbank-Fehler
- Stelle sicher, dass `DATABASE_URL` korrekt ist
- Prüfe, ob die Datenbank von außen erreichbar ist (nicht nur localhost)
- Führe `prisma migrate deploy` in Vercel aus (oder über Vercel CLI)

---

## 📝 Schnell-Referenz: Alle Variablen

```
STRAVA_CLIENT_ID=[Deine Client ID]
STRAVA_CLIENT_SECRET=[Dein Client Secret]
NEXTAUTH_URL=https://plrt-ruby.vercel.app
STRAVA_REDIRECT_URI=https://plrt-ruby.vercel.app/api/auth/callback/strava
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=[openssl rand -base64 32]
ENCRYPTION_KEY=[openssl rand -hex 16]
CRON_SECRET=[openssl rand -base64 32]
```

Viel Erfolg! 🚀
