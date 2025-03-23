import { Request, Response } from "express";
import { ColisModel } from "../models/colisModel";

export class ColisController {
  static async getAllColis(req: Request, res: Response): Promise<void> {
    try {
      const colis = await ColisModel.getAllColis();
      res.json(colis);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  static async getColisById(req: Request, res: Response): Promise<void> {
    const { colisID } = req.params;
    try {
      const colis = await ColisModel.getColisById(Number(colisID));
      if (!colis) {
        res.status(404).json({ message: "Colis non trouvé" });
      } else {
        res.json(colis);
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  static async createColis(req: Request, res: Response): Promise<void> {
    try {
      const insertId = await ColisModel.createColis(req.body);
      res.status(201).json({ colisID: insertId, message: "Colis créé avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  static async deleteColis(req: Request, res: Response): Promise<void> {
    const { colisID } = req.params;
    try {
      const deleted = await ColisModel.deleteColis(Number(colisID));
      if (!deleted) {
        res.status(404).json({ message: "Colis non trouvé" });
      } else {
        res.json({ message: "Colis supprimé avec succès" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }
}
