import { prisma } from "@repo/db";

export class UserService {
  
    async createOrGetUser(name: string) {

        const trimmedName = name.trim().toLowerCase();

        if (!trimmedName || trimmedName.length === 0) 
            throw new Error("Name cannot be empty");
    
        const baseName = trimmedName;
        let counter = 1;
        let newName = trimmedName;
        
        while (await prisma.user.findFirst({ where: { name: newName } })) {
            newName = `${baseName}(${counter})`;
            counter++;
        }

        const user = await prisma.user.create({
            data: {
                name: newName,
                email: null,
                google_id: null,
                profile_url: null
            }
        });

        return user;
  }

  async getUserById(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId }
    });
  }
}

export const userService = new UserService();
