// default data layer for todo dynamodb table.

import * as AWS  from 'aws-sdk'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'

import { createLogger } from '../utils/logger'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const logger = createLogger('todoDao')

const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

const todoDao = <any>{}

todoDao.todoExists = async (userId: string, todoId: string): Promise<boolean> => {

  const result = await docClient
    .get({
      TableName: todosTable,
      Key: {
        userId,
        todoId
      }
    })
    .promise();

  logger.info('getTodo ', !!result.Item);
  return !!result.Item;
}

todoDao.getTodos = async (userId: string) => {
  const result = await docClient
    .query({
      TableName: todosTable,
      KeyConditionExpression: '#userId = :i',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':i': userId
      }
    })
    .promise()
  return result.Items as TodoItem[]
}

todoDao.updateTodo = async (
  userId: string,
  todoId: string,
  updatedTodo: UpdateTodoRequest
) => {
  await docClient
    .update({
      TableName: todosTable,
      ...getUpdateParams(userId, todoId, "done", updatedTodo.done)
    })
    .promise()
}

todoDao.updateTodoUrl = async (
  userId: string,
  todoId: string,
  url: string
) => {
  await docClient
    .update({
      TableName: todosTable,
      ...getUpdateParams(userId, todoId, "attachmentUrl", url)
    })
    .promise();
};

const getUpdateParams = (userId: string, todoId: string, field: string, value: any) => {
  return {
    Key: {
      userId,
      todoId
    },
    ExpressionAttributeNames: {
      "#D": field
    },
    ExpressionAttributeValues: {
      ":y": value
    },
    UpdateExpression: "SET #D = :y",
    ReturnValues: "ALL_NEW"
  }
}

todoDao.createTodo = async (newTodo: TodoItem) => {
  await docClient
    .put({
      TableName: todosTable,
      Item: newTodo
    })
    .promise()

  logger.info(`Todo created`)
}

todoDao.deleteTodo = async (userId: string, todoId: string) => {
  await docClient
    .delete({
      TableName: todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    })
    .promise()
  logger.info(`Todo deleted`)
}

export { todoDao }
