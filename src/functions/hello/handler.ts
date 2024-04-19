import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';

import schema from './schema';

import { middyfy } from '@libs/lambda';

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const { name } = event.body;

  const response = {
    message: `Hello ${name}, welcome to the exciting Serverless world!`,
    event,
  };
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};

export const main = middyfy(hello);
