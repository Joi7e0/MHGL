/**
 * models/Player.js - Клас гравця (Слайма).
 * Відповідає за логіку руху та оновлення позиції героя 
 * за курсором миші і малювання його DOM-елемента.
 */
import { state, dom } from '../core/state.js';

export class Player {
    constructor(x, y, size, speed, health) {
        this.x = x; // Координати ЦЕНТРУ
        this.y = y;
        this.size = size; // Загальний розмір квадратного спрайту
        this.speed = speed;
        this.health = health;
    }

    draw() {
        const rect = dom.canvas.getBoundingClientRect();
        const wrapperRect = dom.canvas.parentElement.getBoundingClientRect();

        const scaleX = rect.width / dom.canvas.width;
        const scaleY = rect.height / dom.canvas.height;

        const offsetX = rect.left - wrapperRect.left;
        const offsetY = rect.top - wrapperRect.top;

        const visualX = offsetX + (this.x * scaleX);
        const visualY = offsetY + (this.y * scaleY);
        const visualSize = this.size * Math.max(scaleX, scaleY);

        dom.playerSprite.style.left = `${visualX}px`;
        dom.playerSprite.style.top = `${visualY}px`;
        dom.playerSprite.style.width = `${visualSize}px`;
        dom.playerSprite.style.height = `${visualSize}px`;

        if (this.invincible) {
            dom.playerSprite.style.opacity = Math.floor(Date.now() / 150) % 2 === 0 ? "0.4" : "1";
        } else {
            dom.playerSprite.style.opacity = "1";
        }
    }

    update(canvasWidth, canvasHeight, mouseX, mouseY) {
        if (mouseX !== null && mouseY !== null) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > this.speed) {
                const angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * this.speed;
                this.y += Math.sin(angle) * this.speed;
            }
        }

        const half = this.size / 2;
        if (this.x - half < 0) this.x = half;
        if (this.x + half > canvasWidth) this.x = canvasWidth - half;
        if (this.y - half < 0) this.y = half;
        if (this.y + half > canvasHeight) this.y = canvasHeight - half;
    }
}
