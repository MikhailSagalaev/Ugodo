import { Migration } from '@mikro-orm/migrations';

export class Migration1712002001000 extends Migration {
  async up(): Promise<void> {
    // Создание перечисления типов маркеров товаров
    this.addSql(`
      CREATE TYPE "product_flag_type_enum" AS ENUM (
        'new',
        'promotion',
        'popular',
        'express',
        'bestseller',
        'recently_viewed'
      );
    `);

    // Создание таблицы маркеров товаров
    this.addSql(`
      CREATE TABLE "product_flag" (
        "id" VARCHAR(255) PRIMARY KEY,
        "product_id" VARCHAR(255) NOT NULL,
        "type" "product_flag_type_enum" NOT NULL,
        "metadata" JSONB,
        "is_active" BOOLEAN DEFAULT TRUE,
        "valid_until" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "product_flag_product_id_foreign" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE CASCADE
      );
    `);

    // Создание индексов для маркеров товаров
    this.addSql(`
      CREATE INDEX "product_flag_product_id_index" ON "product_flag" ("product_id");
      CREATE INDEX "product_flag_type_index" ON "product_flag" ("type");
      CREATE INDEX "product_flag_is_active_index" ON "product_flag" ("is_active");
      CREATE UNIQUE INDEX "product_flag_product_type_unique" ON "product_flag" ("product_id", "type") WHERE "is_active" = TRUE;
    `);

    // Создание таблицы недавно просмотренных товаров
    this.addSql(`
      CREATE TABLE "recently_viewed" (
        "id" VARCHAR(255) PRIMARY KEY,
        "customer_id" VARCHAR(255),
        "session_id" VARCHAR(255),
        "product_id" VARCHAR(255) NOT NULL,
        "viewed_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "recently_viewed_product_id_foreign" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE CASCADE
      );
    `);

    // Создание индексов для недавно просмотренных товаров
    this.addSql(`
      CREATE INDEX "recently_viewed_customer_id_index" ON "recently_viewed" ("customer_id");
      CREATE INDEX "recently_viewed_session_id_index" ON "recently_viewed" ("session_id");
      CREATE INDEX "recently_viewed_product_id_index" ON "recently_viewed" ("product_id");
      CREATE INDEX "recently_viewed_viewed_at_index" ON "recently_viewed" ("viewed_at");
      
      -- Уникальные индексы для исключения дублирования просмотров
      CREATE UNIQUE INDEX "recently_viewed_customer_product_unique" 
        ON "recently_viewed" ("customer_id", "product_id") 
        WHERE "customer_id" IS NOT NULL;
      
      CREATE UNIQUE INDEX "recently_viewed_session_product_unique" 
        ON "recently_viewed" ("session_id", "product_id") 
        WHERE "session_id" IS NOT NULL;
    `);

    // Добавляем внешний ключ для customer_id если таблица customer существует
    this.addSql(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'customer') THEN
          ALTER TABLE "recently_viewed" 
          ADD CONSTRAINT "recently_viewed_customer_id_foreign" 
          FOREIGN KEY ("customer_id") REFERENCES "customer" ("id") ON DELETE SET NULL;
        END IF;
      END$$;
    `);
  }

  async down(): Promise<void> {
    // Удаление таблиц и перечислений в обратном порядке
    this.addSql(`DROP TABLE "recently_viewed";`);
    this.addSql(`DROP TABLE "product_flag";`);
    this.addSql(`DROP TYPE "product_flag_type_enum";`);
  }
} 