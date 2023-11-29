/*
  Warnings:

  - A unique constraint covering the columns `[abbreviation]` on the table `states` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "states_abbreviation_key" ON "states"("abbreviation");
