import express from "express";
import LivroController from "../controllers/bookController";

const livroRoutes = express.Router();
const livroController = new LivroController();

livroRoutes.post("/", livroController.create);
livroRoutes.get("/", livroController.getAll);
livroRoutes.get("/:id", livroController.getById);
livroRoutes.delete("/:id", livroController.delete);

export default livroRoutes;