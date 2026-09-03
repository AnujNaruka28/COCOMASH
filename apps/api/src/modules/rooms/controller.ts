import asyncHandler from "../../common/utils/asyncHandler.js"
import {Request,Response} from "express"
import { createdResponse, successResponse } from "../../common/utils/response.js";
import { CreateRoomDto, PaginationDto, RoomResponse } from "./dto.js";
import roomService from "./service.js";
import getUserId from "../../common/utils/auth.js";
import { AuthRequest } from "../../common/types/AuthRequest.js";

class RoomController {

    createRoom = asyncHandler(async (req: AuthRequest,res: Response) => {

        const roomData = req.body as CreateRoomDto;
        const creatorId = getUserId(req);
        
        const result = await roomService.createRoom(roomData, creatorId);
        return createdResponse(
            res, 
            {
                room: result.room,
                participant: result.participant,
                websocket_url: result.websocket_url
            }, 
            "Room created successfully"
        );
         
    })

    getAllRooms = asyncHandler(async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query as unknown as PaginationDto; 
        const rooms = await roomService.getAllRooms(page, limit);
        return successResponse(res, "Rooms fetched successfully", rooms);
    })

    getRoom = asyncHandler(async (req: Request, res: Response) => {
        const roomId = req.params.id as string;
        const room = await roomService.getRoomById(roomId);
        return successResponse(res, "Room fetched successfully", room);
    })

}

const roomController = new RoomController();
export default roomController;
