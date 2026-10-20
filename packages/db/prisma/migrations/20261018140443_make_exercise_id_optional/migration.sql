-- DropForeignKey
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_exercise_id_fkey";

-- AlterTable
ALTER TABLE "submissions" ALTER COLUMN "exercise_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;
