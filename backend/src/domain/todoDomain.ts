// todo business domain

import { createLogger } from "../utils/logger";
const logger = createLogger("todoDomain");

import { todoDao } from "../dao/todoDao";
import { todoAttachment } from "../dao/todoAttachment";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";

import * as uuid from "uuid";
import { TodoItem } from "../models/TodoItem";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

const bucketName = process.env.IMAGES_S3_BUCKET;

const todoDomain = <any>{};

todoDomain.getTodos = async (userId: string) => {
  return await todoDao.getTodos(userId);
};

todoDomain.deleteTodo = async (userId: string, todoId: string) => {
  await todoDao.deleteTodo(userId, todoId);
};

todoDomain.todoExists = async (userId: string, todoId: string): Promise<boolean> => {
  return await todoDao.todoExists(userId, todoId);
};

todoDomain.updateTodo = async (
  userId: string,
  todoId: string,
  todoRequest: UpdateTodoRequest
) => {
  await todoDao.updateTodo(userId, todoId, todoRequest);
};

const updateTodoUrl = async (userId: string, todoId: string, url: string) => {
  await todoDao.updateTodoUrl(userId, todoId, url);
};

todoDomain.createTodo = async (
  userId: string,
  todoRequest: CreateTodoRequest
): Promise<TodoItem> => {
  const todoId = uuid.v4();
  const createdAt = new Date().toISOString();
  const dueDate = new Date().toISOString();

  const newTodo: TodoItem = {
    userId,
    todoId,
    createdAt,
    dueDate,
    done: false,
    name: todoRequest.name
  };

  await todoDao.createTodo(newTodo);
  return newTodo;
};

// attachments

const getSignedUrl = async (imageId: string) => {
  return await todoAttachment.getSignedUrl(imageId);
};

todoDomain.generateURL = async (userId: string, todoId: string) => {
  const imageId = uuid.v4();
  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`;

  const url = await getSignedUrl(imageId);
  logger.info(`Generated attachment url ${url}`);

  await updateTodoUrl(userId, todoId, imageUrl);

  return {
    uploadUrl: url
  };
};

export { todoDomain };
