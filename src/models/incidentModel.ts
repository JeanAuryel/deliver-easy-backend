import { RowDataPacket } from "mysql2";
import pool from "../config/dbconfig";

export interface Incident {
  incidentID?: number;
  incidentLabel: string;
}

export class IncidentModel {
  static async getAllIncidents(): Promise<Incident[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM incident");
    return rows as Incident[];
  }

  static async createIncident(incident: Incident): Promise<number> {
    const { incidentLabel } = incident;
    const [result] = await pool.query(
      "INSERT INTO incident (incidentLabel) VALUES (?)",
      [incidentLabel]
    );
    return (result as any).insertId;
  }
}
