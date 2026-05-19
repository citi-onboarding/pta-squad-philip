import express from "express";
import emprestimoController from "src/controllers/emprestimo.controller";
const emprestimoRoutes = express.Router();

// empréstimo routes
emprestimoRoutes.post('/', emprestimoController.create);
emprestimoRoutes.get('/', emprestimoController.getAll);
emprestimoRoutes.get('/busca', emprestimoController.getByClienteNome);
emprestimoRoutes.delete('/:id', emprestimoController.delete);


export default emprestimoRoutes;