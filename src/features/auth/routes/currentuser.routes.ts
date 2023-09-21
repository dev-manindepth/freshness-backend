import { CurrentUser } from '@auth/controllers/currentuser';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Router } from 'express';
import express from 'express';
class CurrentUserRoutes {
  private router: Router;
  constructor() {
    this.router = express.Router();
  }
  public routes() {
    this.router.get('/currentuser', authMiddleware.checkAuthentication, CurrentUser.prototype.read);

    return this.router;
  }
}

export const currentUserRoutes: CurrentUserRoutes = new CurrentUserRoutes();
