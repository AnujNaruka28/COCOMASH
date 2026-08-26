import { AuthRequest } from "../types/AuthRequest.js";

const getUserId = (req: AuthRequest) : string => 
    req.user?.id || req.header('x-guest-id')!;

export default getUserId;
