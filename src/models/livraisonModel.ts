import { RowDataPacket } from "mysql2";
import pool from "../config/dbconfig";
import { Request, Response } from "express";

export interface Livraison {
  livraisonID?: number;
  livraisonTotalPoids: number;
  livraisonTimestamp: Date;
  clientID: number;
  employeSiegeID: number;
  employeLivreurID: number;
  tourneeID: number;
}

export class LivraisonModel {
  static async getAllLivraisons(): Promise<Livraison[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM Livraison");
    return rows as Livraison[];
  }

  static async getLivraisonById(livraisonID: number): Promise<Livraison | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Livraison WHERE livraisonID = ?",
      [livraisonID]
    );
    return rows.length ? (rows[0] as Livraison) : null;
  }

  static async getFilteredLivraisons(clientID?: number, tourneeID?: number, employeSiegeID?: number, employeLivreurID?: number): Promise<Livraison[]> {
    let query = "SELECT * FROM Livraison WHERE 1=1";
    let params: any[] = [];

    if (clientID) {
        query += " AND clientID = ?";
        params.push(clientID);
    }
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

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as Livraison[];
  }

  static async createLivraison(livraison: Livraison): Promise<number> {
    const { livraisonTotalPoids, livraisonTimestamp, clientID, employeSiegeID, employeLivreurID, tourneeID } = livraison;
    const [result] = await pool.query(
      "INSERT INTO Livraison (livraisonTotalPoids, livraisonTimestamp, clientID, employeSiegeID, employeLivreurID, tourneeID) VALUES (?, ?, ?, ?, ?, ?)",
      [livraisonTotalPoids, livraisonTimestamp, clientID, employeSiegeID, employeLivreurID, tourneeID]
    );
    return (result as any).insertId;
  }

  static async updateLivraison(livraisonID: number, livraison: Partial<Livraison>): Promise<boolean> {
    const fields = Object.keys(livraison).map((key) => `${key} = ?`).join(", ");
    const values = Object.values(livraison);
    if (values.length === 0) return false;
    values.push(livraisonID);
    const [result] = await pool.query(
      `UPDATE Livraison SET ${fields} WHERE livraisonID = ?`,
      values
    );
    return (result as any).affectedRows > 0;
  }

  static async deleteLivraison(livraisonID: number): Promise<boolean> {
    const [result] = await pool.query("DELETE FROM Livraison WHERE livraisonID = ?", [livraisonID]);
    return (result as any).affectedRows > 0;
  }
}