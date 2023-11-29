import { FastifyInstance } from 'fastify';

import { authenticateController } from '../controllers/authenticate-controller';
import { createPetController } from '../controllers/create-pet-controller';
import { registerOrgController } from '../controllers/register-org-controller';
import { verifyJwt } from '../middlewares/verify-jwt';

export async function apiRoutes(app: FastifyInstance) {
  app.post('/auth/sign-in', registerOrgController);
  app.post('/auth/log-in', authenticateController);

  app.post(
    '/pets',
    {
      onRequest: [verifyJwt],
    },
    createPetController,
  );
}
