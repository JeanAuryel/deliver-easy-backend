import { Router } from 'express';
import { login, getUser } from '../controllers/authController';

const auth = Router();

auth.post('/login', login); // Connexion

// Route pour récupérer l'utilisateur connecté
auth.get('/user', getUser)

export default auth;