import { Router } from "express";
import { IncidentController } from "../controllers/incidentController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const incidents = Router();

incidents.get("/", authenticateJWT, IncidentController.getAllIncidents);
incidents.post("/", authenticateJWT, IncidentController.createIncident);

export default incidents;
