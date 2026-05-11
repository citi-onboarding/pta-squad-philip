import Message from "./Message";
import Terminal from "./Terminal";
import {
  InsertableDatabase,
  GetableDatabase,
  RemoveableDatabase,
  UpdatableDatabaseValue,
  FindableDatabaseValue,
} from "./types";
import { type Prisma } from "generated/prisma";
import prisma from "@database";

type ModelNames = Prisma.ModelName;

export default class Citi<Entity extends ModelNames> {
  constructor(readonly entity: Entity) {}

  areValuesUndefined(...elements: string[]): boolean {
    return elements.some((element) => element === undefined);
  }

  async insertIntoDatabase(object: Record<string, any>): Promise<InsertableDatabase> {
    try {
      await (prisma as any)[(this.entity as string).toLowerCase()].create({ data: object });
      Terminal.show(Message.INSERTED_IN_DATABASE);
      return { httpStatus: 201, message: Message.INSERTED_IN_DATABASE };
    } catch (error) {
      Terminal.show(Message.ERROR_INSERTING_DATABASE);
      return { httpStatus: 400, message: Message.ERROR_INSERTING_DATABASE };
    }
  }

  async getAll(): Promise<GetableDatabase<any>> {
    try {
      const values = await (prisma as any)[(this.entity as string).toLowerCase()].findMany();
      Terminal.show(Message.GET_ALL_VALUES_FROM_DATABASE);
      return { httpStatus: 200, values };
    } catch (error) {
      Terminal.show(Message.ERROR_GETTING_VALUES_FROM_DATABASE);
      return { httpStatus: 400, values: [] };
    }
  }

  async findById(id: string | number): Promise<FindableDatabaseValue<any>> {
    try {
      const value = await (prisma as any)[(this.entity as string).toLowerCase()].findFirst({
        where: { id },
      });
      Terminal.show(Message.VALUE_WAS_FOUND);
      return { httpStatus: 200, value };
    } catch (error) {
      Terminal.show(Message.VALUE_WAS_NOT_FOUND);
      return { httpStatus: 400, value: undefined };
    }
  }

  async updateValue(id: string | number, object: Record<string, any>): Promise<UpdatableDatabaseValue> {
    try {
      const valueExists = await this.findById(id);
      if (!valueExists.value)
        return { httpStatus: 400, messageFromUpdate: Message.VALUE_WAS_NOT_FOUND };

      await (prisma as any)[(this.entity as string).toLowerCase()].update({
        where: { id },
        data: object,
      });
      Terminal.show(Message.VALUE_WAS_UPDATED);
      return { httpStatus: 200, messageFromUpdate: Message.VALUE_WAS_UPDATED };
    } catch (error) {
      Terminal.show(Message.ERROR_AT_UPDATE_FROM_DATABASE);
      return { httpStatus: 400, messageFromUpdate: Message.ERROR_AT_UPDATE_FROM_DATABASE };
    }
  }

  async deleteValue(id: string | number): Promise<RemoveableDatabase> {
    try {
      await (prisma as any)[(this.entity as string).toLowerCase()].delete({ where: { id } });
      Terminal.show(Message.VALUE_DELETED_FROM_DATABASE);
      return { httpStatus: 200, messageFromDelete: Message.VALUE_DELETED_FROM_DATABASE };
    } catch (error) {
      Terminal.show(Message.ERROR_AT_DELETE_FROM_DATABASE);
      return { httpStatus: 400, messageFromDelete: Message.ERROR_AT_DELETE_FROM_DATABASE };
    }
  }
}