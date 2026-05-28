import {Router} from 'express';
import DashboardController from '../controllers/dashboard.controller'; 

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

dashboardRoutes.get('/', dashboardController.get);

export default dashboardRoutes;

