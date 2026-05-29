import express from "express";
import livroRoutes from "./bookRoutes";
import emprestimoRoutes from "./loanRoutes";
import dashboardRoutes from "./dashboardRoutes";

const routes = express.Router();

routes.use("/livros", livroRoutes);
routes.use("/emprestimos", emprestimoRoutes);
routes.use("/dashboard", dashboardRoutes);

export default routes;