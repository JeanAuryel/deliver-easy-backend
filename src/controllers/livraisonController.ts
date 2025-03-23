import { Request, Response } from "express";
import { LivraisonModel } from "../models/livraisonModel";

export class LivraisonController {
  static async getAllLivraisons(req: Request, res: Response): Promise<void> {
    try {
      const { clientID, tourneeID, employeSiegeID, employeLivreurID } = req.query;
      
      if (clientID || tourneeID || employeSiegeID || employeLivreurID) {
        const livraisons = await LivraisonModel.getFilteredLivraisons(
          clientID ? Number(clientID) : undefined,
          tourneeID ? Number(tourneeID) : undefined,
          employeSiegeID ? Number(employeSiegeID) : undefined,
          employeLivreurID ? Number(employeLivreurID) : undefined
        );
        res.json(livraisons);
      } else {
        const livraisons = await LivraisonModel.getAllLivraisons();
        res.json(livraisons);
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  static async getLivraisonById(req: Request, res: Response): Promise<void> {
    const { livraisonID } = req.params;
    try {
      const livraison = await LivraisonModel.getLivraisonById(Number(livraisonID));
      if (!livraison) {
        res.status(404).json({ message: "Livraison non trouvée" });
      } else {
        res.json(livraison);
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  static async createLivraison(req: Request, res: Response): Promise<void> {
    try {
        const insertId = await LivraisonModel.createLivraison(req.body);
        res.status(201).json({ livraisonID: insertId, message: "Livraison créée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
}

  static async deleteLivraison(req: Request, res: Response): Promise<void> {
    const { livraisonID } = req.params;
    try {
      const deleted = await LivraisonModel.deleteLivraison(Number(livraisonID));
      if (!deleted) {
        res.status(404).json({ message: "Livraison non trouvée" });
      } else {
        res.json({ message: "Livraison supprimée avec succès" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }
}
