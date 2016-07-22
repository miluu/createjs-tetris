/// <reference path="../../typings/index.d.ts" />

import stage from './components/stage';
import Board from './components/Board';

let board = new Board();
stage.addChild(board.shape);
board.x = 10;
board.y = 10;
stage.update();
