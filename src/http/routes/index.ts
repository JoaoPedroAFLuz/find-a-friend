import { FastifyInstance } from 'fastify';
import { registerOrgController } from '../controllers/register-org-controller';

export async function apiRoutes(app: FastifyInstance) {
  app.post('/orgs', registerOrgController);
}
