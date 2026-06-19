import express from "express";
import { addPortfolio, createProfile,deletePortfolio,deleteProviderProfile,getPortfolio,getProviderProfile, updatePortfolio, updateProviderProfile } from "../controllers/providerProfile.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post('/create-profile',isAuthenticated, createProfile)
router.get('/get-profile',isAuthenticated, getProviderProfile)
router.put('/update-profile',isAuthenticated, updateProviderProfile);
router.delete('/delete-profile',isAuthenticated, deleteProviderProfile);

// Portfolio CRUD
router.post('/create-portfolio',isAuthenticated, addPortfolio);
router.get('/get-portfolio',isAuthenticated, getPortfolio)
router.put('/update-portfolio/:portfolioId',isAuthenticated, updatePortfolio);
router.delete('/delete-portfolio/:portfolioId',isAuthenticated, deletePortfolio);



export default router;