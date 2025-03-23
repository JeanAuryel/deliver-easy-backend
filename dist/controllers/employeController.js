"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployeData = exports.updateEmployeData = exports.createEmploye = exports.getEmploye = exports.getEmployes = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const employeModel_1 = require("../models/employeModel");
// Récupérer tous les employés
const getEmployes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employes = yield employeModel_1.EmployeModel.getAll();
        res.json(employes);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
exports.getEmployes = getEmployes;
// Récupérer un employé par email
const getEmploye = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        const employe = yield employeModel_1.EmployeModel.getById(Number(email)); // Adaptation si c'est un ID
        if (!employe) {
            res.status(404).json({ message: "Employé non trouvé" });
        }
        else {
            res.json(employe);
        }
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
exports.getEmploye = getEmploye;
// Créer un nouvel employé
const createEmploye = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { employe_prenom, employeNom, employeMail, employeMDP, isFromSiege } = req.body;
        // Hash du mot de passe avant insertion
        const hashedPassword = yield bcryptjs_1.default.hash(employeMDP, 10);
        const newEmploye = {
            employe_prenom,
            employeNom,
            employeMail,
            employeMDP: hashedPassword,
            isFromSiege,
        };
        const insertId = yield employeModel_1.EmployeModel.create(newEmploye);
        res.status(201).json({ employeID: insertId, message: "Employé créé avec succès" });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
exports.createEmploye = createEmploye;
// Mettre à jour les informations d'un employé
const updateEmployeData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        const updateData = req.body;
        if (updateData.employeMDP) {
            updateData.employeMDP = yield bcryptjs_1.default.hash(updateData.employeMDP, 10);
        }
        const updated = yield employeModel_1.EmployeModel.update(Number(email), updateData);
        if (!updated) {
            res.status(404).json({ message: "Employé non trouvé" });
        }
        else {
            res.json({ message: "Employé mis à jour avec succès" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
exports.updateEmployeData = updateEmployeData;
// Supprimer un employé
const deleteEmployeData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        const deleted = yield employeModel_1.EmployeModel.delete(Number(email));
        if (!deleted) {
            res.status(404).json({ message: "Employé non trouvé" });
        }
        else {
            res.json({ message: "Employé supprimé avec succès" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
exports.deleteEmployeData = deleteEmployeData;
