import { Signup } from '@auth/controllers/signup';
import { Router } from 'express';
import express from 'express';
class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    this.router.post('/signup', Signup.prototype.create);
    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();