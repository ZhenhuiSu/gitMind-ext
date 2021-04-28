// ==UserScript==
// @name         gitMind-bindKey
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  gitMind自定义绑定快捷键，插入链接(alt+L)，插入备注(alt+B)，退出弹出窗(esc)
// @note         2021.04.28 去除流程图的自动保存功能
// @author       zhenhuiSu
// @match        https://gitmind.cn/app/doc/*
// @match        https://gitmind.cn/app/flowchart/*
// @grant        none
// @require https://cdn.jsdelivr.net/npm/jquery@1.5.1/dist/node-jquery.min.js
// ==/UserScript==
(function () {
    if (location.pathname.indexOf('flowchart') >= 0) {
        // 设置打开页面多久后清除自动保存功能，默认10秒（10000毫秒）
        // 如果发现依旧存在自动保存功能，需要调大这个值
        var timeout = 10000;
        setTimeout(function() {
            window.flowchartBridge.autoSaveFile = function() {};
            var editorContainerVue = searchVueByDomClassName(window.app, 'editor-container');
            if (editorContainerVue) {
                editorContainerVue.throttleSaveFile = function() {};
            }
        }, timeout);
    } else {
        bindHotKey();
    }

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

    function searchVueByDomClassName(root, className) {
        var isVue = root && root._isVue;
        if (!isVue) return null;
        if (root.$el && root.$el.className === className) return root;
        var children = root.$children;
        var result;
        if (children) {
            for (var i = 0; i < children.length; i++) {
                result = searchVueByDomClassName(children[i], className);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }
})();
