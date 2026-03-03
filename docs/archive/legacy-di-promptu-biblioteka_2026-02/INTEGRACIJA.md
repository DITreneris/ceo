# Kontaktų Rinkimo Integracija – Instrukcijos

> **Dabartinis etapas: minimali aplikacija.** Šiuo metu kontaktų forma ir duomenų rinkimas yra **išjungti** – nerinkime jokių vartotojų duomenų. Šis dokumentas skirtas **vėlesniems etapams**, kai bus nuspręsta įjungti el. pašto rinkimą ar atsiliepimų formą.

## Apie integraciją (kai bus įjungta)

Kontaktų rinkimo forma leidžia vartotojams palikti el. pašto adresą ir klausimus. Duomenys gali būti įrašomi į Google Sheets arba siunčiami kitais būdais.

**📊 Nežinote, kurį variantą pasirinkti?** Žr. [VARIANTU_PALYGINIMAS.md](./VARIANTU_PALYGINIMAS.md)

## Variantai integracijos

### ✅ Variantas 1: Google Sheets + Apps Script (REKOMENDUOJAMAS)

**Privalumai:**
- ✅ Nemokamas
- ✅ Duomenys tiesiogiai Google Sheets
- ✅ Lengvai valdomi duomenys
- ✅ Galima pridėti automatinius email pranešimus
- ✅ Nereikia backend serverio

**Trūkumai:**
- ⚠️ Reikia sukurti Google Apps Script (5-10 min)

---

### Variantas 2: EmailJS

**Privalumai:**
- ✅ Labai paprastas setup (2-3 min)
- ✅ Nemokamas tier (200 email/mėn)
- ✅ Automatiniai email pranešimai
- ✅ Nereikia backend

**Trūkumai:**
- ⚠️ Duomenys ne Google Sheets (bet galima integruoti)
- ⚠️ Ribotas nemokamas tier

---

### Variantas 3: Formspree

**Privalumai:**
- ✅ Labai paprastas
- ✅ Nemokamas tier (50 pateikimų/mėn)
- ✅ Automatiniai email
- ✅ Galima eksportuoti duomenis

**Trūkumai:**
- ⚠️ Ribotas nemokamas tier

---

## 📋 Instrukcijos: Google Sheets + Apps Script

### 1 žingsnis: Sukurti Google Sheets dokumentą

