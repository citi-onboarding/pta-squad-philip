import { Request, Response } from "express";
import { Citi, Crud } from "../global";

/**
 * Controller responsável por gerenciar os empréstimos de livros.
 *
 * Aqui você vai implementar:
 * - Registro de novo empréstimo (validando estoque disponível - RN01)
 * - Atualização de estoque ao emprestar e ao devolver (RN02)
 * - Listagem de empréstimos com cálculo dinâmico de atraso (RN03)
 * - Busca de empréstimos por nome do cliente (usado no mobile)
 * - Envio de e-mail de lembrete para empréstimos atrasados (Nodemailer)
 *
 * Atenção às regras de negócio:
 * - RN01: só empresta se quantidade disponível > 0
 * - RN02: ao emprestar subtrai 1, ao devolver soma 1
 * - RN03: status "Atrasado" = data atual > data prevista E status != "Devolvido"
 */

