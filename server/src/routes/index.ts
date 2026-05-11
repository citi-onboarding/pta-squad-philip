import express from "express";
import livroRoutes from "./livro.routes";
import emprestimoRoutes from "./emprestimo.routes";

const routes = express.Router();

routes.use("/livros", livroRoutes);
routes.use("/emprestimos", emprestimoRoutes);

export default routes;