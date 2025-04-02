import { Migration } from '@mikro-orm/migrations';

export class Migration1712001000000 extends Migration {
  async up(): Promise<void> {
    // Создание перечисления типов связей
    this.addSql(`
      CREATE TYPE "relation_type_enum" AS ENUM (
        'similar',
        'accessory',
        'bought_together',
        'complement',
        'substitute',
        'upsell',
        'cross_sell'
      );
    `);

    // Создание таблицы связей между продуктами
    this.addSql(`
      CREATE TABLE "product_relation" (
        "id" VARCHAR(255) PRIMARY KEY,
        "from_product_id" VARCHAR(255) NOT NULL,
        "to_product_id" VARCHAR(255) NOT NULL,
        "type" "relation_type_enum" NOT NULL,
        "position" INTEGER DEFAULT 0,
        "is_active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      );
    `);

    // Создание индексов для быстрого поиска связанных продуктов
    this.addSql(`
      CREATE INDEX "product_relation_from_product_id_index" ON "product_relation" ("from_product_id");
      CREATE INDEX "product_relation_to_product_id_index" ON "product_relation" ("to_product_id");
      CREATE INDEX "product_relation_type_index" ON "product_relation" ("type");
    `);

    // Добавление внешних ключей для обеспечения целостности данных
    this.addSql(`
      ALTER TABLE "product_relation" ADD CONSTRAINT "product_relation_from_product_id_foreign" 
        FOREIGN KEY ("from_product_id") REFERENCES "product" ("id") ON DELETE CASCADE;
      ALTER TABLE "product_relation" ADD CONSTRAINT "product_relation_to_product_id_foreign" 
        FOREIGN KEY ("to_product_id") REFERENCES "product" ("id") ON DELETE CASCADE;
    `);

    // Создание уникального индекса, чтобы избежать дублирования связей одного и того же типа
    this.addSql(`
      CREATE UNIQUE INDEX "product_relation_unique_relation" 
        ON "product_relation" ("from_product_id", "to_product_id", "type");
    `);
  }

  async down(): Promise<void> {
    // Удаление таблицы связей
    this.addSql(`
      DROP TABLE "product_relation";
    `);

    // Удаление перечисления типов связей
    this.addSql(`
      DROP TYPE "relation_type_enum";
    `);
  }
} 