/*
 * @note    也是特么神坑，视频上传还尼玛得直接封装出个组件
 *          临时精简自 letv 上传视频 demo html5Upload.js
 *          原作者：郝少禅
 *
 * @call    letvVideoUpload.addFile({
                file: file,
                success: function (data) {},  
                    其中data 参数为 {
                        code: 0, 
                        msg: "成功",
                        data: {
                            fileName: xxx,
                            fileSize: xxx,
                            fileType: xxx
                        }
                error: function (data) {}
                    其中data 参数为 {
                        code: xxx,
                        msg: xxx
                    }
            })
            letvVideoUpload.uploadFile({
                intermediate: function (success, error) {
                  // 其中 intermediate 接受两个函数，success error，这两个函数是组件内部传输过去的
                  // 注意 intermediate 函数调用时候，需要将 视频上传初始化 返回的 upload_url 等等传递给success，用于正式的视频上传
                  // error 函数，包含一些视频上传的重试处理
                },
                uploadProgress: function (data) {}
                    其中data 参数为 {
                        progress: xx%, 是百分数字符串哦
                        speed: xx 速度
                    }
                uploadAbort: function (data) {}
                    其中data 参数为 {
                        code: 202,
                        msg: "中断上传"
                    }
                uploadError: function (data) {}
                    其中data 参数为 {
                        code: 404,
                        msg: "网络异常"
                    }
                uploadFinish: function (data) {}
                    其中data 参数为 {
                        code: 0,
                        msg: "上传完成"
                    }
            })
 * @author  Xaber
 */
