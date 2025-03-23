import { Request, Response } from "express";
import { TourneeModel } from "../models/tourneeModel";

export class TourneeController {
  static async getAllTournees(req: Request, res: Response): Promise<void> {
    try {
      const { tourneeID, employeSiegeID, employeLivreurID, tourneeDate, tourneeFin } = req.query;
      
      if (tourneeID || employeSiegeID || employeLivreurID || tourneeDate || tourneeFin !== undefined) {
        const tournees = await TourneeModel.getFilteredTournees(
          tourneeID ? Number(tourneeID) : undefined,
          employeSiegeID ? Number(employeSiegeID) : undefined,
          employeLivreurID ? Number(employeLivreurID) : undefined,
          tourneeDate ? String(tourneeDate) : undefined,
          tourneeFin !== undefined ? tourneeFin === "true" : undefined
        );
        res.json(tournees);
      } else {
        const tournees = await TourneeModel.getAllTournees();
        res.json(tournees);
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  static async getTourneeById(req: Request, res: Response): Promise<void> {
    const { tourneeID } = req.params;
    try {
      const tournee = await TourneeModel.getTourneeById(Number(tourneeID));
      if (!tournee) {
        res.status(404).json({ message: "Tournée non trouvée" });
      } else {
        res.json(tournee);
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  static async createTournee(req: Request, res: Response): Promise<void> {
    try {
      const insertId = await TourneeModel.createTournee(req.body);
      res.status(201).json({ tourneeID: insertId, message: "Tournée créée avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  static async updateTournee(req: Request, res: Response): Promise<void> {
    const { tourneeID } = req.params;
    try {
      const updated = await TourneeModel.updateTournee(Number(tourneeID), req.body);
      if (!updated) {
        res.status(404).json({ message: "Tournée non trouvée" });
      } else {
        res.json({ message: "Tournée mise à jour" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  static async deleteTournee(req: Request, res: Response): Promise<void> {
    const { tourneeID } = req.params;
    try {
      const deleted = await TourneeModel.deleteTournee(Number(tourneeID));
      if (!deleted) {
        res.status(404).json({ message: "Tournée non trouvée" });
      } else {
        res.json({ message: "Tournée supprimée avec succès" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }
}
