-- AlterTable
ALTER TABLE "submissions" ADD COLUMN     "error" TEXT,
ADD COLUMN     "execution_time_ms" INTEGER,
ADD COLUMN     "exit_code" TEXT,
ADD COLUMN     "output" TEXT;
