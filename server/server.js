import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const db_path = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "db.json",
);

const readDB = () => {
  try {
    return JSON.parse(fs.readFileSync(db_path, "utf-8"));
  } catch {
    return { users: [], films: [], threads: [] };
  }
};

const writeDB = (data) => {
  fs.writeFileSync(db_path, JSON.stringify(data, null, 2));
};

const generateId = (items) => {
  const maxId = items.reduce((max, item) => Math.max(max, item._id || 0), 0);
  return maxId + 1;
};

// Утилиты для ответов
const sendError = (res, status, message) => {
  return res.status(status).json({ ok: false, message });
};

const sendSuccess = (res, data) => {
  return res.json({ ok: true, ...data });
};

app.get('/', (req, res) => {
  res.send('Сервер работает!');
});

// Регистрация
app.post("/api/auth/register", (req, res) => {
  console.log("Регистрация:", req.body);
  const { username, email, password } = req.body;
  const db = readDB();

  if (db.users.find((u) => u.username === username)) {
    return sendError(res, 400, "Пользователь уже существует");
  }

  const newUser = {
    _id: generateId(db.users),
    username,
    email,
    password,
    role: "user",
  };
  db.users.push(newUser);
  writeDB(db);

  const token = `mock-token-${newUser._id}`;
  sendSuccess(res, {
    token,
    tokenType: "Bearer",
    user: {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

// Вход
app.post("/api/auth/login", (req, res) => {
  console.log("Вход:", req.body);
  const { username, password } = req.body;
  const db = readDB();

  const user = db.users.find(
    (u) => u.username === username && u.password === password,
  );
  if (!user) {
    return sendError(res, 401, "Неверный логин или пароль");
  }

  const token = `mock-token-${user._id}`;
  sendSuccess(res, {
    token,
    tokenType: "Bearer",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email || "",
      bio: user.bio || "",
      avatar: user.avatar || null,
      role: user.role,
    },
  });
});

// Обновление пароля
app.put("/api/users/password", (req, res) => {
  console.log("Смена пароля");
  const { newPassword } = req.body;
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return sendError(res, 401, "Не авторизован");
  }

  const token = authHeader.split(" ")[1];
  const userId = parseInt(token.split("-")[2]);
  if (!userId) {
    return sendError(res, 401, "Неверный токен");
  }

  const db = readDB();
  const user = db.users.find((u) => u._id === userId);
  if (!user) {
    return sendError(res, 404, "Пользователь не найден");
  }

  user.password = newPassword;
  writeDB(db);
  sendSuccess(res, { message: "Пароль обновлён" });
});

// Обновление профиля
app.put("/api/users/profile", (req, res) => {
  console.log("Обновление профиля");
  const { name, email, bio, avatar } = req.body;
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return sendError(res, 401, "Не авторизован");
  }

  const token = authHeader.split(" ")[1];
  const userId = parseInt(token.split("-")[2]);
  if (!userId) {
    return sendError(res, 401, "Неверный токен");
  }

  const db = readDB();
  const user = db.users.find((u) => u._id === userId);
  if (!user) {
    return sendError(res, 404, "Пользователь не найден");
  }

  if (name) user.username = name;
  if (email) user.email = email;
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;
  
  writeDB(db);

  sendSuccess(res, {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio || "",
      avatar: user.avatar || null,
      role: user.role,
    },
  });
});

// Фильмы
app.get("/api/films", (req, res) => {
  res.json(readDB().films || []);
});

// Посты
app.get("/api/threads", (req, res) => {
  res.json(readDB().threads || []);
});

// Создание поста
app.post("/api/threads", (req, res) => {
  console.log("Создание поста");
  const { title, content } = req.body;
  const db = readDB();

  if (!title || !content) {
    return sendError(res, 400, "Заполните все поля");
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return sendError(res, 401, "Требуется авторизация");
  }

  const token = authHeader.split(" ")[1];
  const userId = parseInt(token.split("-")[2]);
  const user = db.users.find((u) => u._id === userId);
  if (!user) {
    return sendError(res, 401, "Неверный токен");
  }

  const newPost = {
    _id: generateId(db.threads || []),
    author: user.username,
    avatar: user.avatar || null,
    title,
    content,
    createdAt: new Date().toISOString(),
    likes: 0,
    likedBy: [],
  };

  if (!db.threads) db.threads = [];
  db.threads.push(newPost);
  writeDB(db);
  sendSuccess(res, { post: newPost });
});

// Удаление поста
app.delete("/api/threads/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return sendError(res, 401, "Не авторизован");
  }

  const token = authHeader.split(" ")[1];
  const userId = parseInt(token.split("-")[2]);
  if (!userId) {
    return sendError(res, 401, "Неверный токен");
  }

  const postIndex = db.threads.findIndex((p) => p._id === parseInt(id));
  if (postIndex === -1) {
    return sendError(res, 404, "Пост не найден");
  }

  const user = db.users.find((u) => u._id === userId);
  if (!user) {
    return sendError(res, 404, "Пользователь не найден");
  }

  if (db.threads[postIndex].author !== user.username) {
    return sendError(res, 403, "Вы не можете удалить этот пост");
  }

  db.threads.splice(postIndex, 1);
  writeDB(db);
  sendSuccess(res, { message: "Пост удалён" });
});

// Лайк
app.post("/api/threads/:id/like", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const post = db.threads.find((p) => p._id === parseInt(id));
  if (!post) {
    return sendError(res, 404, "Пост не найден");
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return sendError(res, 401, "Не авторизован");
  }

  const token = authHeader.split(" ")[1];
  const userId = parseInt(token.split("-")[2]);
  if (!userId) {
    return sendError(res, 401, "Неверный токен");
  }

  const likedBy = post.likedBy || [];
  const likedIndex = likedBy.indexOf(userId);
  if (likedIndex === -1) {
    post.likes = (post.likes || 0) + 1;
    likedBy.push(userId);
    post.likedBy = likedBy;
  } else {
    post.likes = (post.likes || 0) - 1;
    likedBy.splice(likedIndex, 1);
    post.likedBy = likedBy;
  }
  
  writeDB(db);
  sendSuccess(res, { likes: post.likes, isLiked: likedIndex === -1 });
});

app.listen(3000, () => {
  console.log(`Сервер запущен на http://localhost:3000`);
  console.log(`База: ${db_path}`);
});