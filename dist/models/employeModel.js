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
exports.EmployeModel = void 0;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
class EmployeModel {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield dbconfig_1.default.query("SELECT * FROM employe");
            return rows;
        });
    }
    static getById(employeID) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield dbconfig_1.default.query("SELECT * FROM employe WHERE employeID = ?", [employeID]);
            return rows.length ? rows[0] : null;
        });
    }
    static create(employe) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employe_prenom, employeNom, employeMail, employeMDP, isFromSiege } = employe;
            const [result] = yield dbconfig_1.default.query("INSERT INTO employe (employe_prenom, employeNom, employeMail, employeMDP, isFromSiege) VALUES (?, ?, ?, ?, ?)", [employe_prenom, employeNom, employeMail, employeMDP, isFromSiege]);
            return result.insertId;
        });
    }
    static update(employeID, employe) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = Object.keys(employe)
                .map((key) => `${key} = ?`)
                .join(", ");
            const values = Object.values(employe);
            if (values.length === 0)
                return false;
            values.push(employeID);
            const [result] = yield dbconfig_1.default.query(`UPDATE employe SET ${fields} WHERE employeID = ?`, values);
            return result.affectedRows > 0;
        });
    }
    static delete(employeID) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield dbconfig_1.default.query("DELETE FROM employe WHERE employeID = ?", [employeID]);
            return result.affectedRows > 0;
        });
    }
}
exports.EmployeModel = EmployeModel;
