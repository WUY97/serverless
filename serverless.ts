import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import createAuction from '@functions/createAuction';
import getAuctions from '@functions/getAuctions';

import AuctionsTable from './resources/AuctionsTable';

import AuctionsTableIam from './iam/auctionsTableIam';

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
        statements: [AuctionsTableIam],
      },
    },
  },
  functions: {
    hello,
    createAuction,
    getAuctions,
  },
  resources: {
    Resources: {
      AuctionsTable: AuctionsTable,
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
