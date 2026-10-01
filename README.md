# simpsons-instagram

Simpsons baseball team related Instagram/content development workspace.

This repository is initialized so Codex can work from GitHub on any PC. The repository does **not** assume an application architecture yet; implementation scope should follow explicit user tasks and the project context.

## Codex entry point

Read these files before making changes:

1. `AGENTS.md`
2. `docs/PROJECT_CONTEXT.md`
3. `docs/PROGRESS.md`

Do not invent product scope, posting automation, account integrations, or paid services that are not explicitly requested.

## Multi-PC development

GitHub is the shared source of truth.

Initial setup:

```powershell
git clone https://github.com/Mitsuru-sato37/simpsons-instagram.git
cd simpsons-instagram
```

At the start of each session:

```powershell
git status
git fetch origin
git switch main
git pull --ff-only
```

Use a `codex/<topic>` branch for coherent work. Before switching PCs, commit and push. Resume on another PC by fetching and switching to the same branch.

Important project assets such as source images, logos, roster data, or credentials must not exist only as uncommitted local files.
