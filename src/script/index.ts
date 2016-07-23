/// <reference path="../../typings/index.d.ts" />

import stage from './components/stage';
import Board from './components/Board';

const board = new Board();
board.x = board.y = 20;
stage.addChild(board);
stage.update();

