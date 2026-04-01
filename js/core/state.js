/**
 * core/state.js - Глобальний стан та DOM-елементи.
 * Зберігає змінні, які потрібні на різних етапах гри,
 * а також посилання на всі ключові елементи сторінки.
 */
export const state = {
    isGameRunning: false,
    currentLevel: 1,
    currentScore: 0,
    gameConfig: {},
    player: null,
    balls: [],
    targetMouseX: null,
    targetMouseY: null,
    animationId: null,
    isPaused: false
};

export const dom = {
    startScreen: document.getElementById('start-screen'),
    gameScreen: document.getElementById('game-screen'),
    resultScreen: document.getElementById('result-screen'),

    startButton: document.getElementById('start-button'),
    stopButton: document.getElementById('stop-button'),
    restartButton: document.getElementById('restart-button'),

    canvas: document.getElementById('gameCanvas'),
    ctx: document.getElementById('gameCanvas') ? document.getElementById('gameCanvas').getContext('2d') : null,

    errorMessage: document.getElementById('error-message'),
    countdownOverlay: document.getElementById('countdown-overlay'),
    playerSprite: document.getElementById('player-sprite'),
    winImage: document.getElementById('win-image'),

    hudLevel: document.getElementById('hud-level'),
    hudScore: document.getElementById('hud-score'),
    hudLives: document.getElementById('hud-lives'),

    resultTitle: document.getElementById('result-title'),
    leaderboardList: document.getElementById('leaderboard-list'),
    mainLeaderboardList: document.getElementById('main-leaderboard-list'),

    clearLbBtnResult: document.getElementById('clear-leaderboard-button'),
    clearLbBtnMain: document.getElementById('clear-leaderboard-main'),

    settingsModal: document.getElementById('settings-modal'),
    settingsBtn: document.getElementById('settings-btn'),
    closeSettings: document.getElementById('close-settings'),

    leaderboardModal: document.getElementById('leaderboard-modal'),
    leaderboardBtn: document.getElementById('leaderboard-btn'),
    closeLeaderboard: document.getElementById('close-leaderboard')
};
