import { scryptAsync } from "@noble/hashes/scrypt.js";
import { randomBytes } from "crypto";
import { UserRoles } from "../../prisma/generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";

// Better Auth's scrypt configuration
const config = {
  N: 16384,
  r: 16,
  p: 1,
  dkLen: 64,
};

// Generate a random ID
function generateId(): string {
  return randomBytes(16).toString("hex");
}

// Hash password using the EXACT same method as Better Auth
async function hashPassword(password: string): Promise<string> {
  const saltBytes = randomBytes(16);
  const salt = Array.from(saltBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const key = await scryptAsync(password.normalize("NFKC"), salt, {
    N: config.N,
    p: config.p,
    r: config.r,
    dkLen: config.dkLen,
    maxmem: 128 * config.N * config.r * 2,
  });

  const keyHex = Array.from(key)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${salt}:${keyHex}`;
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
      await tx.user.create({
        data: {
          id: userId,
          name: adminData.name,
          email: adminData.email,
          role: adminData.role,
          emailVerified: true,
        },
      });

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
