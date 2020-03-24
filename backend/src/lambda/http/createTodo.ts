import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
//import * as AWSXRay from 'aws-xray-sdk'
//const XAWS = AWSXRay.captureAWS(AWS)

import { DocumentClient } from 'aws-sdk/clients/dynamodb'


const docClient: DocumentClient = createDynamoDBClient(),
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  
  await createTodo(newTodo);
  return undefined
}

async function createTodo(newTodo) {
  await docClient.put({
    TableName: todosTable,
    Item: newTodo
  }).promise()

  return newTodo
}

function createDynamoDBClient() {
  /*
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }
  */
  //return new XAWS.DynamoDB.DocumentClient()
  return new DocumentClient();
}