import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).send({
      message: error.message,
    });
  }

  console.error(error);

  return response.status(500).send({
    message: "Internal server error.",
  });
}