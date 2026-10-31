// Reusable display helpers for Brightloop 360.
export function formatINR(value: unknown): string {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
    .format(Number.isFinite(amount) ? amount : 0);
}
export function formatDate(value: unknown): string {
  if (!value) return '—';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}
export function getStatusClass(value: unknown): string {
  return String(value ?? 'draft').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
}
