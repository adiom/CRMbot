const sqlite3 = require('sqlite3');

// Создаем базу данных SQLite
const db = new sqlite3.Database('users.db');

// Инициализация бота
const dotenv = require('dotenv');
dotenv.config();

const { Telegraf, Markup } = require('telegraf');
const bot = new Telegraf(process.env.TOKEN);

// Middleware для логирования статистики
bot.use((ctx, next) => {
  // Ваш код для записи статистики входов в бота
  console.log(`User ${ctx.from.id} entered the bot.`);
  next();
});

// Обработчик команды /start с кнопками
bot.start((ctx) => {
  const keyboard = Markup.inlineKeyboard([
    Markup.button.callback('📝 Регистрация', 'register'),
    Markup.button.callback('📋 Задачи', 'tasks'),
    Markup.button.callback('📊 Статистика', 'statistics'),
  ]);

  ctx.reply('Привет! Добро пожаловать в CRM бот.', keyboard);
});

// Обработчик кнопки "Регистрация"
bot.action('register', (ctx) => {
  const userId = ctx.from.id;
  db.run('INSERT INTO users (user_id) VALUES (?)', [userId], (err) => {
    if (err) {
      console.error(err.message);
      ctx.reply('Ошибка при регистрации пользователя.');
    } else {
      ctx.reply('Вы успешно зарегистрированы!');
    }
  });
});

// Обработчик кнопки "Задачи"
bot.action('tasks', (ctx) => {
  const userId = ctx.from.id;
  // Ваш код для отображения задач пользователя
  // Можете использовать db.all для получения списка задач из базы данных
  ctx.reply('Список ваших задач: ...');
});

// Обработчик кнопки "Статистика"
bot.action('statistics', (ctx) => {
  // Ваш код для отображения статистики (например, количество зарегистрированных пользователей)
  ctx.reply('Статистика: ...');
});

// Middleware для обработки текстовых сообщений
bot.on('text', (ctx) => {
  // Ваш код для обработки текстовых сообщений (например, обновление статуса задачи)
  const userId = ctx.from.id;
  const taskText = ctx.message.text;
  db.run('UPDATE tasks SET status = ? WHERE user_id = ? AND task_text = ?', ['выполнено', userId, taskText], (err) => {
    if (err) {
      console.error(err.message);
      ctx.reply('Ошибка при обновлении статуса задачи.');
    } else {
      ctx.reply(`Статус задачи "${taskText}" обновлен на "выполнено".`);
    }
  });
});

// Запуск бота
bot.launch();

// Обработка ошибок
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
