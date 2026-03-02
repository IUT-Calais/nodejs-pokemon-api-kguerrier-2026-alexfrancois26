import type { NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            userId?: number
        }
    }
}

export const verifyJWT = (req : Request, res : Response, next : NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).send({ error : "Token manquant" });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            userId: number;
            email: string;
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(403).send({error : 'Token invalide ou expiré '});
        return;
    }
}