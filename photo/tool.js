
	"use strict";
    const fs = require("fs");
    const sizeOf = require('image-size');
    //本地照片所在目录
    const path = "../../photos"; 
    //要放置生成的照片信息文件目录，建议直接放在 source/photos/ 文件夹下
    const output = "output.json";
    var dimensions;
    fs.readdir(path, function (err, files) {
        if (err) {
            return;
        }
        let arr = [];
        (function iterator(index) {
            if (index == files.length) {
                fs.writeFileSync(output, JSON.stringify(arr, null, "\t"));
                return;
            }
            fs.stat(path + "/" + files[index], function (err, stats) {
                if (err) {
                    return;
                }
                if (stats.isFile()) {

                    arr.push(files[index]);
                }
                iterator(index + 1);
            })
        }(0));
    });