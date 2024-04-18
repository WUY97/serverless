import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import createError from 'http-errors';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-west-1',
});

const docClient = DynamoDBDocumentClient.from(client);

const getAuctionById: ValidatedEventAPIGatewayProxyEvent<undefined> = async (
  event
) => {
  const { id } = event.pathParameters;

  let auction: any;

  try {
    const { Item } = await docClient.send(
      new GetCommand({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
      })
    );

    auction = Item;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  if (!auction) {
    throw new createError.NotFound(`Auction with ID "${id}" not found`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
};

export const main = middy(getAuctionById)
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
