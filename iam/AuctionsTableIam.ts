const AuctionsTableIam = {
  Effect: 'Allow',
  Action: ['dynamodb:PutItem'],
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
