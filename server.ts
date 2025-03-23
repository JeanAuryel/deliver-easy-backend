import express, { Application } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';

// Import des routes
import authRoutes from './src/routes/authRoutes';
import employeRoutes from './src/routes/employeRoutes';
import adresseRoutes from './src/routes/adresseRoutes';
import clientRoutes from './src/routes/clientRoutes';
import colisRoutes from './src/routes/colisRoutes';
import incidentRoutes from './src/routes/incidentRoutes';
import livraisonRoutes from './src/routes/livraisonRoutes';
import tourneeRoutes from './src/routes/tourneeRoutes';

// Import du middleware de gestion des erreurs
import { errorHandler } from './src/middlewares/errorMiddleware';

// Charger les variables d'environnement
dotenv.config();
console.log("📢 Valeur de JWT_SECRET chargée :", process.env.JWT_SECRET);

// Initialisation de l'application Express
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares globaux

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:5173', // 🔹 Spécifie l'URL du frontend (NE PAS METTRE "*")
  credentials: true // 🔹 Autorise les cookies et tokens envoyés avec `withCredentials`
}));
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes); // route pour l'authentification
app.use('/api/employes', employeRoutes); // Route pour les employés
app.use('/api/adresses', adresseRoutes); // Route pour les adresses
app.use('/api/clients', clientRoutes); // Route pour les clients
app.use('/api/colis', colisRoutes); // Route pour les colis
app.use('/api/incidents', incidentRoutes); // Route pour les incidents
app.use('/api/livraisons', livraisonRoutes); // Route pour les livraisons
app.use('/api/tournees', tourneeRoutes); // Route pour les tournées

app.get('/', (req, res) => {
    res.send('Welcome to Deliver_easy Backend API');
});

// Middleware de gestion des erreurs
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
