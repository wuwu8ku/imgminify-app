window.onload = function(){

	var Drop = require('./js/drop.js');
	var Spinner = require('./js/spinner.js');
	var Summary = require('./js/summary.js');
	var Setting = require('./js/setting.js');

	var Imagemin = require('imgminify');
	var async = require('async');
	var fs = require('fs-extra');
	var path = require('path');

	var drop = new Drop();
	var setting = new Setting();
	var summary = new Summary();
	var spinner = new Spinner();

	var cur_files = [];
	var cur_root = '';

	drop.emitter.on('drop', function (files, root) {
		cur_files = files;
		cur_root = root;
		summary.showList(cur_files);
	})
	setting.emitter.on('run', function(opts) {
		if(!cur_files.length || !cur_root){
			alert('没有可以压缩的图片');
			return;
		}
		spinner.show();
		var time = new Date();
		minify(cur_files, cur_root, opts, function(err, data){
			if (err) {
				console.log(err);
			}
			data.time = new Date() - time;
			summary.showResult(data);
			spinner.hide();
			setting.open();
		})
	})

	function minify(files, root, setting, cb){
		var success = [];
		var failed = [];
		var date = new Date();

		var newRoot = root;
		var isOverwrite = setting.global.overwrite;
		if(!isOverwrite){
			var time = '' + date.getFullYear() + (date.getMonth() + 1) + date.getDate();
			newRoot = path.join(root, 'optimized'+ time);
		}

		async.each(files, function(file, callback){
			if(!/image/.test(file.type)){
				return callback();
			}
			var oSize = file.size;
			var src_path = file.path;
			var new_path = isOverwrite ? file.path : file.path.replace(root, newRoot);
			var type = file.type;

			var imagemin = new Imagemin()
				.src(src_path)
				.dest(path.join(new_path, '..'));
				
			var jpeg = setting.jpeg;
			switch(type){
				case 'image/jpeg':
					if(jpeg.quality){
						imagemin.use(Imagemin.jpegoptim({max:jpeg.quality}));
					}
					imagemin.use(Imagemin.jpegtran({progressive: jpeg.progressive}));
					break;
				case 'image/gif':
					imagemin.use(Imagemin.gifsicle());
					break;
				case 'image/png':
					imagemin.use(Imagemin.optipng({optimizationLevel: 3}))
						.use(Imagemin.pngquant({speed:1}));
					break;
				case 'image/svg+xml':
					imagemin.use(Imagemin.svgo());
					break;
				default:
					imagemin.use(Imagemin.gifsicle());
					if(jpeg.quality){
						imagemin.use(Imagemin.jpegoptim({max:jpeg.quality}));
					}
					imagemin.use(Imagemin.jpegtran({progressive: jpeg.progressive}))
						.use(Imagemin.optipng({optimizationLevel: 3}))
						.use(Imagemin.pngquant({speed:1}))
						.use(Imagemin.svgo());
					break;
			}

			imagemin.run(function (err, files) {
				if(!err && !files.length){
					err = "can not read this file";
				}
				if(err){
					fs.copy(src_path, new_path, function(err) {
						if (err){
							console.error(err)
						}
					});
					failed.push({ path: src_path, type: type, oSize: oSize, err: err});
				}else{
					var file = files[0];
					success.push({ path: src_path, type: type, oSize: oSize, nSize: file.contents.length});
				}
				callback();
			});
		},function(err){
			var data = {
				success: success, 
				failed: failed
			};
			cb(null, data);
		})
	}

}