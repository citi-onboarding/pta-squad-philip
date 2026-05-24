import express from "express";
import livroRoutes from "./livro.routes";
import emprestimoRoutes from "./emprestimo.routes";
import dashboardRoutes from "./dashboard.routes";

const routes = express.Router();

routes.use("/livros", livroRoutes);
routes.use("/emprestimos", emprestimoRoutes);
routes.use("/dashboard", dashboardRoutes);

export default routes;