# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# 📊 Данные и типы, используемые в Web-Larek 2.0

Проект Web-Larek 2.0 активно использует интерфейсы и дженерики TypeScript для строгой типизации данных и взаимодействия с API. Это повышает предсказуемость кода, упрощает его поддержку и масштабирование.

---

## `ProductData`

Описание структуры товара в каталоге:

- `id: string` — Уникальный идентификатор товара.
- `description: string` — Подробное описание товара.
- `image: string` — Ссылка на изображение товара.
- `title: string` — Название товара.
- `category: string` — Категория, к которой относится товар.
- `price: number | null` — Цена товара, может быть `null`, если не указана.

---

## `ApiResponseList<Type>`

Формат ответа API при получении списка объектов:

- `total: number` — Общее количество записей.
- `items: Type[]` — Список элементов соответствующего типа.

---

## `AppState`

Общее состояние приложения:

- `products: ProductData[]` — Все доступные товары.
- `basket: ProductData[]` — Товары, добавленные в корзину.
- `order: OrderPayload` — Текущие данные заказа.
- `orderResponse: OrderResponse | null` — Ответ от сервера после оформления.
- `preview: string | null` — ID товара для предпросмотра.

---

## `BasketState`

Состояние отображения корзины:

- `items: HTMLElement[]` — DOM-элементы товаров в корзине.
- `price: number` — Сумма всех выбранных товаров.
- `selected: string[]` — ID товаров, выбранных в корзине.

---

## `DeliveryInfo`

Информация по доставке:

- `address: string` — Адрес, куда нужно доставить заказ.
- `payment: string` — Способ оплаты (например, карта или наличные).

---

## `ContactInfo`

Контактные данные покупателя:

- `phone: string` — Телефонный номер для связи.
- `email: string` — Адрес электронной почты.

---

## `OrderPayload`

Полные данные о заказе:

- `address: string` — Адрес доставки.
- `payment: string` — Метод оплаты.
- `phone: string` — Телефон клиента.
- `email: string` — Email клиента.
- `total: number` — Общая сумма заказа.
- `items: string[]` — Список ID товаров в заказе.

---

## `OrderResponse`

Ответ от сервера после оформления:

- `id: string` — Идентификатор заказа.
- `total: number` — Итоговая сумма, подтверждённая сервером.

---

## `OrderFormErrors`

Ошибки валидации полей заказа:

- Тип: `Partial<Omit<Record<keyof OrderPayload, string>, 'items'>>`
- Ключи — имена полей формы (без `items`), значения — сообщения об ошибке.

---

## `SuccessResponse`

Тип универсального успешного ответа от API:

- `total: number` — Подтверждённая сумма.

---

## `CardEventHandlers`

Обработчики событий карточки товара:

- `onClick?: (event: MouseEvent) => void` — Клик по карточке.
- `onAddToBasket?: (item: ProductData) => void` — Добавление товара в корзину.
- `onRemoveFromBasket?: (item: ProductData) => void` — Удаление товара из корзины.

# 🏗️ Архитектура приложения

Проект **Web-Larek 2.0** построен с использованием архитектурного шаблона **Model–View–Presenter (MVP)**. Такой подход разделяет данные, логику и представление, что делает код более структурированным, масштабируемым и удобным в сопровождении.

---

## 🔁 Основные слои архитектуры

### `Model` — бизнес-логика и данные

Отвечает за состояние приложения, проверку данных и работу с внешними источниками (например, API).

📌 Примеры классов:

- `AppState` — управляет данными каталога, корзины и заказа.
- `AppApi` — клиент для обращения к серверу и получения данных.

🔧 Основные задачи:

- Управление внутренним состоянием приложения.
- Проверка и валидация пользовательских данных.
- Взаимодействие с API: получение и отправка информации.

---

### `View` — пользовательский интерфейс

Отвечает за отображение элементов на странице и обработку действий пользователя.

📌 Примеры классов:

- `Page` — основной интерфейс с каталогом и корзиной.
- `Modal` — всплывающие окна для взаимодействий.
- `Card` — визуальное представление товара.
- `Basket`, `Order`, `Contact` — отдельные компоненты для отображения соответствующих данных.

🎯 Основные задачи:

- Рендеринг DOM-элементов на странице.
- Обновление интерфейса при изменении данных.
- Сбор и передача пользовательского ввода.

---

### `Presenter` — логика взаимодействий

Управляет связью между моделью и представлением. Обрабатывает пользовательские действия и обновляет состояние модели.

📌 Примеры классов:

- `App` — инициализирует приложение и связывает все части.
- `EventEmitter` — централизованный менеджер событий для подписки и оповещений.

🧩 Основные задачи:

- Подписка на пользовательские события.
- Изменение состояния модели по результатам взаимодействий.
- Обновление представления в ответ на изменения данных.

---

## 💡 Преимущества MVP

- **Чёткое разделение ответственности** — каждый слой выполняет только свою роль.
- **Гибкость и масштабируемость** — новые функции добавляются без переписывания старого кода.
- **Тестируемость** — можно изолированно проверять бизнес-логику.
- **Модульность интерфейса** — View-компоненты легко переиспользуются и адаптируются под разные задачи.

---

> 📌 Архитектура MVP — это надёжная основа для создания расширяемых и легко поддерживаемых интерфейсных приложений.

# 🧩 Полное описание классов проекта

Проект **Web-Larek 2.0** реализован с чётким разделением по слоям архитектуры **Model**, **View**, **Presenter**, каждый из которых представлен своими классами.

