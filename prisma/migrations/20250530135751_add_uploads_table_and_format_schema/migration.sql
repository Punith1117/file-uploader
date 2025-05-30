-- CreateTable
CREATE TABLE "Uploads" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "downloadUrl" TEXT NOT NULL,
    "uploadDateTime" TIMESTAMP(3) NOT NULL,
    "sizeMb" DECIMAL(65,30) NOT NULL,
    "folderId" INTEGER NOT NULL,

    CONSTRAINT "Uploads_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Uploads" ADD CONSTRAINT "Uploads_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
