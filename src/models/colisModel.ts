import { RowDataPacket } from "mysql2";
import pool from "../config/dbconfig";

export interface Colis {
  colisID?: number;
  colisLabel: string;
  colisPoids: number;
  colisDimensions: string;
  colisLivraisonEffectuee: boolean;
  colisChoixClient: boolean;
  LivraisonID: number;
}

export class ColisModel {
  static async getAllColis(): Promise<Colis[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM Colis");
    return rows as Colis[];
  }

  static async getColisById(colisID: number): Promise<Colis | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Colis WHERE colisID = ?",
      [colisID]
    );
    return rows.length ? (rows[0] as Colis) : null;
  }

  static async createColis(colis: Colis): Promise<number> {
    const { colisLabel, colisPoids, colisDimensions, colisLivraisonEffectuee, colisChoixClient, LivraisonID } = colis;
    const [result] = await pool.query(
      "INSERT INTO Colis (colisLabel, colisPoids, colisDimensions, colisLivraisonEffectuee, colisChoixClient, LivraisonID) VALUES (?, ?, ?, ?, ?, ?)",
      [colisLabel, colisPoids, colisDimensions, colisLivraisonEffectuee, colisChoixClient, LivraisonID]
    );
    return (result as any).insertId;
  }

  static async deleteColis(colisID: number): Promise<boolean> {
    const [result] = await pool.query("DELETE FROM Colis WHERE colisID = ?", [colisID]);
    return (result as any).affectedRows > 0;
  }
}
