/**
 * ui/ui.js - Функції візуального інтерфейсу та валідації.
 * Керує перемиканням вікон екрану (приховування), адаптивністю
 * ігрового поля (ресайз Canvas) та оновленням HUD життів і рахунку.
 */
import { dom, state } from '../core/state.js';

export function hideAllScreens() {
    dom.startScreen.classList.add('hidden');
    dom.gameScreen.classList.add('hidden');
    dom.resultScreen.classList.add('hidden');
    dom.playerSprite.classList.add('hidden');
}

export function validateInputs() {
    const name = document.getElementById('player-name').value.trim();
    const winBalls = parseInt(document.getElementById('win-balls-count').value);
    const playerSize = parseInt(document.getElementById('player-size').value);
    const minSize = parseInt(document.getElementById('min-ball-size').value);
    const maxSize = parseInt(document.getElementById('max-ball-size').value);
    const speed = parseFloat(document.getElementById('max-ball-speed').value);
    const playerHealth = parseInt(document.getElementById('player-lives').value);
    const maxMutations = parseInt(document.getElementById('max-mutations').value);

    if (!name) return "Ім'я гравця не може бути порожнім!";
    if (isNaN(winBalls) || winBalls <= 0) return "Кількість кульок має бути більшою за 0!";
    if (isNaN(playerSize) || playerSize < 20 || playerSize > 75) return "Розмір гравця має бути від 20 до 75px!";
    if (isNaN(minSize) || minSize < 20 || minSize > 75) return "Мін. розмір кулі має бути від 20 до 75px!";
    if (isNaN(maxSize) || maxSize < 20 || maxSize > 75) return "Макс. розмір кулі має бути від 20 до 75px!";
    if (minSize > maxSize) return "Мінімальний розмір кулі не може перевищувати максимальний!";
    if (isNaN(speed) || speed < 0.1 || speed > 1.0) return "Швидкість куль має бути від 0.1 до 1.0!";
    if (isNaN(playerHealth) || playerHealth < 1 || playerHealth > 6) return "Життя мають бути від 1 до 6 (6 - God Mode)!";
    if (isNaN(maxMutations) || maxMutations < 1 || maxMutations > 100) return "Кількість мутацій має бути від 1 до 100!";

    return null;
}

export function resizeCanvas() {
    if (dom.gameScreen.classList.contains('hidden')) return;

    const maxW = window.innerWidth * 0.95;
    const maxH = window.innerHeight * 0.85;

    dom.canvas.width = maxW;
    dom.canvas.height = maxH;

    if (state.player) {
        const half = state.player.size / 2;
        state.player.x = Math.min(Math.max(state.player.x, half), dom.canvas.width - half);
        state.player.y = Math.min(Math.max(state.player.y, half), dom.canvas.height - half);
    }

    state.balls.forEach(ball => {
        ball.x = Math.min(Math.max(ball.x, ball.radius), dom.canvas.width - ball.radius);
        ball.y = Math.min(Math.max(ball.y, ball.radius), dom.canvas.height - ball.radius);
    });
}

export function updateHUD() {
    dom.hudLevel.textContent = `Мутація: ${state.currentLevel}`;
    dom.hudScore.textContent = `Рахунок: ${state.currentScore}`;

    if (state.gameConfig.godMode) {
        dom.hudLives.innerHTML = '<span style="color: gold; text-shadow: 0 0 10px gold;">GOD MODE</span>';
    } else {
        dom.hudLives.innerHTML = '';
        const maxVisibleHearts = state.gameConfig.playerHealth;
        const currentLives = state.player ? state.player.health : state.gameConfig.playerHealth;
        for (let i = 0; i < maxVisibleHearts; i++) {
            const img = document.createElement('img');
            img.className = 'heart-icon';
            img.src = i < currentLives ? 'photo/heart.png' : 'photo/broken heart.png';
            dom.hudLives.appendChild(img);
        }
    }
}
