import { Request, Response } from "express";
import { ClientModel } from "../models/clientModel";

export class ClientController {
  static async getAllClients(req: Request, res: Response): Promise<void> {
    try {
      const clients = await ClientModel.getAllClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  static async getClientById(req: Request, res: Response): Promise<void> {
    const { clientID } = req.params;
    try {
      const client = await ClientModel.getClientById(Number(clientID));
      if (!client) {
        res.status(404).json({ message: "Client non trouvé" });
      } else {
        res.json(client);
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  static async createClient(req: Request, res: Response): Promise<void> {
    try {
      const insertId = await ClientModel.createClient(req.body);
      res.status(201).json({ clientID: insertId, message: "Client créé avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  static async updateClient(req: Request, res: Response): Promise<void> {
    const { clientID } = req.params;
    try {
      const updated = await ClientModel.updateClient(Number(clientID), req.body);
      if (!updated) {
        res.status(404).json({ message: "Client non trouvé" });
      } else {
        res.json({ message: "Client mis à jour" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  static async deleteClient(req: Request, res: Response): Promise<void> {
    const { clientID } = req.params;
    try {
      const deleted = await ClientModel.deleteClient(Number(clientID));
      if (!deleted) {
        res.status(404).json({ message: "Client non trouvé" });
      } else {
        res.json({ message: "Client supprimé avec succès" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }
}
