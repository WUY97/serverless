import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ScanCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { middyfy } from '@libs/lambda';

import createError from 'http-errors';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-west-1',
});

const docClient = DynamoDBDocumentClient.from(client);

const handler: ValidatedEventAPIGatewayProxyEvent<undefined> = async () => {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: process.env.AUCTIONS_TABLE_NAME,
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error('Error processing DynamoDB request:', error);
    throw new createError.InternalServerError(error);
  }
};

export const main = middyfy(handler);
