# Исправление ошибки "Unsupported protocol postgresql:" на Railway

## Проблема
Railway может не поддерживать протокол `postgresql://` и требовать `postgres://`

## Решение

### Вариант 1: Изменить DATABASE_URL в Railway

1. Зайдите в Railway Dashboard
2. Откройте ваш PostgreSQL сервис
3. Перейдите в Variables
4. Найдите `DATABASE_URL` или создайте его
5. Измените формат с:
   ```
   postgresql://postgres:password@host:port/database
   ```
   на:
   ```
   postgres://postgres:password@host:port/database
   ```

### Вариант 2: Использовать переменную DATABASE_URL из Railway

Railway автоматически создает `DATABASE_URL` для PostgreSQL. Убедитесь, что:
- Переменная называется именно `DATABASE_URL`
- Формат правильный (Railway обычно использует `postgres://`)

### Вариант 3: Добавить преобразование в коде

Если Railway предоставляет URL в формате `postgresql://`, можно преобразовать его:

```javascript
// В начале index.js, перед созданием PrismaClient
if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgresql://')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('postgresql://', 'postgres://');
}
```

## Проверка

После исправления:
1. Перезапустите сервис на Railway
2. Проверьте логи - не должно быть ошибки протокола
3. Проверьте, что приложение работает

