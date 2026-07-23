import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/security";

const prisma = new PrismaClient();

async function main() {
  const adminName = process.env.SUPER_ADMIN_NAME;
  const adminUsername = process.env.SUPER_ADMIN_USERNAME;
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD;

  if (!adminName || !adminUsername || !adminPassword) {
    console.error("❌ Seeding failed: SUPER_ADMIN_NAME, SUPER_ADMIN_USERNAME, or SUPER_ADMIN_PASSWORD is not set in environment.");
    process.exit(1);
  }

  // Normalize username
  const normalizedUsername = adminUsername.trim().toLowerCase();

  console.log(`Checking if Super Admin user "${normalizedUsername}" exists...`);

  const existingAdmin = await prisma.adminUser.findUnique({
    where: {
      username: normalizedUsername,
    },
  });

  if (existingAdmin) {
    console.log(`ℹ️ Super Admin user "${normalizedUsername}" already exists. Skipping creation.`);
    return;
  }

  console.log(`Hashing password for Super Admin...`);
  const passwordHash = await hashPassword(adminPassword);

  console.log(`Creating Super Admin user "${normalizedUsername}"...`);
  await prisma.adminUser.create({
    data: {
      fullName: adminName.trim(),
      username: normalizedUsername,
      passwordHash,
      role: "SUPER_ADMIN",
      status: "APPROVED",
    },
  });

  console.log("✅ Super Admin seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
