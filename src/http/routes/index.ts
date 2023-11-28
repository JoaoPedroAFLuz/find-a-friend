import { FastifyInstance } from 'fastify';

import { authenticateController } from '../controllers/authenticate-controller';
import { registerOrgController } from '../controllers/register-org-controller';

export async function apiRoutes(app: FastifyInstance) {
  app.post('/auth/sign-in', registerOrgController);
  app.post('/auth/log-in', authenticateController);
}
