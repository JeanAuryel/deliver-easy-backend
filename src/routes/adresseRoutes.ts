import { Router } from "express";
import { AdresseController } from "../controllers/adresseController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const adresses = Router();

adresses.get("/", authenticateJWT, AdresseController.getAllAdresses);
adresses.get("/:adresseID", authenticateJWT, AdresseController.getAdresseById);
adresses.post("/", authenticateJWT, AdresseController.createAdresse);
adresses.put("/:adresseID", authenticateJWT, AdresseController.updateAdresse);
adresses.delete("/:adresseID", authenticateJWT, AdresseController.deleteAdresse);

export default adresses;