1. Eikite į [Google Sheets](https://sheets.google.com)
2. Sukurkite naują dokumentą
3. Pirmoje eilutėje sukurkite stulpelius:
   - **A1**: `Data/Laikas`
   - **B1**: `El. paštas`
   - **C1**: `Vardas`
   - **D1**: `Klausimas`
   - **E1**: `Šaltinis`
   - **F1**: `Tipas` (Feedback Store: bug | feature | feedback)

### 2 žingsnis: Sukurti Apps Script

1. Google Sheets dokumente: **Extensions** → **Apps Script**
2. Ištrinkite visą kodą ir įklijuokite kodą iš `google-apps-script.js` failo (arba žemiau esantį kodą):

```javascript
function doPost(e) {
  try {
    // Gauti duomenis iš POST užklausos
    const data = JSON.parse(e.postData.contents);
    
    // Gauti aktyvų lapą
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Pridėti naują eilutę
    sheet.appendRow([
      new Date(),                    // Data/Laikas
      data.email || '',              // El. paštas
      data.name || 'Nenurodytas',    // Vardas
      data.question || 'Nėra',       // Klausimas
      data.source || 'Promptų anatomija' // Šaltinis
    ]);
    
    // Grąžinti sėkmės atsakymą
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Grąžinti klaidos atsakymą
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Testavimo funkcija (neprivaloma)
function test() {
  const testData = {
    email: 'test@example.com',
    name: 'Testas',
    question: 'Test klausimas',
    source: 'Test'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
```

### 3 žingsnis: Išsaugoti ir publikuoti Apps Script

1. Spauskite **Save** (💾) ir pavadinkite projektą (pvz., "Contact Form Handler")
2. Spauskite **Deploy** → **New deployment**
3. Pasirinkite tipą: **Web app**
4. Nustatymai:
   - **Description**: "Contact Form Handler v1"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone" (svarbu!)
5. Spauskite **Deploy**
6. **Pirmą kartą** gausite autorizacijos prašymą:
   - Spauskite **Authorize access**
   - Pasirinkite savo Google paskyrą
   - Spauskite **Advanced** → **Go to [Project Name] (unsafe)**
   - Spauskite **Allow**
7. Nukopijuokite **Web app URL** (tai jūsų `GOOGLE_SCRIPT_URL`)

### 4 žingsnis: Pridėti URL į HTML

1. Atidarykite `index.html`
2. Raskite eilutę:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Pakeiskite į jūsų Apps Script URL:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```

### 5 žingsnis: Testuoti

1. Atidarykite `index.html` naršyklėje
2. Spauskite "Sužinokite daugiau"
3. Užpildykite formą ir siųskite
4. Patikrinkite Google Sheets - turėtų atsirasti nauja eilutė!

---

## 📧 Instrukcijos: EmailJS (Alternatyvus variantas)

### 1 žingsnis: Sukurti EmailJS paskyrą

1. Eikite į [EmailJS](https://www.emailjs.com/)
2. Sukurkite nemokamą paskyrą
3. Patvirtinkite el. paštą

### 2 žingsnis: Sukonfigūruoti Email Service

1. **Email Services** → **Add New Service**
2. Pasirinkite savo email provider (Gmail, Outlook, etc.)
3. Sekite instrukcijas ir sukonfigūruokite

### 3 žingsnis: Sukurti Email Template

1. **Email Templates** → **Create New Template**
2. Template ID: `contact_form` (arba bet koks)
3. Template turinys:
   ```
   Nauja užklausa iš DI Bibliotekos:
   
   El. paštas: {{email}}
   Vardas: {{name}}
   Klausimas: {{question}}
   
   Data: {{timestamp}}
   ```
4. Išsaugokite ir nukopijuokite **Template ID**

### 4 žingsnis: Gauti Public Key

1. **Account** → **General**
2. Nukopijuokite **Public Key**

### 5 žingsnis: Pridėti į HTML

1. Atidarykite `index.html`
2. Raskite komentuotą EmailJS kodą ir atkomentuokite:
   ```javascript
   const EMAILJS_SERVICE_ID = 'your_service_id';
   const EMAILJS_TEMPLATE_ID = 'your_template_id';
   const EMAILJS_PUBLIC_KEY = 'your_public_key';
   ```
3. Pridėkite EmailJS script į `<head>`:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
   ```
4. Modifikuokite `handleContactSubmit` funkciją, kad naudotų EmailJS vietoj Google Sheets

---

## 🔧 Troubleshooting

### Google Sheets negauna duomenų

1. **Patikrinkite Apps Script URL** - ar teisingas?
2. **Patikrinkite Apps Script permissions** - ar "Anyone" turi prieigą?
3. **Patikrinkite browser console** - ar yra klaidų?
4. **Testuokite Apps Script** - naudokite `test()` funkciją Apps Script redaktoriuje

### Forma neatsidaro

1. Patikrinkite browser console klaidas
2. Patikrinkite, ar JavaScript nėra sintaksės klaidų
3. Patikrinkite, ar modal HTML yra teisingai pridėtas

### EmailJS neveikia

1. Patikrinkite, ar pridėtas EmailJS script tag
2. Patikrinkite Service ID, Template ID ir Public Key
3. Patikrinkite browser console klaidas

---

## 📊 Duomenų struktūra

### Google Sheets stulpeliai:

| Data/Laikas | El. paštas | Vardas | Klausimas | Šaltinis |
|------------|-----------|--------|-----------|----------|
| 2024-01-15 10:30:00 | user@example.com | Jonas | Kaip integruoti DI? | DI Promptų Biblioteka |

---

## 🎨 Dizaino pritaikymas

Jei norite pakeisti modal dizainą, redaguokite CSS sekciją `/* ===== MODAL ===== */` faile `index.html`.

---

## 🔒 Saugumas

- ✅ Email validacija vyksta kliento pusėje
- ✅ Google Apps Script turi autorizaciją
- ⚠️ **Svarbu**: Nenaudokite jautrių duomenų be papildomos saugumo validacijos
- ⚠️ **Rekomenduojama**: Pridėti CAPTCHA didesniam saugumui (pvz., Google reCAPTCHA)

---

## 📝 Papildomi patobulinimai

Galite pridėti:
- 📧 Automatinius email pranešimus (per Apps Script arba EmailJS)
- 🔔 Slack/Teams pranešimus
- 📊 Analytics integraciją
- 🛡️ CAPTCHA apsaugą
- 📱 SMS pranešimus (per Twilio)

---

**Klausimai?** Susisiekite su projekto autoriumi.
