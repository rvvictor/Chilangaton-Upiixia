# Shared-file owners

One writer per shared file. Others ask the owner with `uak msg ID --kind request`. Patterns are relative, with no spaces; directories end in `/`.
An owner is not a prerequisite for everyone: consumers work on published contracts and mocks. To transfer ownership, open a PR to main.

| Pattern | Owner task |
|---|---|
| pyproject.toml | PB-001 |
| uv.lock | PB-001 |
| web/package.json | PB-001 |
| web/package-lock.json | PB-001 |
| app/main.py | PB-001 |
| app/config.py | PB-001 |
| web/src/App.tsx | PB-001 |
| web/src/index.css | PB-001 |
| .env.example | PB-001 |
| .gitignore | PB-001 |
| .github/workflows/ | PB-001 |
| .uak/PROJECT.md | PB-001 |
| app/schemas/ | PB-002 |
| app/fixtures/ | PB-002 |
| web/src/lib/types.ts | PB-002 |
| web/DESIGN.md | PB-003 |
| web/src/lib/ui/ | PB-003 |
| web/src/lib/map/ | PB-003 |
| app/services/eventos.py | PB-007 |
