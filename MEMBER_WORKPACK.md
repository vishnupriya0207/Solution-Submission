# Member 1 — Frontend UI & presentation

Based on the supplied `brightloop-360.zip` starter project.

## Assigned branch
`feature/member-1-frontend`

## Your tasks
- [ ] Improve responsive layout and navigation in client/src/style.css.
- [ ] Integrate the supplied formatters into appropriate dashboard/table cells.
- [ ] Check dashboard, forms, tables, empty states and mobile layout.
- [ ] Do not change server/index.js or package manifests.

## Important: use the one shared GitHub repository
This ZIP includes the starter project for reference and local testing. The
coordinator should create the team's shared repository from the original
starter project. Each member must clone that shared repository, create their
own branch, and copy/implement only their assigned contribution files and
changes. Do NOT push this entire ZIP as a separate project or overwrite
teammates' work.

## Git workflow
```bash
git clone <SHARED_REPOSITORY_URL>
cd brightloop-360
git switch -c feature/member-1-frontend
# Copy your assigned contribution files into this shared clone.
git status
git add <only-your-assigned-files>
git commit -m "feat: complete assigned contribution"
git push -u origin feature/member-1-frontend
```

Then open a Pull Request into `main`. Explain what you personally changed,
how you tested it, and what remains incomplete. Commit only work you actually
completed; do not create artificial commits or claim unimplemented work.
