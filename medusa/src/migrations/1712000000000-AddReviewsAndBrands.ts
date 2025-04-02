import { Migration } from '@mikro-orm/migrations';

export class Migration1712000000000 extends Migration {
  async up(): Promise<void> {
    // Создание таблицы брендов
    this.addSql(`
      CREATE TABLE "brand" (
        "id" VARCHAR(255) PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT NULL,
        "logo_url" VARCHAR(255) NULL,
        "website" VARCHAR(255) NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      );
    `);

    // Добавляем колонку brand_id в таблицу product
    this.addSql(`
      ALTER TABLE "product" ADD COLUMN "brand_id" VARCHAR(255) NULL;
      ALTER TABLE "product" ADD CONSTRAINT "product_brand_id_foreign" FOREIGN KEY ("brand_id") REFERENCES "brand" ("id") ON DELETE SET NULL;
    `);

    // Создание таблицы отзывов
    this.addSql(`
      CREATE TABLE "product_review" (
        "id" VARCHAR(255) PRIMARY KEY,
        "product_id" VARCHAR(255) NOT NULL,
        "customer_id" VARCHAR(255) NULL,
        "rating" INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        "title" VARCHAR(255) NULL,
        "content" TEXT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "published" BOOLEAN NOT NULL DEFAULT true
      );

      CREATE INDEX "product_review_product_id_index" ON "product_review" ("product_id");
      CREATE INDEX "product_review_customer_id_index" ON "product_review" ("customer_id");

      ALTER TABLE "product_review" ADD CONSTRAINT "product_review_product_id_foreign" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE CASCADE;
      ALTER TABLE "product_review" ADD CONSTRAINT "product_review_customer_id_foreign" FOREIGN KEY ("customer_id") REFERENCES "customer" ("id") ON DELETE SET NULL;
    `);
  }

  async down(): Promise<void> {
    // Удаление таблицы отзывов
    this.addSql(`
      DROP TABLE "product_review";
    `);

    // Удаление колонки brand_id из таблицы product
    this.addSql(`
      ALTER TABLE "product" DROP CONSTRAINT "product_brand_id_foreign";
      ALTER TABLE "product" DROP COLUMN "brand_id";
    `);

    // Удаление таблицы брендов
    this.addSql(`
      DROP TABLE "brand";
    `);
  }
} 