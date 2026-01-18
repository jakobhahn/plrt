# Strava App Setup Anleitung

## App-Symbol hinzufügen

Strava benötigt ein App-Symbol (Logo) für deine Anwendung. Hier sind die Anforderungen:

### Anforderungen:
- **Format**: PNG oder JPG
- **Größe**: 256x256 Pixel (empfohlen)
- **Maximale Dateigröße**: 2 MB
- **Hintergrund**: Transparent oder einfarbig

### Optionen:

#### Option 1: Einfaches Logo erstellen
Ich habe eine SVG-Datei erstellt: `public/strava-app-icon.svg`

**Umwandeln zu PNG:**
1. Öffne die SVG in einem Bildbearbeitungsprogramm (z.B. GIMP, Photoshop, oder online: https://convertio.co/svg-png/)
2. Exportiere als PNG mit 256x256 Pixel
3. Lade das PNG in Strava hoch

#### Option 2: Online Logo erstellen
- **Canva**: https://www.canva.com (kostenlos, Logo-Vorlagen)
- **LogoMaker**: https://www.logomaker.com
- **Figma**: https://www.figma.com (kostenlos)

**Einfaches Design-Vorschlag:**
- Hintergrund: Orange (#FC4C02 - Strava-Farbe) oder Blau (#0066CC)
- Text: "PLRT" in weiß, groß und fett
- Optional: Lauf- oder Triathlon-Icon

#### Option 3: Vereinslogo verwenden
Falls du bereits ein Vereinslogo hast:
1. Öffne das Logo
2. Passe die Größe auf 256x256 Pixel an
3. Stelle sicher, dass es quadratisch ist
4. Speichere als PNG
5. Lade in Strava hoch

### Hochladen in Strava:

1. Gehe zu https://www.strava.com/settings/api
2. Wähle deine App aus
3. Klicke auf "App-Symbol aktualisieren" oder "Symbol hinzufügen"
4. Lade dein 256x256 PNG-Bild hoch
5. Speichere

### Schnell-Lösung (Online Converter):

1. Öffne: https://convertio.co/svg-png/
2. Lade `public/strava-app-icon.svg` hoch
3. Setze Größe auf 256x256
4. Lade das PNG herunter
5. Lade es in Strava hoch

---

## Nach dem Symbol-Upload

Sobald das Symbol hochgeladen ist, kannst du:
- ✅ Client ID und Client Secret sehen
- ✅ Die App in Vercel konfigurieren
- ✅ Die OAuth-Verbindung testen

---

## Nächste Schritte

Nach dem Symbol-Upload:

1. **Notiere dir Client ID und Client Secret**
2. **Setze in Vercel**:
   - `STRAVA_CLIENT_ID` = [Deine Client ID]
   - `STRAVA_CLIENT_SECRET` = [Dein Client Secret]
3. **Callback Domain** sollte bereits gesetzt sein: `plrt-ruby.vercel.app`

Die App ist dann einsatzbereit! 🚀
