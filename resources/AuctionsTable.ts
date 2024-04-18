const AuctionsTable = {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    TableName: '${self:provider.environment.AUCTIONS_TABLE_NAME}',
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH',
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
};

export default AuctionsTable;
