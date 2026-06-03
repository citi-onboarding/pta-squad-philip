import express from "express";
import emprestimoController from "../controllers/loanController";
const emprestimoRoutes = express.Router();

// empréstimo routes
emprestimoRoutes.post("/", emprestimoController.create);
emprestimoRoutes.get("/", emprestimoController.getAll);
emprestimoRoutes.get("/busca", emprestimoController.getByClienteNome);
emprestimoRoutes.delete("/:id", emprestimoController.delete);
emprestimoRoutes.post("/:id/lembrete", emprestimoController.sendReminder);
emprestimoRoutes.put("/:id/devolver", emprestimoController.returnBook);

export default emprestimoRoutes;
