import { RowDataPacket } from "mysql2";
import pool from "../config/dbconfig";

export interface Adresse {
  adresseID?: number;
  adresseLabel: string;
  adresseCodePostal: string;
  adressePays: string;
  employeID: number;
}

export class AdresseModel {
  static async getAllAdresses(): Promise<Adresse[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM Adresse");
    return rows as Adresse[];
  }

  static async getAdresseById(adresseID: number): Promise<Adresse | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Adresse WHERE adresseID = ?",
      [adresseID]
    );
    return rows.length ? (rows[0] as Adresse) : null;
  }

  static async createAdresse(adresse: Adresse): Promise<number> {
    const { adresseLabel, adresseCodePostal, adressePays, employeID } = adresse;
    const [result] = await pool.query(
      "INSERT INTO Adresse (adresseLabel, adresseCodePostal, adressePays, employeID) VALUES (?, ?, ?, ?)",
      [adresseLabel, adresseCodePostal, adressePays, employeID]
    );
    return (result as any).insertId;
  }

  static async updateAdresse(adresseID: number, adresse: Partial<Adresse>): Promise<boolean> {
    const fields = Object.keys(adresse).map((key) => `${key} = ?`).join(", ");
    const values = Object.values(adresse);
    if (values.length === 0) return false;
    values.push(adresseID);
    const [result] = await pool.query(
      `UPDATE Adresse SET ${fields} WHERE adresseID = ?`,
      values
    );
    return (result as any).affectedRows > 0;
  }

  static async deleteAdresse(adresseID: number): Promise<boolean> {
    const [result] = await pool.query("DELETE FROM Adresse WHERE adresseID = ?", [adresseID]);
    return (result as any).affectedRows > 0;
  }
}
