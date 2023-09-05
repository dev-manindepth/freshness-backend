import {
  Application,
  json,
  urlencoded,
  Request,
  Response,
  NextFunction,
} from "express";
import http from "http";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieSession from "cookie-session";
import HTTP_STATUS from "http-status-codes";
import {
  CustomError,
  IErrorResponse,
} from "./shared/globals/helpers/error-handler";
import { Server } from "socket.io";
import { createClient } from "redis";
import Logger from "bunyan";
import { config } from "@root/config";
import applicationRoutes from "@root/routes";

const log: Logger = config.createLogger("setupServer");
const PORT = 8000;
export class FreshnessServer {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }
  public start() {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }
  private securityMiddleware(app: Application) {
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      })
    );
    app.use(
      cookieSession({
        name: "session",
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        maxAge: 24 * 7 * 3600000,
        secure: config.NODE_ENV !== "development",
      })
    );
  }
  private standardMiddleware(app: Application) {
    app.use(compression());
    app.use(json({ limit: "50mb" }));
    app.use(urlencoded({ extended: true, limit: "50mb" }));
  }
  private routesMiddleware(app: Application) {
    applicationRoutes(app);
  }
  private globalErrorHandler(app: Application): void {
    app.all("*", (req: Request, res: Response) => {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: `${req.originalUrl} not found` });
    });
    app.use(
      (
        error: IErrorResponse,
        _req: Request,
        res: Response,
        next: NextFunction
      ) => {
        log.error(error);
        if (error instanceof CustomError) {
          return res.status(error.statusCode).json(error.serializeErrors());
        }
        next();
      }
    );
  }
  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    try {
      const io: Server = new Server(httpServer, {
        cors: {
          origin: config.CLIENT_URL,
          methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        },
      });
      const pubClient = createClient({ url: config.REDIS_HOST });
      const subClient = pubClient.duplicate();

      await Promise.all([pubClient.connect(), subClient.connect()]);
      log.info("connected to socketio");
      return io;
    } catch (err) {
      log.error("error in socketio", err);
      throw err;
    }
  }
  private startHttpServer(httpServer: http.Server) {
    httpServer.listen(PORT, () => {
      log.info("Server running on port " + PORT);
    });
  }
  private async startServer(app: Application) {
    try {
      const httpServer: http.Server = new http.Server(app);
      const socketIO: Server = await this.createSocketIO(httpServer);
      this.socketIOConnections(socketIO);
      this.startHttpServer(httpServer);
    } catch (error) {
      log.error(error);
    }
  }
  private socketIOConnections(_io: Server): void {}
}
