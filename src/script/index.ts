/// <reference path="../../typings/index.d.ts" />

import stage from './components/stage';
import Board from './components/Board';
import Block from './components/Block';
import * as _ from 'lodash';
import config from './config';

createjs.Ticker.timingMode = createjs.Ticker.RAF;
createjs.Ticker.on('tick', function() {
  stage.update();
});

const board = new Board(config.CELL_WIDTH, config.COLS_COUNT, config.ROWS_COUNT);
board.x = config.BOARD_POSITION_X;
board.y = config.BOARD_POSITION_Y;
stage.addChild(board);

const block = new Block(config.CELL_WIDTH, Block.Type.T);
block.x = config.BOARD_POSITION_X;
block.y = config.BOARD_POSITION_Y;
stage.addChild(block);

stage.update();
(<any>window).block = block;
