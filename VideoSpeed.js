// ==UserScript==
// @name         Video Speed Panel Pro (YT + Bilibili)
// @namespace    vm.speed.panel.pro
// @version      5.0
// @description  Draggable speed panel with ±0.1 control + smart 1x/1.5x toggle
// @match        https://www.youtube.com/*
// @match        https://*.youtube.com/*
// @match        https://www.bilibili.com/*
// @exclude      https://live.bilibili.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const SPEED_KEY = "vm_speed_value";
    const POS_KEY = "vm_speed_panel_pos";

    let speed = parseFloat(localStorage.getItem(SPEED_KEY)) || 1.5;

    function clamp(v) {
        return Math.min(4, Math.max(0.1, v));
    }

    function formatSpeed(v) {
        return v.toFixed(1).replace(/\.0$/, "");
    }

    function applyRate(video) {
        if (!video) return;
        if (Math.abs(video.playbackRate - speed) < 0.01) return;
        video.playbackRate = speed;
    }

    function syncVideos() {
        document.querySelectorAll('video').forEach(applyRate);
    }

    function saveSpeed() {
        localStorage.setItem(SPEED_KEY, speed.toFixed(2));
    }

    function createPanel() {
        const panel = document.createElement("div");
        panel.style.position = "fixed";
        panel.style.zIndex = "999999";
        panel.style.background = "rgba(0,0,0,0.75)";
        panel.style.color = "#fff";
        panel.style.borderRadius = "10px";
        panel.style.fontSize = "13px";
        panel.style.display = "flex";
        panel.style.alignItems = "center";
        panel.style.gap = "6px";
        panel.style.padding = "6px 10px";
        panel.style.userSelect = "none";
        panel.style.backdropFilter = "blur(4px)";
        panel.style.boxShadow = "0 2px 6px rgba(0,0,0,0.4)";
        panel.style.cursor = "default"; // 保持普通箭头

        const btnMinus = document.createElement("span");
        const btnPlus = document.createElement("span");
        const btnToggle = document.createElement("span");

        btnMinus.textContent = "–";
        btnPlus.textContent = "+";

        [btnMinus, btnPlus, btnToggle].forEach(b => {
            b.style.cursor = "pointer";
            b.style.padding = "2px 6px";
            b.style.borderRadius = "6px";
            b.style.background = "rgba(255,255,255,0.1)";
        });

        function updateToggleLabel() {
            btnToggle.textContent = "▶ " + formatSpeed(speed) + "x";
        }

        function updateAll() {
            saveSpeed();
            updateToggleLabel();
            syncVideos();
        }

        btnMinus.onclick = () => {
            speed = clamp(speed - 0.1);
            updateAll();
        };

        btnPlus.onclick = () => {
            speed = clamp(speed + 0.1);
            updateAll();
        };

        // 智能在 1 和 1.5 之间跳
        btnToggle.onclick = () => {
            if (Math.abs(speed - 1) < Math.abs(speed - 1.5)) {
                speed = 1.5;
            } else {
                speed = 1.0;
            }
            updateAll();
        };

        updateToggleLabel();
        panel.append(btnMinus, btnPlus, btnToggle);

        // ===== 恢复位置 =====
        const saved = JSON.parse(localStorage.getItem(POS_KEY) || "null");
        if (saved) {
            panel.style.left = saved.x + "px";
            panel.style.top = saved.y + "px";
        } else {
            panel.style.right = "120px";
            panel.style.top = "70px";
        }

        // ===== 拖动逻辑 =====
        let offsetX, offsetY;

        panel.addEventListener("mousedown", e => {
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;

            function move(e2) {
                panel.style.left = e2.clientX - offsetX + "px";
                panel.style.top = e2.clientY - offsetY + "px";
                panel.style.right = "auto";
            }

            function up() {
                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", up);
                const rect = panel.getBoundingClientRect();
                localStorage.setItem(POS_KEY, JSON.stringify({ x: rect.left, y: rect.top }));
            }

            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", up);
        });

        document.body.appendChild(panel);
    }

    document.addEventListener('play', e => {
        if (e.target instanceof HTMLVideoElement) applyRate(e.target);
    }, true);

    const observer = new MutationObserver(syncVideos);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        createPanel();
        syncVideos();
    });

})();
