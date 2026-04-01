/**
 * main.js - Головна точка входу в програму.
 * Завантажує модулі, ініціалізує глобальні слухачі подій (миша, ресайз вікна)
 * та призначає дії на кнопки стартового меню й налаштувань.
 */
import { state, dom } from './core/state.js';
import { audio } from './utils/audio.js';
import { resizeCanvas, validateInputs, hideAllScreens } from './ui/ui.js';
import { renderLeaderboard, clearLbFunc } from './ui/leaderboard.js';
import { init, killGameLoop, triggerGameOver } from './core/game.js';

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('resize', resizeCanvas);

    if (dom.canvas) {
        dom.canvas.addEventListener('mousemove', (e) => {
            const rect = dom.canvas.getBoundingClientRect();
            const scaleX = dom.canvas.width / rect.width;
            const scaleY = dom.canvas.height / rect.height;
            state.targetMouseX = (e.clientX - rect.left) * scaleX;
            state.targetMouseY = (e.clientY - rect.top) * scaleY;
        });

        dom.canvas.addEventListener('mouseleave', () => {
            state.targetMouseX = null;
            state.targetMouseY = null;
        });
    }

    if (dom.startButton) {
        dom.startButton.addEventListener('click', (e) => {
            e.preventDefault();

            const error = validateInputs();
            if (error) {
                dom.errorMessage.textContent = error;
                dom.errorMessage.classList.remove('hidden');
                return;
            }
            dom.errorMessage.classList.add('hidden');

            hideAllScreens();
            dom.gameScreen.classList.remove('hidden');

            resizeCanvas();

            dom.ctx.clearRect(0, 0, dom.canvas.width, dom.canvas.height);
            dom.countdownOverlay.classList.remove('hidden');
            dom.countdownOverlay.style.animation = 'none';
            dom.countdownOverlay.style.animation = 'popAnim 1s ease-out infinite';

            let counter = 3;
            dom.countdownOverlay.innerHTML = counter;

            const countdownInterval = setInterval(() => {
                counter--;
                if (counter > 0) {
                    dom.countdownOverlay.innerHTML = counter;
                } else if (counter === 0) {
                    dom.countdownOverlay.innerHTML = "СТАРТ!";
                } else {
                    clearInterval(countdownInterval);
                    dom.countdownOverlay.classList.add('hidden');

                    killGameLoop();
                    init();
                }
            }, 800);
        });
    }

    if (dom.stopButton) {
        dom.stopButton.addEventListener('click', () => {
            triggerGameOver();
        });
    }

    if (dom.restartButton) {
        dom.restartButton.addEventListener('click', () => {
            hideAllScreens();
            dom.startScreen.classList.remove('hidden');
            killGameLoop();
            dom.ctx.clearRect(0, 0, dom.canvas.width, dom.canvas.height);

            audio.mainTheme.currentTime = 0;
            audio.mainTheme.play().catch(()=>{});
        });
    }

    if (dom.clearLbBtnResult) dom.clearLbBtnResult.addEventListener('click', clearLbFunc);
    if (dom.clearLbBtnMain) dom.clearLbBtnMain.addEventListener('click', clearLbFunc);

    if (dom.settingsBtn) {
        dom.settingsBtn.addEventListener('click', () => {
            dom.settingsModal.classList.remove('hidden');
        });
    }

    if (dom.closeSettings) {
        dom.closeSettings.addEventListener('click', () => {
            dom.settingsModal.classList.add('hidden');
        });
    }

    if (dom.leaderboardBtn) {
        dom.leaderboardBtn.addEventListener('click', () => {
            dom.leaderboardModal.classList.remove('hidden');
        });
    }

    if (dom.closeLeaderboard) {
        dom.closeLeaderboard.addEventListener('click', () => {
            dom.leaderboardModal.classList.add('hidden');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === dom.settingsModal) {
            dom.settingsModal.classList.add('hidden');
        }
        if (e.target === dom.leaderboardModal) {
            dom.leaderboardModal.classList.add('hidden');
        }
    });

    renderLeaderboard();
    audio.mainTheme.play().catch(()=>{});
});
