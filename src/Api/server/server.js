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
app.use(express.json());

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
// 🔹 ЗАПУСК
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📁 База: ${DB_PATH}`);
});