-- Additive payment fields for Razorpay. Existing rows and tables are preserved.
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "userId" TEXT;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "currency" TEXT NOT NULL DEFAULT 'INR';
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "razorpayOrderId" TEXT;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "razorpayPaymentId" TEXT;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "failureReason" TEXT;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "purchaseType" TEXT;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "metadata" TEXT;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "emailSentAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "Payment_orderId_idx" ON "Payment"("orderId");
CREATE INDEX IF NOT EXISTS "Payment_studentEmail_idx" ON "Payment"("studentEmail");
CREATE INDEX IF NOT EXISTS "Payment_userId_idx" ON "Payment"("userId");
CREATE INDEX IF NOT EXISTS "Payment_razorpayOrderId_idx" ON "Payment"("razorpayOrderId");
CREATE INDEX IF NOT EXISTS "Payment_razorpayPaymentId_idx" ON "Payment"("razorpayPaymentId");
CREATE INDEX IF NOT EXISTS "Payment_status_idx" ON "Payment"("status");
