import { Request, Response } from "express";
import { IncidentModel } from "../models/incidentModel";

export class IncidentController {
  static async getAllIncidents(req: Request, res: Response): Promise<void> {
    try {
      const incidents = await IncidentModel.getAllIncidents();
      res.json(incidents);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  static async createIncident(req: Request, res: Response): Promise<void> {
    try {
      const insertId = await IncidentModel.createIncident(req.body);
      res.status(201).json({ incidentID: insertId, message: "Incident créé avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  }
}
