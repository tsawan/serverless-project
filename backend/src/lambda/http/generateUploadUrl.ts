import "source-map-support/register";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import * as middy from "middy";
import { cors } from "middy/middlewares";

import { getUserId } from "../utils";

import { createLogger } from "../../utils/logger";
const logger = createLogger("generateUploadUrl");

import { todoDomain } from '../../domain/todoDomain'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;

    const todoExists = await todoDomain.todoExists(getUserId(event), todoId);

    logger.info(`todo exists ${todoExists}`);

    if (!todoExists) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "Todo does not exist"
        })
      };
    } else {
      const result = await todoDomain.generateURL(getUserId(event), todoId);
      return {
        statusCode: 200,
        body: JSON.stringify({
          ...result
        })
      };
    }
  }
);

handler.use(
  cors({
    credentials: true
  })
);
