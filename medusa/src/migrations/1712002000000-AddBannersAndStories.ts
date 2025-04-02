import { Migration } from '@mikro-orm/migrations';

export class Migration1712002000000 extends Migration {
  async up(): Promise<void> {
    // Создание таблицы баннеров
    this.addSql(`
      CREATE TABLE "banner" (
        "id" VARCHAR(255) PRIMARY KEY,
        "title" VARCHAR(255) NOT NULL,
        "subtitle" VARCHAR(255),
        "button_text" VARCHAR(255),
        "button_link" VARCHAR(255),
        "image_url" VARCHAR(255) NOT NULL,
        "display_order" INTEGER DEFAULT 0,
        "is_active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      );
    `);

    // Создание индекса для сортировки баннеров
    this.addSql(`
      CREATE INDEX "banner_display_order_index" ON "banner" ("display_order");
    `);

    // Создание таблицы историй
    this.addSql(`
      CREATE TABLE "story" (
        "id" VARCHAR(255) PRIMARY KEY,
        "title" VARCHAR(255) NOT NULL,
        "icon_url" VARCHAR(255) NOT NULL,
        "icon_background_color" VARCHAR(255),
        "display_order" INTEGER DEFAULT 0,
        "is_active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      );
    `);

    // Создание индекса для сортировки историй
    this.addSql(`
      CREATE INDEX "story_display_order_index" ON "story" ("display_order");
    `);

    // Создание таблицы слайдов историй
    this.addSql(`
      CREATE TABLE "story_slide" (
        "id" VARCHAR(255) PRIMARY KEY,
        "story_id" VARCHAR(255) NOT NULL,
        "image_url" VARCHAR(255) NOT NULL,
        "title" VARCHAR(255),
        "description" TEXT,
        "button_text" VARCHAR(255),
        "button_link" VARCHAR(255),
        "display_order" INTEGER DEFAULT 0,
        "is_active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "story_slide_story_id_foreign" FOREIGN KEY ("story_id") REFERENCES "story" ("id") ON DELETE CASCADE
      );
    `);

    // Создание индексов для слайдов историй
    this.addSql(`
      CREATE INDEX "story_slide_story_id_index" ON "story_slide" ("story_id");
      CREATE INDEX "story_slide_display_order_index" ON "story_slide" ("display_order");
    `);
  }

  async down(): Promise<void> {
    // Удаление таблиц в обратном порядке
    this.addSql(`DROP TABLE "story_slide";`);
    this.addSql(`DROP TABLE "story";`);
    this.addSql(`DROP TABLE "banner";`);
  }
} 