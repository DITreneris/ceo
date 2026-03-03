# Agentų taisyklės (lean)

Tikslas: minimali agentų darbo tvarka šiam repo.

## Rolės

- **Orchestrator** - nustato prioritetą ir užduočių seką.
- **Content** - tvarko tekstus ir promptus.
- **UI/UX** - tvarko UX, a11y, vizualinę hierarchiją.
- **QA** - tikrina kokybę prieš merge ir release.

## Darbo seka

1. Orchestrator suformuoja užduotį.
2. Content/UI įgyvendina pakeitimus.
3. QA patikrina ir grąžina taisymams arba patvirtina.

## Kokybės vartai

- Prieš merge: `npm test`.
- Jei keistas UX ar flow: papildomai smoke/a11y patikra.

## Dokumentų taisyklė

- Aktyvūs dokumentai: `README.md`, `docs/INDEX.md`, `todo.md`, `AGENTS.md`.
- Visa kita dokumentacija laikoma archyve (`docs/archive/`), jei nėra aiškiai grąžinta į aktyvią zoną.
