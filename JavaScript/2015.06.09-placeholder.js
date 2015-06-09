/* 
 * @note placeholder 的兼容处理
 *       type password的场景，会在input前添加一个i标签存放placeholder
 *       具体的将 i标签放置到 input 下面的样式需要跟踪这里给出的类名（可以设置）单独写
 * @author Xaber
 */
define(function (require, exports, module) {

    // placeholder 的兼容处理
    // 可接受多个参数
    var placeholder = function (inputs, config) {

        if (this.isSupportPlaceholder) {
            return;
        }

        var arg = [].concat(inputs);

        $.each(arg, function (index, input) {
            var $input = $(input),
                text = $input.attr('placeholder'),
                defaultValue = input.defaultValue,
                isPassWd = $.trim($input.attr('type')) === 'password';

            if (!$input.val()) {
                if (isPassWd) {
                    // 模拟placeholder 提醒添加
                    placeholder.helpPasswdPlaceholder($input, true);
                } else {
                    $input.val(text);
                }
            }

            $input.on('focus', isPassWd ? function () {
                // 模拟placeholder 提醒移除
                placeholder.helpPasswdPlaceholder($input);

            } : function () {
                if (this.value === defaultValue || this.value === text) {
                    this.value = '';
                }
            });
         
            $input.on('blur', isPassWd ? function () {
                // 模拟placeholder 提醒添加
                placeholder.helpPasswdPlaceholder($input, !this.value);

            } : function () {
                if (this.value === '') {
                    this.value = text;
                }
            });
        });
    };

    placeholder._hp_pwd_placeholder = 'u-hp-pwd-placeholder';
    placeholder.setHpPwdPlaceholder = function (text) {
        this._hp_pwd_placeholder = text;
        return this;
    };
    placeholder.isSupportPlaceholder = 'placeholder' in document.createElement('input');
    placeholder.helpPasswdPlaceholder = function (dom, bool) {
        var $passwordMsgCont = null,
            $dom = $(dom),
            operate = bool ? 'show' : 'hide';

        if (dom.$passwordMsgCont) {
            $passwordMsgCont = dom.$passwordMsgCont;

        } else {
            $passwordMsgCont = $('<i class="' + placeholder._hp_pwd_placeholder + '">' + $dom.attr('placeholder') + '</i>'); // 提供类名用于修改样式
            $dom.before($passwordMsgCont);

            dom.$passwordMsgCont = $passwordMsgCont; // 直接将jquery 对象这个引用挂到dom上
        }

        $passwordMsgCont[operate]();
    };

    module.exports = placeholder;
});