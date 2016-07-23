/// <reference path="../../typings/index.d.ts" />

import stage from './components/stage';
import Board from './components/Board';
import Cell from './components/Cell';
import * as _ from 'lodash';

const gameConfig = {
  CELL_WIDTH: 30,
  COLS_COUNT: 10,
  ROWS_COUNT: 20
};

const board = new Board(gameConfig.CELL_WIDTH, gameConfig.COLS_COUNT, gameConfig.ROWS_COUNT);
board.x = board.y = 20;
stage.addChild(board);

let cells: Cell[] = [];
_.times(gameConfig.COLS_COUNT, function(col) {
  _.times(gameConfig.ROWS_COUNT, function(row) {
    const cell = new Cell(gameConfig.CELL_WIDTH);
    stage.addChild(cell);
    cell.x = col * gameConfig.CELL_WIDTH + 20;
    cell.y = row * gameConfig.CELL_WIDTH + 20;
    cells.push(cell);
  });
});

stage.update();

