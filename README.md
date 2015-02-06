## 图片压缩工具
------
使用atom-shell整合的一个图片压缩工具。

### 使用帮助：
- 下载[atom-shell][1]。
- 下载app代码

```
$ cd [atom-shell]/resources/
$ git clone https://github.com/wuwu8ku/imgminify-app.git
$ cd imgminify-app/
$ npm install
```

- 修改imgminify-app文件夹名为app，使atom打开时直接加载应用。
- 打开atom.exe，拖拽图片或文件夹进工具中的虚框内，选择配置后点击“开始优化”按钮进行图片压缩，使用时建议控制压缩数量。
- 如勾选“是否覆盖原图片”，则压缩的图片会覆盖原图片（建议使用该功能前做好备份工作，特别是调整jpeg图片品质时）；否则，压缩后会自动创建“optimized+日期”文件夹，里面就是压缩后的目录及图片。
- JPEG图片优化时勾选Jpeg 调整品质，保证图片质量的同时减小图片流量。

### 相关资料

- [jpegtran](http://sylvana.net/jpegcrop/jpegtran/)：to optimize JPEGs.
- [jpegoptim](https://github.com/tjko/jpegoptim)：utility to optimize jpeg files. Provides lossless optimization (based on optimizing the Huffman tables) and "lossy" optimization based on setting maximum quality factor. 
- [gifsicle](http://www.lcdf.org/gifsicle/)：to optimize GIF animations by stripping repeating pixels in different frames.
- [optipng](http://optipng.sourceforge.net/)：is a PNG optimizer that recompresses image files to a smaller size, without losing any information.Other PNG reduction tools such as pngout, pngcrush, pngrewrite.
- [pngquant](http://pngquant.org/)：is a command-line utility and a library for lossy compression of PNG images.

[1]: https://github.com/atom/atom-shell/releases