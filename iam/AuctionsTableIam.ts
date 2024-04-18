const AuctionsTableIam = {
  Effect: 'Allow',
  Action: ['dynamodb:PutItem', 'dynamodb:Scan'],
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
