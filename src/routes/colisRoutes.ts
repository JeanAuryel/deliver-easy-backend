import { Router } from "express";
import { ColisController } from "../controllers/colisController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const colis = Router();

colis.get("/", authenticateJWT, ColisController.getAllColis);
colis.get("/:colisID", authenticateJWT, ColisController.getColisById);
colis.post("/", authenticateJWT, ColisController.createColis);
colis.delete("/:colisID", authenticateJWT, ColisController.deleteColis);

export default colis;
