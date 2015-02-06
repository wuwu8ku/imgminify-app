var EventEmitter = require('events').EventEmitter;

var Setting = function(){
	this.elem = document.querySelector('.setting');
	this.initGlobal();
	this.initJpeg();
	this.initBtn();
	this.elem.style.display = "block";
};
Setting.prototype.initGlobal = function(){
	this.elemsGlobal = {
		overwrite: document.getElementById('global_overwrite')
	};
	this.elemsGlobal.overwrite.addEventListener('click', function(e){
		var target = e.target;
		localStorage.setItem('set_global_overwrite', target.checked ? true : '');
	}, false);
	var set_global_overwrite = localStorage.getItem('set_global_overwrite');
	if(set_global_overwrite !== null){
		this.elemsGlobal.overwrite.checked = !!set_global_overwrite;
	}
};
Setting.prototype.initJpeg = function(){
	this.elemsJpeg = {
		quality: document.getElementById('jpeg_quality'),
		range: document.getElementById('jpeg_range'),
		progressive: document.getElementById('jpeg_progressive')
	};

	this.elemsJpeg.quality.addEventListener('click', function(e){
		var target = e.target;
		this.elemsJpeg.range.disabled = !target.checked;
		localStorage.setItem('set_jpg_quality', target.checked ? true : '');
	}.bind(this), false);
	this.elemsJpeg.range.addEventListener('change', function(e){
		this.nextSibling.innerHTML = this.value;
		localStorage.setItem('set_jpg_range', this.value);
	}, false);
	this.elemsJpeg.progressive.addEventListener('click', function(e){
		var target = e.target;
		localStorage.setItem('set_jpg_progressive', target.checked ? true : '');
	}, false);

	var set_jpg_quality = localStorage.getItem('set_jpg_quality'),
		set_jpg_range = localStorage.getItem('set_jpg_range'),
		set_jpg_progressive = localStorage.getItem('set_jpg_progressive');
	if(set_jpg_quality !== null){
		this.elemsJpeg.quality.checked = !!set_jpg_quality;
		this.elemsJpeg.range.disabled = !set_jpg_quality;
	}
	if(set_jpg_range !== null){
		this.elemsJpeg.range.value = set_jpg_range;
		this.elemsJpeg.range.nextSibling.innerHTML = set_jpg_range;
	}
	if(set_jpg_progressive !== null){
		this.elemsJpeg.progressive.checked = !!set_jpg_progressive;
	}
};
Setting.prototype.initBtn = function(){
	this.btnOptim = document.getElementById('btn_optim');
	this.btnOptim.addEventListener('click', function(e){
		this.close();
		this.emitter.emit('run', this.get());
	}.bind(this), false);
};
Setting.prototype.close = function () {
	this.btnOptim.disabled = true;
};
Setting.prototype.open = function () {
	this.btnOptim.disabled = false;
};
Setting.prototype.get = function(){
	var result = {
		global: {
			overwrite: this.elemsGlobal.overwrite.checked
		},
		jpeg: {
			quality: this.elemsJpeg.quality.checked ? this.elemsJpeg.range.value : 0,
			progressive: this.elemsJpeg.progressive.checked
		} 
	};
	return result;
};
Setting.prototype.emitter = new EventEmitter();

module.exports = Setting;