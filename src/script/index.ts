/// <reference path="../../typings/index.d.ts" />

import Game from './classes/Game';
import config from './config';

initGame();

function initGame() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const stage = new createjs.Stage(canvas);
  const Ticker = createjs.Ticker;
  const game = new Game({
    cellWidth: config.CELL_WIDTH,
    colsCount: config.COLS_COUNT,
    rowsCount: config.ROWS_COUNT
  });
  stage.addChild(game);
  stage.update();
  Ticker.timingMode = Ticker.RAF;
  Ticker.on('tick', () => {
    stage.update();
  });
  (<any>window).game = game;
}


