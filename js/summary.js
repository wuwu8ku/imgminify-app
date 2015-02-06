var dialog = require('remote').require('dialog');

var Summary = function(){
	this.elem = document.querySelector('.summary');
	this.elem.style.display = 'block';
};
Summary.prototype.showList = function (data) {
	data = data || [];
	var html = '';
	var size = 0;
	for(var i=0,l=data.length;i<l;i++){
		var file = data[i];
		html += '<tr><td>'+ (i+1) +'</td><td>'+ file.type.split('/')[1] +'</td><td>'+ file.path +'</td><td></td><td>'+ this.prettyBytes(file.size) +'</td><td></td><td></td></tr>';
		size += file.size;
	}
	this.elem.querySelector('tbody').innerHTML = html;
	this.elem.querySelector('.summary-total').innerHTML = '共计'+ data.length +'个图片，原始大小'+ this.prettyBytes(size);
};
Summary.prototype.showResult = function (data) {
	var success = data.success,
		failed = data.failed;
	var len_success = success.length,
		len_failed = failed.length;
	var diff = 0,
		size = 0;
	var html = '',
		index = 1;

	for(var i=0;i<len_failed;i++){
		var file = failed[i];
		size += file.oSize;
		var oSize = this.prettyBytes(file.oSize);
		html += '<tr><td>'+ index +'</td><td>'+ file.type.split('/')[1] +'</td><td>'+ file.path +'</td><td>failed</td><td>'+ oSize +'</td><td>'+ oSize +'</td><td>0%</td></tr>';
		index++;
	}

	for(var i=0;i<len_success;i++){
		var file = success[i];
		diff += file.oSize - file.nSize;
		size += file.oSize;

		html += '<tr><td>'+ index +'</td><td>'+ file.type.split('/')[1] +'</td><td>'+ file.path +'</td><td>success</td><td>'+ this.prettyBytes(file.oSize) +'</td><td>'+ this.prettyBytes(file.nSize) +'</td><td>'+ parseInt(100 * (file.oSize-file.nSize) / file.oSize) +'%</td></tr>';
		index++;
	}

	this.elem.querySelector('tbody').innerHTML = html;
	this.elem.querySelector('.summary-total').innerHTML = '共计'+ (len_success + len_failed) +'个图片，成功'+ len_success +'，失败'+len_failed+'，原始大小'+ this.prettyBytes(size) +'，优化后大小'+ this.prettyBytes(size-diff) +'，节省'+ parseInt(100 * diff / size) +'%空间，耗时'+ this.formatTime(data.time);
};
Summary.prototype.prettyBytes = function (num) {
	if (typeof num !== 'number' || Number.isNaN(num)) {
		throw new TypeError('Input must be a number');
	}

	var exponent;
	var unit;
	var neg = num < 0;

	if (neg) {
		num = -num;
	}

	if (num === 0) {
		return '0 B';
	}

	exponent = Math.floor(Math.log(num) / Math.log(1024));
	num = (num / Math.pow(1024, exponent)).toFixed(2) * 1;
	unit = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][exponent];

	return (neg ? '-' : '') + num + ' ' + unit;
};
Summary.prototype.formatTime = function (msd) {
	if(msd < 1000){
		return msd + 'ms';
	}
	var time = parseFloat(msd) / 1000;
    if (null != time && "" != time) {
        if (time > 60 && time < 60 * 60) {
            time = parseInt(time / 60.0) + "m" + parseInt((parseFloat(time / 60.0) -
                parseInt(time / 60.0)) * 60) + "s";
        }else if (time >= 60 * 60 && time < 60 * 60 * 24) {
            time = parseInt(time / 3600.0) + "h" + parseInt((parseFloat(time / 3600.0) -
                parseInt(time / 3600.0)) * 60) + "m" +
                parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "s";
        }
        else {
            time = parseInt(time) + "s";
        }
    }
    return time;
}

module.exports = Summary;