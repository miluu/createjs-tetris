/// <reference path="../../typings/index.d.ts" />

import Game from './classes/Game';
import Star from './classes/Star';
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
  const star = new Star();
  star.x = 10;
  star.y = 10;
  stage.addChild(star);
  console.log(star);
  stage.addChild(game);
  stage.update();
  Ticker.timingMode = Ticker.RAF;
  Ticker.on('tick', () => {
    stage.update();
  });
  (<any>window).game = game;
  (<any>window).star = star;
}


