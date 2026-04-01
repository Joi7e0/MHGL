/**
 * core/game.js - Основний ігровий рушій.
 * Управління циклом requestAnimationFrame, перевірка колізій всіх ботів,
 * спавн нових хвиль ворогів, обробка перемоги або поразки гравця.
 */
import { state, dom } from './state.js';
import { audio } from '../utils/audio.js';
import { Player } from '../models/Player.js';
import { Ball } from '../models/Ball.js';
import { checkCollision } from '../utils/utils.js';
import { hideAllScreens, updateHUD } from '../ui/ui.js';
import { renderLeaderboard } from '../ui/leaderboard.js';

export function killGameLoop() {
    state.isGameRunning = false;
    if (state.animationId) {
        cancelAnimationFrame(state.animationId);
        state.animationId = null;
    }
    state.balls.length = 0;
    state.targetMouseX = null;
    state.targetMouseY = null;
}

export function triggerGameOver(isWin = false) {
    killGameLoop();
    audio.bgMusic.pause();
    audio.bgMusic.currentTime = 0;

    if (isWin) {
        audio.win.currentTime = 0;
        audio.win.play().catch(()=>{});
    } else {
        audio.loss.currentTime = 0;
        audio.loss.play().catch(()=>{});
    }

    const result = {
        name: state.gameConfig.playerName,
        level: state.currentLevel,
        score: state.currentScore
    };

    let leaderboard = JSON.parse(localStorage.getItem('gameLeaderboard')) || [];
    
    const existingIndex = leaderboard.findIndex(e => e.name === result.name);
    if (existingIndex > -1) {
        const existing = leaderboard[existingIndex];
        if (result.score > existing.score || (result.score === existing.score && result.level > existing.level)) {
            leaderboard[existingIndex] = result;
        }
    } else {
        leaderboard.push(result);
    }

    leaderboard.sort((a, b) => b.score - a.score || b.level - a.level);
    localStorage.setItem('gameLeaderboard', JSON.stringify(leaderboard));

    hideAllScreens();
    renderLeaderboard();

    if (isWin) {
        dom.resultTitle.textContent = `Експеримент Завершено Успішно! (Пройдено ${state.gameConfig.maxMutations} мутацій)`;
        dom.resultTitle.style.color = 'var(--primary-color)';
        dom.winImage.classList.remove('hidden');
    } else {
        dom.resultTitle.textContent = "Експеримент провалено (Немає життів)";
        dom.resultTitle.style.color = 'var(--danger-color)';
        dom.winImage.classList.add('hidden');
    }

    dom.resultScreen.classList.remove('hidden');
}

export function spawnBallsForLevel() {
    state.balls.length = 0;
    const targetBallsCount = state.gameConfig.winBallsCount + (state.currentLevel - 1);
    const enemyBallsCount = Math.floor(targetBallsCount * 0.8) + 2;
    const totalBalls = targetBallsCount + enemyBallsCount;

    const possibleColors = ['#ff4757', '#2ed573', '#eccc68', '#00a8ff', '#9b59b6'];
    const enemyColors = possibleColors.filter(c => c !== state.gameConfig.targetColor);
    const behaviors = ['linear', 'zigzag', 'random'];

    for (let i = 0; i < totalBalls; i++) {
        const radius = Math.random() * (state.gameConfig.maxSize - state.gameConfig.minSize) + state.gameConfig.minSize;
        const x = Math.random() * (dom.canvas.width - radius * 2) + radius;
        const y = Math.random() * (dom.canvas.height - radius * 2) + radius;

        const ballSpeed = state.gameConfig.maxSpeed;
        const randomSpeed = Math.random() * (ballSpeed - 0.1) + 0.1;

        const dx = (Math.random() > 0.5 ? 1 : -1) * randomSpeed;
        const dy = (Math.random() > 0.5 ? 1 : -1) * randomSpeed;

        const color = i < targetBallsCount
            ? state.gameConfig.targetColor
            : enemyColors[Math.floor(Math.random() * enemyColors.length)];

        const behavior = behaviors[Math.floor(Math.random() * behaviors.length)];
        state.balls.push(new Ball(x, y, radius, dx, dy, color, behavior));
    }
}

