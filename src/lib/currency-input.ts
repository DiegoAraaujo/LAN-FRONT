const formatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatMoneyInput = (value: number | string): string =>
  value === '' ? '' : formatter.format(Number(value));

// The digits represent cents, just as in a banking app.
export const parseMoneyInput = (text: string): number | '' | null => {
  if (text.includes('-')) return null;
  const digits = text.replace(/\D/g, '');
  if (!digits) return '';
  const cents = Number(digits);
  return Number.isSafeInteger(cents) ? cents / 100 : null;
};
