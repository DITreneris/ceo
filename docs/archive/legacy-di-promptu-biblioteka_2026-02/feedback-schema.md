# Feedback Store – Duomenų schema

**Paskirtis:** Grįžtamojo ryšio ir metrikų saugojimo struktūra agentų sistemos continuous improvement ciklui.  
**Schema versija:** 1.0 (pakeitimų istorija – CHANGELOG.md).

---

## Schema apžvalga

| Laukas      | Tipas   | Privaloma | Aprašymas                              |
|-------------|---------|-----------|----------------------------------------|
| id          | string  | Taip      | Unikalus įrašo identifikatorius        |
| data        | datetime| Taip      | Įrašo sukūrimo data/laikas             |
| tipas       | enum    | Taip      | bug \| feature \| feedback \| metrika  |
| agentas     | enum    | Ne        | content \| curriculum \| ui \| qa \| orchestrator |
| sesija_id   | string  | Ne        | Vartotojo sesijos identifikatorius     |
| turinys     | text    | Ne        | Grįžtamojo ryšio tekstas arba JSON     |
| prioritetas | enum    | Ne        | low \| medium \| high \| critical      |
| statusas    | enum    | Ne        | open \| in_progress \| resolved \| closed |

---

## Implementacijos variantai

### 1. Google Sheets

**Stulpeliai:** Data/Laikas | El. paštas | Vardas | Klausimas | Šaltinis | Tipas | Prioritetas | Statusas

Galima išplėsti esamą kontaktų lapą arba sukurti atskirą „Feedback“ lapą.

### 2. Supabase / PostgreSQL

```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tipas TEXT CHECK (tipas IN ('bug', 'feature', 'feedback', 'metrika')),
  agentas TEXT CHECK (agentas IN ('content', 'curriculum', 'ui', 'qa', 'orchestrator')),
  sesija_id TEXT,
  turinys TEXT,
  prioritetas TEXT CHECK (prioritetas IN ('low', 'medium', 'high', 'critical')),
  statusas TEXT DEFAULT 'open' CHECK (statusas IN ('open', 'in_progress', 'resolved', 'closed'))
);
```

### 3. JSON failas (MVP)

Paprasta struktūra failo saugojimui:

```json
{
  "feedback": [
    {
      "id": "fb-001",
      "data": "2026-02-18T10:00:00Z",
      "tipas": "feedback",
      "agentas": "content",
      "sesija_id": "sess_xyz",
      "turinys": "Promptas #3 neaiškus",
      "prioritetas": "medium",
      "statusas": "open"
    }
  ]
}
```

---

## Šaltiniai duomenims

- Google Sheets (kontaktų forma)
- Analytics (sesijų, klikų)
- QA Agent rezultatai
- Production metrikos (page load, a11y scores)

---

## Continuous improvement integracija

1. **Rinkti** – Feedback Store įrašai iš šaltinių
2. **Analizuoti** – Orchestrator + Curriculum prioritetų formavimas
3. **Planuoti** – Backlog atnaujinimas
4. **Įgyvendinti** – Content + UI/UX agentai
5. **Validuoti** – QA Agent
6. **Išleisti** – GitHub merge / deploy
7. **Stebėti** – grįžti į „Rinkti“

---

**Paskutinis atnaujinimas:** 2026-02-18
