-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "smsConsent" BOOLEAN NOT NULL DEFAULT false,
    "isWalkIn" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("createdAt", "customerEmail", "customerName", "customerPhone", "endTime", "id", "isWalkIn", "notes", "serviceId", "startTime", "status", "updatedAt") SELECT "createdAt", "customerEmail", "customerName", "customerPhone", "endTime", "id", "isWalkIn", "notes", "serviceId", "startTime", "status", "updatedAt" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE INDEX "Booking_startTime_idx" ON "Booking"("startTime");
CREATE INDEX "Booking_status_idx" ON "Booking"("status");
CREATE INDEX "Booking_customerPhone_idx" ON "Booking"("customerPhone");
CREATE INDEX "Booking_startTime_endTime_idx" ON "Booking"("startTime", "endTime");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
