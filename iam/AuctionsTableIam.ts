const AuctionsTableIam = {
  Effect: 'Allow',
  Action: [
    'dynamodb:PutItem',
    'dynamodb:Scan',
    'dynamodb:GetItem',
    'dynamodb:UpdateItem',
  ],
  Resource: {
    'Fn::Join': [
      '',
      [
        'arn:aws:dynamodb:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':table/',
        { Ref: 'AuctionsTable' },
      ],
    ],
  },
};
export default AuctionsTableIam;
