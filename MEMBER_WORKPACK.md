# Member 3 — Subscription lifecycle & billing calculations

Based on the supplied `brightloop-360.zip` starter project.

## Assigned branch
`feature/member-3-billing`

## Your tasks
- [ ] Integrate calculateInvoiceTotals into invoice generation.
- [ ] Use the subscription plan interval to calculate the next billing date.
- [ ] Prevent duplicate invoices and overpayments.
- [ ] Test daily, weekly, monthly and yearly plans plus tax/discount scenarios.

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
git switch -c feature/member-3-billing
# Copy your assigned contribution files into this shared clone.
git status
git add <only-your-assigned-files>
git commit -m "feat: complete assigned contribution"
git push -u origin feature/member-3-billing
```

Then open a Pull Request into `main`. Explain what you personally changed,
how you tested it, and what remains incomplete. Commit only work you actually
completed; do not create artificial commits or claim unimplemented work.
