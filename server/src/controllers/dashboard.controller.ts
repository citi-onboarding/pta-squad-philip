import { Request, Response, NextFunction } from "express";
import { GetDashboardService } from "src/services/dashboard/dashboardService";

class DashboardController {
  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const getDashboardService = new GetDashboardService();

      const dashboardData = await getDashboardService.execute();

      return res.status(200).json(dashboardData);
    } catch (error) {
      next(error);
    }
  };
}

export default DashboardController;