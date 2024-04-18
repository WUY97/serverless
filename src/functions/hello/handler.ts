import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';

import schema from './schema';

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const response = {
    message: `Hello, welcome to the exciting Serverless world!`,
    event,
  };
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};

export const main = hello;
