# Neon Datenbank Setup

## 🎯 Ziel: PostgreSQL Datenbank bei Neon einrichten

### Schritt 1: Neon Account erstellen

1. Gehe zu: https://neon.tech
2. Klicke auf **Sign Up** oder **Get Started**
3. Melde dich mit GitHub an (empfohlen) oder erstelle einen Account

---

### Schritt 2: Neues Projekt erstellen

1. Klicke auf **Create a project**
2. Fülle das Formular aus:
   - **Name**: `plrt` (oder `plrt-triathlon-verein`)
   - **Region**: Wähle die nächstgelegene Region (z.B. `Frankfurt, Germany`)
   - **PostgreSQL version**: `16` (empfohlen) oder `15`
   - **Pricing Plan**: **Free** (für den Start ausreichend)
3. Klicke auf **Create project**
4. ⏳ Warte einige Sekunden, bis das Projekt erstellt ist

---

### Schritt 3: Database URL finden

1. Im Neon Dashboard siehst du dein Projekt
2. Klicke auf dein Projekt
3. Du siehst einen Bereich **Connection Details**
4. Klicke auf **Connection string** Tab
5. Wähle **URI** aus
6. Du siehst eine URL wie:
   ```
   postgresql://username:password@ep-xxxxx-xxxxx.region.aws.neon.tech/neondb?sslmode=require
   ```
7. **Kopiere diese URL** - sie ist bereits vollständig und enthält:
   - Username
   - Password (wird automatisch generiert)
   - Host
   - Database name
   - SSL-Modus

**Wichtig**: Neon zeigt das Passwort nur einmal an! Speichere es sicher.

---

### Schritt 4: Passwort anzeigen/speichern

1. Im **Connection Details** Bereich
2. Klicke auf **Show** neben dem Passwort
3. **Kopiere und speichere das Passwort sicher**
4. Die vollständige URL ist bereits fertig - du musst nichts ändern

**Alternative**: Falls du das Passwort verloren hast:
1. Gehe zu **Settings** → **Password**
2. Klicke auf **Reset password**
3. Kopiere das neue Passwort
4. Aktualisiere die DATABASE_URL in Vercel

---

### Schritt 5: DATABASE_URL in Vercel eintragen

1. Gehe zu: https://vercel.com/dashboard
2. Wähle dein Projekt **plrt** aus
3. **Settings** → **Environment Variables**
4. Klicke auf **Add New**
5. Trage ein:
   - **Key**: `DATABASE_URL`
   - **Value**: [Deine komplette Neon URL aus Schritt 3]
   - ✅ **Production**, ✅ **Preview**, ✅ **Development**
6. Klicke auf **Save**

