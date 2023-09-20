import { Signin } from '@auth/controllers/signin';
import { Signout } from '@auth/controllers/signout';
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
    this.router.post('/signin', Signin.prototype.read);
    return this.router;
  }
  public signoutRoute(): Router {
    this.router.get('/signout', Signout.prototype.update);
    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
