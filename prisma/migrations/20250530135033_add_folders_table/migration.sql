-- CreateTable
CREATE TABLE "Folders" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Folders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Folders" ADD CONSTRAINT "Folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
