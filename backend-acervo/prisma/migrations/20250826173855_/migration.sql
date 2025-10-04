-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "coverImagePath" TEXT;

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "coverImagePath" TEXT;

-- CreateTable
CREATE TABLE "Movie" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "coverImagePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);
