import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { UserRoles } from "../../prisma/generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";

const scryptAsync = promisify(scrypt);

// Generate a random ID (similar to what Better Auth does)
function generateId(): string {
  return randomBytes(16).toString("hex");
}

// Hash password using scrypt (same as Better Auth default)
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

const seedAdmin = async () => {
  try {
    const adminData = {
      name: process.env.ADMIN_NAME!,
      email: process.env.ADMIN_EMAIL!,
      role: UserRoles.ADMIN,
      password: process.env.ADMIN_PASS!,
    };

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingAdmin) {
      console.log("Admin account already exists!");
      process.exit(0);
    }

    // Generate IDs
    const userId = generateId();
    const accountId = generateId();

    // Hash the password
    const hashedPassword = await hashPassword(adminData.password);

    // Create admin user and account in a transaction
    await prisma.$transaction(async (tx) => {
      // Create the user
      await tx.user.create({
        data: {
          id: userId,
          name: adminData.name,
          email: adminData.email,
          role: adminData.role,
          emailVerified: true,
        },
      });

      // Create the account with password
      await tx.account.create({
        data: {
          id: accountId,
          userId: userId,
          accountId: adminData.email,
          providerId: "credential",
          password: hashedPassword,
        },
      });
    });

    console.log("✅ Admin account created successfully!");
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Role: ${adminData.role}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
