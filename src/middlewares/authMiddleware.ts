import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
    user?: any;
}

const SECRET_KEY = process.env.JWT_SECRET || '123456abcdef';

export const authenticateJWT = (req: CustomRequest, res: Response, next: NextFunction): void => {
    console.log("🔍 Vérification du token en cours...");

    const authHeader = req.header('Authorization');
    console.log("🔍 En-tête Authorization reçu :", authHeader);

    if (!authHeader) {
        console.error("❌ Aucun token trouvé dans l'en-tête Authorization.");
        res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
        return;
    }

    const token = authHeader.split(' ')[1]; // Bearer Token
    if (!token) {
        console.error("❌ Aucun token trouvé après 'Bearer'.");
        res.status(401).json({ message: 'Accès non autorisé. Token invalide.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("✅ Token décodé avec succès :", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("❌ Token invalide ou expiré :", error);
        res.status(403).json({ message: 'Token invalide.' });
    }
};
