var Spinner = function(){
	this.elem = document.querySelector('.spinner');
	this.elem.style.display = 'none';
};
Spinner.prototype.show = function(){
	this.elem.style.display = 'block';
}
Spinner.prototype.hide = function(){
	this.elem.style.display = 'none';
}

module.exports = Spinner;