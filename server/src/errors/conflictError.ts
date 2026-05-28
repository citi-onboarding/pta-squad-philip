import { AppError } from "./AppError";

export class ConflictError extends AppError {
  constructor(message = "Recurso já existe.") {
    super(message, 409);

    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}