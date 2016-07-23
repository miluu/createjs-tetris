/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../typings/index.d.ts" />
	"use strict";
	var stage_1 = __webpack_require__(2);
	var Board_1 = __webpack_require__(3);
	var board = new Board_1.default();
	board.x = board.y = 20;
	stage_1.default.addChild(board);
	stage_1.default.update();


/***/ },
/* 2 */
/***/ function(module, exports) {

	/// <reference path="../../../typings/index.d.ts" />
	"use strict";
	var stage = new createjs.Stage('canvas');
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = stage;


/***/ },
/* 3 */
/***/ function(module, exports) {

	/// <reference path="../../../typings/index.d.ts" />
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Board = (function (_super) {
	    __extends(Board, _super);
	    function Board(cellWidth, colsCount, rowsCount) {
	        if (cellWidth === void 0) { cellWidth = 30; }
	        if (colsCount === void 0) { colsCount = 10; }
	        if (rowsCount === void 0) { rowsCount = 20; }
	        _super.call(this);
	        this.cellWidth = cellWidth;
	        this.colsCount = colsCount;
	        this.rowsCount = rowsCount;
	        this.init();
	    }
	    Board.prototype.init = function () {
	        this.graphics
	            .beginFill('rgba(0, 0, 0, 0.5)')
	            .drawRect(0, 0, this.getWidth(), this.getHeight());
	    };
	    Board.prototype.getWidth = function () {
	        return this.cellWidth * this.colsCount;
	    };
	    Board.prototype.getHeight = function () {
	        return this.cellWidth * this.rowsCount;
	    };
	    return Board;
	}(createjs.Shape));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Board;


/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map