window.letvVideoUpload = (function() {

    var letvVideoUpload = function() {};

    // 添加文件的Option对象
    var addFileOption = {};
    // 上传的Option对象
    var uploadOption = {};

    // 文件操作
    var uploadFileOperation = (function() {
        function uploadFileOperation() {}
        // 允许上传的文件类型
        var fileTypes = "wmv|avi|dat|asf|rm|rmvb|ram|mpg|mpeg|mp4|mov|m4v|mkv|flv|vob|qt|divx|cpk|fli|flc|mod|dvix|dv|ts";
        // 获取文件的类型
        var getFileType = function(file) {
            return file.name.split(".").pop();
        };
        // 获取文件的key
        var getFileKey = function(file) {
            return [getFileType(file), file.size, file.lastModifiedDate || file.name].join('_');
        };
        // 选中文件的时候
        var inputFile = function(file) {
            var fType = getFileType(file);
            if (file.size < 0) {
                addFileOption.addFileError({
                    code: 100,
                    msg: "文件大小为0"
                });
            } else if (!eval("/" + fileTypes + "$/i").test(fType)) {
                addFileOption.addFileError({
                    code: 101,
                    msg: "不支持此视频格式"
                });
            } else {
                addFileOption.addFileSuccess({
                    code: 0,
                    msg: "成功",
                    data: {
                        fileName: file.name,
                        fileSize: file.size,
                        fileType: fType
                    }
                });

                // 设置file相关信息
                letvVideoUpload.exportObject.selectFile.file = file;
                letvVideoUpload.exportObject.selectFile.fileKey = getFileType(file);
            }
        };

        uploadFileOperation.inputFile = inputFile;

        return uploadFileOperation;
    })();

    // cookie操作
    var uploadCookie = (function() {
        function uploadCookie() {}
        uploadCookie.setCookie = function(key, value, expiresDays) {
            var date = new Date();
            date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000);
            document.cookie = key + "=" + value + "; expires=" + date.toGMTString();
        };
        uploadCookie.getCookie = function(key) {
            var strCookie = document.cookie;
            var arrCookie = strCookie.split("; ");
            for (var i = 0; i < arrCookie.length; i++) {
                var arr = arrCookie[i].split("=");
                if (arr[0] == key) {
                    return arr[1];
                }
                if (i == arrCookie.length - 1) {
                    return false;
                }
            }
        };
        uploadCookie.removeCookie = function(key) {
            uploadCookie.setCookie(key, "", -1);
        };
        return uploadCookie;
    })();

    // 上传回调函数
    var xhrEventCallback = (function() {
        function xhrEventCallback() {}
        xhrEventCallback.loadstart = function(e) {
            var currStack = videoUpload.cellStack;
            currStack.inittime = (new Date()).getTime(); //标记开始 即时的 时间
            var transferedsize = videoUpload.cellStack ? videoUpload.cellStack.transferedsize : 0;
            currStack.transferedsize = transferedsize;
        };
        xhrEventCallback.load = function(e) {
            var res = eval("(" + e.target.responseText + ")");
            if (!!res.transferedsize) {
                //记录断点续传token
                var tokenUrl = videoUpload.uploadUrl.split('token').pop();
                var videoToken = tokenUrl.substr(1, tokenUrl.length - 1).split('&')[0];
                uploadCookie.setCookie(letvVideoUpload.exportObject.selectFile.fileKey, videoToken, 2);
                var transferedsize = parseInt(res.transferedsize);
                videoUpload.cellStack.transferedsize = transferedsize;
                transferedsize < letvVideoUpload.exportObject.selectFile.file.size && videoUpload.streamUpload(transferedsize);
            } else {
                if (!res.totalsize && res.status != '200') {
                    uploadOption.uploadError({
                        code: res.status,
                        msg: res.msg
                    });
                    uploadCookie.removeCookie(letvVideoUpload.exportObject.selectFile.fileKey);
                    videoUpload.xhrAbort();
                }
            }
            videoUpload.cellStack.starttime = (new Date()).getTime();
            if (res.transferedsize && res.transferedsize == res.totalsize) {
                //文件上传完成
                uploadOption.uploadFinish({
                    code: 0,
                    msg: "上传完成"
                });
                uploadCookie.removeCookie(letvVideoUpload.exportObject.selectFile.fileKey);
                videoUpload.xhrAbort();
            }
        };
        xhrEventCallback.progress = function(e) {
            var cellstack = videoUpload.cellStack,
                filetransfered = parseInt(cellstack.transferedsize);
            var pc = parseInt((filetransfered + e.loaded) / letvVideoUpload.exportObject.selectFile.file.size * 100),
                delttime = ((new Date()).getTime() - (cellstack.starttime || cellstack.inittime)) / 1000,
                rate = e.loaded / delttime;
            rate = rate / 1024;
            rate = rate > 1024 ? (((rate / 1024 * 10) >> 0) / 10).toFixed(1) + "M/s" : (((rate * 10) >> 0) / 10).toFixed(1) + "K/s";
            //在上传过程中如果用户在电脑上删除了视频，会触发视频丢失错误
            if (isNaN(pc)) {
                uploadOption.uploadError({
                    code: 203,
                    msg: "视频丢失"
                });
                videoUpload.xhrAbort();
            } else {
                if (pc == 100) {
                    pc = 99;
                }
                uploadOption.uploadProgress({
                    progress: pc + "%",
                    speed: rate
                });
            }
        };
        xhrEventCallback.error = function(e) {
            uploadOption.uploadError({
                code: 404,
                msg: "网络异常"
            });
            videoUpload.xhrAbort();
        };
        xhrEventCallback.abort = function(e) {
            uploadOption.uploadAbort({
                code: 202,
                msg: "中断上传"
            });
        };
        return xhrEventCallback;
    })();

    // 上传
    var videoUpload = (function() {
        function videoUpload() {}
        var cellSize = 10485760;
        var xhr = null;
        var tryNum = 0;
        var sliceFile = function(file, start) {
            var blob;
            start = start || 0;
            var range = start + cellSize;
            if (start != -1) {
                if (file.slice) {
                    blob = file.slice(start, range);
                } else if (file.webkitSlice) {
                    blob = file.webkitSlice(start, range);
                } else if (file.mozSlice) {
                    blob = file.mozSlice(start, range);
                } else {
                    blob = file;
                }
            } else {
                return null;
            }
            return blob;
        };
        videoUpload.cellStack = {};
        videoUpload.uploadUrl = "";
        videoUpload.streamUpload = function(loadedsize) {
            videoUpload.cellStack.transferedsize = loadedsize;
            xhr = new XMLHttpRequest();
            letvVideoUpload.exportObject.selectFile.xhrAbort = videoUpload.xhrAbort;
            xhr.upload.addEventListener("progress", function(e) {
                xhrEventCallback.progress(e);
            }, false);
            xhr.addEventListener("loadstart", function(e) {
                xhrEventCallback.loadstart(e);
            }, false);
            xhr.addEventListener("load", function(e) {
                xhrEventCallback.load(e);
            }, false);
            xhr.addEventListener("error", function(e) {
                xhrEventCallback.error(e);
            }, false);
            xhr.addEventListener("abort", function(e) {
                xhrEventCallback.abort(e);
            }, false);
            var cellFile = sliceFile(letvVideoUpload.exportObject.selectFile.file, loadedsize);
            var content = loadedsize == -1 ? "bytes *" : "bytes " +
                (loadedsize + 1) + "-" + (loadedsize + cellFile.size) + "/" + letvVideoUpload.exportObject.selectFile.file.size;
            xhr.open("POST", videoUpload.uploadUrl, true);
            xhr.setRequestHeader("X_FILENAME", encodeURI(letvVideoUpload.exportObject.selectFile.file.name));
            xhr.setRequestHeader("Content-Range", content);
            xhr.send(cellFile);
        };
        videoUpload.xhrAbort = function() {
            xhr && xhr.abort();
        };
        videoUpload.tryUpload = function(option) {
            var uploadtype = 1;

            option = $.extend({
                // 接受 success 函数作为参数
                // success 接受 intermediate 调用后传入的参数（需要 upload init 返回的 video_id video_unique 等数据）
                intermediate: function(success, error) {}
            }, option);

            try {
                option.intermediate(function(data) {
                    if (data.code == 0) {
                        var nextBlob = data.data.upload_size || 0;
                        letvVideoUpload.exportObject.selectFile.video_id = data.data.video_id;
                        letvVideoUpload.exportObject.selectFile.video_unique = data.data.video_unique;
                        tryNum = 0;
                        videoUpload.uploadUrl = data.data.upload_url.split('&')[0];
                        videoUpload.streamUpload(nextBlob);

                    } else {
                        switch (data.code) {
                            case 112:
                                if (tryNum < 2) {
                                    setTimeout(function() {
                                        videoUpload.tryUpload(option);
                                    }, 20000);
                                    ++tryNum;
                                } else {
                                    if (tryNum < 3) {
                                        uploadCookie.removeCookie(letvVideoUpload.exportObject.selectFile.fileKey);
                                        ++tryNum;
                                        videoUpload.tryUpload(option);
                                    } else {
                                        uploadOption.uploadAbort({
                                            code: data.code,
                                            msg: data.message
                                        });
                                        tryNum = 0;
                                    }
                                }
                                break;
                            default:
                                uploadOption.uploadAbort({
                                    code: data.code,
                                    msg: data.message
                                });
                        }
                    }

                }, function(data) {
                    if (tryNum < 3) {
                        setTimeout(function() {
                            videoUpload.tryUpload(option);
                        }, 1000);
                        ++tryNum;
                    } else {
                        uploadOption.uploadAbort({
                            code: 206,
                            msg: data.statusText
                        });
                        tryNum = 0;
                    }
                });

            } catch (e) {
                if (tryNum < 3) {
                    setTimeout(function() {
                        videoUpload.tryUpload(option);
                    }, 1000);
                    ++tryNum;
                } else {
                    uploadOption.uploadAbort({
                        code: 207,
                        msg: e.message
                    });
                    tryNum = 0;
                }
            }
        };
        return videoUpload;
    })();

    // 添加文件
    letvVideoUpload.addFile = function(option) {
        option = $.extend({
            file: null,
            success: function() {},
            error: function() {}
        }, option || {});

        // 设置文件添加的相关回调
        addFileOption.addFileSuccess = option.success;
        addFileOption.addFileError = option.error;

        // 将文件放入到配置中
        uploadFileOperation.inputFile(option.file);
    };

    letvVideoUpload.uploadFile = function(option) {
        var holder = function() {};
        var tryUploadOp = $.extend({
            intermediate: function(success, error) {}
        }, {
            intermediate: option.intermediate
        });

        uploadOption.uploadProgress = option.uploadProgress || holder;
        uploadOption.uploadFinish = option.uploadFinish || holder;
        uploadOption.uploadError = option.uploadError || holder;
        uploadOption.uploadAbort = option.uploadAbort || holder;

        videoUpload.tryUpload(tryUploadOp);
    };

    //可供用户访问的属性
    letvVideoUpload.exportObject = (function() {
        function exportObject() {};

        //选中的文件对象
        exportObject.selectFile = {};
        return exportObject;
    })();

    return letvVideoUpload;
})();