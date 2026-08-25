import { PrismaClient } from "./generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function connectDB() {
    await prisma.$connect().then(() => {
        console.log('Connected to database');
    }).catch((error) => {
        console.error('Failed to connect to database', error);
        throw error;
    });
}

async function disconnectDB() {
    await prisma.$disconnect();
}

export { connectDB, disconnectDB, prisma };