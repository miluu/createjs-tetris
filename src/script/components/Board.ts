/// <reference path="../../../typings/index.d.ts" />

import * as _ from 'lodash';
import Cell from './Cell';
import Block, {IBlockInfo} from './Block';

interface IMapPosition {
  row: number;
  col: number;
}
export default class Board extends createjs.Container {
  private _bg: createjs.Shape;
  private _map: number[][];
  private _cells: Cell[][];
  private _activeBlock: Block;
  private _activeBlockPosition: IMapPosition;
  constructor(
    private _cellWidth: number = 30,
    private _colsCount: number = 10,
    private _rowsCount: number = 20
  ) {
    super();
    this._init();
  }

  public resetActiveBlock(blockInfo: IBlockInfo) {
    this._activeBlock.blockRotation = blockInfo.blockRotation;
    this._activeBlock.blockType = blockInfo.blockType;
    this.resetActiveBlockPos();
    this.showActiveBlock();
  }

  public resetActiveBlockPos() {
    const rotationShape = this._activeBlock.getRotationShape();
    console.log(rotationShape);
  }

  public showActiveBlock() {
    this._activeBlock.visible = true;
  }

  public hideActiveBlock() {
    this._activeBlock.visible = false;
  }

  public getWidth(): number {
    return this._cellWidth * this._colsCount;
  }

  public getHeight(): number {
    return this._cellWidth * this._rowsCount;
  }

  public setMap(position: IMapPosition, val: number) {
    const {row, col} = position;
    if (val !== 0 && val !== 1) {
      throw new Error('val can only be 0 or 1.');
    }
    if (row > this._rowsCount - 1 || row < 0 || col > this._colsCount || col < 0) {
      throw new Error(`Out of map's range.`);
    }
    this._map[row][col] = val;
    this._updateMapView();
  }

  public moveBlock(direction: 'left' | 'right' | 'down') {
    switch (direction) {
      case 'down':
        this._activeBlockPosition.row++;
        break;
      case 'left':
        this._activeBlockPosition.col--;
        break;
      case 'right':
        this._activeBlockPosition.col++;
        break;
      default:
        return;
    }
    this._updateActiveBlockPosition();
  }

  get map(): number[][] {
    return this._map;
  }
  set map(map: number[][]) {
    this._map = map;
    this._updateMapView();
  }
  private _init(): void {
    this._initBg();
    this._initMap();
    this._initCells();
    this._initActiveBoard();
    this._updateMapView();
  }

  private _initActiveBoard() {
    this._activeBlock = new Block(this._cellWidth);
    this._activeBlockPosition = {col: 3, row: 0};
    this._updateActiveBlockPosition();
    this.addChild(this._activeBlock);
  }

  private _initBg(): void {
    this._bg = new createjs.Shape();
    this._bg.graphics
      .beginFill('rgba(0, 0, 0, 0.5)')
      .drawRect(0, 0, this.getWidth(), this.getHeight());
    this.addChild(this._bg);
  }

  private _initMap(): void {
    this._map = [];
    const mapRow = new Array(this._colsCount);
    _.fill(mapRow, 0);
    _.times(this._rowsCount, () => {
      this._map.push(mapRow.concat());
    });
  }

  private _initCells(): void {
    this._cells = [];
    _.times(this._rowsCount, (row) => {
      const cellsRow: Cell[] = [];
      _.times(this._colsCount, (col) => {
        const cell = new Cell(this._cellWidth);
        cell.x = col * this._cellWidth;
        cell.y = row * this._cellWidth;
        this.addChild(cell);
        cellsRow.push(cell);
      });
      this._cells.push(cellsRow);
    });
  }

  private _updateMapView(): void {
    _.forEach(this._map, (mapRow, row) => {
      _.forEach(mapRow, (cellState, col) => {
        const cell = this._cells[row][col];
        cell.alpha = cellState === 0
          ? 0.1
          : 0.8;
      });
    });
  }

  private _updateActiveBlockPosition(): void {
    const {col, row} = this._activeBlockPosition;
    const x = col * this._cellWidth;
    const y = row * this._cellWidth;
    this._activeBlock.x = x;
    this._activeBlock.y = y;
  }
}
