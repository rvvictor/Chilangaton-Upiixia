# Agent messages

Append-only; use bash .uak/bin/uak msg / inbox. Format: - N | epoch | from | to | kind | task | text

- 1 | 1792951459 | victor-1 | task:PB-001 | info | PB-001 | PB-001 amended by victor: Paths pyproject.toml, uv.lock, .python-version, app/__init__.py, app/main.py, app/config.py, app/routers/__init__.py, app/services/__init__.py, app/tests/__init__.py, app/tests/test_health.py, web/package.json, web/package-lock.json, web/index.html, web/vite.config.ts, web/tsconfig.json, web/tsconfig.app.json, web/tsconfig.node.json, web/.oxlintrc.json, web/.gitignore, web/public/, web/src/App.tsx, web/src/main.tsx, web/src/index.css, web/src/vite-env.d.ts, web/src/lib/api.ts, .env.example, .gitignore, .uak/bin/smoke-project, .uak/bin/.smoke-project.provenance · Verify `bash .uak/bin/smoke`. uak status --task PB-001; the merge gate checks the new Paths.
