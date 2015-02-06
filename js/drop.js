var EventEmitter = require('events').EventEmitter;
var normalize = require('../js/normalize.js');

var Drop = function(){
	this.elem = document.querySelector('.drop');
	this.bind();
	this.elem.style.display = 'block';
};
Drop.prototype.bind = function(){
	this.elem.ondragleave = this.hide.bind(this);
	this.elem.ondragover = this.over.bind(this);
	this.elem.ondragend = this.hide.bind(this);
	this.elem.ondrop = this.drop.bind(this);

	document.ondragover = document.ondrop = function(e) {
		e.preventDefault();
		return false;
    };
};
Drop.prototype.hide = function(){
	this.elem.className = 'drop';
	return this;
}
Drop.prototype.over = function (e) {
	this.elem.className = 'drop is-over';
	e.preventDefault();
	return this;
};
Drop.prototype.drop = function (e) {
	e.stopPropagation();
	e.preventDefault();
	this.elem.className = 'drop';
	normalize(e, function (f) {
		this.emitter.emit('drop', f.items, f.rootDir);
	}.bind(this));
};
Drop.prototype.emitter = new EventEmitter();

module.exports = Drop;