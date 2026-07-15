-- locales 配列のロケールフィルタ（isEmpty / has）用GINインデックス（設計書§2.4）
CREATE INDEX "columns_locales_gin" ON "columns" USING GIN ("locales");
