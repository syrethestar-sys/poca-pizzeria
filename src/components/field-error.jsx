export function FieldError({ error }) {
  if (!error?.message) return null;
  return <p className="mt-1 text-xs text-destructive">{error.message}</p>;
}
