/**
 * ui/leaderboard.js - Таблиця рекордів гравця.
 * Робота з Local Storage: перевірка, додавання нових досягнень, сортування 
 * та вивід результатів у віконце Топ-рейтингу.
 */
import { dom } from '../core/state.js';

export function renderLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('gameLeaderboard')) || [];
    const noDataHTML = '<li class="leaderboard-item"><span class="player" style="text-align:center; width:100%">Ще немає жодного рекорду! Мутуйте першим!</span></li>';

    let htmlContent = '';
    if (leaderboard.length === 0) {
        htmlContent = noDataHTML;
    } else {
        leaderboard.slice(0, 5).forEach((entry, index) => {
            htmlContent += `
                <li class="leaderboard-item" style="padding: 10px; list-style: none; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span class="rank" style="color: var(--primary-color); font-weight: bold;">${index + 1}.</span>
                    <span class="player" style="flex:1; margin-left: 15px; font-weight: bold;">${entry.name}</span>
                    <span class="level" style="margin-right: 15px; color: var(--text-muted);">Мутація ${entry.level}</span>
                    <span class="score" style="color: var(--primary-color); font-weight: bold;">${entry.score} очок</span>
                </li>
            `;
        });
    }

    if (dom.leaderboardList) dom.leaderboardList.innerHTML = htmlContent;
    if (dom.mainLeaderboardList) dom.mainLeaderboardList.innerHTML = htmlContent;
}

export const clearLbFunc = () => {
    localStorage.removeItem('gameLeaderboard');
    renderLeaderboard();
};
