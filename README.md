#  Presale API Automation Framework

## 📖 О проекте

Фреймворк для автоматизации API тестов проекта Presale на базе **Playwright + TypeScript**.
Поддерживает тестирование REST API.

## 🏗️ Архитектура проекта

service-automatization/  

├── 🧪 tests/                    # Все тесты  
│   ├── 📱 api/                  # API тесты  
│   │   ├── 🔐 auth/             # Авторизация  
│   │   ├── 👤 profile/          # Профиль пользователя  
│   │   ├── 💳 payments/         # Платежи  
│   │   └── 🏠 addresses/        # Адреса  
│   ├── 🔧 fixtures/             # Фикстуры и настройки  
│   ├── 📊 data/                 # Тестовые данные  
│   └── 🛠️ utils/                # Утилиты и хелперы  
├── ⚙️ config/                   # Конфигурации  
└── 📦 package.json              # Зависимости  



## 📥 Getting started

```
git clone git@github.com:presale-ru/service-automatization.git
cd service-automatization
```
## 🛠️ Tools

- Package manager - **npm**
- Playwright  - [Playwright](https://playwright.dev/)
- TypeScript  - [TypeScript](https://www.typescriptlang.org/)
- Reporters - [Reporters](https://playwright.dev/docs/test-reporters)


## Установка зависимостей
- npm install

# Проверка установки

npx playwright --version

# Запуск тестов

- npm test

# Запуск тестов  по доменам

##### 🔐 Авторизация
- npm test tests/api/auth

#####  👤 Профиль пользователя
-  npm test tests/api/profile

##### 🏠 Управление адресами
- npm test tests/api/addresses

🎯 Структура тестов

### API Тесты

🔐 Auth - Авторизация, токены 

👤 Profile - Личные данные, email верификация

🏠 Addresses - CRUD адресов доставки