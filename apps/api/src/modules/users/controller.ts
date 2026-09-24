import { Request, Response } from "express";
import { userService } from "./service.js";
import { CreateUserDTO } from "./dto.js";
import { createdResponse, successResponse, errorResponse } from "../../common/utils/response.js";
import asyncHandler from "../../common/utils/asyncHandler.js";

export class UserController {
    
    createOrGetUser = asyncHandler(async (req: Request, res: Response) => {    
        
        const { name } = req.body as CreateUserDTO;
        const user = await userService.createOrGetUser(name);
      
        createdResponse(
            res, 
            {
                id: user.id,
                name: user.name,
                profile_url: user.profile_url
            }, 
            "User created successfully"
        );

    })

    getUserById = asyncHandler(async (req: Request, res: Response) => {
        
        const { id } = req.params;
        const userId = Array.isArray(id) ? id[0] : id;
      
        if (!userId) return errorResponse(res, "Invalid user ID", "User ID parameter is required", 400);

        const user = await userService.getUserById(userId);
      
        if (!user) return errorResponse(res, "User not found", "No user exists with the provided ID", 404);
    
        return successResponse(res, "User retrieved successfully", user);

    })
}

export const userController = new UserController();
