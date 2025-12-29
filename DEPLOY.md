# Деплой на Vercel

## Шаги для деплоя:

### 1. Установите Vercel CLI (если еще не установлен):
```bash
npm i -g vercel
```

### 2. Войдите в Vercel:
```bash
vercel login
```

### 3. Деплой из папки frontend:
```bash
cd frontend
vercel
```

Или деплой из корня проекта:
```bash
vercel --cwd frontend
```

### 4. Настройте переменные окружения в Vercel Dashboard:

После первого деплоя, зайдите в Vercel Dashboard → Settings → Environment Variables и добавьте:

```
REACT_APP_API_URL=https://your-backend.up.railway.app
```

Замените `your-backend.up.railway.app` на ваш реальный Railway backend URL.

### 5. Production деплой:
```bash
vercel --prod
```

## Альтернативный способ через GitHub:

1. Подключите ваш GitHub репозиторий к Vercel
2. Укажите:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
3. Добавьте переменную окружения `REACT_APP_API_URL` в настройках проекта

## Важно:

- Убедитесь, что ваш Railway backend имеет CORS настроенный для вашего Vercel домена
- Backend должен быть доступен публично (не localhost)

