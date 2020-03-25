// todo business domain

import { createLogger } from "../utils/logger";
const logger = createLogger("todoDomain");

import { TodoDao } from "../dao/TodoDao";
import { TodoAttachment } from "../dao/TodoAttachment";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";

import * as uuid from "uuid";
import { TodoItem } from "../models/TodoItem";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

export class TodoDomain {

  static async getTodos(userId: string) {
    return await TodoDao.getTodos(userId);
  }

  static async deleteTodo(userId: string, todoId: string) {
    await TodoDao.deleteTodo(userId, todoId);
  }

  static async todoExists(userId: string, todoId: string): Promise<boolean> {
    return await TodoDao.todoExists(userId, todoId);
  }

  static async updateTodo(
    userId: string,
    todoId: string,
    todoRequest: UpdateTodoRequest
  ) {
    await TodoDao.updateTodo(userId, todoId, todoRequest);
  }

  static async createTodo(
    userId: string,
    todoRequest: CreateTodoRequest
  ): Promise<TodoItem> {
    const todoId = uuid.v4();
    const createdAt = new Date().toISOString();
    const dueDate = new Date(todoRequest.dueDate).toISOString();

    const newTodo: TodoItem = {
      userId,
      todoId,
      createdAt,
      dueDate,
      done: false,
      name: todoRequest.name
    };

    await TodoDao.createTodo(newTodo);
    return newTodo;
  }

  // attachments

  static async generateURL(userId: string, todoId: string) {
    const imageId = uuid.v4();
    const imageUrl = TodoAttachment.getImageUrl(imageId);

    const url = await getSignedUrl(imageId);
    logger.info(`Generated attachment url ${url}`);

    await updateTodoUrl(userId, todoId, imageUrl);

    return {
      uploadUrl: url
    };
  }
}

const updateTodoUrl = async (userId: string, todoId: string, url: string) => {
  await TodoDao.updateTodoUrl(userId, todoId, url);
};

const getSignedUrl = async (imageId: string) => {
  return await TodoAttachment.getSignedUrl(imageId);
};
