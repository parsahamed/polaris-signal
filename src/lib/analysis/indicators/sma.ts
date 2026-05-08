export function calculateSMA(values: number[], period: number): number[] {
  if (period <= 0) {
    return values.map(() => NaN);
  }

  const result: number[] = [];
  let rollingSum = 0;

  values.forEach((value, index) => {
    rollingSum += value;

    if (index >= period) {
      rollingSum -= values[index - period];
    }

    if (index < period - 1) {
      result.push(NaN);
      return;
    }

    result.push(rollingSum / period);
  });

  return result;
}
