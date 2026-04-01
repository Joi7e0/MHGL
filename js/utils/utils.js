/**
 *  Допоміжні чисті функції та константи.
 * Маппінг картинок для кульок. Формула перевірки фізичних
 * зіткнень між двома круглими об'єктами.
 */
export const colorImageMap = {
    '#ff4757': 'photo/slime/red.png',
    '#2ed573': 'photo/slime/green.png',
    '#eccc68': 'photo/slime/yellow.png',
    '#00a8ff': 'photo/slime/blue.png',
    '#9b59b6': 'photo/slime/lila.png'
};

export const loadedSmileImages = {};
Object.keys(colorImageMap).forEach(key => {
    loadedSmileImages[key] = new Image();
    loadedSmileImages[key].src = colorImageMap[key];
});

export const checkCollision = (player, ball) => {
    const dx = player.x - ball.x;
    const dy = player.y - ball.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Розмір гравця подається як диаметр/ширина, тому радіус це половина
    return distance < (player.size / 2 + ball.radius);
};
