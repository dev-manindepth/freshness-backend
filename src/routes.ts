import { authRoutes } from '@auth/routes/auth.routes';
import { currentUserRoutes } from '@auth/routes/currentuser.routes';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { serverAdapter } from '@service/queue/base.queue';
import { Application } from 'express';

const BASE_PATH = '/api/v1';
export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());
    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, authRoutes.signoutRoute());
    app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
  };
  routes();
};
