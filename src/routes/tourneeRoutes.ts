import { Router } from "express";
import { TourneeController } from "../controllers/tourneeController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const tournees = Router();

tournees.get("/", authenticateJWT, TourneeController.getAllTournees);
tournees.get("/:tourneeID", authenticateJWT, TourneeController.getTourneeById);
tournees.post("/", authenticateJWT, TourneeController.createTournee);
tournees.put("/:tourneeID", authenticateJWT, TourneeController.updateTournee);
tournees.delete("/:tourneeID", authenticateJWT, TourneeController.deleteTournee);

export default tournees;
