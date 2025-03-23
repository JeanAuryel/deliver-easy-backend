import { Router } from "express";
import { ClientController } from "../controllers/clientController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const clients = Router();

clients.get("/", authenticateJWT, ClientController.getAllClients);
clients.get("/:clientID", authenticateJWT, ClientController.getClientById);
clients.post("/", authenticateJWT, ClientController.createClient);
clients.put("/:clientID", authenticateJWT, ClientController.updateClient);
clients.delete("/:clientID", authenticateJWT, ClientController.deleteClient);

export default clients;
