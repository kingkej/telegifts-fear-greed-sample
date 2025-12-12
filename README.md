## Fear / Greed Index (Sample)

A minimal **React + TypeScript** sample that:

- Fetches **emission stats** from the GiftAsset API (**`giftasset.pro`**)
- Computes a **Fear/Greed score** (0–100)
- Renders the result in a small UI

### 1) Get a GiftAsset API key
To make requests you need a GiftAsset API key.

- Apply for access on GiftAsset (get an API key from `giftasset.pro`).

### 2) Run the sample
From the repo root:

```bash
cd samples/fear-greed-index
npm install
cp env.example .env
npm run dev
```

Then open the URL printed by the dev server.

### 3) Configure credentials (no private tokens)
Edit your local `.env` (never commit it):

- `VITE_GIFTASSET_BASE_URL` (defaults to `https://api.giftasset.pro`)
- `VITE_GIFTASSET_API_KEY`
- `VITE_GIFTASSET_BEARER_TOKEN` (optional, only if your GiftAsset plan requires it)

### 4) What endpoint is called?
The sample calls:

- `GET /api/a/api/v1/gifts/get_gifts_collections_emission`

against the base URL set by `VITE_GIFTASSET_BASE_URL`.

### 5) How the index is calculated
For each collection, the sample derives component scores (0–100) from emission stats:

- Whale concentration (top whales share)
- Upgrade rate
- Hidden ratio
- Refund rate (inverted)
- Owner dispersion (inverted)

A weighted sum produces **Greed** (0–100). **Fear** is `100 - Greed`.


## Fear / Greed Index (пример)

Минимальный пример на **React + TypeScript**, который:

- Запрашивает **статистику эмиссии** через GiftAsset API (**`giftasset.pro`**)
- Считает **Fear/Greed score** (0–100)
- Показывает результат в простом UI

### 1) Получить API key GiftAsset
Чтобы делать запросы, нужен GiftAsset API key.

- Подайте заявку на доступ в GiftAsset (получите API key на `giftasset.pro`).

### 2) Запуск примера
Из корня репозитория:

```bash
cd samples/fear-greed-index
npm install
cp env.example .env
npm run dev
```

Далее откройте URL, который выведет dev-сервер.

### 3) Настройка credentials (без приватных токенов)
Отредактируйте локальный `.env` (никогда не коммитьте его):

- `VITE_GIFTASSET_BASE_URL` (по умолчанию `https://api.giftasset.pro`)
- `VITE_GIFTASSET_API_KEY`
- `VITE_GIFTASSET_BEARER_TOKEN` (опционально, если ваш тариф/доступ GiftAsset этого требует)

### 4) Какой endpoint вызывается?
Пример вызывает:

- `GET /api/a/api/v1/gifts/get_gifts_collections_emission`

на base URL из `VITE_GIFTASSET_BASE_URL`.

### 5) Как считается индекс
Для каждой коллекции пример получает component scores (0–100) из emission stats:

- Whale concentration (доля у крупных держателей)
- Upgrade rate
- Hidden ratio
- Refund rate (инвертируется)
- Owner dispersion (инвертируется)

Далее считается взвешенная сумма → **Greed** (0–100). **Fear** считается как `100 - Greed`.
