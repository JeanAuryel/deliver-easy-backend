import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../config/dbconfig";
import { RowDataPacket } from "mysql2";

const SECRET_KEY = process.env.JWT_SECRET || "1A2B3C4D5E6F7G8H9I0J";

// Interface pour représenter un employé (issue du modèle fourni)
interface Employe {
  employeID?: number;
  employe_prenom: string;
  employeNom: string;
  employeMail: string;
  employeMDP: string;
  isFromSiege: boolean;
}

// Fonction pour récupérer un employé par e-mail
const getEmployeByEmail = async (employeMail: string): Promise<Employe | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM employe WHERE employeMail = ?",
    [employeMail]
  );
  return rows.length ? (rows[0] as Employe) : null;
};

// Connexion d'un utilisateur avec redirection selon le rôle et `isFromSiege`
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log("📥 Données reçues par le backend :", req.body) // 🔹 Vérifie les données reçues

    const { employeMail, employeMDP } = req.body;

    if (!employeMail || !employeMDP) {
      res.status(400).json({ message: "Email et mot de passe sont requis" });
      return;
    }

    // Vérifier si l'utilisateur existe
    const employe = await getEmployeByEmail(employeMail);
    if (!employe) {
      console.warn("🔸 Aucun employé trouvé pour cet email.");
      res.status(401).json({ message: "Email ou mot de passe incorrect" });
      return;
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(employeMDP, employe.employeMDP);
    if (!isMatch) {
      console.warn("🔸 Mot de passe incorrect.");
      res.status(401).json({ message: "Email ou mot de passe incorrect" });
      return;
    }

    console.log("✅ Authentification réussie pour :", employeMail);

    // Déterminer l'URL de redirection en fonction de `isFromSiege`
    const dashboardUrl = employe.isFromSiege ? "/dashboard/SiegeDashboard" : "/dashboard/DeliveryDashboard";

    // Générer le token JWT
    const token = jwt.sign(
      {
        employeID: employe.employeID,
        employeMail: employe.employeMail,
        isFromSiege: employe.isFromSiege,
      },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    // Retourner l'URL de redirection avec le token
    res.status(200).json({
      message: "Connexion réussie",
      token,
      employe: {
        employeID: employe.employeID,
        employeMail: employe.employeMail,
        employeNom: employe.employeNom,
        employePrenom: employe.employe_prenom,
        isFromSiege: employe.isFromSiege,
      },
      redirectUrl: dashboardUrl,
    });
  } catch (error) {
    next(error);
  }
};

// Fonction pour récupérer l'utilisateur connecté
export const getUser = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.token // 📌 Vérifie si le cookie `token` existe

  if (!token) {
    res.status(401).json({ message: 'Non autorisé' })
    return
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    res.status(200).json(decoded)
  } catch (error) {
    res.status(403).json({ message: 'Token invalide' })
  }
};