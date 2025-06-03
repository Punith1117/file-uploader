-- DropForeignKey
ALTER TABLE "Uploads" DROP CONSTRAINT "Uploads_folderId_fkey";

-- AddForeignKey
ALTER TABLE "Uploads" ADD CONSTRAINT "Uploads_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
