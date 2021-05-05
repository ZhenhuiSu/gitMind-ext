// ==UserScript==
// @name         gitMind-bindKey
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  gitMind自定义绑定快捷键，插入链接(alt+L)，插入备注(alt+B)，退出弹出窗(esc)，折叠/收缩(alt+Z)
// @note         2021.04.28 去除流程图的自动保存功能
// @note         2021.04.28 流程图自动保存功能使用开关形式
// @note         2021.04.28 脑图增加快捷键折叠/收缩(alt+Z)
// @author       zhenhuiSu
// @match        https://gitmind.cn/app/doc/*
// @match        https://gitmind.cn/app/flowchart/*
// @grant        none
// @require https://cdn.jsdelivr.net/npm/jquery@1.5.1/dist/node-jquery.min.js
// ==/UserScript==
(function () {
    window.myGitMind = {};
    if (location.pathname.indexOf('flowchart') >= 0) {
        var timeout = 1000;
        var addDom4CloseAutoSave = function() {
            window.myGitMind.isAutoSaveFile = true;
            var menus = $('.menus-outer.is-left');
            var sourceNode = menus[0].children[0];
            var attributeNames = sourceNode.getAttributeNames();
            var closeAutoSaveBtn = $('<li></li>').addClass("menus-list is-left menus-list is-left iconfont closeAutoSaveFile");
            var closeAutoSaveBtnEl = closeAutoSaveBtn[0];
            for (var i = 0; i < attributeNames.length; i++) {
                if (attributeNames[i] !== 'class') {
                    closeAutoSaveBtnEl.setAttribute(attributeNames[i], sourceNode.getAttribute(attributeNames[i]))
                }
            }
            closeAutoSaveBtnEl.append('关闭自动保存');
            closeAutoSaveBtn.click(function() {
                var editorContainerVue = searchVueByDomClassName(window.app, 'editor-container');
                if (!editorContainerVue) return;
                if (window.myGitMind.isAutoSaveFile) {
                    // 关闭自动保存
                    // 缓存window.flowchartBridge.autoSaveFile
                    window.myGitMind.autoSaveFileFn = window.flowchartBridge.autoSaveFile;
                    window.flowchartBridge.autoSaveFile = function() {};
                    // 缓存editorContainerVue.throttleSaveFile
                    window.myGitMind.throttleSaveFileFn = editorContainerVue.throttleSaveFile;
                    editorContainerVue.throttleSaveFile = function() {};
                    closeAutoSaveBtnEl.innerHTML = '开启自动保存';
                    window.myGitMind.isAutoSaveFile = false;
                } else {
                    // 开启自动保存
                    // 恢复window.flowchartBridge.autoSaveFile
                    window.flowchartBridge.autoSaveFile = window.myGitMind.autoSaveFileFn;
                    // 恢复editorContainerVue.throttleSaveFile
                    editorContainerVue.throttleSaveFile = window.myGitMind.throttleSaveFileFn;
                    closeAutoSaveBtnEl.innerHTML = '关闭自动保存';
                    window.myGitMind.isAutoSaveFile = true;
                }
            });
            menus.append(closeAutoSaveBtnEl);
        };
        var timeoutFn = function() {
             if ($('.menus-outer.is-left')) {
                addDom4CloseAutoSave();
            } else {
                setTimeout(timeoutFn, timeout);
            }
        };
        setTimeout(timeoutFn, timeout)
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
            var remarkEl = $('.icon-link');
            if (remarkEl) {
                remarkEl.click();
            }
        },
        // 00190 alt Z
        190: function () {
            var expendEl = $('.icon-zhankai');
            var shrinkEl = $('.icon-shouqi');
            if (expendEl) {
                expendEl.click();
            }
            if (shrinkEl) {
                shrinkEl.click();
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
