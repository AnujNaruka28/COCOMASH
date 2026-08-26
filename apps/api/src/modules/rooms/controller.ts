import { asyncHandler } from "../../common/utils/asyncHandler.js"
import {Request,Response} from "express"
import { successResponse } from "../../common/utils/response.js";
import { CreateRoomDto, RoomResponse } from "./dto.js";
import roomService from "./service.js";
import getUserId from "../../common/utils/auth.js";
import { AuthRequest } from "../../common/types/AuthRequest.js";

class RoomController {

    createRoom = asyncHandler(async (req: AuthRequest,res: Response) => {

        const roomData = req.body as CreateRoomDto;
        const creatorId = getUserId(req);
        
        const roomCreated: RoomResponse = await roomService.createRoom(roomData, creatorId);

        return successResponse(res, "Room created successfully", roomCreated);
         
    })

    getRoomById = asyncHandler(async (req: Request,res: Response) => {

        const roomId = req.params.id;
        
        const room = await roomService.getRoomById(roomId);
        
        return successResponse(res, "Room fetched successfully", room);
    })

}

const roomController = new RoomController();
export default roomController;

