/// <reference path="../../../typings/index.d.ts" />

export const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const stage = new createjs.Stage(canvas);
export default stage;
