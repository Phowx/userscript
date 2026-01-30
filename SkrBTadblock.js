// ==UserScript==
// @name         SkrBT 精品推荐与在线播放屏蔽器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  屏蔽 SkrBT 网站上的"精品推荐"和"在线播放"相关内容
// @author       You
// @match        https://skrbtso.top/*
// @match        https://*.skrbtso.top/*
// @match        https://skrbtso.cc/*
// @match        https://*.skrbtso.cc/*
// @match        https://soskr.net/*
// @match        https://*.soskr.net/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 添加CSS样式，立即隐藏目标元素
    GM_addStyle(`
        /* 精品推荐区块 - 通过ID直接隐藏 */
        #detail-ad-recommend-panel {
            display: none !important;
        }

        /* 资源下载区块中的云播通道 */
        #detail-ad-panel a[href*="by87d.com"],
        #detail-ad-panel a[href*="anyshare.icu"] {
            display: none !important;
        }
    `);

    // DOM加载完成后执行更复杂的匹配
    function hideUnwantedContent() {
        // 获取所有 panel
        const panels = document.querySelectorAll('.panel.panel-default');

        panels.forEach(panel => {
            const panelTitle = panel.querySelector('.panel-title');
            if (panelTitle) {
                const titleText = panelTitle.textContent.trim();

                // 屏蔽"在线播放"区块
                if (titleText === '在线播放') {
                    panel.style.display = 'none';
                }

                // 双重保险：再次确保"精品推荐"被隐藏
                if (titleText === '精品推荐') {
                    panel.style.display = 'none';
                }
            }
        });

        // 隐藏右侧面板中可能的广告内容
        const rightPanel = document.getElementById('right-panel');
        if (rightPanel) {
            // 如果右侧面板只有广告，可以选择完全隐藏
            // rightPanel.style.display = 'none';
        }
    }

    // 页面加载时执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideUnwantedContent);
    } else {
        hideUnwantedContent();
    }

    // 监听DOM变化，处理动态加载的内容
    const observer = new MutationObserver(function(mutations) {
        hideUnwantedContent();
    });

    // 等待body存在后开始观察
    function startObserving() {
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            hideUnwantedContent();
        } else {
            setTimeout(startObserving, 10);
        }
    }

    startObserving();
})();
