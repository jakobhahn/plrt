# Supabase Datenbank Setup

## 🎯 Ziel: PostgreSQL Datenbank bei Supabase einrichten

### Schritt 1: Supabase Account erstellen

1. Gehe zu: https://supabase.com
2. Klicke auf **Start your project** oder **Sign in**
3. Melde dich mit GitHub an (empfohlen) oder erstelle einen Account

---

### Schritt 2: Neues Projekt erstellen

1. Klicke auf **New Project**
2. Fülle das Formular aus:
   - **Name**: `plrt` (oder `plrt-triathlon-verein`)
   - **Database Password**: 
     - ⚠️ **WICHTIG**: Wähle ein sicheres Passwort
     - **Speichere es sicher** - du brauchst es für die DATABASE_URL
     - Beispiel: `MeinSicheresPasswort123!`
   - **Region**: Wähle die nächstgelegene Region (z.B. `West EU (Frankfurt)`)
   - **Pricing Plan**: **Free** (für den Start ausreichend)
3. Klicke auf **Create new project**
4. ⏳ Warte 1-2 Minuten, bis das Projekt erstellt ist

---

### Schritt 3: Database URL finden

1. Im Supabase Dashboard, klicke auf **Settings** (Zahnrad-Icon links)
2. Klicke auf **Database** (in der linken Sidebar)
3. Scrolle runter zu **Connection string**
4. Wähle **URI** aus
5. Du siehst eine URL wie:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. **Ersetze `[YOUR-PASSWORD]`** mit dem Passwort, das du in Schritt 2 erstellt hast
7. **Füge am Ende hinzu**: `?sslmode=require`
8. Die finale URL sieht so aus:
   ```
   postgresql://postgres:MeinSicheresPasswort123!@db.xxxxx.supabase.co:5432/postgres?sslmode=require
   ```

---

### Schritt 4: DATABASE_URL in Vercel eintragen

1. Gehe zu: https://vercel.com/dashboard
2. Wähle dein Projekt **plrt** aus
3. **Settings** → **Environment Variables**
4. Klicke auf **Add New**
5. Trage ein:
   - **Key**: `DATABASE_URL`
   - **Value**: [Deine komplette Supabase URL aus Schritt 3]
   - ✅ **Production**, ✅ **Preview**, ✅ **Development**
6. Klicke auf **Save**

**Beispiel:**
```
DATABASE_URL=postgresql://postgres:MeinPasswort123!@db.abcdefghijk.supabase.co:5432/postgres?sslmode=require
```

---

### Schritt 5: Datenbank-Migrationen ausführen

Nach dem Setzen der DATABASE_URL musst du die Datenbank-Struktur erstellen.

#### Option A: Über Vercel CLI (Empfohlen)

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

4. Führe Migrationen aus:
   ```bash
   npx prisma migrate deploy
   ```
   
   Oder mit expliziter DATABASE_URL:
   ```bash
   DATABASE_URL="deine-supabase-url" npx prisma migrate deploy
   ```

#### Option B: Über Supabase SQL Editor

1. Gehe zu Supabase Dashboard → **SQL Editor**
2. Klicke auf **New query**
3. Führe lokal aus:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Kopiere die generierten SQL-Befehle aus `prisma/migrations/.../migration.sql`
5. Füge sie in den Supabase SQL Editor ein
6. Klicke auf **Run**

#### Option C: Über Prisma Studio (Lokal)

1. Setze DATABASE_URL lokal in `.env`:
   ```env
   DATABASE_URL="deine-supabase-url"
   ```

2. Führe Migrationen aus:
   ```bash
   npx prisma migrate deploy
   ```

3. Optional: Seed-Daten laden:
   ```bash
   npm run db:seed
   ```

---

### Schritt 6: Seed-Daten laden (Optional)

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

### Schritt 7: Verbindung testen

1. Öffne deine Vercel-App: https://plrt-ruby.vercel.app
2. Versuche dich anzumelden
3. Prüfe, ob die Datenbank-Verbindung funktioniert

---

## ✅ Checkliste

- [ ] Supabase Account erstellt
- [ ] Neues Projekt erstellt
- [ ] Datenbank-Passwort sicher gespeichert
- [ ] DATABASE_URL aus Supabase kopiert
- [ ] `[YOUR-PASSWORD]` in URL ersetzt
- [ ] `?sslmode=require` hinzugefügt
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

2. **Supabase Dashboard**
   - Du kannst das Passwort im Supabase Dashboard ändern
   - Settings → Database → Reset database password

3. **Connection Pooling** (Optional, für Production)
   - Supabase bietet Connection Pooling an
   - URL-Format: `postgresql://postgres.xxxxx:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`
   - Für bessere Performance bei vielen gleichzeitigen Verbindungen

---

## 🆘 Probleme?

### "Connection refused"
- Prüfe, ob `?sslmode=require` am Ende der URL steht
- Prüfe, ob das Passwort korrekt ist (keine Leerzeichen)
- Prüfe, ob die Region korrekt ist

### "Password authentication failed"
- Das Passwort in der URL stimmt nicht
- Reset das Passwort in Supabase: Settings → Database → Reset database password
- Aktualisiere die DATABASE_URL in Vercel

### "Relation does not exist"
- Migrationen wurden noch nicht ausgeführt
- Führe `npx prisma migrate deploy` aus

### "Too many connections"
- Nutze Connection Pooling (siehe oben)
- Oder: Upgrade auf einen höheren Supabase Plan

---

## 📝 Schnell-Referenz

**Supabase DATABASE_URL Format:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
```

**Mit Connection Pooling:**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require
```

**Vercel Environment Variable:**
- Key: `DATABASE_URL`
- Value: [Deine komplette URL]
- Environments: Production, Preview, Development

---

Viel Erfolg! 🚀
