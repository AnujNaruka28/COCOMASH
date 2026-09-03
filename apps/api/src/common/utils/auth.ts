import { AuthRequest } from "../types/AuthRequest.js";

const getUserId = (req: AuthRequest) : string => 
    req.user?.id || "";

export default getUserId;
