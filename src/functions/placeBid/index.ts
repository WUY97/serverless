import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'patch',
        path: 'auctions/{id}/bid',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};
