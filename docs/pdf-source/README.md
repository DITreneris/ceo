# PDF interiors (operator-local)

Paid playbook HTML is **not** in git. Keep the files on this machine only:

- `operating-cadence.html` — 21-page Operations playbook
- `strategic-os.html` — 43-page Strategy playbook

Tracked here: `pdf-print.css` (Letter print stylesheet).

## Export

```bash
npm run pdf:export      # writes gitignored api/_private/pdfs/*.pdf
npm run pdf:upload-blob # private Vercel Blob; same paid-pdfs/ paths
```

`pdf:export` does not update buyer files. Do not commit the HTML interiors or the PDF binaries.
