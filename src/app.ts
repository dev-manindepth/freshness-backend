import express, { Express } from 'express';
import { FreshnessServer } from '@root/setupServer';
import { config } from '@root/config';
import databaseConnection from '@root/setupDatabase';

class Application {
  public initialize(): void {
    this.loadConfig();
    databaseConnection();
    const app: Express = express();
    const server: FreshnessServer = new FreshnessServer(app);
    server.start();
  }
  private loadConfig(): void {
    config.validateConfig();
    config.cloudinaryConfig();
  }
}
const application: Application = new Application();
application.initialize();
