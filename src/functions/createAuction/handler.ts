import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { v4 as uuid } from 'uuid';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { middyfy } from '@libs/lambda';
import createError from 'http-errors';

import schema from './schema';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-west-1',
});

const docClient = DynamoDBDocumentClient.from(client);

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const { title } = event.body;
  const now = new Date();

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    highestBid: {
      amount: 0,
    },
  };

  try {
    const command = new PutCommand({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction,
      ReturnValues: 'ALL_OLD',
    });

    const response = await docClient.send(command);
    console.log('PutCommand successful:', response);
  } catch (error) {
    console.error('Error processing DynamoDB request:', error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Auction created successfully',
      auction,
    }),
  };
};

export const main = middyfy(handler);
