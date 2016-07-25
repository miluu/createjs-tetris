/// <reference path="../../typings/index.d.ts" />

import stage from './components/stage';
import Board from './components/Board';
import Block from './components/Block';
import BlockBoard from './components/BlockBoard';
import NextBlocks from './components/NextBlocks';
import HoldBlock from './components/HoldBlock';
import * as _ from 'lodash';
import config from './config';

createjs.Ticker.timingMode = createjs.Ticker.RAF;
createjs.Ticker.on('tick', function() {
  stage.update();
});

const nextBlocks = new NextBlocks(4, config.CELL_WIDTH);
nextBlocks.scaleX = nextBlocks.scaleY = .5;
nextBlocks.on('click', () => {
  console.log(nextBlocks.next());
});
stage.addChild(nextBlocks);

const holdBlock = new HoldBlock(config.CELL_WIDTH);
holdBlock.scaleX = holdBlock.scaleY = .5;
holdBlock.x = 200;
stage.addChild(holdBlock);

stage.update();
(<any>window).nextBlocks = nextBlocks;
(<any>window).holdBlock = holdBlock;
