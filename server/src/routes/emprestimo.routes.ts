import express from "express";
import EmprestimoController from "../controllers/emprestimo.controller";
const emprestimoRoutes = express.Router();

emprestimoRoutes.post("/", EmprestimoController.create);
emprestimoRoutes.get("/", EmprestimoController.getAll);
emprestimoRoutes.get("/cliente", EmprestimoController.getByClienteNome);
emprestimoRoutes.patch("/:id/devolver", EmprestimoController.delete);

export default emprestimoRoutes;