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
    return { users: [], movies: [] };
  }
};

const writeDB = (data) => {
  fs.writeFileSync(db_path, JSON.stringify(data, null, 2));
};

const generateId = (items) => {
  const maxId = items.reduce((max, item) => Math.max(max, item._id || 0), 0);
  return maxId + 1;
};

// Регистрация
app.post("/api/auth/register", (req, res) => {
  console.log("Регистрация:", req.body);
  const { username, email, password } = req.body;
  const db = readDB();

  if (db.users.find((u) => u.username === username)) {
    return res
      .status(400)
      .json({ ok: false, message: "Пользователь уже существует" });
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
  res.json({
    ok: true,
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
    return res
      .status(401)
      .json({ ok: false, message: "Неверный логин или пароль" });
  }

  const token = `mock-token-${user._id}`;
  res.json({
    ok: true,
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

// Список пользователей
app.get("/api/users", (req, res) => {
  res.json(readDB().users);
});

// Обновление пароля
app.put("/api/users/password", (req, res) => {
  console.log("Смена пароля");
  const { newPassword } = req.body;
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ ok: false, message: "Не авторизован" });

  const token = authHeader.split(" ")[1];
  const userId = parseInt(token.split("-")[2]);
  if (!userId)
    return res.status(401).json({ ok: false, message: "Неверный токен" });

  const db = readDB();
  const user = db.users.find((u) => u._id === userId);
  if (!user)
    return res
      .status(404)
      .json({ ok: false, message: "Пользователь не найден" });

  user.password = newPassword;
  writeDB(db);
  res.json({ ok: true, message: "Пароль обновлён" });
});

// Обновление профиля
app.put("/api/users/profile", (req, res) => {
  console.log("Обновление профиля");
  const { name, email, bio, avatar } = req.body;
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ ok: false, message: "Не авторизован" });

  const token = authHeader.split(" ")[1];
  const userId = parseInt(token.split("-")[2]);
  if (!userId)
    return res.status(401).json({ ok: false, message: "Неверный токен" });

  const db = readDB();
  const user = db.users.find((u) => u._id === userId);
  if (!user)
    return res
      .status(404)
      .json({ ok: false, message: "Пользователь не найден" });

  if (name) user.username = name;
  if (email) user.email = email;
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;
  writeDB(db);

  res.json({
    ok: true,
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

// Список фильмов
app.get("/api/films", (req, res) => {
  res.json(readDB().films || []);
});

// Список тредов
app.get("/api/threads", (req, res) => {
  res.json(readDB().threads || []);
});

// Создание треда
app.post("/api/threads", (req, res) => {
  console.log("Создание поста");
  const { title, content } = req.body;
  const db = readDB();

  if (!title || !content) {
    return res.status(400).json({ ok: false, message: "Заполните все поля" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ ok: false, message: "Требуется авторизация" });
  }

  const token = authHeader.split(" ")[1];
  const userId = parseInt(token.split("-")[2]);
  const user = db.users.find((u) => u._id === userId);
  if (!user) {
    return res.status(401).json({ ok: false, message: "Неверный токен" });
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
    comments: [],
  };

  if (!db.threads) db.threads = [];
  db.threads.push(newPost);
  writeDB(db);
  res.json({ ok: true, post: newPost });
});

// Удаление поста
app.delete("/api/threads/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();

  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ ok: false, message: "Не авторизован" });

  const token = authHeader.split(" ")[1];
  const userId = parseInt(token.split("-")[2]);
  if (!userId)
    return res.status(401).json({ ok: false, message: "Неверный токен" });

  const postIndex = db.threads.findIndex((p) => p._id === parseInt(id));
  if (postIndex === -1)
    return res.status(404).json({ ok: false, message: "Пост не найден" });

  const user = db.users.find((u) => u._id === userId);
  if (!user)
    return res
      .status(404)
      .json({ ok: false, message: "Пользователь не найден" });

  if (db.threads[postIndex].author !== user.username) {
    return res
      .status(403)
      .json({ ok: false, message: "Вы не можете удалить этот пост" });
  }
  db.threads.splice(postIndex, 1);
  writeDB(db);
  res.json({ ok: true, message: "Пост удалён" });
});

// Лайк на посте
app.post("/api/threads/:id/like", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const post = db.threads.find((p) => p._id === parseInt(id));
  if (!post)
    return res.status(404).json({ ok: false, message: "Пост не найден" });

  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ ok: false, message: "Не авторизован" });

  const token = authHeader.split(" ")[1];
  const userId = parseInt(token.split("-")[2]);
  if (!userId)
    return res.status(401).json({ ok: false, message: "Неверный токен" });

  const likedBy = post.likedBy || [];
  const likedIndex = likedBy.indexOf(userId);
  if (likedIndex === -1) {
    post.likes = (post.likes || 0) + 1;
    likedBy.push(userId);
    post.likedBy = likedBy;
    writeDB(db);
    res.json({ ok: true, likes: post.likes, isLiked: true });
  } else {
    post.likes = (post.likes || 0) - 1;
    likedBy.splice(likedIndex, 1);
    post.likedBy = likedBy;
    writeDB(db);
    res.json({ ok: true, likes: post.likes, isLiked: false });
  }
});

app.listen(3000, () => {
  console.log(`Сервер запущен на http://localhost:3000`);
  console.log(`База: ${db_path}`);
});
