// ==UserScript==
// @name         gitMind-bindKey
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  gitMind自定义绑定快捷键，插入链接(alt+L)，插入备注(alt+B)，退出弹出窗(esc)
// @author       zhenhuiSu
// @match        https://gitmind.cn/app/doc/*
// @grant        none
// @require https://cdn.jsdelivr.net/npm/jquery@1.5.1/dist/node-jquery.min.js
// ==/UserScript==
(function () {
    bindHotKey();

    // ctrl shift alt key
    var bindMap = {
        // 00027 ESC
        27: function () {
            var qlEditor = $('.ql-editor');
            var remarkPop = $('.ne-title');
            if (remarkPop) {
                remarkPop.children('.icon-guanbi').click()
            }

            if (qlEditor) {
                qlEditor.focus();
            }
        },
        // 00166 alt B
        166: function () {
            var remarkEl = $('.icon-beizhu');
            if (remarkEl) {
                remarkEl.click();
            }
        },
        // 00176 alt L
        176: function () {
            var remarkEl = $('.icon-beizhu');
            if (remarkEl) {
                remarkEl.click();
            }
        }
    }

    function bindHotKey() {
        document.onkeydown = function () {
            // gitMind内置快捷键绑定的窗口，退出弹出窗后需要使该组件获取焦点，否则内置快捷键将不可用
            var fun = choiceFun(window.event);
            if (fun) {
                fun.apply();
            }
        };
    }

    function choiceFun(e) {
        var key = 0;
        key = key + e.ctrlKey;
        key = (key * 10) + e.shiftKey;
        key = (key * 10) + e.altKey;
        key = (key * 100) + e.keyCode;
        return bindMap[key];
    }
})();
