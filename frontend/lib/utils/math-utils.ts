export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function roundToBase(
  num: number,
  base: number,
  direction: 'up' | 'down' | 'nearest',
): number {
  switch (direction) {
    case 'up':
      return Math.ceil(num / base) * base;
    case 'down':
      return Math.floor(num / base) * base;
    case 'nearest':
    default:
      return Math.round(num / base) * base;
  }
}

export function defineDefaultRange(range: number[]): number[] {
  const [start, end] = range;
  const middle = (start + end) / 2;
  return [Math.floor((start + middle) / 2), Math.ceil((end + middle) / 2)];
}

export function expandRange(range: number[], expandValue: number): number[] {
  const [start, end] = range;
  return start === end
    ? [Math.max(start - expandValue, 0), end + expandValue]
    : range;
}
