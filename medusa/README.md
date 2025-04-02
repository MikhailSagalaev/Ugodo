<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  Medusa
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

<p align="center">
  Building blocks for digital commerce
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
    <a href="https://www.producthunt.com/posts/medusa"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Day-%23DA552E" alt="Product Hunt"></a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

## Compatibility

This starter is compatible with versions >= 1.8.0 of `@medusajs/medusa`.

## Getting Started

Visit the [Quickstart Guide](https://docs.medusajs.com/create-medusa-app) to set up a server.

Visit the [Docs](https://docs.medusajs.com/development/backend/prepare-environment) to learn more about our system requirements.

## What is Medusa

Medusa is a set of commerce modules and tools that allow you to build rich, reliable, and performant commerce applications without reinventing core commerce logic. The modules can be customized and used to build advanced ecommerce stores, marketplaces, or any product that needs foundational commerce primitives. All modules are open-source and freely available on npm.

Learn more about [Medusa's architecture](https://docs.medusajs.com/development/fundamentals/architecture-overview) and [commerce modules](https://docs.medusajs.com/modules/overview) in the Docs.

## Roadmap, Upgrades & Plugins

You can view the planned, started and completed features in the [Roadmap discussion](https://github.com/medusajs/medusa/discussions/categories/roadmap).

Follow the [Upgrade Guides](https://docs.medusajs.com/upgrade-guides/) to keep your Medusa project up-to-date.

Check out all [available Medusa plugins](https://medusajs.com/plugins/).

## Community & Contributions

The community and core team are available in [GitHub Discussions](https://github.com/medusajs/medusa/discussions), where you can ask for support, discuss roadmap, and share ideas.

Join our [Discord server](https://discord.com/invite/medusajs) to meet other community members.

## Other channels

- [GitHub Issues](https://github.com/medusajs/medusa/issues)
- [Twitter](https://twitter.com/medusajs)
- [LinkedIn](https://www.linkedin.com/company/medusajs)
- [Medusa Blog](https://medusajs.com/blog/)

# Fashion Starter Medusa

## Пользовательские модули

### Истории (Stories)

Модуль `stories` позволяет создавать интерактивные истории, похожие на Instagram Stories, с изображениями и кнопками для пользователей.

```typescript
const storyService = req.scope.resolve("storyService")

// Создание истории
const story = await storyService.create({
  title: "Летняя коллекция",
  icon_url: "https://example.com/icon.png",
  icon_background_color: "#FF5733",
  display_order: 1,
  slides: [
    {
      image_url: "https://example.com/slide1.jpg",
      title: "Летние платья",
      button_text: "Смотреть",
      button_link: "/collection/summer-dresses"
    }
  ]
})

// Получение всех активных историй
const activeStories = await storyService.listActive()

// Добавление слайдов к истории
await storyService.addSlides(storyId, [
  {
    image_url: "https://example.com/slide2.jpg",
    title: "Новинка сезона"
  }
])
```

### Баннеры (Banners)

Модуль `banners` управляет баннерами для отображения на главной странице или в других частях магазина.

```typescript
const bannerService = req.scope.resolve("bannerService")

// Создание баннера
const banner = await bannerService.create({
  title: "Скидка 20% на всё",
  subtitle: "Только до конца недели!",
  image_url: "https://example.com/banner.jpg",
  button_text: "Перейти в каталог",
  button_link: "/products"
})

// Получение всех активных баннеров
const activeBanners = await bannerService.listActive()
```

### Маркеры товаров (Product Flags)

Модуль `product-flags` позволяет отмечать товары различными маркерами: новинки, акции, популярные товары и т.д.

```typescript
const productFlagService = req.scope.resolve("productFlagService")

// Отметить товар как новинку
await productFlagService.create({
  product_id: "prod_123",
  type: ProductFlagType.NEW
})

// Проверить, имеет ли товар маркер
const isNew = await productFlagService.hasFlag("prod_123", ProductFlagType.NEW)

// Получить все товары с маркером "Бестселлер"
const bestsellerIds = await productFlagService.getProductsByFlagType(ProductFlagType.BESTSELLER)
```

### Недавно просмотренные (Recently Viewed)

Модуль `recently-viewed` отслеживает и хранит информацию о недавно просмотренных товарах пользователями.

```typescript
const recentlyViewedService = req.scope.resolve("recentlyViewedService")

// Записать просмотр товара
await recentlyViewedService.recordView({
  product_id: "prod_123",
  customer_id: "cus_123" // или session_id для неавторизованных
})

// Получить недавно просмотренные товары клиента
const productIds = await recentlyViewedService.listProductIdsByCustomer("cus_123")

// Соединить просмотры анонимного пользователя с авторизованным
await recentlyViewedService.mergeCustomerViews("cus_123", "sess_456")
```

## Диаграмма структуры модулей

```
modules/
├── banners/
│   ├── entities/
│   │   └── banner.ts
│   ├── repositories/
│   │   └── banner.repository.ts
│   └── services/
│       └── banner.ts
├── stories/
│   ├── entities/
│   │   ├── story.ts
│   │   └── story-slide.ts
│   ├── repositories/
│   │   ├── story.repository.ts
│   │   └── story-slide.repository.ts
│   └── services/
│       └── story.ts
├── product-flags/
│   ├── entities/
│   │   └── product-flag.ts
│   ├── repositories/
│   │   └── product-flag.repository.ts
│   └── services/
│       └── product-flag.ts
└── recently-viewed/
    ├── entities/
    │   └── recently-viewed.ts
    ├── repositories/
    │   └── recently-viewed.repository.ts
    └── services/
        └── recently-viewed.ts
```
