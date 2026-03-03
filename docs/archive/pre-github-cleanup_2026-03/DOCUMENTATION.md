# Dokumentų valdymas

**Tikslas:** kad repozitorijoje liktų tik aktuali, trumpa dokumentacija, o „legacy“ versijos būtų aiškiai atskirtos archyve.

## Greita schema

| Sritis | Dokumentas | Kam skirta |
|--------|------------|------------|
| **Navigacija** | `docs/INDEX.md` | Vienas įėjimo taškas į aktyvią dokumentaciją |
| **Apžvalga** | `README.md` | Kas tai per projektas ir kaip naudoti |
| **Užduotys** | `todo.md`, `roadmap.md` | Kas daroma dabar ir kas vėliau |
| **Deploy** | `DEPLOYMENT.md` | Kaip deploy’inti į GitHub Pages |
| **Versijos** | `CHANGELOG.md` | Pakeitimų istorija (SemVer) |
| **Kokybė** | `docs/QA_STANDARTAS.md` | `npm test`, pa11y, kriterijai |
| **Testavimas** | `docs/TESTAVIMAS.md` | Gyvas testavimas po deploy |
| **UX auditas** | `docs/UI_UX_MIKRO_AUDITAS_KISS_MARRY_KILL.md` | Mikro-audito metodika, `KISS-MARRY-KILL`, KPI ir validavimo checklist |

## Aktyvių dokumentų taisyklė

- Aktyvi kasdienė navigacija prasideda nuo `docs/INDEX.md`.
- Jei dokumentas yra tik `docs/archive/`, jis laikomas legacy, kol aiškiai neperkeltas į aktyvią schemą.
- Keičiant aktyvius srautus (QA, deploy, first-run), atnaujinti atitinkamą aktyvų dokumentą ir `CHANGELOG.md`.

## Archyvas

- `docs/archive/` – sena / nebeaktuali medžiaga (ankstesni projektai, konceptai, auditai).
  - Ten laikome „kad neprapultų“, bet **nebesiremiame** kasdieniam darbui.

## Terminų taisyklė (aktyviems docs)

- Pirmas paminėjimas: `užklausa (promptas)`.
- Toliau tame pačiame dokumente: `promptas`.
- Brand pavadinimų (pvz., „Promptų anatomija“) nekeičiam.
