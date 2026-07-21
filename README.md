# Сайт: https://ksendel-coder.github.io/MultiCinema/

# Учебный проект - SPA для поиска фильмов с авторизацией, тредами и видеоплеером. Включает фронтенд на React + TypeScript и бэкенд на Express.

# Основной функционал:
1. Регистрация и вход (Bearer-токен)
2. Фильмы: поиск, фильтрация по жанрам, пагинация, видео в модалке
3. Треды: создание постов, лайки
4. Профиль (имя, био, аватар): редактирование, смена пароля



# Сервер (server.js)

Серверная часть написана на Express и находится в файле `server.js`
В нём реализовано:
1. Хранение данных в JSON-файле (`db.json`)
2. Маршруты для регистрации, входа, профиля, фильмов, тредов
3. Логика лайков
4. Bearer-токены для авторизации

# Функции сервера
`server.js` - главный файл сервера. Настраивает CORS, парсинг JSON, подключает базу и обрабатывает все API-маршруты 
`db.json` - база данных в формате JSON. Хранит пользователей, фильмы, треды, лайки

# Основные маршруты
POST: `/api/auth/register` регистрация
POST: `/api/auth/login` вход
PUT: `/api/users/profile` обновление профиля
PUT: `/api/users/password` смена пароля
GET: `/api/films` список фильмов
GET: `/api/threads` список тредов
POST: `/api/threads` создать тред
DELETE: `/api/threads/:id` удалить тред
POST: `/api/threads/:id/like` лайк/разлайк

# Запуск проекта
1. Склонировать проект git clone https://github.com/ksendel-coder/practice_project
cd practice_project
2. Установить зависимости npm install --legacy-peer-deps
3. Собрать npm run build
4. Запустить npm run dev

Фронтенд и сервер запускаются одной командой: npm run dev 
# Фронтенд: http://localhost:5173
# Сервер: http://localhost:3000 


# Чтобы задеплоить использовала Render

Были созданы файлы .env для хранения переменных окружения — значений, которые зависят от среды запуска (разработка, продакшен). В проекте используется два файла: `.env.development` для локальной разработки (npm run dev) и `.env.production` для продакшена (npm run build), в котором указывается реальный URL сервера на Render. По умолчанию стоит `/api`.


Если что-то не так будет, то создайте файлы `.env.development` и `.env.production` в корне проекта:
# .env.development
VITE_API_URL=/api

# .env.production 
VITE_API_URL=https://practice-project-server.onrender.com/api