---

## 🔷 1. Model — слой данных и логики

### `AppState`

**Роль:** Управляет состоянием каталога, корзины и заказа.

**Конструктор:**
- `initialState: Partial<AppStateType>`
- `events: EventEmitter`

**Поля:**
- `catalog: ProductData[]`
- `basket: string[]`
- `preview: string | null`
- `order: Omit<OrderPayload, 'items' | 'total'>`
- `orderError: OrderFormErrors`

**Методы:**
- `addToBasket(productId)`
- `removeFromBasket(productId)`
- `clearBasket()`
- `getBasketProducts()`
- `getTotal()`
- `setCatalog(products)`
- `setContactField(field, value)`
- `setOrderField(field, value)`
- `validateContact()`
- `validateOrder()`
- `orderReset()`
- `contactReset()`
- `setPreview(product)`

---

### `AppApi`

**Роль:** Работа с сервером.

**Конструктор:**
- `contentDeliveryUrl: string`
- `apiBaseUrl: string`
- `config?: RequestInit`

**Методы:**
- `fetchProductList()`
- `processOrderSubmission(payload)`

---

## 🖼️ 2. View — визуальное представление

### `Page`

**Роль:** Интерфейс каталога и корзины.

**Конструктор:**
- `container: HTMLElement`
- `eventHandlers: IEvents`

**Методы:**
- `set counter(value)`
- `set catalog(items)`
- `set locked(isLocked)`

---

### `Modal`

**Роль:** Управление модальными окнами.

**Конструктор:**
- `containerElement: HTMLElement`
- `eventDispatcher: IEvents`

**Методы:**
- `openModal()`
- `closeModal()`
- `set content(newContent)`
- `renderModal(modalData)`
- `logModalState()`

---

### `Card`

**Роль:** Отображение карточки товара.

**Конструктор:**
- `containerElement: HTMLElement`
- `product: ProductData`
- `actionHandlers: ICardEventHandlers`

**Методы:**
- `set cardTitle(value)`
- `set cardImage(value)`
- `set cardPrice(value)`
- `set cardCategory(value)`
- `updateButtonState(isInBasket)`
- `setIndex(index)`
- `getContainer()`

---

### `Basket`

**Роль:** Представление корзины.

**Конструктор:**
- `container: HTMLElement`
- `events: EventEmitter`

**Методы:**
- `set items(items: HTMLElement[])`
- `set totalPrice(price: number)`
- `render(data)`
- `getContainer()`

---

### `Order`

**Роль:** Форма доставки.

**Конструктор:**
- `container: HTMLFormElement`
- `events: IEvents`

**Методы:**
- `set payment(name)`
- `reset()`

---

### `Contact`

**Роль:** Форма контактной информации.

**Конструктор:**
- `container: HTMLFormElement`
- `events: IEvents`

**Методы:**
- `set email(value)`
- `set phone(value)`
- `reset()`

---

## 🧠 3. Presenter — логика взаимодействия

### `App`

**Роль:** Центральный управляющий логикой приложения.

**Конструктор:** без аргументов

**Методы:**
- `initialize()`
- `setupEventHandlers()`
- `fetchProductData()`
- `refreshCatalog()`
- `refreshBasketView()`
- `handleBasketToggle(item)`
- `updateBasket()`
- `updateBasketCounter()`
- `createBasketItem(product, index)`
- `createCatalogCard(item)`
- `updateCard(itemId)`
- `showCard(item)`
- `displayBasket()`
- `displayOrderForm()`
- `displayContactForm()`
- `removeItemFromBasket(id)`
- `processOrderSubmission()`
- `modifyOrderForm()`
- `modifyContactForm()`
- `modifyOrderField()`
- `modifyContactField()`

---

### `EventEmitter`

**Роль:** Система событий между компонентами.

**Конструктор:** без аргументов

**Методы:**
- `on(event, callback)`
- `emit(event, data?)`
- `off(event, callback)`
- `onAll(callback)`
- `offAll()`
- `trigger(eventName, context?)`

---

## 🧩 Структура по слоям

| Слой      | Классы                                                           |
| --------- | ---------------------------------------------------------------- |
| Model     | `AppState`, `AppApi`                                             |
| View      | `Page`, `Modal`, `Card`, `Basket`, `Order`, `Contact`, `Success`|
| Presenter | `App`, `EventEmitter`                                            |

---



# Общий список событий приложения






| Событие                          | Описание                                        |
| -------------------------------- | ----------------------------------------------- |
| `basket:open`                    | Открытие корзины                                |
| `order:open`                     | Открытие формы доставки                         |
| `order:submit`                   | Подтверждение доставки и переход к контактам    |
| `contacts:submit`                | Подтверждение контактов и оформление заказа     |
| `basket:change`                  | Изменение содержимого корзины                   |
| `items:changed`                  | Каталог обновлён                                |
| `card:select`                    | Пользователь кликнул на карточку (предпросмотр) |
| `card:toBasket`                  | Товар добавлен или удалён из корзины            |
| `order.payment:change`           | Изменён способ оплаты                           |
| `contactsOrderFormErrors:change` | Ошибки валидации контактной формы               |
| `orderOrderFormErrors:change`    | Ошибки валидации формы доставки                 |
| `modal:closed`                   | Модальное окно закрыто                          |
| `modal:opened`                   | Модальное окно открыто                          |
| `preview:changed`                | Установлен товар для предпросмотра              |
