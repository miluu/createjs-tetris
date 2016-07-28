/// <reference path="../../typings/index.d.ts" />

import stage from './components/stage';
import Board from './components/Board';
import Block, {IBlockInfo} from './components/Block';
import BlockBoard from './components/BlockBoard';
import NextBlocks from './components/NextBlocks';
import HoldBlock from './components/HoldBlock';
import KeyController from './components/KeyController';
import * as _ from 'lodash';
import config from './config';

let activeBlockInfo: IBlockInfo = null;

const board = new Board();
board.y = config.CELL_WIDTH;
board.x = config.CELL_WIDTH * 4;
stage.addChild(board);

const activeBlock = new Block();
activeBlock.y = config.CELL_WIDTH;
activeBlock.x = config.CELL_WIDTH * 7;
activeBlock.on('click', () => {
  activeBlock.blockRotation++;
});
stage.addChild(activeBlock);
activeBlock.visible = false;

const nextBlocks = new NextBlocks(4, config.CELL_WIDTH);
nextBlocks.scaleX = nextBlocks.scaleY = .5;
nextBlocks.x = config.CELL_WIDTH * 15;
nextBlocks.y = config.CELL_WIDTH;
nextBlocks.on('click', activeNextBlock);
stage.addChild(nextBlocks);

const holdBlock = new HoldBlock(config.CELL_WIDTH);
holdBlock.scaleX = holdBlock.scaleY = .5;
holdBlock.x = holdBlock.y = config.CELL_WIDTH;
stage.addChild(holdBlock);
holdBlock.on('click', holdActiveBlock);

const keyController = new KeyController();
keyController.onKeydown.up = () => {
  activeBlock.blockRotation++;
};
keyController.onKeydown.space = () => {
  activeNextBlock();
};
keyController.onKeydown.z = () => {
  holdActiveBlock();
};
keyController.onKeydown.down = () => {
  activeBlock.y += config.CELL_WIDTH;
};
keyController.onKeydown.left = () => {
  activeBlock.x -= config.CELL_WIDTH;
};
keyController.onKeydown.right = () => {
  activeBlock.x += config.CELL_WIDTH;
};

stage.update();
createjs.Ticker.timingMode = createjs.Ticker.RAF;
createjs.Ticker.on('tick', function() {
  if (activeBlockInfo) {
    activeBlock.visible = true;
  } else {
    activeBlock.visible = false;
  }
  stage.update();
});

function activeNextBlock() {
  activeBlockInfo = nextBlocks.next();
  activeBlock.blockType = activeBlockInfo.blockType;
  activeBlock.blockRotation = activeBlockInfo.blockRotation;
  activeBlock.y = config.CELL_WIDTH;
  activeBlock.x = config.CELL_WIDTH * 7;
}

function holdActiveBlock() {
  if (!activeBlockInfo) {
    return;
  }
  activeBlockInfo = holdBlock.hold(activeBlockInfo);
  if (!activeBlockInfo) {
    activeBlockInfo = nextBlocks.next();
  }
  activeBlock.blockType = activeBlockInfo.blockType;
  activeBlock.blockRotation = activeBlockInfo.blockRotation;
  activeBlock.y = config.CELL_WIDTH;
  activeBlock.x = config.CELL_WIDTH * 7;
}

(<any>window).nextBlocks = nextBlocks;
(<any>window).holdBlock = holdBlock;
(<any>window).board = board;
(<any>window).keyController = keyController;
