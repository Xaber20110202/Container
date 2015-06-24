/* 
 * @note checkAllHelper
 *       传入两个jq 选择器
 *       第一个是点击全选的checkbox
 *       第二个则是其他被全选的checkbox
 * @author Xaber
 */
define(function (require, exports, module) {

    var checkAllHelper = function (checkallSelector, checkboxsSelector) {

        var $checkboxs = $(checkboxsSelector),
            $checkAll = $(checkallSelector),

            isAllChecked = function ($checkboxs) {
                var result = true;

                $checkboxs.each(function () {
                    result = $(this).is(':checked');
                    return result; // jq each return false break the loop
                });

                return result;
            };

        if (!$checkboxs.length || !$checkAll.length) {
            return;
        }

        // 全选
        $checkAll.on('click', function () {
            $checkboxs.prop('checked', !isAllChecked($checkboxs));
        });

        // 设置全选的勾选
        $checkboxs.on('click', function () {
            var $this = $(this);
            if ($this.prop('checked')) {
                if (isAllChecked($checkboxs)) {
                    $checkAll.prop('checked', true);
                }
            } else {
                $checkAll.prop('checked', false);
            }
        });
    };

    module.exports = checkAllHelper;
});