declare const prisma: import("./generated/prisma/internal/class.js").PrismaClient<never, import("./generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined, import("@prisma/client/runtime/client").DefaultArgs>;
declare function connectDB(): Promise<void>;
declare function disconnectDB(): Promise<void>;
export { connectDB, disconnectDB, prisma };
//# sourceMappingURL=client.d.ts.map