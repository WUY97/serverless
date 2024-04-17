import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import createAuction from '@functions/createAuction';

const serverlessConfiguration: AWS = {
    service: 'serverless',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild'],
    provider: {
        name: 'aws',
        runtime: 'nodejs20.x',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
            AUCTIONS_TABLE_NAME: '${self:service}-${opt:stage, "dev"}-auctions',
        },
        stage: '${opt:stage, "dev"}',
        region: 'us-west-1',
        iam: {
            role: {
                statements: [
                    {
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
                    },
                ],
            },
        },
    },
    functions: {
        hello,
        createAuction,
    },
    resources: {
        Resources: {
            AuctionsTable: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    TableName:
                        '${self:provider.environment.AUCTIONS_TABLE_NAME}',
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
            },
        },
    },
    package: { individually: true },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node20',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10,
        },
    },
};

module.exports = serverlessConfiguration;
