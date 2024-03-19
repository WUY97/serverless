import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event
) => {
    const response = {
        message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
        event,
    };
    return {
        statusCode: 200,
        body: JSON.stringify(response),
    };
};

export const main = middyfy(hello);
