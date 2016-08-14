import config from '../config';
const Colors = config.Colors;
export function randomColor(withoutFirst: boolean = false): string {
  let c = Colors;
  if (withoutFirst) {
    c = c.slice(1);
  }
  const len = c.length;
  const r = Math.floor(Math.random() * len);
  return c[r];
}
