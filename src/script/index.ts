/// <reference path="../../typings/index.d.ts" />

import stage from './components/stage';
import Board from './components/Board';
import Block from './components/Block';
import NextBlock from './components/NextBlock';
import * as _ from 'lodash';
import config from './config';

createjs.Ticker.timingMode = createjs.Ticker.RAF;
createjs.Ticker.on('tick', function() {
  stage.update();
});

const nextBlock = new NextBlock();
nextBlock.showBlock();
nextBlock.updateBlockPosition();
stage.addChild(nextBlock);

stage.update();
(<any>window).nextBlock = nextBlock;
