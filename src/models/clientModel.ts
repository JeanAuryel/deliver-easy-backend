import { RowDataPacket } from "mysql2";
import pool from "../config/dbconfig";

export interface Client {
  clientID?: number;
  clientPrenom: string;
  clientNom: string;
  clientTelephone: string;
  adresseID: number;
  employeID: number;
}

export class ClientModel {
  static async getAllClients(): Promise<Client[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM Client");
    return rows as Client[];
  }

  static async getClientById(clientID: number): Promise<Client | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Client WHERE clientID = ?",
      [clientID]
    );
    return rows.length ? (rows[0] as Client) : null;
  }

  static async createClient(client: Client): Promise<number> {
    const { clientPrenom, clientNom, clientTelephone, adresseID, employeID } = client;
    const [result] = await pool.query(
      "INSERT INTO Client (clientPrenom, clientNom, clientTelephone, adresseID, employeID) VALUES (?, ?, ?, ?, ?)",
      [clientPrenom, clientNom, clientTelephone, adresseID, employeID]
    );
    return (result as any).insertId;
  }

  static async updateClient(clientID: number, client: Partial<Client>): Promise<boolean> {
    const fields = Object.keys(client).map((key) => `${key} = ?`).join(", ");
    const values = Object.values(client);
    if (values.length === 0) return false;
    values.push(clientID);
    const [result] = await pool.query(
      `UPDATE Client SET ${fields} WHERE clientID = ?`,
      values
    );
    return (result as any).affectedRows > 0;
  }

  static async deleteClient(clientID: number): Promise<boolean> {
    const [result] = await pool.query("DELETE FROM Client WHERE clientID = ?", [clientID]);
    return (result as any).affectedRows > 0;
  }
}
