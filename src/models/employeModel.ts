import { RowDataPacket } from "mysql2";
import pool from "../config/dbconfig";

export interface Employe {
  employeID?: number;
  employe_prenom: string;
  employeNom: string;
  employeMail: string;
  employeMDP: string;
  isFromSiege: boolean;
}

export class EmployeModel {
  static async getAll(): Promise<Employe[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM employe");
    return rows as Employe[];
  }

  static async getById(employeID: number): Promise<Employe | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM employe WHERE employeID = ?",
      [employeID]
    );
    return rows.length ? (rows[0] as Employe) : null;
  }

  static async create(employe: Employe): Promise<number> {
    const { employe_prenom, employeNom, employeMail, employeMDP, isFromSiege } = employe;
    const [result] = await pool.query(
      "INSERT INTO employe (employe_prenom, employeNom, employeMail, employeMDP, isFromSiege) VALUES (?, ?, ?, ?, ?)",
      [employe_prenom, employeNom, employeMail, employeMDP, isFromSiege]
    );
    return (result as any).insertId;
  }

  static async update(employeID: number, employe: Partial<Employe>): Promise<boolean> {
    const fields = Object.keys(employe)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(employe);
    
    if (values.length === 0) return false;

    values.push(employeID);
    const [result] = await pool.query(
      `UPDATE employe SET ${fields} WHERE employeID = ?`,
      values
    );
    return (result as any).affectedRows > 0;
  }

  static async delete(employeID: number): Promise<boolean> {
    const [result] = await pool.query("DELETE FROM employe WHERE employeID = ?", [employeID]);
    return (result as any).affectedRows > 0;
  }
}
