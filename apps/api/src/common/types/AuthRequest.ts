import { Request } from "express";

interface AuthRequest extends Request {
    user?: {
        id: string;
        name?: string;
        profile_url?: string;
    };
}

export type { AuthRequest };