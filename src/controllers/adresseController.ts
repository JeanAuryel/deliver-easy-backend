import { Request, Response } from "express";
import { AdresseModel } from "../models/adresseModel";

export class AdresseController {
  static async getAllAdresses(req: Request, res: Response): Promise<void> {
    try {
      const adresses = await AdresseModel.getAllAdresses();
      res.json(adresses);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  static async getAdresseById(req: Request, res: Response): Promise<void> {
    const { adresseID } = req.params;
    try {
      const adresse = await AdresseModel.getAdresseById(Number(adresseID));
      if (!adresse) {
        res.status(404).json({ message: "Adresse non trouvée" });
      } else {
        res.json(adresse);
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  static async createAdresse(req: Request, res: Response): Promise<void> {
    try {
      const insertId = await AdresseModel.createAdresse(req.body);
      res.status(201).json({ adresseID: insertId, message: "Adresse créée avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  static async updateAdresse(req: Request, res: Response): Promise<void> {
    const { adresseID } = req.params;
    try {
      const updated = await AdresseModel.updateAdresse(Number(adresseID), req.body);
      if (!updated) {
        res.status(404).json({ message: "Adresse non trouvée" });
      } else {
        res.json({ message: "Adresse mise à jour" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  static async deleteAdresse(req: Request, res: Response): Promise<void> {
    const { adresseID } = req.params;
    try {
      const deleted = await AdresseModel.deleteAdresse(Number(adresseID));
      if (!deleted) {
        res.status(404).json({ message: "Adresse non trouvée" });
      } else {
        res.json({ message: "Adresse supprimée avec succès" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }
}
