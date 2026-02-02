// ==UserScript==
// @name         115 VIP Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Block "Purchase VIP" ads, floating banners, and top promo banners on 115.com
// @author       Antigravity
// @match        https://115.com/*
// @match        https://f.115.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    // CSS to hide the ad elements
    const css = `
        /* 1. Hide Sidebar Buy VIP Button */
        div[title="购买VIP"] {
            display: none !important;
        }

        /* 2. Hide Floating Bottom-Right Ad */
        /* Target by position styles (fallback) */
        div.fixed[style*="bottom: 20px"][style*="right: 20px"],
        /* Target by internal "Close Ad" button (more specific) */
        div.fixed:has(button[aria-label="关闭广告"]) {
            display: none !important;
        }

        /* 3. Hide Top Banner Ad (Right of Search Bar) */
        /* Targets the container div that holds the ad image */
        /* The image usually has alt text like "【17周年】115生活_网页_网页_头部" */
        div.flex.items-center > div:has(img[alt*="网页_头部"]),
        div.flex.items-center > div:has(img[alt*="115生活"][alt*="网页"]) {
            display: none !important;
        }
    `;

    // Inject the CSS
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = 'antigravity-115-adblock';
        style.textContent = css;

        // Try to insert as early as possible
        const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
        head.appendChild(style);
    }
})();
