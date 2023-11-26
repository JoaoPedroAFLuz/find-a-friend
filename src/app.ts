import fastify from 'fastify';

import { apiRoutes } from './http/routes';

export const app = fastify();

app.register(apiRoutes);
