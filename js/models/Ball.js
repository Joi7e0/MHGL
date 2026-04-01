/**
 * models/Ball.js - Клас ворожих/цільових куль.
 * Відома поведінка (zigzag, random, linear), пульсація (ріст/зменшення)
 * та логіка малювання спрайтів ботів на Canvas.
 */
import { loadedSmileImages } from '../utils/utils.js';
import { state } from '../core/state.js';

export class Ball {
    constructor(x, y, radius, dx, dy, color, behavior) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.color = color;

        this.baseRadius = radius;
        this.scaleSpeed = (Math.random() * 0.3) + 0.1;
        this.maxScale = 1 + Math.random() * 0.3;
        this.isGrowing = Math.random() > 0.5;

        this.behavior = behavior;
        this.ticks = 0;
        this.baseSpeed = Math.sqrt(dx * dx + dy * dy);
    }

    draw(ctx) {
        const img = loadedSmileImages[this.color];
        if (img && img.complete) {
            const size = this.radius * 2;
            ctx.drawImage(img, this.x - this.radius, this.y - this.radius, size, size);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }

        // Напис "Ціль" або "Ворог"
        const labelText = (this.color === state.gameConfig.targetColor) ? "Ціль" : "Ворог";
        ctx.fillStyle = (this.color === state.gameConfig.targetColor) ? "#ffa502" : "#ff3366";
        ctx.font = "bold 13px Rajdhani";
        ctx.textAlign = "center";
        ctx.fillText(labelText, this.x, this.y - this.radius - 5);
    }

    update(canvasWidth, canvasHeight) {
        this.ticks++;

        if (this.isGrowing) {
            this.radius += this.scaleSpeed;
            if (this.radius >= this.baseRadius * this.maxScale) this.isGrowing = false;
        } else {
            this.radius -= this.scaleSpeed;
            if (this.radius <= this.baseRadius) this.isGrowing = true;
        }

        if (this.behavior === 'zigzag') {
            if (this.ticks % 60 === 0) {
                if (Math.random() > 0.5) this.dx *= -1;
                else this.dy *= -1;
            }
        } else if (this.behavior === 'random') {
            if (this.ticks % 90 === 0) {
                const newAngle = Math.random() * Math.PI * 2;
                this.dx = Math.cos(newAngle) * this.baseSpeed;
                this.dy = Math.sin(newAngle) * this.baseSpeed;
            }
        }

        this.x += this.dx;
        this.y += this.dy;

        if (this.x - this.radius <= 0 || this.x + this.radius >= canvasWidth) {
            this.dx *= -1;
            this.x = this.x - this.radius <= 0 ? this.radius : canvasWidth - this.radius;
        }
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvasHeight) {
            this.dy *= -1;
            this.y = this.y - this.radius <= 0 ? this.radius : canvasHeight - this.radius;
        }
    }
}
