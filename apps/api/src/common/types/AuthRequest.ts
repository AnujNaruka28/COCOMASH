import { Request } from "express";

interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}

export type { AuthRequest };