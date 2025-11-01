-- CreateTable
CREATE TABLE "chat_rooms" (
    "id" TEXT NOT NULL,
    "tender_id" TEXT,
    "tender_request_id" TEXT,
    "sender_company_profile_id" TEXT NOT NULL,
    "receiver_company_profile_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "chat_room_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pdf_url" TEXT,
    "read_status" BOOLEAN NOT NULL DEFAULT false,
    "sender_company_profile_id" TEXT NOT NULL,
    "receiver_company_profile_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chat_rooms_tender_id_idx" ON "chat_rooms"("tender_id");

-- CreateIndex
CREATE INDEX "chat_rooms_sender_company_profile_id_idx" ON "chat_rooms"("sender_company_profile_id");

-- CreateIndex
CREATE INDEX "chat_rooms_receiver_company_profile_id_idx" ON "chat_rooms"("receiver_company_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_rooms_sender_company_profile_id_receiver_company_profi_key" ON "chat_rooms"("sender_company_profile_id", "receiver_company_profile_id", "tender_id");

-- CreateIndex
CREATE INDEX "messages_chat_room_id_idx" ON "messages"("chat_room_id");

-- CreateIndex
CREATE INDEX "messages_created_at_idx" ON "messages"("created_at");

-- CreateIndex
CREATE INDEX "messages_sender_company_profile_id_idx" ON "messages"("sender_company_profile_id");

-- CreateIndex
CREATE INDEX "messages_receiver_company_profile_id_idx" ON "messages"("receiver_company_profile_id");

-- AddForeignKey
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_tender_id_fkey" FOREIGN KEY ("tender_id") REFERENCES "tenders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_sender_company_profile_id_fkey" FOREIGN KEY ("sender_company_profile_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_receiver_company_profile_id_fkey" FOREIGN KEY ("receiver_company_profile_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_company_profile_id_fkey" FOREIGN KEY ("sender_company_profile_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_company_profile_id_fkey" FOREIGN KEY ("receiver_company_profile_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
