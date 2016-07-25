/// <reference path="../../../typings/index.d.ts" />

import * as _ from 'lodash';
import Cell from './Cell';

export default class Board extends createjs.Container {
  private _bg: createjs.Shape;
  private _map: number[][];
  private _cells: Cell[][];
  constructor(
    private _cellWidth: number = 30,
    private _colsCount: number = 10,
    private _rowsCount: number = 20
  ) {
    super();
    this._init();
  }

  private _init(): void {
    this._initBg();
    this._initMap();
    this._initCells();
    this._update();
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

  private _update(): void {
    _.forEach(this._map, (mapRow, row) => {
      _.forEach(mapRow, (cellState, col) => {
        const cell = this._cells[row][col];
        cell.alpha = cellState === 0
          ? 0.1
          : 0.8;
      });
    });
  }

  get map(): number[][] {
    return this._map;
  }
  set map(map: number[][]) {
    this._map = map;
    this._update();
  }

  getWidth(): number {
    return this._cellWidth * this._colsCount;
  }

  getHeight(): number {
    return this._cellWidth * this._rowsCount;
  }
}
