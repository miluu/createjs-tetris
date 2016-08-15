import config from '../config';
import * as _ from 'lodash';
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

export function randomIndex(len: number): number[] {
  let indexArr: number[] = [];
  let retArr: number[] = [];
  let r: number;
  _.times(len, (i) => {
    indexArr.push(i);
  });
  _.times(len, (i) => {
    r = _.random(len - 1 - i);
    retArr.push(indexArr[r]);
    _.pullAt(indexArr, r);
  });
  return retArr;
}
