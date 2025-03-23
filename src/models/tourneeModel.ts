import { RowDataPacket } from "mysql2";
import pool from "../config/dbconfig";

export interface Tournee {
  tourneeID?: number;
  tourneeDate: Date;
  tourneeFin: boolean;
  employeSiegeID: number;
  employeLivreurID: number;
}

export class TourneeModel {
  static async getAllTournees(): Promise<Tournee[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM Tournee");
    return rows as Tournee[];
  }

  static async getTourneeById(tourneeID: number): Promise<Tournee | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Tournee WHERE tourneeID = ?",
      [tourneeID]
    );
    return rows.length ? (rows[0] as Tournee) : null;
  }

  static async getFilteredTournees(tourneeID?: number, employeSiegeID?: number, employeLivreurID?: number, tourneeDate?: string, tourneeFin?: boolean): Promise<Tournee[]> {
    let query = "SELECT * FROM Tournee WHERE 1=1";
    let params: any[] = [];

    if (tourneeID) {
        query += " AND tourneeID = ?";
        params.push(tourneeID);
    }
    if (employeSiegeID) {
        query += " AND employeSiegeID = ?";
        params.push(employeSiegeID);
    }
    if (employeLivreurID) {
        query += " AND employeLivreurID = ?";
        params.push(employeLivreurID);
    }
    if (tourneeDate) {
        query += " AND DATE(tourneeDate) = ?";
        params.push(tourneeDate);
    }
    if (tourneeFin !== undefined) {
        query += " AND tourneeFin = ?";
        params.push(Number(tourneeFin));
    }

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as Tournee[];
  }

  static async createTournee(tournee: Tournee): Promise<number> {
    const { tourneeDate, tourneeFin, employeSiegeID, employeLivreurID } = tournee;
    const [result] = await pool.query(
      "INSERT INTO Tournee (tourneeDate, tourneeFin, employeSiegeID, employeLivreurID) VALUES (?, ?, ?, ?)",
      [tourneeDate, tourneeFin, employeSiegeID, employeLivreurID]
    );
    return (result as any).insertId;
  }

  static async updateTournee(tourneeID: number, tournee: Partial<Tournee>): Promise<boolean> {
    const fields = Object.keys(tournee).map((key) => `${key} = ?`).join(", ");
    const values = Object.values(tournee);
    if (values.length === 0) return false;
    values.push(tourneeID);
    const [result] = await pool.query(
      `UPDATE Tournee SET ${fields} WHERE tourneeID = ?`,
      values
    );
    return (result as any).affectedRows > 0;
  }

  static async deleteTournee(tourneeID: number): Promise<boolean> {
    const [result] = await pool.query("DELETE FROM Tournee WHERE tourneeID = ?", [tourneeID]);
    return (result as any).affectedRows > 0;
  }
}
