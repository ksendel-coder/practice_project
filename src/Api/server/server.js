// server.js
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const DB_PATH = path.join(__dirname, '../../../server/db.json');

// 🔹 Чтение базы
const readDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { users: [], movies: [] };
  }
};

// 🔹 Запись в базу
const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// 🔹 Генерация ID
const generateId = (items) => {
  const maxId = items.reduce((max, item) => Math.max(max, item._id || 0), 0);
  return maxId + 1;
};

// ============================================
// 🔹 РЕГИСТРАЦИЯ
// ============================================
app.post('/api/auth/register', (req, res) => {
  console.log('📩 Регистрация:', req.body);
  
  const { username, email, password } = req.body;
  const db = readDB();

  const existing = db.users.find((u) => u.username === username);
  if (existing) {
    return res.status(400).json({ ok: false, message: 'Пользователь уже существует' });
  }

  const newUser = {
    _id: generateId(db.users),
    username,
    email,
    password,
    role: 'user',
  };

  db.users.push(newUser);
  writeDB(db);

  const token = `mock-token-${newUser._id}`;

  res.json({
    ok: true,
    token,
    tokenType: 'Bearer',
    user: {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

// ============================================
// 🔹 ВХОД
// ============================================
app.post('/api/auth/login', (req, res) => {
  console.log('📩 Вход:', req.body);
  
  const { username, password } = req.body;
  const db = readDB();

  const user = db.users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ ok: false, message: 'Неверный логин или пароль' });
  }

  const token = `mock-token-${user._id}`;

  res.json({
    ok: true,
    token,
    tokenType: 'Bearer',
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

// ============================================
// 🔹 ПОЛУЧИТЬ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ
// ============================================
app.get('/api/users', (req, res) => {
  const db = readDB();
  res.json(db.users);
});

// ============================================
// 🔹 ПОЛУЧИТЬ ФИЛЬМЫ
// ============================================
app.get('/api/films', (req, res) => {
  const db = readDB();
  res.json(db.films || []);
});

// ============================================
// 🔹 ТРЕДЫ (ПОСТЫ)
// ============================================

// 🔹 Получить все посты
app.get('/api/threads', (req, res) => {
  const db = readDB();
  res.json(db.threads || []);
});

// 🔹 Создать пост
app.post('/api/threads', (req, res) => {
  console.log('📩 Получен запрос на создание поста');
  console.log('📦 Body:', req.body);
  console.log('🔑 Authorization:', req.headers.authorization);
  
  const { title, content } = req.body;
  const db = readDB();

  if (!title || !content) {
    console.error('❌ Нет title или content');
    return res.status(400).json({ ok: false, message: 'Заполните все поля' });
  }

  const authHeader = req.headers.authorization;
  let author = 'Аноним';
  let avatar = null;  // ← добавить

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const userId = parseInt(token.split('-')[2]);
    const user = db.users.find((u) => u._id === userId);
    if (user) {
      author = user.username;
      avatar = user.avatar || null;  // ← сохраняем аватар автора
      console.log('👤 Автор:', author);
      console.log('🖼️ Аватар:', avatar);
    } else {
      console.warn('⚠️ Пользователь не найден по токену');
    }
  } else {
    console.warn('⚠️ Нет Authorization заголовка');
  }

  const newPost = {
    _id: generateId(db.threads || []),
    author,
    avatar,  // ← добавляем avatar в пост
    title,
    content,
    createdAt: new Date().toISOString(),
    likes: 0,
    likedBy: [],
    comments: [],
  };

  if (!db.threads) db.threads = [];
  db.threads.push(newPost);
  writeDB(db);

  console.log('✅ Пост создан:', newPost);
  res.json({ ok: true, post: newPost });
});

// ============================================
// 🔹 УДАЛИТЬ ПОСТ
// ============================================
app.delete('/api/threads/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  
  const postIndex = db.threads.findIndex((p) => p._id === parseInt(id));
  
  if (postIndex === -1) {
    return res.status(404).json({ ok: false, message: 'Пост не найден' });
  }

  db.threads.splice(postIndex, 1);
  writeDB(db);
  
  console.log(`🗑️ Пост #${id} удалён`);
  res.json({ ok: true, message: 'Пост удалён' });
});

// ============================================
// 🔹 ЛАЙКНУТЬ ПОСТ
// ============================================
app.post('/api/threads/:id/like', (req, res) => {
  const { id } = req.params;
  console.log(`❤️ Запрос на лайк поста #${id}`);
  
  const db = readDB();
  const post = db.threads.find((p) => p._id === parseInt(id));
  
  if (!post) {
    console.warn(`⚠️ Пост #${id} не найден`);
    return res.status(404).json({ ok: false, message: 'Пост не найден' });
  }

  post.likes = (post.likes || 0) + 1;
  post.likedBy = post.likedBy || [];
  writeDB(db);
  
  console.log(`✅ Пост #${id} лайкнут, лайков: ${post.likes}`);
  res.json({ ok: true, likes: post.likes });
});

// ============================================
// 🔹 СМЕНИТЬ ПАРОЛЬ
// ============================================
app.put('/api/users/password', (req, res) => {
  console.log('🔑 Запрос на смену пароля');
  
  const { newPassword } = req.body;
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ ok: false, message: 'Не авторизован' });
  }

  const token = authHeader.split(' ')[1];
  let userId = null;
  if (token.includes('mock-token-')) {
    userId = parseInt(token.split('-')[2]);
  }

  if (!userId) {
    return res.status(401).json({ ok: false, message: 'Неверный токен' });
  }

  const db = readDB();
  const user = db.users.find((u) => u._id === userId);

  if (!user) {
    return res.status(404).json({ ok: false, message: 'Пользователь не найден' });
  }

  user.password = newPassword;
  writeDB(db);

  console.log(`✅ Пароль пользователя ${user.username} обновлён`);
  res.json({ ok: true, message: 'Пароль обновлён' });
});

// ============================================
// 🔹 ОБНОВИТЬ ПРОФИЛЬ
// ============================================
app.put('/api/users/profile', (req, res) => {
  console.log('📝 Запрос на обновление профиля');
  console.log('📦 Body:', req.body);
  
  const { name, email, bio, avatar } = req.body;
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ ok: false, message: 'Не авторизован' });
  }

  const token = authHeader.split(' ')[1];
  let userId = null;
  if (token.includes('mock-token-')) {
    userId = parseInt(token.split('-')[2]);
  }

  if (!userId) {
    return res.status(401).json({ ok: false, message: 'Неверный токен' });
  }

  const db = readDB();
  const user = db.users.find((u) => u._id === userId);

  if (!user) {
    return res.status(404).json({ ok: false, message: 'Пользователь не найден' });
  }

  if (name) user.username = name;
  if (email) user.email = email;
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;

  writeDB(db);

  console.log(`✅ Профиль пользователя ${user.username} обновлён`);
  res.json({
    ok: true,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio || '',
      avatar: user.avatar || null,
      role: user.role,
    },
  });
});

// ============================================
// 🔹 ЗАПУСК
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📁 База: ${DB_PATH}`);
});