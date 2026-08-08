const MINOR_UNITS_PER_CURRENCY = 100;

export const toMinorUnits = (amount: number): number =>
  Math.round(amount * MINOR_UNITS_PER_CURRENCY);

export const fromMinorUnits = (amount: number): number =>
  amount / MINOR_UNITS_PER_CURRENCY;

export const roundCurrency = (amount: number): number =>
  fromMinorUnits(toMinorUnits(amount));

export const hasAtMostTwoDecimalPlaces = (amount: number): boolean =>
  Number.isFinite(amount) &&
  Math.abs(fromMinorUnits(toMinorUnits(amount)) - amount) < Number.EPSILON * 10;
