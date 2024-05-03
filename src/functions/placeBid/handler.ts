import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

import { getAuctionById } from '@functions/getAuctionById/handler';

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
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const auction = await getAuctionById(id);

  if (amount <= auction.highestBid.amount) {
    throw new createError.Forbidden(
      `Your bid must be higher than ${auction.highestBid.amount}`
    );
  }

  const params = new UpdateCommand({
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set highestBid.amount = :amount',
    ExpressionAttributeValues: {
      ':amount': amount,
    },
    ReturnValues: 'ALL_NEW',
  });

  let updatedAuction: any;

  try {
    const result = await docClient.send(params);
    updatedAuction = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
};

export const main = middyfy(handler);
