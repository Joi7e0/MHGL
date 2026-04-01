// Налаштування музики та звуків
/**
 * utils/audio.js - Ініціалізація аудіо системи.
 * Шляхи до музики та звукових ефектів гри. Гучність та зациклення.
 */
export const audio = {
    eat: new Audio('sound/eat_sound.mp3'),
    damage: new Audio('sound/damage_sound.mp3'),
    bgMusic: new Audio('sound/game_sound2.mp3'),
    loss: new Audio('sound/loss_sound.mp3'),
    win: new Audio('sound/viktory_sound.mp3'),
    mainTheme: new Audio('sound/main_menu_sound.mp3')
};

audio.bgMusic.loop = true;
audio.bgMusic.volume = 0.15;

audio.mainTheme.loop = true;
audio.mainTheme.volume = 0.15;
