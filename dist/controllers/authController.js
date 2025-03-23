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
exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
const SECRET_KEY = process.env.JWT_SECRET || "1A2B3C4D5E6F7G8H9I0J";
// Fonction pour récupérer un employé par e-mail
const getEmployeByEmail = (employeMail) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield dbconfig_1.default.query("SELECT * FROM employe WHERE employeMail = ?", [employeMail]);
    return rows.length ? rows[0] : null;
});
// Connexion d'un utilisateur avec redirection selon le rôle et `isFromSiege`
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { employeMail, employeMDP } = req.body;
        // Vérifier si l'utilisateur existe
        const employe = yield getEmployeByEmail(employeMail);
        if (!employe) {
            res.status(401).json({ message: "Email ou mot de passe incorrect" });
            return;
        }
        // Vérifier le mot de passe
        const isMatch = yield bcryptjs_1.default.compare(employeMDP, employe.employeMDP);
        if (!isMatch) {
            res.status(401).json({ message: "Email ou mot de passe incorrect" });
            return;
        }
        // Déterminer l'URL de redirection en fonction de `isFromSiege`
        const dashboardUrl = employe.isFromSiege ? "/dashboard/SiegeDashboard" : "/dashboard/DeliveryDashboard";
        // Générer le token JWT
        const token = jsonwebtoken_1.default.sign({
            employeID: employe.employeID,
            employeMail: employe.employeMail,
            isFromSiege: employe.isFromSiege,
        }, SECRET_KEY, { expiresIn: "2h" });
        // Retourner l'URL de redirection avec le token
        res.status(200).json({
            message: "Connexion réussie",
            token,
            employe: {
                employeID: employe.employeID,
                employeMail: employe.employeMail,
                employeNom: employe.employeNom,
                employePrenom: employe.employe_prenom,
                isFromSiege: employe.isFromSiege,
            },
            redirectUrl: dashboardUrl,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