export const gameLoop = () => {
    if (!state.isGameRunning) return;

    dom.ctx.clearRect(0, 0, dom.canvas.width, dom.canvas.height);

    state.player.update(dom.canvas.width, dom.canvas.height, state.targetMouseX, state.targetMouseY);
    state.player.draw();

    for (let i = 0; i < state.balls.length; i++) {
        for (let j = i + 1; j < state.balls.length; j++) {
            const b1 = state.balls[i];
            const b2 = state.balls[j];
            const dx = b2.x - b1.x;
            const dy = b2.y - b1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDist = b1.radius + b2.radius;

            if (distance < minDist && distance > 0) {
                const overlap = minDist - distance;
                const nx = dx / distance;
                const ny = dy / distance;

                b1.x -= nx * overlap / 2;
                b1.y -= ny * overlap / 2;
                b2.x += nx * overlap / 2;
                b2.y += ny * overlap / 2;

                b1.dx *= -1; b1.dy *= -1;
                b2.dx *= -1; b2.dy *= -1;
            }
        }
    }

    state.balls = state.balls.filter(ball => {
        ball.update(dom.canvas.width, dom.canvas.height);
        ball.draw(dom.ctx);

        if (checkCollision(state.player, ball)) {
            const ballDiameter = ball.radius * 2;

            const takeDamage = () => {
                if (state.player.invincible) return;

                if (!state.gameConfig.godMode) {
                    state.player.health--;
                }
                dom.canvas.classList.add('shake');
                setTimeout(() => dom.canvas.classList.remove('shake'), 400);

                if (state.player.size > state.gameConfig.playerSize) {
                    state.player.size -= 10;
                }
            };

            if (ball.color === state.gameConfig.targetColor) {
                state.currentScore++;
                audio.eat.currentTime = 0;
                audio.eat.play().catch(() => { });
            } else {
                if (ballDiameter < state.player.size) {
                    state.currentScore++;
                    audio.eat.currentTime = 0;
                    audio.eat.play().catch(() => { });
                } else {
                    takeDamage();
                    audio.damage.currentTime = 0;
                    audio.damage.play().catch(() => { });
                }
            }

            updateHUD();
            return false;
        }
        return true;
    });

    if (state.player.health <= 0) {
        triggerGameOver();
        return;
    }

    const targetBallsLeft = state.balls.filter(b => b.color === state.gameConfig.targetColor).length;
    if (targetBallsLeft === 0) {
        if (state.currentLevel >= state.gameConfig.maxMutations) {
            triggerGameOver(true);
            return;
        } else {
            state.currentLevel++;

            const possibleColors = ['#ff4757', '#2ed573', '#eccc68', '#00a8ff', '#9b59b6'];
            const otherColors = possibleColors.filter(c => c !== state.gameConfig.targetColor);
            state.gameConfig.targetColor = otherColors[Math.floor(Math.random() * otherColors.length)];

            updateHUD();
            spawnBallsForLevel();
        }
    }

    state.animationId = requestAnimationFrame(gameLoop);
};

export const init = () => {
    state.gameConfig.playerName = document.getElementById('player-name').value.trim();
    state.gameConfig.winBallsCount = parseInt(document.getElementById('win-balls-count').value);
    state.gameConfig.maxSpeed = parseFloat(document.getElementById('max-ball-speed').value);
    state.gameConfig.minSize = parseInt(document.getElementById('min-ball-size').value);
    state.gameConfig.maxSize = parseInt(document.getElementById('max-ball-size').value);
    state.gameConfig.playerSize = parseInt(document.getElementById('player-size').value);
    state.gameConfig.playerHealth = parseInt(document.getElementById('player-lives').value);
    state.gameConfig.targetColor = document.getElementById('target-color').value;
    state.gameConfig.maxMutations = parseInt(document.getElementById('max-mutations').value);
    state.gameConfig.godMode = state.gameConfig.playerHealth === 6;

    state.currentLevel = 1;
    state.currentScore = 0;

    state.player = new Player(
        dom.canvas.width / 2,
        dom.canvas.height / 2,
        state.gameConfig.playerSize,
        4.5,
        state.gameConfig.playerHealth
    );
    state.player.invincible = true;
    setTimeout(() => {
        if (state.player) state.player.invincible = false;
    }, 3000);

    updateHUD();
    spawnBallsForLevel();

    state.isGameRunning = true;
    dom.resultTitle.style.color = 'var(--text-main)';
    dom.playerSprite.classList.remove('hidden');
    dom.playerSprite.src = "photo/main-smile.png";

    audio.bgMusic.currentTime = 0;
    audio.bgMusic.play().catch(() => { });

    audio.mainTheme.pause();
    audio.mainTheme.currentTime = 0;

    gameLoop();
};
