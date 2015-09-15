// 定时展示功能
(function () {
    var __now = Date.now(),
        pattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
        
        // 辅助函数        
        f = function (str) {
            return parseInt(str, 10);
        },

        // 通过格式获取时间戳
        getTimestamp = function (format) {
            var arr = format.replace(/[-:]/g, ' ').split(' ');
            return new Date(f(arr[0]), f(arr[1]) - 1, f(arr[2]), f(arr[3]), f(arr[4]), f(arr[5])).getTime();
        },

        // 格式不正确
        isFormatUnCorrect = function (format) {
            return format && format.search(pattern) === -1;
        },

        // start end 如果不传递 默认忽略start end分别为很久很久以前 和 很久很久以后
        isBetweenTime = function (start, end) {
            if (!start && !end) {
                return true;

            // 格式不正确  
            } else if (isFormatUnCorrect(start) || isFormatUnCorrect(end)) {
                return true;
            
            // 开始时间结束时间
            } else if (start && end) {
                return getTimestamp(start) < __now && getTimestamp(end) > __now;

            // 只有开始时间
            } else if (start && !end) {
                return getTimestamp(start) < __now;
            
            // 只有结束时间
            } else if (!start && end) {
                return getTimestamp(end) > __now;
            }

            return true;
        };

    window.isBetweenTime = isBetweenTime;
})();