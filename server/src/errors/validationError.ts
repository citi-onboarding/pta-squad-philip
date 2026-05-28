import { AppError } from "./appError";

export class ValidationError extends AppError {
  constructor(message = "Dados da requisição inválidos.") {
    super(message, 400);

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

//throw new NotFoundError("Livro não encontrado")