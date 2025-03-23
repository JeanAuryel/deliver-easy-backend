import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { EmployeModel, Employe } from "../models/employeModel";

// Récupérer tous les employés
export const getEmployes = async (req: Request, res: Response): Promise<void> => {
  try {
    const employes = await EmployeModel.getAll();
    res.json(employes);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Récupérer un employé par email
export const getEmploye = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.params;
  try {
    const employe = await EmployeModel.getById(Number(email)); // Adaptation si c'est un ID
    if (!employe) {
      res.status(404).json({ message: "Employé non trouvé" });
    } else {
      res.json(employe);
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Créer un nouvel employé
export const createEmploye = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employe_prenom, employeNom, employeMail, employeMDP, isFromSiege } = req.body;

    // Hash du mot de passe avant insertion
    const hashedPassword = await bcrypt.hash(employeMDP, 10);

    const newEmploye: Employe = {
      employe_prenom,
      employeNom,
      employeMail,
      employeMDP: hashedPassword,
      isFromSiege,
    };

    const insertId = await EmployeModel.create(newEmploye);
    res.status(201).json({ employeID: insertId, message: "Employé créé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Mettre à jour les informations d'un employé
export const updateEmployeData = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.params;
  try {
    const updateData = req.body;

    if (updateData.employeMDP) {
      updateData.employeMDP = await bcrypt.hash(updateData.employeMDP, 10);
    }

    const updated = await EmployeModel.update(Number(email), updateData);
    if (!updated) {
      res.status(404).json({ message: "Employé non trouvé" });
    } else {
      res.json({ message: "Employé mis à jour avec succès" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Supprimer un employé
export const deleteEmployeData = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.params;
  try {
    const deleted = await EmployeModel.delete(Number(email));
    if (!deleted) {
      res.status(404).json({ message: "Employé non trouvé" });
    } else {
      res.json({ message: "Employé supprimé avec succès" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
