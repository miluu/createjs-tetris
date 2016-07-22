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
/***/ function(module, exports) {

	/// <reference path="../../typings/index.d.ts" />
	"use strict";
	var Board = (function () {
	    function Board(blockWidth, colCount, rowCount) {
	        if (blockWidth === void 0) { blockWidth = 30; }
	        if (colCount === void 0) { colCount = 10; }
	        if (rowCount === void 0) { rowCount = 20; }
	        this.blockWidth = blockWidth;
	        this.colCount = colCount;
	        this.rowCount = rowCount;
	        this.shape = new createjs.Shape();
	        this.shape.graphics
	            .beginFill('rgba(0, 0, 0, 0.5)')
	            .drawRect(0, 0, this.getWidth(), this.getHeight());
	    }
	    Board.prototype.getWidth = function () {
	        return this.blockWidth * this.colCount;
	    };
	    Board.prototype.getHeight = function () {
	        return this.blockWidth * this.rowCount;
	    };
	    Object.defineProperty(Board.prototype, "x", {
	        get: function () {
	            return this.shape.x;
	        },
	        set: function (x) {
	            this.shape.x = x;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Board.prototype, "y", {
	        get: function () {
	            return this.shape.y;
	        },
	        set: function (y) {
	            this.shape.y = y;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Board;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Board;


/***/ }
/******/ ]);
//# sourceMappingURL=Board.js.map