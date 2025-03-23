import { Router } from "express";
import { LivraisonController } from "../controllers/livraisonController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const livraisons = Router();

livraisons.get("/", authenticateJWT, LivraisonController.getAllLivraisons);
livraisons.get("/:livraisonID", authenticateJWT, LivraisonController.getLivraisonById);
livraisons.post("/", authenticateJWT, LivraisonController.createLivraison);
livraisons.delete("/:livraisonID", authenticateJWT, LivraisonController.deleteLivraison);

export default livraisons;
