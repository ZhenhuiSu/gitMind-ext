// ==UserScript==
// @name         gitMind-bindKey
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  gitMind自定义绑定快捷键，插入链接(alt+L)，插入备注(alt+B)，退出弹出窗(esc)
// @author       zhenhuiSu
// @match        https://gitmind.cn/app/doc/*
// @grant        none
// @require https://cdn.jsdelivr.net/npm/jquery@1.5.1/dist/node-jquery.min.js
// ==/UserScript==

bindHotKey();

function bindHotKey(){
    document.onkeydown = function(){
        // gitMind内置快捷键绑定的窗口，退出弹出窗后需要使该组件获取焦点，否则内置快捷键将不可用
        var qlEditor = $('.ql-editor');
        var key = window.event.keyCode;
        if (event.altKey) {
            switch(key) {
                case 66:
                    $('.icon-beizhu').click();
                    break;
                case 76:
                    $('.icon-link').click();
                    break;
            }
        } else {
            switch(key) {
                case 27:
                    if ($('.ne-title')) {
                        $('.ne-title').children('.icon-guanbi').click();
                    }
                    qlEditor.focus();
                    break;
            }
        }
    };
}
