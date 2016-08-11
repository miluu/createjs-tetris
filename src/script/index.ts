/// <reference path="../../typings/index.d.ts" />

import Game from './classes/Game';
import Firefly from './classes/Firefly';
import config from './config';

initGame();

function initGame() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const stage = new createjs.Stage(canvas);
  const Ticker = createjs.Ticker;
  Ticker.timingMode = Ticker.RAF;
  Ticker.setFPS(60);
  const game = new Game({
    cellWidth: config.CELL_WIDTH,
    colsCount: config.COLS_COUNT,
    rowsCount: config.ROWS_COUNT
  });
  stage.addChild(game);
  const firefly = new Firefly();
  firefly.x = 200;
  firefly.y = 200;
  firefly.scaleX = firefly.scaleY = 1;
  stage.addChild(firefly);
  console.log(firefly);
  stage.update();
  Ticker.timingMode = Ticker.RAF;
  Ticker.on('tick', () => {
    stage.update();
  });
  (<any>window).game = game;
  (<any>window).star = firefly;
}