**Beispiel:**
```
DATABASE_URL=postgresql://username:password@ep-xxxxx-xxxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

---

### Schritt 6: Datenbank-Migrationen ausführen

Nach dem Setzen der DATABASE_URL musst du die Datenbank-Struktur erstellen.

#### Option A: Lokal (Empfohlen)

1. Erstelle eine lokale `.env` Datei (falls noch nicht vorhanden):
   ```bash
   cp .env.example .env
   ```

2. Setze DATABASE_URL in `.env`:
   ```env
   DATABASE_URL="deine-neon-url"
   ```

3. Führe Migrationen aus:
   ```bash
   npx prisma migrate deploy
   ```
   
   Oder für Entwicklung:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Optional: Seed-Daten laden:
   ```bash
   npm run db:seed
   ```

#### Option B: Über Vercel CLI

1. Installiere Vercel CLI (falls noch nicht installiert):
   ```bash
   npm install -g vercel
   ```

2. Login zu Vercel:
   ```bash
   vercel login
   ```

3. Linke dein Projekt:
   ```bash
   vercel link
   ```

4. Lade Environment Variables lokal:
   ```bash
   vercel env pull .env.local
   ```

5. Führe Migrationen aus:
   ```bash
   npx prisma migrate deploy
   ```

#### Option C: Über Neon SQL Editor

1. Gehe zu Neon Dashboard → **SQL Editor**
2. Klicke auf **New query**
3. Führe lokal aus, um SQL zu generieren:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Kopiere die generierten SQL-Befehle aus `prisma/migrations/.../migration.sql`
5. Füge sie in den Neon SQL Editor ein
6. Klicke auf **Run**

---

### Schritt 7: Seed-Daten laden (Optional)

Falls du Testdaten haben möchtest:

1. Stelle sicher, dass `DATABASE_URL` in deiner lokalen `.env` gesetzt ist
2. Führe aus:
   ```bash
   npm run db:seed
   ```

Das erstellt:
- 2 Test-User (admin@plrt.de, member@plrt.de)
- 3 Athleten
- 5 Termine
- 2 Downloads
- Beispiel-Statistiken

---

### Schritt 8: Verbindung testen

1. Öffne deine Vercel-App: https://plrt-ruby.vercel.app
2. Versuche dich anzumelden
3. Prüfe, ob die Datenbank-Verbindung funktioniert

---

## ✅ Checkliste

- [ ] Neon Account erstellt
- [ ] Neues Projekt erstellt
- [ ] DATABASE_URL aus Neon kopiert
- [ ] Passwort sicher gespeichert
- [ ] DATABASE_URL in Vercel gesetzt
- [ ] Migrationen ausgeführt
- [ ] Seed-Daten geladen (optional)
- [ ] Verbindung getestet

---

## 🔒 Sicherheit

### Wichtige Hinweise:

1. **Passwort niemals committen**
   - Die DATABASE_URL enthält dein Passwort
   - Nur in Vercel Environment Variables setzen
   - Nicht in Git committen

2. **Neon Dashboard**
   - Du kannst das Passwort im Neon Dashboard zurücksetzen
   - Settings → Password → Reset password

3. **Connection Pooling** (Automatisch bei Neon)
   - Neon bietet automatisches Connection Pooling
   - Die URL funktioniert direkt mit Pooling
   - Keine zusätzliche Konfiguration nötig

---

## 🆘 Probleme?

### "Connection refused"
- Prüfe, ob `?sslmode=require` am Ende der URL steht
- Prüfe, ob die URL vollständig kopiert wurde
- Prüfe, ob das Projekt in Neon aktiv ist

### "Password authentication failed"
- Das Passwort in der URL stimmt nicht
- Reset das Passwort in Neon: Settings → Password → Reset password
- Aktualisiere die DATABASE_URL in Vercel

### "Relation does not exist"
- Migrationen wurden noch nicht ausgeführt
- Führe `npx prisma migrate deploy` aus

### "Database does not exist"
- Prüfe, ob der Datenbankname in der URL korrekt ist
- Neon erstellt standardmäßig eine Datenbank namens `neondb`
- Falls nötig, erstelle eine neue Datenbank im Neon Dashboard

---

## 📝 Schnell-Referenz

**Neon DATABASE_URL Format:**
```
postgresql://username:password@ep-xxxxx-xxxxx.region.aws.neon.tech/neondb?sslmode=require
```

**Vercel Environment Variable:**
- Key: `DATABASE_URL`
- Value: [Deine komplette Neon URL]
- Environments: Production, Preview, Development

**Migrationen ausführen:**
```bash
# Lokal (mit .env)
npx prisma migrate deploy

# Mit expliziter URL
DATABASE_URL="deine-url" npx prisma migrate deploy
```

---

## 💡 Neon Vorteile

- ✅ **Automatisches Connection Pooling** - keine zusätzliche Konfiguration
- ✅ **Serverless** - zahle nur für das, was du nutzt
- ✅ **Schnelle Setup** - Datenbank in Sekunden erstellt
- ✅ **Automatische Backups** - auch im Free Plan
- ✅ **Branching** - erstelle Datenbank-Branches für Testing (Pro Feature)

---

Viel Erfolg! 🚀
